/* istanbul ignore file */
const ServerTestHelper = {
  async getUserId(
    server,
    { username = 'dicoding', password = 'secret', fullname = 'dicoding indonesia' },
  ) {
    this.server = server;

    const userPayLoad = {
      username,
      password,
      fullname,
    };

    await this.server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayLoad,
    });

    const responseAuth = await this.server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userPayLoad.username,
        password: userPayLoad.password,
      },
    });

    // const responseUserJson = JSON.parse(responseUser.payload);
    const responseAuthJson = JSON.parse(responseAuth.payload);

    // const userId = responseUserJson.data.addedUser.id;
    const accessToken = responseAuthJson.data.accessToken;

    return { accessToken };
  },
};

module.exports = ServerTestHelper;
