import { Message } from "discord.js";
import { Command, IUser, IChallenge } from "../../Interfaces";
import register from "../../utils/register";
import UserModel from "../../models/user";
import ChallengeModel from "../../models/challenge";

import { ExtendedClient } from "../../Client/index";
export const command: Command = {
    name: "award",
    description: "used by admins to give points to users when they solve a challenge",
    usage: `\`award @users <amount>\``,
    run: async (client: ExtendedClient, msg: Message, args: string[]) => {
        if (!msg.member!.permissions!.has("ADMINISTRATOR")) {
            msg.channel.send(
                `<@${msg.author.id}> You don't have access to this command, if you have solved a challenge, please ask admins to award you, thanks.`
            );
            return;
        }

        //let ids: string[] = [];
        const server: string = msg.guildId!.toString();
        let award: number;

        //if the last arg is a number, we add points directly
        //otherwise, we assume the last arg is the name of the challenge
        //thus we search for it and find its award and grant it to the users

        let challengeExists: IChallenge | null;

        //checking if last arg is a number
        if (Boolean(+args[args.length - 1])) {
            award = +args[args.length - 1];

            // checking if entered number is valid
            if (!(award > 0 && Number.isInteger(award) && Number.isFinite(award))) {
                msg.channel.send(`please enter a finite positive integer`);

                return;
            }

        } else {
            //we assume the last arg is the challenge's name and we query it's reward from the db

            const name = args[args.length - 1]; //to make it readable

            challengeExists = await ChallengeModel.findOne({
                name,
                server,
            });

            if (challengeExists) {
                award = challengeExists.award;
            } else {
                msg.channel.send(`challenge doesn't exist`);
                return;
            }
        }

        if (msg.mentions.users.size > 0) {
            let ids: (string | undefined)[] = await Promise.all(
                msg.mentions.users.map(async (user) => {
                    try {
                        //checking if the user exists already
                        const userExists: IUser | null = await UserModel.findOne({
                            id: user.id,
                            server,
                        });

                        //if the user exists, we update their points
                        if (userExists) {
                            if (challengeExists) {
                                //we add the challenge's name to the solved[] array and increment score with points

                                //checking if the user had solved the challenge before
                                if (userExists.solved.includes(challengeExists.name)) {
                                    msg.channel.send(
                                        `User <@${user.id}> had already solved the challenge before`
                                    );
                                    return;
                                } else {
                                    // we update the user
                                    await userExists!.updateOne({
                                        $inc: { score: award },
                                        $addToSet: { solved: challengeExists.name },
                                    });

                                    // we update the challenge as well
                                    await challengeExists!.updateOne({ $inc: { solvedCount: 1 } });
                                }

                                // we increment the solvedCount of the challenge by 1
                                challengeExists.updateOne({ $inc: { solvedCount: 1 } });
                            } else {
                                //we only increment score and leave solved array as it is
                                await userExists!.updateOne({
                                    $inc: { score: award },
                                });
                            }
                            return `<@!${user.id}>`;
                        } else {
                            //if the user doesn't exist, we create it and give it the points

                            // a new user means that they surely haven't done the challenge before, so we don't need to do the check we did before
                            const newUser = await register(user.id, server);
                            if (newUser.success) {
                                if (challengeExists) {
                                    //in case if the challenge's name was used in the command'
                                    await UserModel.findOneAndUpdate(newUser.user, {
                                        $inc: { score: award },
                                        $addToSet: { solved: challengeExists.name },
                                    });

                                    // we update the challenge as well
                                    await challengeExists!.updateOne({ $inc: { solvedCount: 1 } });
                                } else {
                                    // we only increment score
                                    await UserModel.findOneAndUpdate(newUser.user, {
                                        $inc: { score: award },
                                    });
                                }
                                return `<@!${user.id}>`;
                            }
                        }
                    } catch (e) {
                        msg.channel.send(`error has occured in award.ts`);
                        console.log(e);
                    }
                })
            );

            // if (ids!.includes(undefined)) {
            //     msg.channel.send("WARNING: perhaps someone wasn't awarded correctly, check again");
            // }

            //removing falsy values from the ids array
            ids = ids.filter(Boolean);

            if (ids.length !== 0) {
                msg.channel.send(
                    `${ids!.join(" and ")} ${
                        ids!.length == 1 ? "has" : "have"
                    } been awarded ${award} point`
                );
            }
        } else {
            msg.channel.send(`error: tag atleast 1 user to award them\``);

            return;
        }
    },
    aliases: ["reward"],
};
