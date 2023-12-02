const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123';

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const thread = new NewThread(
        {
          title: 'this is title',
          body: 'this is body',
        },
        userId,
      );

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toBeDefined();
      expect(addThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'this is title',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('validateThreadById function', () => {
    it('should throw NotFoundError when thread id is invalid', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await ThreadsTableTestHelper.addThread({});

      // Action and Assert
      await expect(threadRepositoryPostgres.validateThreadById('asd')).rejects.toThrowError(
        NotFoundError,
      );
    });

    it('should not throw NotFoundError when thread id is valid', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await ThreadsTableTestHelper.addThread({});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.validateThreadById('thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should return detailed thread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await ThreadsTableTestHelper.addThread({});

      // Action
      const detailThread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(detailThread).toStrictEqual({
        id: 'thread-123',
        title: 'this is title',
        body: 'this is body',
        date: '2023',
        username: 'dicoding',
      });
    });
  });
});
