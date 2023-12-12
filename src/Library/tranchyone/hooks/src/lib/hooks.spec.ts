import { createUserHook } from './hooks';

describe('hmacclient', () => {
  it('should work', async () => {
    const result = await createUserHook({
      appId: 'bde2bf62-83c6-4112-b3a5-fc2c88402553',
      apiKey: 'pD0o20kFGuCg07Ax25Z5c0wZIg/xJoWCAhMd1qbg5Og=',
      requestUri: 'http://localhost:7300/user/oauth0/action1',
      requestBody: {
        userName: 'tau.dang',
      },
    });
    expect(result).toEqual(
      'HMACSHA256:SHA256:appId:/GjY7z6khLseX50QsGT/RzrzQz0E67U0WvrNo9Y+F2I=:6c72dd53-c987-46b0-907f-19bed6ea63f3:1209574800'
    );
  });
});
