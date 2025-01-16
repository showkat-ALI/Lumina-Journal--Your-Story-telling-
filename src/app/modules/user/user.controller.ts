import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.services';

const registerUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await UserServices.registerSingleStudentIntoDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is registered succesSfully',
    data: result,
  });
});
const loginUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await UserServices.loginUserIntoDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});
export const UserControllers = {
  registerUser,
  loginUser,
};
