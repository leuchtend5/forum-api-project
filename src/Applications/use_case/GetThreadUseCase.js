class GetThreadUseCase {
  constructor(threadRepository, commentRepository) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.validateThreadById(threadId);
    const detailThread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThreadId(threadId);

    return { ...detailThread, comments };
  }
}

module.exports = GetThreadUseCase;
