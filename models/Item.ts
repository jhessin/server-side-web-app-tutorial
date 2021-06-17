/** @format */

import { model, Schema, Model, Document, ObjectId } from "mongoose";

export interface IItem extends Document {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  // Array of User ID's interested in the item
  interested: ObjectId[];
  timestamp: Date;
}

const ItemSchema: Schema = new Schema({
  name: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  interested: {
    type: Array,
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Item: Model<IItem> = model("Item", ItemSchema);
