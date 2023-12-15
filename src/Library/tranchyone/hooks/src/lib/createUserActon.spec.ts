
import { createUserAction } from './createUserAction';

describe('oauth0 create user action', () => {
  it('should work', async () => {
    await createUserAction({
      client: {
        authority: 'https://dev-nkhte1hawwbq5ac2.us.auth0.com',
        clientId: process.env["Auth0actorTest_ClientId"]!,
        clientSecret: process.env["Auth0actorTest_ClientSecret"]!,
        audience: 'https://askapi',
      },
      requestUri: 'http://localhost:7300/user/oauth0/create',
      requestBody: {
        userId: 'auth0|5f7c8ec7c33c6c004bbafe83',
        email: 'tau.dang2@example.tech',
        createdAt: new Date('2023-12-12T12:47:33.944Z'),
      },
    });
  });

  it('should not work with invalid api key', async () => {
    expect(() =>
      createUserAction({
        client: {
          authority: 'https://dev-nkhte1hawwbq5ac2.us.auth0.com',
          clientId: 'bde2bf62-83c6-4112-b3a5-fc2c88402553',
          clientSecret: 'pD0o20kFGuCg07Ax25Z5c0wZIg/xJoWCAhMd1qbg51g=',
          audience: 'https://askapi',
        },
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
