import { createUserHook } from './hooks';

describe('auth0 hook', () => {
  it('should work', async () => {
    await createUserHook({
      appId: 'bde2bf62-83c6-4112-b3a5-fc2c88402553',
      apiKey: 'pD0o20kFGuCg07Ax25Z5c0wZIg/xJoWCAhMd1qbg5Og=',
      requestUri: 'http://localhost:7300/user/oauth0/create',
      requestBody: {
        userId: 'auth0|5f7c8ec7c33c6c004bbafe82',
        email: 'tau.dang@example.tech',
        createdAt: new Date('2023-12-12T12:47:33.944Z'),
      },
    });
  });

  it('should not work with invalid api key', async () => {
    expect(() =>
      createUserHook({
        appId: 'bde2bf62-83c6-4112-b3a5-fc2c88402553',
        apiKey: 'difference-ket',
        requestUri: 'http://localhost:7300/user/oauth0/create',
        requestBody: {
          userId: 'auth0|5f7c8ec7c33c6c004bbafe82',
          email: 'tau.dang@example.tech',
          createdAt: new Date('2023-12-12T12:47:33.944Z'),
        },
      })
    ).rejects.toThrow(/401/);
  });
});
