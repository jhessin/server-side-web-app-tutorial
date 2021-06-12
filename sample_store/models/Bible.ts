/** @format */

import { model, Schema, Model, Document, ObjectId } from "mongoose";

export interface IBible extends Document {
  _id?: ObjectId;
  timestamp: Date;
  version: number;
}

export const BibleSchema: Schema = new Schema({
  timestamp: {
    type: Date,
    default: new Date(),
  },
  version: {
    type: Number,
    default: 1,
  },
});

export const Bible: Model<IBible> = model("Bible", BibleSchema);
