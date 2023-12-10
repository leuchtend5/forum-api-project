class DeleteReplyUseCase {
  constructor(replyRepository, commentRepository) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.validateCommentById(useCasePayload.commentId);
    await this._replyRepository.validateReplyById(useCasePayload.replyId);
    await this._replyRepository.validateReplyOwner(useCasePayload.replyId, useCasePayload.owner);
    await this._replyRepository.deleteReplyById(useCasePayload.replyId);
  }
}

module.exports = DeleteReplyUseCase;
