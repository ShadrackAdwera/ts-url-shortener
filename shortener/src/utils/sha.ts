import { sha512 } from 'sha.js';
export const sha = (url: string) =>
  new sha512().update(url).digest('hex').split('').slice(0, 7).join('');
