import { Document } from "mongoose";

export interface IUser extends Document { //for the mongoose docs objects
	id: string;
	server: string;
	score: number;
	solved: string[]; //array of names of the solved challenges
}

export interface User {
	id: string;
	server: string;
	score: number;
	solved: string[];
}

interface RegisterReturn {
	success: Boolean;
	user?: User;
}


export interface Register {
	(id: string, server: string): Promise<RegisterReturn>;
}