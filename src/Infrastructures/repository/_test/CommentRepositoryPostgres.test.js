const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../../repository/CommentRepositoryPostgres');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123';

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const comment = new NewComment({
        threadId: 'thread-123',
        content: 'a content',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addComment = await commentRepositoryPostgres.addComment(comment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toBeDefined();
      expect(addComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'a content',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('validateCommentById function', () => {
    it('should throw NotFoundError when comment id is invalid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({});

      // Action and Assert
      await expect(commentRepositoryPostgres.validateCommentById('asd')).rejects.toThrowError(
        NotFoundError,
      );
    });

    it('should not throw NotFoundError when comment id is valid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({});

      // Action and Assert
      await expect(
        commentRepositoryPostgres.validateCommentById('comment-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('validateCommentOwner function', () => {
    it('should throw AuthorizationError when owner is invalid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({});

      // Action and Assert
      await expect(
        commentRepositoryPostgres.validateCommentOwner('comment-123', 'user-234'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when owner is valid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({});

      // Action and Assert
      await expect(
        commentRepositoryPostgres.validateCommentOwner('comment-123', 'user-123'),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return an empty array if there is no comment in the thread', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      // Assert
      expect(comments).toStrictEqual([]);
    });

    it('should correctly return all detail comments from a thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'indonesia',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-234',
        threadId: 'thread-123',
        owner: 'user-234',
        content: 'second comment',
      });

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments).toStrictEqual([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023',
          content: 'a content',
        },
        {
          id: 'comment-234',
          username: 'indonesia',
          date: '2023',
          content: 'second comment',
        },
      ]);
    });

    it('should correctly return all detail comments from a thread including deleted comment', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'indonesia',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-234',
        threadId: 'thread-123',
        owner: 'user-234',
        content: 'second comment',
        date: '2024',
      });

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-234');
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments).toStrictEqual([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023',
          content: 'a content',
        },
        {
          id: 'comment-234',
          username: 'indonesia',
          date: '2024',
          content: '**komentar telah dihapus**',
        },
      ]);
    });
  });
});
