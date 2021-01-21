const { GDCommand } = require("../../client");
const { Level } = require("../../client/lib/GeometryDash");

module.exports = new GDCommand({
	name: "daily",
	description: "Fetches the Geometry Dash daily level.",
	aliases: ["dailylevel"],
	usage: "daily",
	examples: ["daily"],
	async execute(client, message) {
		message.channel.send(await Level.getDailyEmbed(client.gd));
	}
});