const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor(replyRepository, commentRepository, threadRepository) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.validateThreadById(useCasePayload.threadId);
    await this._commentRepository.validateCommentById(useCasePayload.commentId);
    const newReply = new NewReply(useCasePayload);

    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
