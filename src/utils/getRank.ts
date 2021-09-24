import UserModel from "../models/user";


interface Rank {
	rank: number;
	total: number;
}

const getRank = async(score: number, server: string): Promise<Rank> => {

	const rank = await UserModel.find({ server, score: { $gte: score } })
		.count()
		.exec();

	const total = await UserModel.count({server});

	return {rank, total};
}


export default getRank;

