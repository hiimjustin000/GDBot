const { GDClient } = require("./client");
const path = require("path");
const env = require("./env");

const client = new GDClient({
	prefix: env.PREFIX,
	token: env.TOKEN,
	commandFolder: path.resolve(__dirname, "commands"),
	eventFolder: path.resolve(__dirname, "events")
});

client.login();