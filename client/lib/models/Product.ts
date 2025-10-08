import mongoose from "mongoose";

export interface ITexture {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  imagePublicId?: string;
  images: {
    url: string;
    publicId?: string;
    alt?: string;
    isPrimary?: boolean;
  }[];
  resolution?: string;
  format?: string;
  tags?: string[];
  featured?: boolean;
  trending?: boolean;
  likes?: number;
  views?: number;
  isActive?: boolean;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

const TextureSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true, // Primary image
    },
    imagePublicId: {
      type: String,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
        },
        alt: {
          type: String,
          default: "",
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    resolution: {
      type: String,
      default: "4096x4096",
    },
    format: {
      type: String,
      default: "PNG, JPG",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for better performance
TextureSchema.index({ category: 1 });
TextureSchema.index({ featured: 1 });
TextureSchema.index({ trending: 1 });
TextureSchema.index({ isActive: 1 });
TextureSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.models.Texture ||
  mongoose.model("Texture", TextureSchema);