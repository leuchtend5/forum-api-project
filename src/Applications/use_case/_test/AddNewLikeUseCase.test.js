const NewLike = require('../../../Domains/likes/entitites/NewLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddNewLikeUseCase = require('../AddNewLikeUseCase');

describe('AddNewLikeUseCase', () => {
  // Arrange
  const useCasePayLoad = {
    threadId: 'thread-123',
    commentId: 'comment-123',
    userId: 'user-123',
  };

  const mockLikedComment = {
    id: 'like-123',
    commentId: useCasePayLoad.commentId,
    owner: useCasePayLoad.userId,
  };

  const expectedLikedComment = {
    id: 'like-123',
    commentId: 'comment-123',
    owner: 'user-123',
  };

  const mockLikeRepository = new LikeRepository();
  const mockCommentRepository = new CommentRepository();
  const mockThreadRepository = new ThreadRepository();

  beforeEach(() => {
    mockThreadRepository.validateThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.validateCommentById = jest.fn(() => Promise.resolve());
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve(mockLikedComment));
  });

  it('should orchestrating the add like action correctly', async () => {
    mockLikeRepository.getLikeByCommentId = jest.fn(() => Promise.resolve([]));

    /** creating use case instance */
    const addNewLikeUseCase = new AddNewLikeUseCase(
      mockLikeRepository,
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action
    const addLike = await addNewLikeUseCase.execute(useCasePayLoad);

    // Assert
    expect(addLike).toStrictEqual(expectedLikedComment);
    expect(mockThreadRepository.validateThreadById).toBeCalledWith(useCasePayLoad.threadId);
    expect(mockCommentRepository.validateCommentById).toBeCalledWith(useCasePayLoad.commentId);
    expect(mockLikeRepository.getLikeByCommentId).toBeCalledWith(useCasePayLoad.commentId);
    expect(mockLikeRepository.addLike).toBeCalledWith(
      new NewLike({
        commentId: 'comment-123',
        owner: 'user-123',
      }),
    );
  });

  it('should orchestrating the delete like action correctly', async () => {
    /** mocking needed function */
    mockLikeRepository.deleteLike = jest.fn(() =>
      Promise.resolve({
        commentId: 'comment-123',
        owner: 'user-123',
      }),
    );

    mockLikeRepository.getLikeByCommentId = jest.fn(() =>
      Promise.resolve([
        {
          id: 'like-123',
          comment_id: 'comment-123',
          owner: 'user-123',
        },
      ]),
    );

    /** creating use case instance */
    const addNewLikeUseCase = new AddNewLikeUseCase(
      mockLikeRepository,
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action
    await addNewLikeUseCase.execute(useCasePayLoad);

    // Assert
    expect(mockThreadRepository.validateThreadById).toBeCalledWith(useCasePayLoad.threadId);
    expect(mockCommentRepository.validateCommentById).toBeCalledWith(useCasePayLoad.commentId);
    expect(mockLikeRepository.getLikeByCommentId).toBeCalledWith(useCasePayLoad.commentId);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(
      new NewLike({
        commentId: 'comment-123',
        owner: 'user-123',
      }),
    );
  });
});
