const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'a content',
      };
      const threadId = 'thread-123';
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getUserId(server, {});
      await ThreadsTableTestHelper.addThread({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const threadId = 'thread-123';
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getUserId(server, {});
      await ThreadsTableTestHelper.addThread({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: true,
      };
      const threadId = 'thread-123';
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getUserId(server, {});
      await ThreadsTableTestHelper.addThread({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
      );
    });

    it('should response 401 when there is no access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'a content',
      };
      const threadId = 'thread-123';
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getUserId(server, {});
      await ThreadsTableTestHelper.addThread({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when the thread id is invalid', async () => {
      // Arrange
      const requestPayload = {
        content: 'a content',
      };
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getUserId(server, {});
      await ThreadsTableTestHelper.addThread({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/xx/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and success soft delete the comment', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getUserId(server, {});
      await ThreadsTableTestHelper.addThread({ owner: userId });
      await CommentsTableTestHelper.addComment({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when the owner of the comment is invalid', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const server = await createServer(container);

      // Inject first User
      const { userId: firstUser } = await ServerTestHelper.getUserId(server, {});

      // Inject second User
      const { accessToken: secondToken } = await ServerTestHelper.getUserId(server, {
        username: 'indonesia',
      });

      await ThreadsTableTestHelper.addThread({ owner: firstUser });
      await CommentsTableTestHelper.addComment({ owner: firstUser });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${secondToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak diberikan akses untuk aksi ini');
    });
  });
});
