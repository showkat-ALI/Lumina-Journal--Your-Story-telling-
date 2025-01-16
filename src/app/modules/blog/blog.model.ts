import { Schema, model } from 'mongoose';
import { TBlog } from './blog.interface';
const blogSchema = new Schema<TBlog>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Blog = model<TBlog>('Blog', blogSchema);
