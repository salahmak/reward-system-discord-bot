import { User } from "../Interfaces";
import { model, Schema } from "mongoose";

const UserSchema = new Schema<User>({
    id: String,
    server: String,
    score: Number,
    solved: [String],
});

const UserModel = model<User>("users", UserSchema);

export default UserModel;
