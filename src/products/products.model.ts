import * as mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  productId: {type: String, required: true}
})
export interface Product extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  price: number;
  productId: string;
}
