import { Client, Message } from "discord.js";
import { Command, Register, User  } from "../../Interfaces";
import register from "../../utils/register";
import UserModel from "../../models/user";

import {ExtendedClient} from "../../Client/index"


export const command: Command = {
	name: "award",
	run: async (client: ExtendedClient, msg: Message, args: string[]) => {

		try{

			if(!msg.member.permissions.has("ADMINISTRATOR")){
				msg.channel.send(`<@${msg.author.id}> You don't have access to this command, if you have solved a challenge, please ask admins to award you, thanks.`)
				return;
			}

			let id: string;
			const server = msg.guildId!.toString();
			const points = +args[2]

			if(msg.mentions.users.first())
			{
				id = msg.mentions.users.first()!.id.toString();
			}else{
				msg.channel.send(`error: use as shown:\n\`${client.config.prefix} award @user <amount>\``);

				return;
			}

			if(!Boolean(points)){
				msg.channel.send("please enter a correct number")
				return;
			}



			//checking if user exists
			const userExists = await UserModel.findOne({ id, server });

			if(userExists)
			{
				await userExists.updateOne({$inc: {score: points, solved: 1}});
			}else {
				const newUser = await register(id, server);
				if(newUser.success){
					await UserModel.findOneAndUpdate(newUser.user, {$inc: {score: points, solved: 1}});
				}
			}


			msg.channel.send(`<@!${id}> has been awarded ${points} point`);

		
		
		}catch(e){
			console.log("error has occured in award.ts")
		}


	},
	aliases: []
}