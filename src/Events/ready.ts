import { Event } from "../Interfaces";

export const event: Event = {
	name: "ready",
	once: true,
	run: (client) => {
		client.user?.setPresence({ activities: [{ name: client.config.prefix, type: "LISTENING" }], status: 'online' });

		console.log("ready");
	}
}