import { Message, MessageEmbed } from "discord.js";
import { Challenge } from "../../Interfaces";
import ChallengeModel from "../../models/challenge";
import { ExtendedClient } from "../../Client";

const listChallenges = async (client: ExtendedClient, msg: Message): Promise<void> => {
    //? getting the list of challenges and returning a nice embed

    try {
        // we get the array of challenges
        const challenges: Challenge[] | null = await ChallengeModel.find({}).lean();

        //empty array means no challenges were added
        if (challenges?.length === 0) {
            msg.channel.send(`no challenges to list, please add some`);
            return;
        }
        //in case if there r challenges
        else {
            const embed = new MessageEmbed()
                .setTitle("Challenges")
                .setDescription(`Available challenges`)
                .setColor("#33ffe7")
                .setThumbnail(msg.guild!.iconURL()!)
                .setFooter(msg.guild!.name);

            challenges!.forEach((ch) => {
                embed.addField(
                    `${ch.name}`,
                    `**Award**: ${ch.award}, **Solved by**: ${ch.solvedCount} user`,
                );
            });

            msg.channel.send({ embeds: [embed] });
        }
    } catch (e) {
        msg.channel.send(
            `an error has occured in listChallenges.ts when trying to list challenges`,
        );
    }
};

export default listChallenges;