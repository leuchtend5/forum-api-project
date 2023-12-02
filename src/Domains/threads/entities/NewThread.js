class NewThread {
  constructor(payload, userId) {
    this._verifyPayload(payload, userId);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
    this.userId = userId;
  }

  _verifyPayload({ title, body }, userId) {
    const checkString = [title, body, userId].every((value) => typeof value === 'string');

    if (!title || !body || !userId) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (title.length > 50) {
      throw new Error('NEW_THREAD.TITLE_LIMIT_CHAR');
    }

    if (!checkString) {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
