import { Message } from "discord.js";
import { Challenge } from "../../Interfaces";
import ChallengeModel from "../../models/challenge";
import { ExtendedClient } from "../../Client";


const addEditChallenge = async (client: ExtendedClient, msg: Message, args: string[]): Promise<void> => {
    //server ID
    const server: string = msg.guildId!.toString();

    //getting the requested challenge command
    const cmd: string = args[1];

    //checking if the user of the command has admin permissions, otherwise the command doesn't run
    if (!msg.member!.permissions!.has("ADMINISTRATOR")) {
        msg.channel.send(`<@${msg.author.id}> You don't have access to this command.`);
        return;
    }

    //we check if the 2nd and 3rd args were provided
    if (!Boolean(args[2] && Boolean(args[3]))) {
        msg.channel.send(
            `Please make sure to pass enough arguments to "add" subcommand\n try running \`${client.config.prefix} help challenges\` to get info about the usage of this command`,
        );

        return;
    }

    const name: string = args[2];
    const award: number = +args[3];

    if (Boolean(+name)) {
        msg.channel.send(`Name of the challenge cannot be a number`);
    }

    //checking if the 3rd arg is a number
    //would be false if the third argument isn't a correct number
    if (!Boolean(award)) {
        msg.channel.send(`Please enter a correct number`);
        return;
    }


    //checking if the entered value is a positive finite integer
    if (award <= 0 || !Number.isInteger(award) || !Number.isFinite(award)) {
        msg.channel.send(`Please enter a positive integer`);
        return;
    }

    try {
        if (cmd === "add") {
            //we create a challenge and store it in the db

            // .lean() to get a plain js object instead of a large db object
            const challengeExists: Challenge | null = await ChallengeModel.findOne({
                name,
                server,
            }).lean();

            //in case if the challenge already exists (with the same name and same server)
            if (challengeExists) {
                msg.channel.send(`challenge named ${name} already exists`);
            } else {
                //new challenge's object
                const newChallengeObj: Challenge = {
                    server,
                    name,
                    award: award,
                    solvedCount: 0,
                };

                const challenge = new ChallengeModel(newChallengeObj);

                //saving the new challenge
                await challenge.save();

                msg.channel.send(`The challenge ${name} has been added successfully!`);
            }
        } else if (cmd === "edit") {
            //we update the doc with the new points value


            const challengeExists: Challenge | null = await ChallengeModel.findOneAndUpdate(
                { name, server },
                { award: award },
            );

            console.log(challengeExists);
            if (challengeExists) {
                msg.channel.send(`Challenge has been updated`);
            } else {
                msg.channel.send(`challenge doesn't exist`);
            }
        }
    } catch (e) {
        msg.channel.send(
            `an error has occurred in addEditChallenge.ts when trying to add/edit challenge`,
        );
        console.error(e);
    }
};


export default addEditChallenge;