const { GDEvent } = require("../client");
const env = require("../env");

module.exports = new GDEvent({
	name: "ready",
	async listener(client) {
		console.log(`${client.user.username} has been started. It currently has ${client.guilds.cache.size} guild${client.guilds.cache.size != 1 ? "s" : ""}.`);
		client.user.setPresence({
			activity: {
				name: env.ACTIVITY.replace(/\[guildcount\]/, client.guilds.cache.size).replace(/\[usercount\]/, client.users.cache.size).replace(/\(s\[guild\]\)/, client.guilds.cache.size == 1 ? "" : "s").replace(/\(s\[user\]\)/, client.users.cache.size == 1 ? "" : "s"),
				type: env.ACTIVITY_TYPE.toUpperCase()
			}, 
			status: env.STATUS.toLowerCase()
		});
	}
});