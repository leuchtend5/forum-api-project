const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: userId } = request.auth.credentials;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({
      threadId,
      content: request.payload.content,
      owner: userId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);

    return response;
  }

  async deleteCommentHandler(request, h) {
    const { commentId, threadId } = request.params;
    const { id: userId } = request.auth.credentials;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({
      threadId,
      commentId,
      owner: userId,
    });

    const response = h.response({
      status: 'success',
    });

    response.code(200);

    return response;
  }
}

module.exports = CommentHandler;
