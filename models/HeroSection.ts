import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeroSection extends Document {
  title: string;
  subtitle?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSectionSchema = new Schema<IHeroSection>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    subtitle: {
      type: String,
    },
    image: {
      type: String,
    },
    ctaText: {
      type: String,
    },
    ctaLink: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const HeroSection: Model<IHeroSection> =
  mongoose.models.HeroSection ||
  mongoose.model<IHeroSection>('HeroSection', HeroSectionSchema);

export default HeroSection;

