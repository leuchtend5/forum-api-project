const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { threadId, content, owner } = comment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();
    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, owner, content, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async validateCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async validateCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak diberikan akses untuk aksi ini');
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content FROM comments
      JOIN users ON users.id = comments.owner
      WHERE comments.thread_id = $1
      ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = TRUE, content = $2 WHERE id = $1 RETURNING id',
      values: [id, '**komentar telah dihapus**'],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
