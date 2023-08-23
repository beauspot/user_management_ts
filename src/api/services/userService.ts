import { userModel } from "../models/userModels";
import { UserDataInterface } from "../interfaces/user_interface";
import UnauthenticatedError from "../helpers/unauthenticated";
import CustomAPIError from "../helpers/custom-errors";
import { StatusCodes } from "http-status-codes";
import { generateToken } from "../helpers/jsonWebToken";

// User signup Services
export const signup_user_service = async (userData: UserDataInterface) => {
  const newUser = await userModel.create({ ...userData });
  // console.log(newUser);
  const userToken = newUser.createJWT();
  // console.log(userToken);
  return { newUser, userToken };
};

// Login User service
export const login_user_service = async (
  userData: Partial<UserDataInterface>
) => {
  const { username, password } = userData; // Extract Email and Password from userData

  // checking if both fields are omitted
  if (!username || !password) {
    throw new CustomAPIError(
      `Email and Password are required for login.`,
      StatusCodes.BAD_REQUEST
    );
  }
  const userExists = await userModel.findOne({ username: username });
  if (!userExists) {
    throw new UnauthenticatedError(
      "Password or username didn't match any on our database",
      StatusCodes.NOT_FOUND
    );
  }
  // comparing the password of the user.
  const isMatch = await userExists.comparePwd(password);
  if (!isMatch) {
    throw new UnauthenticatedError(
      "Password or username didn't match any on our database",
      StatusCodes.NOT_FOUND
    );
  } else {
    //const token = userExists.createJWT();
    const token: string = generateToken(userExists._id);

    return { userExists, token };
  }
};
