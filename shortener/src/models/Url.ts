import { Document, Model, model, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface UrlDoc extends Document {
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

urlSchema.set('versionKey', 'version');
urlSchema.plugin(updateIfCurrentPlugin);

const Url = model<UrlDoc, UrlModel>('url', urlSchema);

export { Url };
