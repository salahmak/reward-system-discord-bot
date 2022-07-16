import { Command, Event } from "../Interfaces";
import { Message } from "discord.js";


export const event: Event = {
    name: "messageCreate",
    once: false,
    run: async (client, msg: Message) => {

        if (
            msg.author.bot ||
            !msg.guild ||
            !msg.content.startsWith(client.config.prefix)
        ) return;

        const args = msg.content
            .slice(client.config.prefix.length)
            .trim()
            .split(" ");

        const cmd = args[0];
        if (!cmd) return;

        const command = client.commands.get(cmd) || client.aliases.get(cmd);
        if (!command) return;

        (command as Command).run(client, msg, args);
    },
};