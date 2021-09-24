import UserModel from "../models/user";

const unregister = async (id: string, server: string) => {
	try {
		//checking if user exists
		const deletedUser = await UserModel.deleteOne({ id, server });

		console.log(deletedUser);


		// if the user exists, return false seccuess message and no user
		
		


	} catch (e) {
		console.log(e);
	}
};

export default unregister;