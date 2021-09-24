import { Client, Message, MessageEmbed } from "discord.js";
import { Command, Register, User } from "../../Interfaces";
import register from "../../utils/register";
import getRank from "../../utils/getRank";
import UserModel from "../../models/user";

import { ExtendedClient } from "../../Client/index";

export const command: Command = {
	name: "profile",
	run: async (client: ExtendedClient, msg: Message, args: string[]) => {
		try {
			const mention = msg.mentions.users.first()
				? msg.mentions.users.first()
				: msg.author;

			const id = mention!.id;
			const avatar = mention!.avatar;

			const avatarURL = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=256`;

			const server = msg.guildId!.toString();

			const serverName = msg.guild!.name;

			let user: any = await UserModel.findOne({
				id: id.toString(),
				server,
			}).lean();

			if (!user) {
				const newUser = await register(id, server);
				if (!newUser.success) {
					msg.channel.send(
						"an error has occured while creating the user"
					);
					return;
				} else {
					user = newUser.user;
				}
			}

			const {rank, total} = await getRank(user.score, server);


			const embed = new MessageEmbed()
				.setTitle(`${mention!.username}#${mention!.discriminator}`)
				.setAuthor("Profile")
				.setThumbnail(avatarURL)
				.addField("Score:", `${user.score}`)
				.addField("Challenged solved:", `${user.solved}`)
				.addField("Rank:", `${rank}/${total}`)
				.setColor("#33ffe7")
				.setFooter(serverName)

			msg.channel.send({embeds: [embed]});

		} catch (e) {
			console.log("error has occured in profile.ts", e);
		}
	},
	aliases: ["p"],
};