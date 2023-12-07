class DeleteCommentUseCase {
  constructor(commentRepository, threadRepository) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.validateThreadById(useCasePayload.threadId);
    await this._commentRepository.validateCommentById(useCasePayload.commentId);
    await this._commentRepository.validateCommentOwner(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    await this._commentRepository.deleteCommentById(useCasePayload.commentId);
  }
}

module.exports = DeleteCommentUseCase;
