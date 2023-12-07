const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.validateThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase(
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.validateThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.validateCommentById).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.validateCommentOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCasePayload.commentId);
  });
});
