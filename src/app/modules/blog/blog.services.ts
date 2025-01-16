import jwt from 'jsonwebtoken';
import config from '../../config';
import { Blog } from './blog.model';
import { TBlog } from './blog.interface';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const createABlogIntoDB = async (payload: TBlog, header: any) => {
  try {
    let gotToken;

    if (header && header.startsWith('Bearer ')) {
      const bearer = header.split(' ');
      gotToken = bearer[1];
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Authorization header is missing or malformed',
      );
    }

    const authorizedData = await new Promise((resolve, reject) => {
      jwt.verify(
        gotToken,
        config.PRIVATE_KEY as string,
        (err: any, decoded: any) => {
          if (err) {
            reject(new AppError(httpStatus.BAD_REQUEST, 'Invalid token'));
          } else {
            resolve(decoded);
          }
        },
      );
    });

    try {
      const newBlog = await Blog.create(payload);
      return { _id: newBlog._id, author: authorizedData };
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create blog');
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};
const updateABlogFromDB = async (
  payload: TBlog,
  header: any,
  blogID: string,
) => {
  try {
    let gotToken;

    if (header && header.startsWith('Bearer ')) {
      const bearer = header.split(' ');
      gotToken = bearer[1];
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Authorization header is missing or malformed',
      );
    }

    const authorizedData = await new Promise((resolve, reject) => {
      jwt.verify(
        gotToken,
        config.PRIVATE_KEY as string,
        (err: any, decoded: any) => {
          if (err) {
            reject(new AppError(httpStatus.BAD_REQUEST, 'Invalid token'));
          } else {
            resolve(decoded);
          }
        },
      );
    });

    try {
      if (authorizedData) {
        const newBlog = await Blog.findOneAndUpdate(
          { _id: blogID },
          { payload },
        );
        return newBlog;
      }
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create blog');
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

export const blogServices = {
  createABlogIntoDB,
  updateABlogFromDB,
};
