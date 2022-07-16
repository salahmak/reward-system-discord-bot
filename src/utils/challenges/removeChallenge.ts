import { Message } from "discord.js";
import {Challenge} from "../../Interfaces"
import ChallengeModel from "../../models/challenge"
import { ExtendedClient } from "../../Client";

const removeChallenge = async (client: ExtendedClient, msg: Message, args: string[]): Promise<void> => {
    //server ID
    const server: string = msg.guildId!.toString();

    //checking if the user of the command has admin permissions, otherwise the command doesn't run
    if (!msg.member!.permissions!.has("ADMINISTRATOR")) {
        msg.channel.send(`<@${msg.author.id}> You don't have access to this command.`);
        return;
    }

    //checking of the <name> argument was given to the command
    if (!Boolean(args[2])) {
        msg.channel.send(
            `Please make sure to pass enough arguments to "remove" subcommand\n try running \`${client.config.prefix} help challenges\` to get info about the usage of this command`
        );

        return;
    }

    try {
        const name: string = args[2];
        //checking if the challenge exists

        const deletedChallenge: Challenge | null = await ChallengeModel.findOneAndDelete({
            name,
            server,
        });

        if (deletedChallenge) {
            msg.channel.send(`challenge ${name} has been deleted successfully`);
        } else {
            msg.channel.send(`challenge doesn't exists`);
        }
    } catch (e) {
        msg.channel.send(
            `an error has occured in removeChallenge.ts when trying to remove challenge`
        );
        console.log(e);
    }
}

export default removeChallenge;