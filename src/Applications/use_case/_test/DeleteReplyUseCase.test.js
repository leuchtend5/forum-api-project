const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.validateCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.validateReplyById = jest.fn(() => Promise.resolve());
    mockReplyRepository.validateReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase(mockReplyRepository, mockCommentRepository);

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.validateCommentById).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.validateReplyById).toBeCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.validateReplyOwner).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.owner,
    );
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCasePayload.replyId);
  });
});
