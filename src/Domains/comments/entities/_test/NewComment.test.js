const NewComment = require('../NewComment');

describe('a NewComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: true,
      content: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'a content',
      owner: 'user-123',
    };

    // Action
    const addComment = new NewComment(payload);

    // Assert
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.owner).toEqual(payload.owner);
  });
});
