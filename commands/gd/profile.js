const { GDCommand } = require("../../client");
const { User } = require("../../client/lib/GeometryDash");

module.exports = new GDCommand({
	name: "profile",
	description: "Fetches a Geometry Dash profile.",
	aliases: ["user"],
	usage: "profile (id/name)",
	examples: ["profile RobTop", "profile 16"],
	async execute(client, message, args) {
		if (!args[0]) return message.channel.send("Please specify an ID or username.");

		let user = new User(args[0], client.gd);
		await user.init();

		message.channel.send(user.getEmbed());
	}
});