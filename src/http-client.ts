import axios from 'axios';

export interface HttpClientOptions {
  origin: string;
  userAgent: string;
}

export const createHttpClient = ({ origin, userAgent }: HttpClientOptions) =>
  axios.create({
    headers: {
      Origin: origin,
      Referer: origin,
      'User-Agent': userAgent,
    },
  });
