/** @format */

import { model, Schema, Model, Document, ObjectId } from "mongoose";

export interface IAppendix extends Document {
  _id: ObjectId;
  title: string;
  appendix: string;
}

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
