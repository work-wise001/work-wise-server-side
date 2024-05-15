import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  fullName: {type: String},
  email: {type: String, required: true},
  password: {type: String},
  userId: {type: String, required: true},
  image: { url: String, format: String, public_id: String }
})
export interface User extends mongoose.Document {
  id: string;
  fullName: string;
  email: string;
  password: string;
  userId: string;
}
