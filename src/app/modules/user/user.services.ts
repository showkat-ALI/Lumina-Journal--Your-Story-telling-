/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TAuthorizedData } from '../../generalType/authorizedData';
const registerSingleStudentIntoDB = (userData: TUser) => {
  try {
    User.create(userData);
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
  }
};
const blockUsersFromDB = async (header: any, userID: string) => {
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

  const authorizedData: TAuthorizedData = await new Promise(
    (resolve, reject) => {
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
    },
  );
  try {
    if (authorizedData?.role === 'admin') {
      const user: TUser | any = await User.findOne({ _id: userID });
      user.isBlocked = true;
      return user;
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Something went wrong while getting user!!',
      );
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};
const getAllUsersFromDB = async (header: any) => {
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

  const authorizedData: TAuthorizedData = await new Promise(
    (resolve, reject) => {
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
    },
  );
  try {
    if (authorizedData?.role === 'admin') {
      const users = await User.find();
      return users;
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Something went wrong while getting user!!',
      );
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
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
  getAllUsersFromDB,
  blockUsersFromDB,
};
