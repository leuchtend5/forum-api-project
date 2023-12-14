const DetailReply = require('../DetailReply');

describe('a DetailReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      comment_id: 'comment-123',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      date: '2023',
      content: true,
      comment_id: 'comment-123',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create detailReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2023',
      content: 'a content',
      comment_id: 'comment-123',
    };

    // Action
    const { id, username, date, content, comment_id } = new DetailReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(comment_id).toEqual(payload.comment_id);
  });
});
