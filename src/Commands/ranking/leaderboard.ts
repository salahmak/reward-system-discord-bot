import { Client, Message, MessageEmbed } from "discord.js";
import { Command, Register, User } from "../../Interfaces";
import register from "../../utils/register";
import getRank from "../../utils/getRank";
import UserModel from "../../models/user";

import { ExtendedClient } from "../../Client/index";

export const command: Command = {
	name: "leaderboard",
	description: "lists top users sorted by their scores",
	usage: "\`leaderboard\`",
	run: async (client: ExtendedClient, msg: Message, args: string[]) => {
		try {

			const guild = msg.guild;

			const {id, name} = guild!;

			const iconURL: string = msg.guild!.iconURL()!;

			
			const users: User[] = await UserModel.find({server: id})
				.limit(10)
				.sort({ score: -1 })
				.lean()
				.exec();

			if(users.length === 0)
			{
				msg.channel.send("Currently there are no registered users in this server")
				return;
			}


			const embed = new MessageEmbed()
				.setTitle("Leaderboard")
				.setDescription(`Top ${users.length} users`)
				.setColor("#33ffe7")
				.setThumbnail(iconURL)
				.setFooter(name);

			users.forEach((user, i)=>{

				embed.addField(`------${1+i}------ `,`<@${user.id}>: **Score**: ${user.score}, **Solved**: ${user.solved} challenges`);
			})

			//console.log(iconURL)

			msg.channel.send({embeds: [embed]})




		} catch (e) {
			console.log("error has occured in leaderboard.ts", e);
		}
	},
	aliases: ["lb"],
};