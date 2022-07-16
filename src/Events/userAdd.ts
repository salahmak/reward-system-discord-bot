import { Event } from "../Interfaces";
import { GuildMember } from "discord.js";
import register from "../utils/register";

export const event: Event = {
    name: "guildMemberAdd",
    once: false,
    run: async (client, member: GuildMember) => {
        try {
            const id = member.id;
            const server = member.guild!.id;

            await register(id, server);

        } catch (e) {
            console.log(e);
        }
    },
};