const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { commentId, threadId } = request.params;
    const { id: userId } = request.auth.credentials;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      threadId,
      commentId,
      content: request.payload.content,
      owner: userId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);

    return response;
  }

  async deleteReplyHandler(request, h) {
    const { replyId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({
      commentId,
      replyId,
      owner: userId,
    });

    const response = h.response({
      status: 'success',
    });

    response.code(200);

    return response;
  }
}

module.exports = ReplyHandler;
