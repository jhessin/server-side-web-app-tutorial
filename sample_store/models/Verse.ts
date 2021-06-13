/** @format */

import { model, Schema, Model, Document, ObjectId } from "mongoose";

export interface IVerse extends Document {
  _id?: ObjectId;
  testament: number;
  book: string;
  chapter: number;
  verse: number;
  versetext: string;
  heading: string;
  paragraph: boolean;
  style: string;
  microheading: boolean;
  footnote: string;
}

export const VerseSchema: Schema = new Schema({
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
  versetext: {
    type: String,
    required: true,
  },
});

export const Verse: Model<IVerse> = model("Verse", VerseSchema);
