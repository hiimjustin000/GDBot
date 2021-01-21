const { GDEvent } = require("../client");
const { Level } = require("../client/lib/GeometryDash");

module.exports = new GDEvent({
	name: "messageReactionRemove",
	async listener(client, reaction, user) {
		if (user.bot) return;
		if (reaction.message.author.id != client.user.id) return;
		if (!reaction.message.embeds[0].title.startsWith("Search results") || !reaction.message.embeds[0].title.startsWith("Levels by")) return;

		if (reaction.emoji.toString() == "◀") {
			if (reaction.message.embeds[0].title.startsWith("Search results")) {
				let page = +(reaction.message.embeds[0].description.split(" ")[1]) - 2;
				let query = reaction.message.embeds[0].title.split(": ").slice(1).join(" ");

				let waitMsg = await reaction.message.channel.send("Please wait...");
				reaction.message.edit((await Level.getSearchResults(query, client.gd, page)).embed).then(() => waitMsg.delete());
			} else {
				let page = +(reaction.message.embeds[0].description.split(" ")[1]) - 2;
				let query = reaction.message.embeds[0].title.split(": ").slice(1).join(" ");

				let waitMsg = await reaction.message.channel.send("Please wait...");
				reaction.message.edit((await Level.getLevelsByUser(query, client.gd, page)).embed).then(() => waitMsg.delete());
			}
		}
		if (reaction.emoji.toString() == "▶") {
			if (reaction.message.embeds[0].title.startsWith("Search results")) {
				let page = +(reaction.message.embeds[0].description.split(" ")[1]);
				let query = reaction.message.embeds[0].title.split(": ").slice(1).join(" ");

				let waitMsg = await reaction.message.channel.send("Please wait...");
				reaction.message.edit((await Level.getSearchResults(query, client.gd, page)).embed).then(() => waitMsg.delete());
			} else {
				let page = +(reaction.message.embeds[0].description.split(" ")[1]);
				let query = reaction.message.embeds[0].title.split(": ").slice(1).join(" ");

				let waitMsg = await reaction.message.channel.send("Please wait...");
				reaction.message.edit((await Level.getLevelsByUser(query, client.gd, page)).embed).then(() => waitMsg.delete());
			}
		}
	}
});