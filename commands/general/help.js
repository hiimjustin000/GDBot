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
		if (Object.keys(client.commands).includes(args[0])) return message.channel.send(new MessageEmbed({
			title: `GDBot help: \`${args[0]}\``,
			description: client.commands[args[0]].description,
			color: client.randomColor(),
			fields: [
				{
					name: "Alias(es)",
					value: client.commands[args[0]].aliases ? client.commands[args[0]].aliases.join(", ") : "None"
				},
				{
					name: "Usage",
					value: client.commands[args[0]].usage
				},
				{
					name: "Example(s)",
					value: `\`${client.commands[args[0]].examples ? client.commands[args[0]].examples.join("`\n`") : "None"}\``
				},
				{
					name: "Required permission(s)",
					value: `${client.commands[args[0]].requiredPerms ? `\`${client.commands[args[0]].requiredPerms.join("`\n`")}\`` : "None"}`
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