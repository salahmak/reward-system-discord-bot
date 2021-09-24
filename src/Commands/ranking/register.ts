import { Client, Message } from "discord.js";
import { Command, Register, User  } from "../../Interfaces";
import register from "../../utils/register"


export const command: Command = {
	name: "register",
	run: async (client: Client, msg: Message, args: string[]) => {
		const id = msg.author!.id!.toString();
		const server = msg.guildId!.toString();

		console.log({id, server})

		const regUser = await register(id, server);

		if(!regUser.success){
			msg.channel.send("failed to create user, please contact the admins");
			return;
		}
		
		msg.channel.send("success")

	},
	aliases: []
}