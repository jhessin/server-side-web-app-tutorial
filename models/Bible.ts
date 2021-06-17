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

export const bibleSchema = {
  name: "bible",
  properties: {
    _id: "objectId?",
    __v: "int?",
    _key: "objectId",
    timestamp: "date?",
    version: "int?",
  },
  primaryKey: "_id",
};

export const Bible: Model<IBible> = model("Bible", BibleSchema);
