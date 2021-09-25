import { Client, Collection, Intents } from "discord.js";
import mongoose from "mongoose";
import path from "path";
import { readdirSync } from "fs";
import { Command, Event } from "../Interfaces/index";

class ExtendedClient extends Client {
	public commands: Collection<string, Command> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public aliases: Collection<string, Command> = new Collection();

	public config = {
		token: process.env.TOKEN || "",

		mongoUrl:
			process.env.NODE_ENV === "production"
				? process.env.MONGO_URL_PROD || ""
				: process.env.MONGO_URL_DEV || "",

		prefix: process.env.PREFIX || "",
	};

	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MEMBERS,
			],
		});
	}

	public async init() {
		this.login(this.config.token as string);
		mongoose.connect(this.config.mongoUrl);

		const commandPath = path.join(__dirname, "..", "Commands");
		readdirSync(commandPath).forEach(async (dir) => {
			const commands = readdirSync(`${commandPath}/${dir}`);

			for (const file of commands) {
				const { command } = await import(`${commandPath}/${dir}/${file}`);
				this.commands.set(command.name, command);

				if (command.aliases.length !== 0) {
					command.aliases.forEach((alias: string) => {
						this.aliases.set(alias, command);
					});
				}
			}
		});

		const eventPath = path.join(__dirname, "..", "Events");
		readdirSync(eventPath).forEach(async (file) => {
			const { event } = await import(`${eventPath}/${file}`);
			this.events.set(event.name, event);

			this.on(event.name, event.run.bind(null, this));

			console.log(event);
		});
	}
}

export { ExtendedClient };