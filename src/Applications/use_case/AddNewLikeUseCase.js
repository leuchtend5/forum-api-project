const NewLike = require('../../Domains/likes/entities/NewLike');

class AddNewLikeUseCase {
  constructor(likeRepository, commentRepository, threadRepository) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.validateThreadById(threadId);
    await this._commentRepository.validateCommentById(commentId);
    const newLike = new NewLike({ commentId, owner: userId });
    const getLikes = await this._likeRepository.getLikeByCommentId(commentId);
    const checkLike = getLikes.some(
      (like) => like.comment_id === commentId && like.owner === userId, // check if the user has already liked the same comment
    );

    if (checkLike) {
      return this._likeRepository.deleteLike(newLike);
    }

    return this._likeRepository.addLike(newLike);
  }
}

module.exports = AddNewLikeUseCase;
