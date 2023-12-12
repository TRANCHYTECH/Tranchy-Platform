import { randomBytes, createHash } from 'crypto';
import axios from 'axios';

function unixTimestamp(date: number) {
  return Math.floor(date / 1000);
}

function generateNonce() {
  const nonce = randomBytes(16).toString('base64');
  return nonce;
}

export type CreateUserHookOptions = {
  appId: string;
  apiKey: string;
  requestUri: string;
  requestBody: {
    userName: string;
  };
};

export async function createUserHook(
  options: CreateUserHookOptions
): Promise<string> {
  const requestBody = JSON.stringify(options.requestBody);
  const appId = options.appId;
  const apiKey = options.apiKey;
  const requestHttpMethod = 'POST';
  const requestUri = encodeURIComponent(options.requestUri); // OK
  const hmacHashingMethod = 'HMACSHA256';
  const requestBodyHashingMethod = 'SHA256';

  // UNIX time. OK
  const requestTimeStamp = unixTimestamp(Date.now());

  // create random nonce for each request
  const nonce = generateNonce();

  // Hashing the request body, any change in request body will result in different hash, we'll incure message integrity
  const hashAlgorithm = createHash(requestBodyHashingMethod);
  const requestContentHash = hashAlgorithm.update(requestBody);
  const requestContentBase64String = requestContentHash.digest('base64');

  // Creating the raw signature string
  const signatureRawData = `${appId}${requestHttpMethod}${requestUri}${requestTimeStamp}${nonce}${requestContentBase64String}`;

  const { createHmac } = await import('crypto');
  const hmac = createHmac('sha256', Buffer.from(apiKey, 'base64'));
  hmac.update(signatureRawData, 'utf8');

  const requestSignatureBase64String = hmac.digest('base64');

  const authHeader = `${hmacHashingMethod}:${requestBodyHashingMethod}:${appId}:${requestSignatureBase64String}:${nonce}:${requestTimeStamp}`;

  const response = await axios.post(options.requestUri, options.requestBody, {
    headers: { Authorization: `Hmac ${authHeader}`, 'x-csrf': '1' },
  });

  return authHeader;
}
