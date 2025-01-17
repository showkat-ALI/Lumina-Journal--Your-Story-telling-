import { Schema, model } from 'mongoose';
import { BlogModel, TBlog } from './blog.interface';
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
    owner: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);
blogSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

blogSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

blogSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//creating a custom static method
blogSchema.statics.isBlogExists = async function (id: string) {
  const existingBlog = await Blog.findOne({ id });
  return existingBlog;
};

export const Blog = model<TBlog, BlogModel>('Blog', blogSchema);
