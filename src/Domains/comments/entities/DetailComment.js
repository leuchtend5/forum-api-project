class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, is_deleted, replies } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_deleted ? '**komentar telah dihapus**' : content;
    this.is_deleted = is_deleted;
    this.replies = replies;
  }

  _verifyPayload({ id, username, date, content, replies }) {
    const checkString = [id, username, date, content].every((value) => typeof value === 'string');

    if (!id || !username || !date || !content || !replies) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!checkString || !Array.isArray(replies)) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
