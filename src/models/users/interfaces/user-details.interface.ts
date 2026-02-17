import { Types } from "mongoose";

export interface UserDTO {
  _id: string | Types.ObjectId;
  name: string;
  lastname: string;
  email: string;
}
