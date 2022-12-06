import { createHash } from 'crypto';

export const sha = (url: string) =>
  createHash('sha1').update(url).digest('hex').split('').slice(0, 7).join('');
