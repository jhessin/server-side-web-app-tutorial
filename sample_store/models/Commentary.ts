/** @format */

import { model, Schema, Model, Document, ObjectId } from "mongoose";

export interface ICommentary extends Document {
  _id?: ObjectId;
  book: string;
  chapter: number;
  verse: number;
  commentary: string;
}

const CommentarySchema: Schema = new Schema({
  book: {
    type: String,
    required: true,
  },
  chapter: {
    type: Number,
    default: null,
  },
  verse: {
    type: Number,
    default: null,
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
