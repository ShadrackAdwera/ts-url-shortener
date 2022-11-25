import { Document, Model, model, Schema } from 'mongoose';

interface UrlDoc extends Document {
  longUrl: string;
  shortUrl: string;
  version: number;
}

interface UrlModel extends Model<UrlDoc> {
  longUrl: string;
  shortUrl: string;
}

const urlSchema = new Schema(
  {
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
  },
  { timestamps: true, toJSON: { getters: true } }
);

const Url = model<UrlDoc, UrlModel>('url', urlSchema);

export { Url };
