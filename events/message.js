const { GDEvent } = require("../client");
const fs = require("fs");
const path = require("path");

module.exports = new GDEvent({
	name: "message",
	listener(client, message) {
		if (message.author.bot) return;
		if (!message.guild) return message.channel.send(`${client.user.username} does not work in DMs.`);

		let prefixes = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "db", "prefixes.json")).toString());
		if (!prefixes[message.guild.id]) prefixes[message.guild.id] = client.defaultPrefix;
		client.prefixes[message.guild.id] = prefixes[message.guild.id];

		let prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${client.prefixes[message.guild.id].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\s*`);
		if (!prefixRegex.test(message.content)) return;

		let [, matchedPrefix] = message.content.match(prefixRegex);
		let args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
		let command = args.shift().toLowerCase();
		let commands = { ...client.commands.general, ...client.commands.gd }
		let commandFile = commands[command];

		if (commandFile) {
			if (commandFile.requiredPerms) {
				if (!message.member.hasPermission(commandFile.requiredPerms)) return message.channel.send(`You do not have these permissions:\n**${commandFile.requiredPerms.join("**\n**")}**`);
			}

			commandFile.execute(client, message, args);
		}
	}
});