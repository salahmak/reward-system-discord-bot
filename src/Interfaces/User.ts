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