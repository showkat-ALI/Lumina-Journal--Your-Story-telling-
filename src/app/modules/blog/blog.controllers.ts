import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { blogServices } from './blog.services';

const createABlog = catchAsync(async (req, res) => {
  const userData = req.body;
  const header = req.headers['authorization'];

  const result = await blogServices.createABlogIntoDB(userData, header);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog is created succesSfully',
    data: result,
  });
});
const updateBlog = catchAsync(async (req, res) => {
  const blogID = req.params;
  const userData = req.body;
  const header = req.headers['authorization'];

  const result = await blogServices.updateABlogFromDB(userData, header, blogID);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog is updated succesSfully',
    data: result,
  });
});

export const blogControllers = {
  createABlog,
  updateBlog,
};
