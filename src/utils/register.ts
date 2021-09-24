import { Register, User } from "../Interfaces";
import UserModel from "../models/user";

const register: Register = async (id: string, server: string) => {
	try {
		//checking if user exists
		const userExists = await UserModel.findOne({ id, server }).lean();

		// if the user exists, return false seccuess message and no user
		if (userExists) {
			throw "user already exists";
		}

		//initializing new user object
		const newUser: User = {
			id,
			server,
			score: 0,
			solved: 0,
		};

		//saving the new user in the db
		const user = new UserModel(newUser);
		await user.save();


		return {success: true, user: newUser};


	} catch (e) {
		console.log(e);
		return { success: false };
	}
};

export default register;