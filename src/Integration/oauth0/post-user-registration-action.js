// Required dependencies:
// @tranchyone/hooks@0.0.4 - source code at: src/Library/tranchyone/hooks

// Secrets:
// authority
// clientId
// clientSecret

const { createUserAction } = require("@tranchyone/hooks");

exports.onExecutePostUserRegistration = async (event, api) => {
  await createUserAction({
    client: {
      authority: event.secrets.authority,
      clientId: event.secrets.clientId,
      clientSecret: event.secrets.clientSecret,
      audience: 'https://askapi',
    },
    requestUri: "https://askapi.tranchy.tech/user/oauth0/create",
    requestBody: {
      userId: event.user.user_id,
      email: event.user.email
    },
  });
};
