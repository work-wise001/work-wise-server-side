import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  fullName: {type: String},
  email: {type: String, required: true},
  password: {type: String},
  userId: {type: String, required: true},
  verified: {type: Boolean, default: false },
  authStrategy: {type: String, default: "local"},
  otpCode: {type: String},
  image: { url: String, format: String, public_id: String },
  resetToken: {type: String},
  resetTokenExpiration: {type: Number}
},
{
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      delete ret._id;
    },
  },
  timestamps: true,
})
export interface User extends mongoose.Document {
  id: string;
  fullName: string;
  email: string;
  password: string;
  userId: string;
  otpCode: string;
  verified: boolean;
  resetToken: string;
  resetTokenExpiration: number;
}
