import { Challenge } from "../Interfaces/index";
import { Schema, model } from "mongoose";

const UserSchema = new Schema<Challenge>({
  id: String,
  serverId: String,
  award: Number,
  solvedCount: Number,
});

const UserModel = model<Challenge>("challenges", UserSchema);

export default UserModel;
