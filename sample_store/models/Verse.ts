/** @format */

import { model, Schema, Model, Document, ObjectId } from "mongoose";

export enum Style {
  Prose = 1,
  Poetry,
  PoetryNoClip,
  PoetryPreBreak,
  PoetryPreBreakNoClip,
  List,
  ListNoClip,
  ListPreBreak,
  ListPreBreakNoClip,
}

export interface IVerse extends Document {
  _id?: ObjectId;
  book: string;
  chapter: number;
  verse: number;
  heading: string;
  microheading: boolean;
  paragraph: boolean;
  style: Style;
  footnotes: string;
  versetext: string;
}

export const verseSchema = {
  name: 'verse',
  properties: {
    _id: 'objectId?',
    __v: 'int?',
    _key: 'objectId',
    book: 'string?',
    chapter: 'int?',
    footnotes: 'string?',
    heading: 'string?',
    microheading: 'bool?',
    paragraph: 'bool?',
    style: 'int?',
    verse: 'int?',
    versetext: 'string?',
  },
  primaryKey: '_id',
};

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
  heading: {
    type: String,
    default: "",
  },
  microheading: {
    type: Boolean,
    default: false,
  },
  paragraph: {
    type: Boolean,
    default: false,
  },
  style: {
    type: Style,
    required: true,
  },
  footnotes: {
    type: String,
    default: "~~",
  },
  versetext: {
    type: String,
    required: true,
  },
});

export const Verse: Model<IVerse> = model("Verse", VerseSchema);
