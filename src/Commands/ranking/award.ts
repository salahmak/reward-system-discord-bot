import { Message } from "discord.js";
import { Command } from "../../Interfaces";
import register from "../../utils/register";
import UserModel from "../../models/user";

import { ExtendedClient } from "../../Client/index";
export const command: Command = {
    name: "award",
    description:
        "used by admins to give points to users when they solve a challenge",
    usage: `\`award @users <amount>\``,
    run: async (client: ExtendedClient, msg: Message, args: string[]) => {
        if (!msg.member!.permissions!.has("ADMINISTRATOR")) {
            msg.channel.send(
                `<@${msg.author.id}> You don't have access to this command, if you have solved a challenge, please ask admins to award you, thanks.`
            );
            return;
        }

        //let ids: string[] = [];
        const server = msg.guildId!.toString();
        const points = +args[args.length - 1];

        if (!Boolean(points)) {
            msg.channel.send("please enter a correct number");
            return;
        }

        //handling case when the given points are negative
        if (points <= 0) {
            msg.channel.send(
                `Please enter a positive integer (if you want to subtract points, use \`${client.config.prefix} remove\` instead`
            );
            return;
        }

        if (msg.mentions.users.size > 0) {
            let ids = await Promise.all(
                msg.mentions.users.map(async (user) => {
                    try {
                        //checking if the user exists already
                        const userExists = await UserModel.findOne({
                            id: user.id,
                            server,
                        });

                        //if the user exists, we update their points
                        if (userExists) {
                            await userExists!.updateOne({
                                $inc: { score: points, solved: 1 },
                            });
                        } else {
                            //if the user doesn't exist, we create it and give it the points
                            const newUser = await register(user.id, server);
                            if (newUser.success) {
                                await UserModel.findOneAndUpdate(newUser.user, {
                                    $inc: { score: points, solved: 1 },
                                });
                            }
                        }
                        return `<@!${user.id}>`;
                    } catch (e) {
                        msg.channel.send(`error has occured in award.ts`);
                        console.log("error has occured in award.ts");
                    }
                })
            );

            if (ids!.includes(undefined)) {
                msg.channel.send(
                    "WARNING: perhaps someone wasn't awarded correctly, check again"
                );
            }

            //removing falsy values from the ids array
            ids = ids.filter(Boolean);

            if (ids.length !== 0) {
                msg.channel.send(
                    `${ids!.join(" and ")} ${
                        ids!.length == 1 ? "has" : "have"
                    } been awarded ${points} point`
                );
            }
        } else {
            msg.channel.send(
                `error: use as shown:\n\`${client.config.prefix} award @user <amount>\``
            );

            return;
        }
    },
    aliases: ["reward"],
};
