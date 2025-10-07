import AppError from "../../errorHelpers/AppError";
import { IAuthProviders, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { enVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist.");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(enVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProviders = {
    provider: "credential",
    providerId: email as string,
  };
  const user = await User.create({
    email,
    auths: [authProvider],
    password: hashedPassword,
    ...rest,
  });
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {

  const isUserExist=await User.findById(userId);

  if(!isUserExist){
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
  }

  // if(isUserExist.isDeleted || isUserExist.isActive === IsActive.BLOCKED){
  //   throw new AppError(httpStatus.FORBIDDEN, "This user can not be updated!")
  // }
  /**
   * email---> Can not update,
   * name, phone, password, address,
   * password re hashing,
   * only admin, super-admin- role isDeleted,
   *
   * promoting to superAdmin -- superAdmin
   */

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    if (
      decodedToken.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    if (payload.isActive || payload.isVerified || payload.isDeleted) {
      if (decodedToken.isActive === Role.USER || decodedToken.isActive === Role.GUIDE ) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
      }
    }
    if(payload.password){
      payload.password = await bcryptjs.hash(payload.password, enVars.BCRYPT_SALT_ROUND);
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})
    return newUpdateUser;
  }
};

const getAllUsers = async () => {
  const users = await User.find({});

  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
};
