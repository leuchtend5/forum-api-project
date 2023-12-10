class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId, content, owner } = payload;

    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ commentId, content, owner }) {
    const checkString = [commentId, content, owner].every((value) => typeof value === 'string');

    if (!commentId || !content || !owner) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!checkString) {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
