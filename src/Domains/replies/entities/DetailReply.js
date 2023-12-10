class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
  }

  _verifyPayload({ id, username, date, content }) {
    const checkString = [id, username, date, content].every((value) => typeof value === 'string');

    if (!id || !username || !date || !content) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!checkString) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
