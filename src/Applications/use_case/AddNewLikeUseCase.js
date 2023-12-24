const NewLike = require('../../Domains/likes/entitites/NewLike');

class AddNewLikeUseCase {
  constructor(likeRepository, commentRepository, threadRepository) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, owner }) {
    await this._threadRepository.validateThreadById(threadId);
    await this._commentRepository.validateCommentById(commentId);
    await this._commentRepository.validateCommentOwner(owner);
    const newLike = new NewLike({ commentId, owner });

    return this._likeRepository.addLike(newLike);
  }
}

module.exports = AddNewLikeUseCase;
