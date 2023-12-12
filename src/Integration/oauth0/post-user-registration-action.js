// Required dependencies:
// axios@1.6.2
// tslib@2.6.2
// axios-retry@4.0.0
// @tranchyone/hooks@0.0.1 - source code at: src/Library/tranchyone/hooks/src/lib/hooks.ts

// Secrets:
// appId
// apiKey

const { createUserHook } = require("@tranchyone/hooks");

exports.onExecutePostUserRegistration = async (event, api) => {
  await createUserHook({
    appId: event.secrets.appId,
    apiKey: event.secrets.apiKey,
    requestUri: "https://askapi.tranchy.tech/user/oauth0/create",
    requestBody: {
      userId: event.user.user_id,
      email: event.user.email,
      createdAt: new Date(event.user.created_at),
    },
  });
};
