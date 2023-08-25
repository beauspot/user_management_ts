import { signup_user_service, login_user_service } from "../services/userService";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import {generateRefreshToken} from "../helpers/refreshToken";

// User Signup controller
export const signup_a_user = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Callling the create_user_service function.
        const { newUser, userToken } = await signup_user_service(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ UserData: { username: newUser.username }, token: userToken });
  }
);

// User Login Controller
export const login_user = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {  username, password } = req.body;

    // Pass email and password separately to login_user_service
    const { userExists, token } = await login_user_service({
       username,
      password,
    });

    // checking if the user with the email exists or not.
    if (!userExists) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        errMessage: `The user with the email: ${username} is not registered`,
      });
    }
    const refreshToken = generateRefreshToken(userExists._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(StatusCodes.OK).json({
      userData: { userEmail: username },
      Token: token
    });
  }
);