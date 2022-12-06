import request from 'supertest';
import { app } from '../../app';
import { sha } from '../../utils/sha';
import { hostUrl } from '../url-controllers';

const baseUrl = '/minified-url';
const sampleUrl = 'https://sample-url.com';

describe('url controllers', () => {
  describe('getUrls controller', () => {
    it('should 200 on a successful call', () => {
      return request(app).get(`${baseUrl}`).send({}).expect(200);
    });
  });
  it('should return an empty array when there are no urls', async () => {
    const response = await request(app).get(`${baseUrl}`).send({}).expect(200);
    expect(response.body.urls.length).toBe(0);
  });
  it('should return a list of urls', async () => {
    await request(app).post(`${baseUrl}`).send({ url: sampleUrl }).expect(201);
    const response = await request(app).get(`${baseUrl}`).send({}).expect(200);
    expect(response.body.urls.length).toBeGreaterThan(0);
  });
  describe('createUrl url controller', () => {
    it('should return an error when an empty body is provided', () => {
      return request(app).post(`${baseUrl}`).send({}).expect(400);
    });
    it('should create a new url', async () => {
      const hashKey = sha(sampleUrl);
      const postResponse = await request(app)
        .post(`${baseUrl}`)
        .send({ url: sampleUrl })
        .expect(201);
      expect(postResponse.body.longUrl).toBe(sampleUrl);
      expect(postResponse.body.shortUrl).toBe(`${hostUrl}/${hashKey}`);
    });
  });
  describe('pingUrl controller', () => {
    it('should redirect to the long url', async () => {
      await request(app)
        .post(`${baseUrl}`)
        .send({ url: sampleUrl })
        .expect(201);
      const urlFound = await request(app)
        .get(`${baseUrl}`)
        .send({})
        .expect(200);

      return request(app)
        .get(`${baseUrl}/${urlFound.body.urls[0].hashKey}`)
        .send({})
        .expect(301);
    });
  });
});
