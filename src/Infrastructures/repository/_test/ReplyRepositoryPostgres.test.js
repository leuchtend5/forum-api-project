const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123';

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const reply = new NewReply({
        commentId: 'comment-123',
        content: 'a reply',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addReply = await replyRepositoryPostgres.addReply(reply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toBeDefined();
      expect(addReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: 'a reply',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('validateReplyById function', () => {
    it('should throw NotFoundError when reply id is invalid', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({});

      // Action and Assert
      await expect(replyRepositoryPostgres.validateReplyById('asd')).rejects.toThrowError(
        NotFoundError,
      );
    });

    it('should not throw NotFoundError when reply id is valid', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({});

      // Action and Assert
      await expect(
        replyRepositoryPostgres.validateReplyById('reply-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('validateReplyOwner function', () => {
    it('should throw AuthorizationError when owner is invalid', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({});

      // Action and Assert
      await expect(
        replyRepositoryPostgres.validateReplyOwner('reply-123', 'user-234'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when owner is valid', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({});

      // Action and Assert
      await expect(
        replyRepositoryPostgres.validateReplyOwner('reply-123', 'user-123'),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getReplyByThreadId function', () => {
    it('should return an empty array if there is no reply in the comment', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getReplyByThreadId('thread-123');

      // Assert
      expect(replies).toStrictEqual([]);
    });

    it('should correctly return all detail replies from a comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'indonesia',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await RepliesTableTestHelper.addReply({});
      await RepliesTableTestHelper.addReply({
        id: 'reply-234',
        comment_id: 'comment-123',
        owner: 'user-234',
        date: '2024',
        content: 'second reply',
      });

      // Action
      const replies = await replyRepositoryPostgres.getReplyByThreadId('thread-123');

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies).toEqual([
        {
          id: 'reply-123',
          username: 'dicoding',
          date: '2023',
          content: 'a reply',
          comment_id: 'comment-123',
          is_deleted: false,
        },
        {
          id: 'reply-234',
          username: 'indonesia',
          date: '2024',
          content: 'second reply',
          comment_id: 'comment-123',
          is_deleted: false,
        },
      ]);
    });

    it('should correctly return all detail replies from a comment including deleted reply', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'indonesia',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await RepliesTableTestHelper.addReply({});
      await RepliesTableTestHelper.addReply({
        id: 'reply-234',
        comment_id: 'comment-123',
        owner: 'user-234',
        date: '2024',
        content: 'second reply',
      });

      // Action
      await replyRepositoryPostgres.deleteReplyById('reply-123');
      const replies = await replyRepositoryPostgres.getReplyByThreadId('thread-123');

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies).toEqual([
        {
          id: 'reply-123',
          username: 'dicoding',
          date: '2023',
          content: '**balasan telah dihapus**',
          comment_id: 'comment-123',
          is_deleted: true,
        },
        {
          id: 'reply-234',
          username: 'indonesia',
          date: '2024',
          content: 'second reply',
          comment_id: 'comment-123',
          is_deleted: false,
        },
      ]);
    });
  });

  describe('deleteReplyById function', () => {
    it('should successfully delete the reply and change is_deleted to TRUE in database', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({});
      await replyRepositoryPostgres.deleteReplyById('reply-123');

      // Action and Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply.is_deleted).toEqual(true);
    });
  });
});
