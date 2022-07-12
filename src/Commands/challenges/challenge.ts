import { Message } from "discord.js";
import { Command } from "../../Interfaces";
import ChallengeModel from "../../models/challenge";

import { ExtendedClient } from "../../Client";

export const command: Command = {
    name: "challenge",
    description: "managing challenges",
    usage: "",
    aliases: ["ch"],

    run: async (client: ExtendedClient, msg: Message, args: string[]) => {
        
    },
};
