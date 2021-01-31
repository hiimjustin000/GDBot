const { MessageEmbed } = require("discord.js");
const { GDCommand } = require("../../client");
const env = require("../../env");

module.exports = new GDCommand({
	name: "help",
	description: "Shows info about each command.",
	aliases: ["commands", "cmds"],
	usage: "help [command]",
	examples: ["help", "help ping"],
	execute(client, message, args) {
		let commands = { ...client.commands.general, ...client.commands.gd };

		if (Object.keys(commands).includes(args[0])) return message.channel.send(new MessageEmbed({
			title: `GDBot help: \`${args[0]}\``,
			description: commands[args[0]].description,
			color: client.randomColor(),
			fields: [
				{
					name: "Alias(es)",
					value: commands[args[0]].aliases ? commands[args[0]].aliases.join(", ") : "None"
				},
				{
					name: "Usage",
					value: commands[args[0]].usage
				},
				{
					name: "Example(s)",
					value: `\`${commands[args[0]].examples ? commands[args[0]].examples.join("`\n`") : "None"}\``
				},
				{
					name: "Required permission(s)",
					value: `${commands[args[0]].requiredPerms ? `\`${commands[args[0]].requiredPerms.join("`\n`")}\`` : "None"}`
				}
			],
			timestamp: new Date(),
			footer: {
				text: env.FOOTER
			}
		}));
		
		message.channel.send(new MessageEmbed({
			title: "GDBot help",
			description: `Use \`${client.prefixes[message.guild.id]}help [command]\` for specific command help`,
			color: client.randomColor(),
			fields: [
				{
					name: "General:",
					value: Object.keys(client.commands.general).join(", ")
				},
				{
					name: "Geometry Dash:",
					value: Object.keys(client.commands.gd).join(", ")
				}
			],
			timestamp: new Date(),
			footer: {
				text: env.FOOTER
			}
		}));
	}
});