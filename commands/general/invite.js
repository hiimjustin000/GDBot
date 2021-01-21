const { MessageEmbed } = require("discord.js");
const { GDCommand } = require("../../client");
const env = require("../../env");

module.exports = new GDCommand({
	name: "invite",
	description: "Invite the bot!",
	usage: "invite",
	execute(client, message) {
		message.channel.send(new MessageEmbed({
			title: "Invite the bot!",
			color: client.randomColor(),
			url: env.INVITE_LINK,
			timestamp: new Date(),
			footer: {
				text: env.FOOTER
			}
		}));
	}
});