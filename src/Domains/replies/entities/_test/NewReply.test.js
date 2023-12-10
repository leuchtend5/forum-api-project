const NewReply = require('../NewReply');

describe('a NewReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: true,
      content: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'a content',
      owner: 'user-123',
    };

    // Action
    const addReply = new NewReply(payload);

    // Assert
    expect(addReply.commentId).toEqual(payload.commentId);
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.owner).toEqual(payload.owner);
  });
});
