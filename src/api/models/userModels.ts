import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserDataInterface } from "../interfaces/user_interface";

// Declare the Schema of the Mongo model
const userSchema = new Schema<UserDataInterface>(
  {
    username: {
      type: String,
      required: [true, "Username is mandatory."],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// <----- Applying mongoose middleware to the user model----->

// for the moment user registers
// the password is ran through a bcrypt function

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// generate token
userSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXP }
  );
};

userSchema.methods.comparePwd = async function (pwd: string) {
  const comparePwd = await bcrypt.compare(pwd, this.password);
  console.info(comparePwd);
  return comparePwd;
};

//Export the model
export const userModel = model<UserDataInterface>("Usermodel", userSchema);
