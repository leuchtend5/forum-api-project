const NewThread = require('../NewThread');

describe('a NewThread entity', () => {
  const userId = 'user-123';

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'This is title',
    };

    // Action and Assert
    expect(() => new NewThread(payload, userId)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when title contains more than 50 character', () => {
    // Arrange
    const payload = {
      title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      body: 'this is body',
    };

    // Action and Assert
    expect(() => new NewThread(payload, userId)).toThrowError('NEW_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new NewThread(payload, userId)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'this is title',
      body: 'this is body',
    };

    // Action
    const addedThread = new NewThread(payload, userId);

    // Assert
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.userId).toEqual(userId);
  });
});
