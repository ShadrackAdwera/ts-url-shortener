import { sha } from './sha';

describe('sha function', () => {
  it('return 7 characters for the hash value', () => {
    const hashValue = sha('https://www.google.com');
    expect(hashValue.length).toBe(7);
  });
});
