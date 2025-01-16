import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
const registerSingleStudentIntoDB = (userData: TUser) => {
  try {
    User.create(userData);
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
  }
};
const loginUserIntoDB = async (userData: TUser) => {
  try {
    const userEmail = userData.email;
    const userPassWord = userData.password;
    const retriveUser = await User.findOne({
      email: userEmail,
    });

    if (
      retriveUser &&
      (await bcrypt.compare(userPassWord, retriveUser.password))
    ) {
      const jwtToken = jwt.sign(
        {
          password: retriveUser.password,
          role: retriveUser.role,
          email: retriveUser.email,
          isBlocked: retriveUser.isBlocked,
          isDeleted: retriveUser.isDeleted,
        },
        config.PRIVATE_KEY as string,
        { expiresIn: '1h', algorithm: 'HS256' },
      );
      return { token: jwtToken };
    } else {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Password or Email didn't match",
      );
    }
  } catch (error) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "Password or Email didn't match",
    );
  }
};

export const UserServices = {
  registerSingleStudentIntoDB,
  loginUserIntoDB,
};
