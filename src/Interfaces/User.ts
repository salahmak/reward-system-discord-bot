import { Document } from "mongoose";

export interface IUser extends Document { //for the mongoose docs objects
	id: string;
	server: string;
	score: number;
	solved: number;
}

export interface User {
	id: string;
	server: string;
	score: number;
	solved: number;
}

interface RegisterReturn {
	success: Boolean;
	user?: User;
}


export interface Register {
	(id: string, server: string): Promise<RegisterReturn>;
}