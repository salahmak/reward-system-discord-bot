import { Message } from "discord.js";
import { Command } from "../../Interfaces";
import UserModel from "../../models/user";

import { ExtendedClient } from "../../Client/index";

export const command: Command = {
    name: "remove",
    description: "used by admins to take away points from users.",
    usage: `\`remove @users <amount>\``,
    run: async (client: ExtendedClient, msg: Message, args: string[]) => {
        if (!msg.member!.permissions!.has("ADMINISTRATOR")) {
            msg.channel.send(
                `<@${msg.author.id}> You don't have access to this command.`
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
                `Please enter a positive integer (if you want to award points, use \`${client.config.prefix} award\` instead`
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
                            if (userExists.score < points) {
                                msg.channel.send(
                                    `user <@!${user.id}> has less points than ${points}`
                                );
                            } else {
                                await userExists!.updateOne({
                                    $inc: { score: -points, solved: -1 },
                                });
                            }
                        } else {
                            //if the user doesn't exist, we exit
                            msg.channel.send(
                                `user <@!${user.id}> doesn't exist`
                            );
                            return null;
                        }
                        return `<@!${user.id}>`;
                    } catch (e) {
                        msg.channel.send(`error has occured in remove.ts`);
                        console.log("error has occured in remove.ts");
                    }
                })
            );

            if (ids!.includes(undefined)) {
                msg.channel.send(
                    "WARNING: perhaps someone's points wheren't removed correctly, check again"
                );
            }

            //removing falsy values from the ids array
            ids = ids.filter(Boolean)

            if (ids.length !== 0) {
                msg.channel.send(
                    `${points} point has been taken away from ${ids!.join(
                        " and "
                    )}`
                );
            }
        } else {
            msg.channel.send(
                `error: use as shown:\n\`${client.config.prefix} remove @user <amount>\``
            );

            return;
        }
    },
    aliases: ["rm"],
};
