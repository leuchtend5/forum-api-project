class GetThreadUseCase {
  constructor(threadRepository) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const detailThread = await this._threadRepository.getThreadById(threadId);

    return detailThread;
  }
}

module.exports = GetThreadUseCase;
