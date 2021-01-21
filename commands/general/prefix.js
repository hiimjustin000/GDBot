const { GDCommand } = require("../../client");
const fs = require("fs");
const path = require("path");

module.exports = new GDCommand({
	name: "prefix",
	description: "Change the guild prefix.",
	usage: "prefix [desired prefix]",
	examples: ["prefix -"],
	requiredPerms: ["MANAGE_GUILD"],
	execute(client, message, args) {
		if (!args[0]) return message.channel.send(`The current prefix is \`${client.prefixes[message.guild.id]}\`.`);

		const prefixes = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "db", "prefixes.json")).toString());
		prefixes[message.guild.id] = args[0];

		try {
			fs.writeFileSync(path.resolve(__dirname, "..", "..", "db", "prefixes.json"), JSON.stringify(prefixes));
		} catch (error) {
			console.error(error.message);
		}

		message.channel.send(`Prefix set to \`${args[0]}\`.`);
	}
});