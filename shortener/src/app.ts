import express, { Request, Response, NextFunction } from 'express';
import { HttpError } from '@adwesh/common';
import { urlRouter } from './routes/url-routes';

const app = express();

app.use(express.json());

app.use('/api/minified-url', urlRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  return next(new HttpError('This method / route does not exist', 404));
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An error occured try again' });
});
