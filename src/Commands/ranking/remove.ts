import { Message } from "discord.js";
import { Command, IChallenge } from "../../Interfaces";
import UserModel from "../../models/user";
import ChallengeModel from "../../models/challenge";

import { ExtendedClient } from "../../Client";

export const command: Command = {
    name: "remove",
    description: "used by admins to take away points from users.",
    usage: `\`remove @users <amount>\``,
    run: async (client: ExtendedClient, msg: Message, args: string[]) => {
        if (!msg.member!.permissions!.has("ADMINISTRATOR")) {
            msg.channel.send(`<@${msg.author.id}> You don't have access to this command.`);
            return;
        }

        //let ids: string[] = [];
        const server = msg.guildId!.toString();
        let award: number;

        //if the last arg is a number, we add points directly
        //otherwise, we assume the last arg is the name of the challenge
        //thus we search for it and find its award and grant it to the users

        let challengeExists: IChallenge | null;

        // if last arg is number
        if (Boolean(+args[args.length - 1])) {
            award = +args[args.length - 1];

            // checking if entered number is valid
            if (!(award > 0 && Number.isInteger(award) && Number.isFinite(award))) {
                msg.channel.send(`please enter a finite positive integer`);

                return;
            }
        } else {
            //we assume the last arg is the challenge's name and we query it's reward from the db

            const name = args[args.length - 1];

            challengeExists = await ChallengeModel.findOne({ name, server });

            if (challengeExists) {
                award = challengeExists.award;
            } else {
                msg.channel.send("challlenge doesn't exist");
                return;
            }
        }

        if (msg.mentions.users.size > 0) {
            let ids: (string | undefined)[] = await Promise.all(
                msg.mentions.users.map(async (user) => {
                    try {
                        //checking if the user exists already
                        const userExists = await UserModel.findOne({
                            id: user.id,
                            server,
                        });

                        //if the user exists, we update their points
                        if (userExists) {
                            if (userExists.score < award) {
                                msg.channel.send(
                                    `user <@!${user.id}> has less points than ${award}`,
                                );
                            } else {
                                if (challengeExists) {
                                    // checking if user has solved the challenge or not
                                    if (userExists.solved.includes(challengeExists.name)) {
                                        // if so, we remove the challenge from the array and remove points
                                        await userExists.updateOne({
                                            $pull: { solved: challengeExists.name },
                                            $inc: { score: -award },
                                        });
                                    } else {
                                        msg.channel.send(`<@${user.id}> hasn't solved the challenge before`);
                                        return;
                                    }
                                } else {
                                    // in case if we are removing points using numbers
                                    await userExists!.updateOne({
                                        $inc: { score: -award },
                                    });
                                }
                            }
                            return `<@!${user.id}>`;
                        } else {
                            //if the user doesn't exist, we exit
                            msg.channel.send(`user <@!${user.id}> doesn't exist`);
                            return;
                        }
                    } catch (e) {
                        msg.channel.send(`error has occured in remove.ts`);
                        console.log(e);
                    }
                }),
            );

            // if (ids!.includes(undefined)) {
            //     msg.channel.send(
            //         "WARNING: perhaps someone's points wheren't removed correctly, check again"
            //     );
            // }

            //removing falsy values from the ids array
            ids = ids.filter(Boolean);

            if (ids.length !== 0) {
                msg.channel.send(`${award} point has been taken away from ${ids!.join(" and ")}`);
            }
        } else {
            msg.channel.send(
                `error: use as shown:\n\`${client.config.prefix} remove @user <amount>\``,
            );

            return;
        }
    },
    aliases: ["rm"],
};
