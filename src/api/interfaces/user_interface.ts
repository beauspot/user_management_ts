import { Document, Types } from "mongoose";

export interface UserDataInterface extends Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  createJWT: () => string;
  comparePwd: (pwd: string) => Promise<boolean>;
}
