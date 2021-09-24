import { ExtendedClient } from "../Client";
import { ClientEvents } from "discord.js";

interface Run {
	(client: ExtendedClient, ...args: any[]):any;
}

export interface Event {
	name: keyof ClientEvents;
	once: Boolean;
	run: Run;
}