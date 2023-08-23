import AsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticateRequest";

export const dashboardCtrl = AsyncHandler(
  (req: AuthenticatedRequest, res: Response) => {
    const username = req.user?.username as string;
    if (username) {
      res.send(`Welcome to Your Dashboard, ${username}!`);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json("Not logged in");
    }
  }
);
