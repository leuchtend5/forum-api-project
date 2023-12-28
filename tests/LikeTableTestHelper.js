const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeTableTestHelper = {
  async addLike({ id = 'like-123', commentId = 'comment-123', owner = 'user-123' }) {
    const query = {
      text: 'INSERT INTO likes VALUES ($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await pool.query(query);
  },

  async getLikeByCommentId(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikeTableTestHelper;
