const { GDCommand } = require("../../client");
const { Level, ExtendedLevel } = require("../../client/lib/GeometryDash");

module.exports = new GDCommand({
	name: "levelsby",
	description: "Fetches the list of Geometry Dash levels made by a certain user.",
	usage: "levelsby (name)",
	examples: ["level 4284013", "level Nine Circles"],
	execute(client, message, args) {
		if (!args[0]) return message.channel.send("Please specify a username or player ID.");

		let results = Level.getLevelsByUser(args.join(" "), client.gd);

		message.channel.send(results.embed).then(msg => {
			let collector = msg.channel.createMessageCollector(m => (!isNaN(m.content.split(" ")[1]) && (m.content.startsWith("select ") || m.content.startsWith("page ")) || m.content == "cancel"), { time: 30000 });
			
			collector.on("collect", m => {
				if (m.author != message.author) return;
				if (m.content.startsWith("select ")) return m.channel.send(new ExtendedLevel(results.ids[m.content.split(" ")[1] - 1], client.gd).getEmbed());
				if (m.content.startsWith("page ")) return msg.edit(Level.getSearchResults(results.query, client.gd, m.content.split(" ")[1] - 1).embed);
				if (m.content == "cancel") {
					collector.stop();
					m.channel.send("Cancelled.");
				}
			});
		});
	}
});