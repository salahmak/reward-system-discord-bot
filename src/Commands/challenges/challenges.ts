import { Message } from "discord.js";
import { Command } from "../../Interfaces";

import { ExtendedClient } from "../../Client";
import addEditChallenge from "../../utils/challenges/addEditChallenge";
import removeChallenge from "../../utils/challenges/removeChallenge";
import listChallenges from "../../utils/challenges/listChallenges";

/**
 //? Structure of the command:
 ** challenge add <challenge name> <award>
 ** challenge modiy <challenge name> <newAwards>
 ** challenge remove <challenge name>
 ** challenge list
 */

export const command: Command = {
    name: "challenges",
    description: "used by admins to: add, edit, remove and list challenges",
    usage: `\`challenges add <challengeName> <award>\`\n
            \`challenges edit <challengeName> <award>\`\n
            \`challenges remove <challengeName>\`\n
            \`challenges list\``,
    aliases: ["ch", "challenge"],

    /**
     *
     * @param client
     * @param msg
     * @param args
     * @returns
     *
     ** //?
     */
    run: async (client: ExtendedClient, msg: Message, args: string[]) => {
        console.log(args);

        //exiting the command if the less than 2 args are passed to the command
        if (args.length < 2) {
            msg.channel.send(command.usage);
            return;
        }

        //getting the requested challenge command
        const cmd: string = args[1];

        //if statements to run the command specified above
        if (cmd === "add" || cmd === "edit") {
            await addEditChallenge(client, msg, args);
        } else if (cmd == "remove") {
            await removeChallenge(client, msg, args);
        } else if (cmd === "list") {
            await listChallenges(client, msg);
        } else {
            msg.channel.send(
                `Unknown command ${cmd} try running \`${client.config.prefix} help ${command.name}\` to get info about the usage of this command`,
            );
        }
    },
};
