/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JwtPayload } from 'jsonwebtoken';
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userTokens";
import { enVars } from '../../config/env';

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email Doesn't Exist");
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const userToken = createUserToken(isUserExist);

  // delete isUserExist.password;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken =await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

  const user = await User.findById(decodedToken.userId);
  const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);
  
  if(!isOldPasswordMatch){
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password Doesn't Match")
  };

  user!.password = await bcryptjs.hash(newPassword, Number(enVars.BCRYPT_SALT_ROUND)); 
  user!.save();
};

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
};
