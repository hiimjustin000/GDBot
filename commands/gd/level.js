const { GDCommand } = require("../../client");
const { Level } = require("../../client/lib/GeometryDash");

module.exports = new GDCommand({
	name: "level",
	description: "Fetches a Geometry Dash level.",
	usage: "level (query)",
	examples: ["level 4284013", "level Nine Circles"],
	async execute(client, message, args) {
		if (!args[0]) return message.channel.send("Please specify a level query.");

		let waitMsg = await message.channel.send("This may take a while...");

		let results = await Level.getSearchResults(args.join(" "), client.gd);

		message.channel.send(results.embed).then(msg => {
			waitMsg.delete();
			if (msg.embeds[0].title.startsWith("Search results")) {
				msg.react("◀").then(() => msg.react("▶"));

				let collector = msg.channel.createMessageCollector(m => !isNaN(m.content.split(" ")[1]) && m.content.startsWith("select "), { time: 30000 });
			
				collector.on("collect", async m => {
					if (m.author != message.author) return;

					m.channel.send((await new Level(results.ids[m.content.split(" ")[1] - 1], client.gd).init()).getEmbed());
				});
			}
		});
	}
});