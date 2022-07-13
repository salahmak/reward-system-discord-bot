import { Message } from "discord.js";
import { Command, Challenge } from "../../Interfaces";
import ChallengeModel from "../../models/challenge";

import { ExtendedClient } from "../../Client";

/**
 //? Structure of the command:
 ** challenge add <challenge name> <award>
 ** challenge modiy <challenge name> <newAwards>
 ** challenge remove <challenge name>
 ** challenge list
 */

export const command: Command = {
    name: "challenges",
    description: "managing challenges",
    usage: "test",
    aliases: ["ch"],

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

        //server ID
        const server: string = msg.guildId!.toString();

        //getting the requested challenge command
        const cmd: string = args[1];

        //if statements to run the command specified above
        //TODO make util functions to handle these
        if (cmd === "add") {
            //checking if the user of the command has admin permissions, otherwise the command doesn't run
            if (!msg.member!.permissions!.has("ADMINISTRATOR")) {
                msg.channel.send(`<@${msg.author.id}> You don't have access to this command.`);
                return;
            }

            //we check if the 2nd and 3rd args were provided
            if (!Boolean(args[2] && Boolean(args[3]))) {
                msg.channel.send(
                    `Please make sure to pass enough arguments to "add" subcommand\n try running \`${client.config.prefix} help ${command.name}\` to get info about the usage of this command`
                );

                return;
            }

            const points: number = +args[3];

            //checking if the 3rd arg is a number
            //would be false if the third argument isn't a correct number
            if (!Boolean(points)) {
                msg.channel.send(`Please enter a correct number`);
                return;
            }

            //todo do the same for award command
            //checking if the entered value is a positive finite integer
            if (points <= 0 || !Number.isInteger(points) || !Number.isFinite(points)) {
                msg.channel.send(`Please enter a positive integer`);
                return;
            }

            const name: string = args[2];

            try {
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
                        award: points,
                        solvedCount: 0,
                    };

                    const challenge = new ChallengeModel(newChallengeObj);

                    //saving the new challenge
                    await challenge.save();

                    msg.channel.send(`The challenge ${name} has been added successfully!`);
                }
            } catch (e) {
                msg.channel.send(
                    `an error has occured in ${command.name}.ts when trying to add challenge`
                );
                console.error(e);
            }
        } else if (cmd == "remove") {
            //?we remove the challenge using its name

            //checking if the user of the command has admin permissions, otherwise the command doesn't run
            if (!msg.member!.permissions!.has("ADMINISTRATOR")) {
                msg.channel.send(`<@${msg.author.id}> You don't have access to this command.`);
                return;
            }

            //checking of the <name> argument was given to the command
            if (!Boolean(args[2])) {
                msg.channel.send(
                    `Please make sure to pass enough arguments to "remove" subcommand\n try running \`${client.config.prefix} help ${command.name}\` to get info about the usage of this command`
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
                    `an error has occured in ${command.name}.ts when trying to remove challenge`
                );
                console.log(e);
            }
        } else if (cmd === "list") {
            //?getting the list of challenges and returning a nice embed

            try {
                // we get the array of challenges
                const challenges: Challenge[] | null = await ChallengeModel.find({});

                //empty array means no challenges were added
                if (challenges?.length === 0) {
                    msg.channel.send(`no challenges, please add some`);
                }
                //in case if there r challenges
                else {
                    let output: string = "Challenges:\n";
                    challenges?.forEach(({ name, award, solvedCount }: Challenge) => {
                        output += `name: ${name}, award: ${award}, solved by: ${solvedCount} participant\n`;
                    });

                    msg.channel.send(output);
                }
            } catch (e) {
                msg.channel.send(
                    `an error has occured in ${command.name}.ts when trying to list challenges`
                );
            }
        } else {
            msg.channel.send(
                `Unknown command ${cmd} try running \`${client.config.prefix} help ${command.name}\` to get info about the usage of this command`
            );
        }
    },
};
