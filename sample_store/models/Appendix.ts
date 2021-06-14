/** @format */

import { model, Schema, Model, Document, ObjectId } from "mongoose";

export interface IAppendix extends Document {
  _id?: ObjectId;
  title: string;
  appendix: string;
}

export const appendixSchema = {
  name: "appendix",
  properties: {
    _id: "objectId?",
    __v: "int?",
    _key: "objectId",
    appendix: "string?",
    title: "string?",
  },
  primaryKey: "_id",
};

const AppendixSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  appendix: {
    type: String,
    required: true,
  },
});

export const Appendix: Model<IAppendix> = model("Appendix", AppendixSchema);
