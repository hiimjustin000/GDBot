const { GDCommand } = require("../../client");
const { Level, ExtendedLevel } = require("../../client/lib/GeometryDash");

module.exports = new GDCommand({
	name: "levelsby",
	description: "Fetches the list of Geometry Dash levels made by a certain user.",
	usage: "levelsby (name)",
	examples: ["level 4284013", "level Nine Circles"],
	async execute(client, message, args) {
		if (!args[0]) return message.channel.send("Please specify a username or player ID.");

		let results = await Level.getLevelsByUser(args.join(" "), client.gd);

		message.channel.send(results.embed).then(msg => {
			msg.react("◀").then(() => msg.react("▶"));

			let collector = msg.channel.createMessageCollector(m => !isNaN(m.content.split(" ")[1]) && m.content.startsWith("select "), { time: 30000 });
			
			collector.on("collect", async m => {
				if (m.author != message.author) return;

				m.channel.send((await new ExtendedLevel(results.ids[m.content.split(" ")[1] - 1], client.gd).init()).getEmbed());
			});
		});
	}
});