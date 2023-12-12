import { createUserHook } from './hooks';

describe('hmacclient', () => {
  it('should work', async () => {
    await createUserHook({
      appId: 'bde2bf62-83c6-4112-b3a5-fc2c88402553',
      apiKey: 'pD0o20kFGuCg07Ax25Z5c0wZIg/xJoWCAhMd1qbg51g=',
      requestUri: 'http://localhost:7300/user/oauth0/action1',
      requestBody: {
        userName: 'tau.dang',
      },
    });
  });
});
