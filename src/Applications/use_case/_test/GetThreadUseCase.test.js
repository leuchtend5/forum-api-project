const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
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

  it('should orchestrating the get thread action correctly with comments, likeCount, and replies', async () => {
    // Arrange
    const commentsPayload = [
      new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2023',
        content: 'first comment',
        replies: [],
      }),
      new DetailComment({
        id: 'comment-234',
        username: 'john doe',
        date: '2023',
        content: 'second comment',
        replies: [],
      }),
    ];

    const repliesPayload = [
      new DetailReply({
        id: 'reply-123',
        username: 'dicoding',
        date: '2023',
        content: 'first reply',
        comment_id: 'comment-123',
      }),
      new DetailReply({
        id: 'reply-234',
        username: 'john doe',
        date: '2023',
        content: 'second reply',
        comment_id: 'comment-123',
      }),
    ];

    const mockDetailThread = new DetailThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: useCasePayload.date,
      username: useCasePayload.username,
      comments: commentsPayload,
    });

    const expectedDetailThread = {
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: '2023',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023',
          content: 'first comment',
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              date: '2023',
              content: 'first reply',
            },
            {
              id: 'reply-234',
              username: 'john doe',
              date: '2023',
              content: 'second reply',
            },
          ],
          likeCount: 1,
        },
        {
          id: 'comment-234',
          username: 'john doe',
          date: '2023',
          content: 'second comment',
          replies: [],
          likeCount: 0,
        },
      ],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.validateThreadById = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn(() => Promise.resolve(commentsPayload));
    mockReplyRepository.getReplyByThreadId = jest.fn(() => Promise.resolve(repliesPayload));
    mockLikeRepository.getLikeByCommentId = jest.fn((comment_id) =>
      Promise.resolve(
        comment_id === 'comment-123'
          ? [
              {
                id: 'like-123',
                comment_id: 'comment-123',
                owner: 'user-123',
              },
            ]
          : [],
      ),
    );

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase(
      mockThreadRepository,
      mockCommentRepository,
      mockReplyRepository,
      mockLikeRepository,
    );

    // Action
    const detailThread = await getThreadUseCase.execute(params);

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockThreadRepository.validateThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockLikeRepository.getLikeByCommentId).toBeCalled();
  });

  it('should orchestrating the get thread action correctly with only comments', async () => {
    // Arrange
    const commentsPayload = [
      new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2023',
        content: 'first comment',
        replies: [],
      }),
      new DetailComment({
        id: 'comment-234',
        username: 'john doe',
        date: '2023',
        content: 'second comment',
        replies: [],
      }),
    ];

    const repliesPayload = [];

    const mockDetailThread = new DetailThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: useCasePayload.date,
      username: useCasePayload.username,
      comments: commentsPayload,
    });

    const expectedDetailThread = {
      id: 'thread-123',
      title: 'this is title',
      body: 'this is body',
      date: '2023',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023',
          content: 'first comment',
          replies: [],
          likeCount: 0,
        },
        {
          id: 'comment-234',
          username: 'john doe',
          date: '2023',
          content: 'second comment',
          replies: [],
          likeCount: 0,
        },
      ],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.validateThreadById = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn(() => Promise.resolve(commentsPayload));
    mockReplyRepository.getReplyByThreadId = jest.fn(() => Promise.resolve(repliesPayload));
    mockLikeRepository.getLikeByCommentId = jest.fn(() => Promise.resolve([]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase(
      mockThreadRepository,
      mockCommentRepository,
      mockReplyRepository,
      mockLikeRepository,
    );

    // Action
    const detailThread = await getThreadUseCase.execute(params);

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockThreadRepository.validateThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockLikeRepository.getLikeByCommentId).toBeCalled();
  });

  it('should orchestrating the get thread action correctly without comments and replies', async () => {
    // Arrange
    const commentsPayload = [];

    const repliesPayload = [];

    const mockDetailThread = new DetailThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: useCasePayload.date,
      username: useCasePayload.username,
      comments: commentsPayload,
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
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.validateThreadById = jest.fn(() => Promise.resolve());

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));

    mockCommentRepository.getCommentByThreadId = jest.fn(() => Promise.resolve(commentsPayload));

    mockReplyRepository.getReplyByThreadId = jest.fn(() => Promise.resolve(repliesPayload));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase(
      mockThreadRepository,
      mockCommentRepository,
      mockReplyRepository,
    );

    // Action
    const detailThread = await getThreadUseCase.execute(params);

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockThreadRepository.validateThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(useCasePayload.id);
  });
});
