import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);
    // res.status(httpStatus.CREATED).json({
    //   message: "User Created Successfully.",
    //   user,
    // });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllUsers();

    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "All Users Retrieved Successfully.",
    //   data: users,
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const userControllers = {
  createUser,
  getAllUsers,
};

// route matching -> controller -> service-> model-> db
