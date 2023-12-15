import axios from 'axios';
import axiosRetry from 'axios-retry';

type GetAccessTokenOptions = {
  authority: string;
  clientId: string;
  clientSecret: string;
  audience: string;
};

type CreateUserActionOptions = {
  client: GetAccessTokenOptions;
  requestUri: string;
  requestBody: {
    userId: string;
    email: string;
  };
};

async function getAccessToken(options: GetAccessTokenOptions) {
  const requestBody = {
    client_id: options.clientId,
    client_secret: options.clientSecret,
    audience: options.audience,
    grant_type: 'client_credentials',
  };
  const response = await axios.post(
    `${options.authority}/oauth/token`,
    requestBody,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.access_token;
}

export async function createUserAction(
  options: CreateUserActionOptions
): Promise<void> {
  axiosRetry(axios, {
    retries: 3,
    retryCondition: () => true,
    retryDelay: axiosRetry.exponentialDelay,
  });

  const accessToken = await getAccessToken(options.client);
  const response = await axios.post(options.requestUri, options.requestBody, {
    headers: { Authorization: `Bearer ${accessToken}`, 'x-csrf': '1' },
  });

  if (response.status !== 202) {
    throw new Error('could not finish sending');
  }
}
