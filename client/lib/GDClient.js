const { Client } = require("discord.js");
const fs = require("fs");
const path = require("path");
const env = require("../../env");

class GDClient extends Client {
	constructor(options = {}) {
		super(options);

		this.commands = {
			general: {},
			gd: {}
		}
		this.token = options.token;
		this.prefixes = {};
		this.gd = new (require("./GeometryDash"))(env.HOST);

		if (typeof options.prefix == "undefined") options.prefix = "gd/";
		this.defaultPrefix = options.prefix;
		if (typeof options.commandFolder == "undefined") options.commandFolder = "";
		if (options.commandFolder != "") {
			for (const folder of fs.readdirSync(options.commandFolder)) {
				for (const file of fs.readdirSync(path.resolve(options.commandFolder, folder))) {
					let command = require(path.resolve(options.commandFolder, folder, file));

					if (folder == "general") this.commands.general[command.name] = command;
					else this.commands.gd[command.name] = command;
				}
			}
		}
		if (typeof options.eventFolder == "undefined") options.eventFolder = "";
		if (options.eventFolder != "") {
			for (const file of fs.readdirSync(options.eventFolder)) {
				let event = require(path.resolve(options.eventFolder, file));
				this.on(event.name, event.listener.bind(null, this));
			}
		}
	}

	login() {
		super.login(this.token);
	}

	randomColor() {
		return Math.floor(Math.random() * (0xFFFFFF + 1));
	}
}

module.exports = GDClient;