const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'a reply',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getUserId(server, {});
      await ThreadsTableTestHelper.addThread({ owner: userId });
      await CommentsTableTestHelper.addComment({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getUserId(server, {});
      await ThreadsTableTestHelper.addThread({ owner: userId });
      await CommentsTableTestHelper.addComment({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
        'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: true,
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getUserId(server, {});
      await ThreadsTableTestHelper.addThread({ owner: userId });
      await CommentsTableTestHelper.addComment({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
        'tidak dapat membuat reply baru karena tipe data tidak sesuai',
      );
    });

    it('should response 401 when there is no access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'a reply',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getUserId(server, {});
      await ThreadsTableTestHelper.addThread({ owner: userId });
      await CommentsTableTestHelper.addComment({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and success soft delete the reply', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getUserId(server, {});

      await ThreadsTableTestHelper.addThread({ owner: userId });
      await CommentsTableTestHelper.addComment({ owner: userId });
      await RepliesTableTestHelper.addReply({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when the owner of the reply is invalid', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const server = await createServer(container);

      // Inject first User
      const { userId: firstUser } = await ServerTestHelper.getUserId(server, {});

      // Inject second User
      const { accessToken: secondToken } = await ServerTestHelper.getUserId(server, {
        username: 'indonesia',
      });

      await ThreadsTableTestHelper.addThread({ owner: firstUser });
      await CommentsTableTestHelper.addComment({ owner: firstUser });
      await RepliesTableTestHelper.addReply({ owner: firstUser });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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
