const { GDCommand } = require("../../client");
const { Level } = require("../../client/lib/GeometryDash");

module.exports = new GDCommand({
	name: "weekly",
	description: "Fetches the Geometry Dash weekly demon.",
	aliases: ["weeklydemon"],
	usage: "weekly",
	examples: ["weekly"],
	async execute(client, message) {
		message.channel.send(Level.getWeeklyEmbed(client.gd));
	}
});