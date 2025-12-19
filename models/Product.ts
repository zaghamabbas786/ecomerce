import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVariant {
  size: string;
  color: string;
  stock: number;
}

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  collectionId?: mongoose.Types.ObjectId;
  sizes: string[];
  colors: string[];
  images: string[];
  variants: IVariant[];
  featured: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>(
  {
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    collectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Collection',
    },
    sizes: [
      {
        type: String,
        required: true,
      },
    ],
    colors: [
      {
        type: String,
        required: true,
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    variants: [VariantSchema],
    featured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ price: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

