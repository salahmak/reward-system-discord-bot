import { ExtendedClient } from "../Client";
import { Message } from "discord.js";

interface Run {
    (client: ExtendedClient, message: Message, args: string[]): any;
}

export interface Command {
    name: string;
    description: string;
    usage: string;
    aliases: string[];
    run: Run;
}