class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, content, owner } = payload;

    this.threadId = threadId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ threadId, content, owner }) {
    const checkString = [threadId, content, owner].every((value) => typeof value === 'string');

    if (!threadId || !content || !owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!checkString) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
