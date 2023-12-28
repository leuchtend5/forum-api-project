const AddNewLikeUseCase = require('../../../../Applications/use_case/AddNewLikeUseCase');

class LikeHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;
    const addNewLikeUseCase = this._container.getInstance(AddNewLikeUseCase.name);
    await addNewLikeUseCase.execute({
      threadId,
      commentId,
      userId,
    });

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = LikeHandler;
