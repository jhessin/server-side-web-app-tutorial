/** @format */

import { model, Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
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
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const User: Model<IUser> = model('User', UserSchema);
