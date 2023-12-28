const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikeTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123';

  describe('addLike function', () => {
    it('should persist add like to the comment correctly', async () => {
      // Arrange
      const like = new NewLike({
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addLike = await likeRepositoryPostgres.addLike(like);

      // Assert
      const likes = await LikeTableTestHelper.getLikeByCommentId('comment-123');
      expect(likes).toBeDefined();
      expect(addLike).toStrictEqual({
        id: 'like-123',
      });
    });
  });

  describe('deleteLike function', () => {
    it('should persist delete like from the comment correctly', async () => {
      // Arrange
      const like = new NewLike({
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Add like
      const addLike = await likeRepositoryPostgres.addLike(like);
      const likesBeforeDelete = await LikeTableTestHelper.getLikeByCommentId('comment-123');

      // Delete like
      await likeRepositoryPostgres.deleteLike(like);
      const likesAfterDelete = await LikeTableTestHelper.getLikeByCommentId('comment-123');

      // Assert
      expect(addLike).toStrictEqual({
        id: 'like-123',
      });
      expect(likesBeforeDelete).toBeDefined();
      expect(likesBeforeDelete).toEqual([
        {
          id: 'like-123',
          comment_id: 'comment-123',
          owner: 'user-123',
        },
      ]);
      expect(likesAfterDelete).toEqual([]);
    });
  });

  describe('getLikeByCommentId function', () => {
    it('should return an empty array if there is no like on the comment', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likes = await likeRepositoryPostgres.getLikeByCommentId('comment-123');

      // Assert
      expect(likes).toStrictEqual([]);
    });

    it('should correctly return all likes from a comment', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikeTableTestHelper.addLike({});

      // Action
      const likes = await likeRepositoryPostgres.getLikeByCommentId('comment-123');

      // Assert
      expect(likes).toHaveLength(1);
      expect(likes).toEqual([
        {
          id: 'like-123',
          comment_id: 'comment-123',
          owner: 'user-123',
        },
      ]);
    });
  });
});
