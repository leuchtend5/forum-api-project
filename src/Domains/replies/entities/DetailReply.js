class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, comment_id } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.comment_id = comment_id;
  }

  _verifyPayload({ id, username, date, content, comment_id }) {
    const checkString = [id, username, date, content, comment_id].every(
      (value) => typeof value === 'string',
    );

    if (!id || !username || !date || !content || !comment_id) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!checkString) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
