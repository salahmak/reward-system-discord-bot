import { Client, Message } from "discord.js";
import { Command } from "../../Interfaces";

export const command: Command = {
	name: "ping",
	description: "prints the response latency from the server",
	usage: `\`ping\``,
	run: (client: Client, msg: Message, args: string[]) => {
		msg.channel.send(`${client.ws.ping}ms, Pong!`)
	},
	aliases: []
}