const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor(threadRepository) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const newThread = new NewThread(useCasePayload, userId);

    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
