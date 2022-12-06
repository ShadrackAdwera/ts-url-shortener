import { Document, Model, model, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface UrlDoc extends Document {
  longUrl: string;
  hashKey: string;
  version: number;
}

interface UrlModel extends Model<UrlDoc> {
  longUrl: string;
  hashKey: string;
}

const urlSchema = new Schema(
  {
    longUrl: { type: String, required: true },
    hashKey: { type: String, required: true },
  },
  { timestamps: true, toJSON: { getters: true } }
);

urlSchema.set('versionKey', 'version');
urlSchema.plugin(updateIfCurrentPlugin);

const Url = model<UrlDoc, UrlModel>('url', urlSchema);

export { Url };
