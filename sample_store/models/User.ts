/** @format */

import { model, Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  isAdmin: boolean;
  timestamp: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const User: Model<IUser> = model('User', UserSchema);
