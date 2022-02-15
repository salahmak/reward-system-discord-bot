import { Message, MessageEmbed } from "discord.js";
import { ExtendedClient } from "../../Client/index";
import { Command } from "../../Interfaces";

export const command: Command = {
	name: "help",
	description: "Prints information about each command (`help <command>`)",
	usage: `\`help\`: Prints descriptions of all commands\n\`help <command>\`: Prints usage of a certain command`,
	run: (client: ExtendedClient, msg: Message, args: string[]) => {
		const commandKeys = [...client.commands.keys()];
		const commandsObjs = [...client.commands.values()];

		//the command that we want to get help for
		const cmd = args[1];
		

		//initializing the embed
		const embed = new MessageEmbed()
			.setFooter(msg.guild!.name)
			.setColor("#33ffe7");

		//in case if we want help for only 1 command
		if (Boolean(cmd) && commandKeys.includes(cmd)) {
			const command = client.commands.get(cmd);
			embed.setTitle(command!.name);
			embed.addField("Descriptions:", command!.description);
			embed.addField("Usage:", command!.usage);

			if (command!.aliases.length !== 0) {
				let aliases: string = "";
				command!.aliases.forEach((al) => {
					aliases += ` \`${al}\``;
				});

				embed.addField("aliases", aliases);
			}

			//in case if we want a general help message
		} else {
			embed.setTitle("Commands list");

			commandsObjs.forEach((command) => {
				embed.addField(command.name, command.description);
			});
		}

		//sending the help msg
		msg.channel.send({ embeds: [embed] });
	},
	aliases: ["h"],
};