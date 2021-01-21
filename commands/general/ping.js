const { MessageEmbed } = require("discord.js");
const { GDCommand } = require("../../client");
const env = require("../../env");

module.exports = new GDCommand({
	name: "ping",
	description: "Checks bot ping",
	aliases: ["latency"],
	usage: "ping",
	examples: ["ping"],
	execute(client, message) {
		message.channel.send("Pong!").then(msg => {
			msg.edit("Pong!", new MessageEmbed({
				color: client.randomColor(),
				fields: [
					{
						name: "Latency",
						value: `${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`
					},
					{
						name: "API Latency",
						value: `${Math.round(client.ws.ping)}ms`
					}
				],
				timestamp: new Date(),
				footer: {
					text: env.FOOTER
				}
			}));
		});
	}
});