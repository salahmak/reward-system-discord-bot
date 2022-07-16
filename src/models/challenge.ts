import { Challenge } from "../Interfaces";
import { model, Schema } from "mongoose";

const UserSchema = new Schema<Challenge>({
    name: String,
    server: String,
    award: Number,
    solvedCount: Number,
});

const UserModel = model<Challenge>("challenges", UserSchema);

export default UserModel;
