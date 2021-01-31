const { GDEvent } = require("../client");
const { Level } = require("../client/lib/GeometryDash");

module.exports = new GDEvent({
	name: "messageReactionRemove",
	async listener(client, reaction, user) {
		if (user.bot) return;
		if (!reaction.me) return;
		if (!reaction.message.embeds[0].title.startsWith("Search results") && !reaction.message.embeds[0].title.startsWith("Levels by")) return;	

		if (reaction.emoji.toString().charCodeAt(0) == 9664) {
			if (reaction.message.embeds[0].title.startsWith("Search results")) {
				let page = reaction.message.embeds[0].description.split(" ")[1] - 2;
				let query = reaction.message.embeds[0].title.split(": ")[1];

				reaction.message.edit((await Level.getSearchResults(query, client.gd, page)).embed);
			} else {
				let page = reaction.message.embeds[0].description.split(" ")[1] - 2;
				let query = reaction.message.embeds[0].title.split(": ")[1];

				reaction.message.edit((await Level.getLevelsByUser(query, client.gd, page)).embed);
			}
		}
		if (reaction.emoji.toString().charCodeAt(0) == 9654) {
			if (reaction.message.embeds[0].title.startsWith("Search results")) {
				let page = reaction.message.embeds[0].description.split(" ")[1];
				let query = reaction.message.embeds[0].title.split(": ")[1];

				reaction.message.edit((await Level.getSearchResults(query, client.gd, page)).embed);
			} else {
				let page = reaction.message.embeds[0].description.split(" ")[1];
				let query = reaction.message.embeds[0].title.split(": ")[1];

				reaction.message.edit((await Level.getLevelsByUser(query, client.gd, page)).embed);
			}
		}
	}
});