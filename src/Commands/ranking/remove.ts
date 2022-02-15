import { Client, Message } from "discord.js";
import { Command, Register, User } from "../../Interfaces";
import register from "../../utils/register";
import UserModel from "../../models/user";

import { ExtendedClient } from "../../Client/index";

export const command: Command = {
    name: "remove",
    description: "used by admins to take away points from users",
    usage: `\`remove @users <amount>\``,
    run: async (client: ExtendedClient, msg: Message, args: string[]) => {
        try {
            if (!msg.member!.permissions!.has("ADMINISTRATOR")) {
                msg.channel.send(
                    `<@${msg.author.id}> You don't have access to this command, if you have solved a challenge, please ask admins to award you, thanks.`
                );
                return;
            }

            let ids: string[] = [];
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
                msg.mentions.users.forEach(async (user) => {
                    //adding the current id to the ids array
                    ids.push(`<@!${user.id}>`);

                    //checking if the user exists already
                    const userExists = await UserModel.findOne({
                        id: user.id,
                        server,
                    });

                    //if the user exists, we update their points
                    if (userExists) {
                        if(userExists.score < points) {
                            msg.channel.send(`user <@!${user.id}> has less points than ${points}`);
                        }else{
                            await userExists.updateOne({
                                $inc: { score: -points, solved: -1 },
                            });
                        }
                    } else {
                        //if the user doesn't exist, we create it and give it the points
                        msg.channel.send(`<@!${user.id}> isn't registered`);
                    }
                });
            } else {
                msg.channel.send(
                    `error: use as shown:\n\`${client.config.prefix} remove @user <amount>\``
                );

                return;
            }

            msg.channel.send(
                `${points} point has been taken away from ${ids!.join(" and ")}`
            );
        } catch (e) {
            console.log("error has occured in remove.ts");
        }
    },
    aliases: ["rm"],
};
