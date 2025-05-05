import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  ph: number;
  size: number; // in ml
  price: number;
  image: string;
  benefits: string[];
  stock: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    ph: {
      type: Number,
      required: true,
      min: 0,
      max: 14,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    benefits: [{
      type: String,
      required: true,
    }],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search
productSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema); 