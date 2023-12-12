import { randomBytes, createHash, createHmac } from 'crypto';
import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

const unixTimestamp = (date: number) => Math.floor(date / 1000);

const generateNonce = () => randomBytes(16).toString('base64');

type CreateUserHookOptions = {
  appId: string;
  apiKey: string;
  requestUri: string;
  requestBody: {
    userId: string;
    email: string;
    createdAt: Date;
  };
};

export async function createUserHook(
  options: CreateUserHookOptions
): Promise<void> {
  axiosRetry(axios, {
    retries: 3,
    retryCondition: () => true,
    retryDelay: axiosRetry.exponentialDelay,
  });

  const requestBody = JSON.stringify(options.requestBody);
  const requestHttpMethod = 'POST';
  const hmacHashingMethod = 'HMACSHA256';
  const requestBodyHashingMethod = 'SHA256';

  const requestTimeStamp = unixTimestamp(Date.now());
  const nonce = generateNonce();

  const hashAlgorithm = createHash(requestBodyHashingMethod);
  const requestContentHash = hashAlgorithm.update(requestBody);
  const requestContentBase64String = requestContentHash.digest('base64');

  const signatureRawData = `${
    options.appId
  }${requestHttpMethod}${encodeURIComponent(
    options.requestUri
  )}${requestTimeStamp}${nonce}${requestContentBase64String}`;

  const hmac = createHmac('sha256', Buffer.from(options.apiKey, 'base64'));
  hmac.update(signatureRawData, 'utf8');
  const requestSignatureBase64String = hmac.digest('base64');

  const authHeader = `${hmacHashingMethod}:${requestBodyHashingMethod}:${options.appId}:${requestSignatureBase64String}:${nonce}:${requestTimeStamp}`;
  const response = await axios.post(options.requestUri, options.requestBody, {
    headers: { Authorization: `Hmac ${authHeader}`, 'x-csrf': '1' },
  });

  if (response.status !== 202) {
    throw new Error('could not finish sending');
  }
}
