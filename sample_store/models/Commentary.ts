/** @format */

import { model, Schema, Model, Document, ObjectId } from "mongoose";

export interface ICommentary extends Document {
  _id?: ObjectId;
  book: string;
  chapter: number;
  verse: number;
  commentary: string;
}

export const commentarySchema = {
  name: "commentary",
  properties: {
    _id: "objectId?",
    __v: "int?",
    _key: "objectId",
    book: "string?",
    chapter: "int?",
    commentary: "string?",
    verse: "int?",
  },
  primaryKey: "_id",
};

const CommentarySchema: Schema = new Schema({
  book: {
    type: String,
    required: true,
  },
  chapter: {
    type: Number,
    required: true,
  },
  verse: {
    type: Number,
    required: true,
  },
  commentary: {
    type: String,
    required: true,
  },
});

export const Commentary: Model<ICommentary> = model(
  "Commentary",
  CommentarySchema,
);
