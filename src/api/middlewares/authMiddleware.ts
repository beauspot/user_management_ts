import { Response, NextFunction } from "express";
import { userModel } from "../models/userModels";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UnauthenticatedError from "../helpers/unauthenticated";
import { AuthenticatedRequest } from "../interfaces/authenticateRequest";
import lodash from "lodash";

// Define a type guard function for JwtPayload
function isJwtPayload(decoded: any): decoded is JwtPayload {
  return typeof decoded === "object" && "id" in decoded;
}

// creating the authentication middleware to authenticate the user.
export const auth = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    /*   console.log("token Data: ", token);
      console.log("Request User Data: ", req.user); */
      try {
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          if (isJwtPayload(decoded)) {
            console.log(decoded.id);
          }
          // console.log("Decoded Data: ", decoded);
          const user = await userModel.findById(decoded.id);
          if (!lodash.isUndefined(user)) {
            req.user = { id: user?.id, username: user?.username };
            next();
          }
        }
      } catch (error) {
        throw new UnauthenticatedError(
          "Not Athorized token expired, Please Login again.",
          StatusCodes.UNAUTHORIZED
        );
      }
    } else {
      throw new UnauthenticatedError(
        "There is no token atached to the Header.",
        StatusCodes.UNAUTHORIZED
      );
    }
    //   next();
  }
);
