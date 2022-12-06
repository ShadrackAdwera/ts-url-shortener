import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Url, UrlDoc } from '../models/Url';
import { sha } from '../utils/sha';

export const hostUrl = 'http://ts-minified.io';

const getUrls = async (req: Request, res: Response, next: NextFunction) => {
  let urls: (UrlDoc & { _id: string })[];
  try {
    urls = await Url.find();
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }
  res.status(200).json({ count: urls.length, urls });
};

const createUrl = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return next(new HttpError('Invalid inputs', 400));
  const { url } = req.body;

  const shortened = sha(url);

  const newUrl = new Url({
    longUrl: url,
    hashKey: shortened,
  });

  try {
    await newUrl.save();
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }
  res.status(201).json({
    message: 'URL Created',
    shortUrl: `${hostUrl}/${newUrl.hashKey}`,
    longUrl: newUrl.longUrl,
  });
};

const pingUrl = async (req: Request, res: Response, next: NextFunction) => {
  const params = req.params.hash;
  let foundUrl: (UrlDoc & { _id: string }) | null;

  try {
    foundUrl = await Url.findOne({ hashKey: params });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }
  if (!foundUrl) return next(new HttpError('The URL was not found', 404));
  res.redirect(301, foundUrl.longUrl);
};

export { getUrls, createUrl, pingUrl };
