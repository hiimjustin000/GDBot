const { GDCommand } = require("../../client");
const { Level, ExtendedLevel } = require("../../client/lib/GeometryDash");

module.exports = new GDCommand({
	name: "level",
	description: "Fetches a Geometry Dash level.",
	usage: "level (query)",
	examples: ["level 4284013", "level Nine Circles"],
	execute(client, message, args) {
		if (!args[0]) return message.channel.send("Please specify a level query.");

		let results = Level.getSearchResults(args.join(" "), client.gd);

		message.channel.send(results.embed).then(msg => {
			if (msg.embeds[0].title.startsWith("Search results")) {
				let collector = msg.channel.createMessageCollector(m => !isNaN(m.content.split(" ")[1]) && (m.content.startsWith("select ") || m.content.startsWith("page ")), { time: 30000 });
			
				collector.on("collect", async m => {
					if (m.author != msg.author) return;
					if (m.content.startsWith("select ")) return m.channel.send(new ExtendedLevel(results.ids[m.content.split(" ")[1] - 1], client.gd).getEmbed());

					msg.edit(Level.getSearchResults(results.query, client.gd, m.content.split(" ")[1]).embed);
				});
			}
		});
	}
});