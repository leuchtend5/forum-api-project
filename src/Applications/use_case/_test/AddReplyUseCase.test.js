const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'a reply',
      owner: 'user-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'a reply',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.validateThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase(
      mockReplyRepository,
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.validateThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.validateCommentById).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        commentId: useCasePayload.commentId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );
  });
});
