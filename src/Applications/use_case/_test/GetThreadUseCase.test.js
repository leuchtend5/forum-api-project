const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const params = {
      threadId: 'thread-123',
    };

    const useCasePayload = {
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: '2023',
      username: 'dicoding',
      comments: [],
    };

    const mockDetailThread = new DetailThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: useCasePayload.date,
      username: useCasePayload.username,
      comments: useCasePayload.comments,
    });

    const expectedDetailThread = {
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: '2023',
      username: 'dicoding',
      comments: [],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.validateThreadById = jest.fn().mockImplementation(() => Promise.resolve());

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));

    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread.comments));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase(mockThreadRepository, mockCommentRepository);

    // Action
    const detailThread = await getThreadUseCase.execute(params);

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
  });
});
