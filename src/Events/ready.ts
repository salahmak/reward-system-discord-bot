import { Event } from "../Interfaces";

export const event: Event = {
	name: "ready",
	once: true,
	run: (client) => {
		console.log("ready");
	}
}