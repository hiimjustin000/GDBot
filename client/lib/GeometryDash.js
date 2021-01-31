const { MessageEmbed } = require("discord.js");
const { default: fetch } = require("node-fetch");
const difficulties = require("../../db/difficulties.json");
const songs = require("../../db/songs.json");
const env = require("../../env");

const length = [
	"Tiny",
	"Short",
	"Medium",
	"Long",
	"XL"
]
const difficulty = {
	0: "na",
	10: "easy",
	20: "normal",
	30: "hard",
	40: "harder",
	50: "insane"
}

const moderator = [
	"User",
	"Moderator",
	"Elder Moderator"
]

const profileSettings = {
	messages: [
		"Open",
		"Open to friends only",
		"Closed"
	],
	friendRequests: [
		"Open",
		"Closed"
	],
	commentHistory: [
		"Open",
		"Open to friends only",
		"Closed"
	]
}

class Level {
	constructor(id, gd) {
		this.id = id;
		this.gd = gd;
	}

	async init() {
		let levelData = await this.gd.getData("getGJLevels21", {
			str: this.id,
			type: 0
		});

		let level = this.gd.parse(levelData.split("#")[0]);
		let author = levelData.split("#")[1].split(":");
		let song = `~${levelData.split("#")[2]}`;
		song = this.gd.parse(song, "~|~");

		this.name = level[2];
		this.creatorName = author[1] || "-";
		this.description = Buffer.from(level[3], "base64").toString() || "None";
		this.coins = level[37];
		this.coins = `${this.coins}, ${level[38] > 0 ? "Silver" : "Bronze"}`;
		if (this.coins.startsWith("0")) this.coins = "0";
		this.song = level[35] != "0" ? song : songs[level[12]];
		this.song = level[35] != "0" ? `[${this.song[1] || level[35]} - ${this.song[2]} by ${this.song[4]}](https://www.newgrounds.com/audio/listen/${this.song[1] || level[35]}) | Size: ${this.song[5]} MB` : `${this.song[0]} by ${this.song[1]}`;
		this.songObj = level[35] != "0" ? {
			id: song[1] || level[35],
			name: song[2],
			author: song[4],
			size: `${song[5]} MB`
		} : {
			name: songs[level[12]][0],
			author: songs[level[12]][1]
		}
		this.objects = "Unknown";
		this.objects = level[45] != "0" ? level[45] : "Unknown";
		this.objects = this.objects == "65535" ? ">65535" : this.objects;
		this.downloads = level[10];
		this.likes = level[14];
		this.length = length[level[15]];
		this.starRate = level[18] > 0 ? "Yes" : "No";
		this.version = level[5];
		this.gameVersion = level[13] > 17 ? (level[13] / 10).toFixed(1) : level[13] == 11 ? "1.8" : level[13] == 10 ? "1.7" : "<1.7";
		if (level[30] != "0") this.original = level[30];
		this.difficultyFace = this._getDifficultyFace(level);

		return this;
	}

	static async getDailyEmbed(gd) {
		let id = gd.parse(await gd.getData("downloadGJLevel22", {
			levelID: -1
		}))[1];

		return (await new ExtendedLevel(id, gd).init()).getEmbed();
	}

	static async getWeeklyEmbed(gd) {
		let id = gd.parse(await gd.getData("downloadGJLevel22", {
			levelID: -2
		}))[1];

		return (await new ExtendedLevel(id, gd).init()).getEmbed();
	}

	static async getSearchResults(query, gd, page = 0) {
		if (typeof page == "string") page = parseInt(page);

		let embed = new MessageEmbed({
			title: `Search results: ${query}`,
			description: `Page ${page + 1}`,
			color: Math.floor(Math.random() * (0xFFFFFF + 1)),
			timestamp: new Date(),
			footer: {
				text: env.FOOTER
			}
		});

		let results = await gd.getData("getGJLevels21", {
			str: query,
			type: 0,
			page
		});
		if (!results || results == "-1") return {
			embed: embed.addField("No results found", "No results found"),
			page
		}
		results = results.split("#")[0].split("|", 10);

		if (results.length == 1) return {
			embed: (await new ExtendedLevel(gd.parse(results[0])[1], gd).init()).getEmbed(),
		}
		
		let ids = [];
		
		for (let i = 0; i < 10; i++) {
			if (typeof results[i] != "undefined") {
				let level = new Level(gd.parse(results[i])[1], gd);
				await level.init();
				embed.addField(`${level.name} by ${level.creatorName} (${level.id})`, `Downloads: ${level.downloads}\nLikes: ${level.likes}\nLength: ${level.length}\nSong: ${level.songObj.name} by ${level.songObj.author}`);

				ids.push(level.id);
			}
		}

		embed.addField(`Page ${page + 1}`, "Use `select (number)` to select level");

		return {
			embed,
			page,
			ids
		}
	}

	static async getLevelsByUser(query, gd, page = 0) {
		let user = new User(query, gd);
		await user.init();

		let embed = new MessageEmbed({
			title: `Levels by: ${user.username}`,
			description: `Page ${page + 1}`,
			color: Math.floor(Math.random() * (0xFFFFFF + 1)),
			timestamp: new Date(),
			footer: {
				text: env.FOOTER
			}
		});

		let results = await gd.getData("getGJLevels21", {
			str: user.id,
			type: 5,
			page
		});
		if (!results || results == "-1") return {
			embed: embed.addField("No results found", "No results found"),
			page
		}
		results = results.split("#")[0].split("|");

		let ids = [];
		
		for (let i = 0; i < results.length; i++) {
			let level = new Level(gd.parse(results[i])[1], gd);
			await level.init();
			embed.addField(`${level.name} (${level.id})`, `Downloads: ${level.downloads}\nLikes: ${level.likes}\nLength: ${level.length}\nSong: ${level.songObj.name} by ${level.songObj.author}`);

			ids.push(level.id);
		}

		embed.addField(`Page ${page + 1}`, "Use `select (number)` to select level");

		return {
			embed,
			page,
			ids
		}
	}

	_getDifficultyFace(levelData) {
		let levelDifficulty = difficulty[levelData[9]];
		
		if (levelData[17] > 0) levelDifficulty = `${levelDifficulty} demon`;
		else if (levelData[25] > 0) levelDifficulty = "auto";

		if (levelDifficulty == "insane demon") levelDifficulty = "extreme demon";
		if (levelDifficulty == "harder demon") levelDifficulty = "insane demon";
		if (levelDifficulty == "normal demon") levelDifficulty = "medium demon";

		let levelAward = "default";
		if (levelData[19] > 0) levelAward = "feature";
		if (levelData[42] > 0) levelAward = "epic";

		let diff = levelDifficulty;
		diff = diff.toLowerCase();

		if (diff.includes(" ")) {
			let diffArray = diff.split(" ");
			diff = difficulties[levelAward][diffArray[1]][diffArray[0]];
		} else diff = difficulties[levelAward][diff];

		return diff;
	}
}

class ExtendedLevel extends Level {
	constructor(id, gd) {
		super(id, gd);
	}

	async init() {
		await super.init();

		let fullData = this.gd.parse(await this.gd.getData("downloadGJLevel22", {
			levelID: this.id
		}));

		this.password = "No copy";
		this.password = fullData[27] == "Aw==" ? "Free copy" : this.gd.xorDecrypt(fullData[27], 26364).slice(1);
		this.password = fullData[27] == "0" ? "No copy" : this.password;
		this.uploaded = `${fullData[28]} ago`;
		this.updated = `${fullData[29]} ago`;

		return this;
	}

	getEmbed() {
		let embed = new MessageEmbed({
			title: `${this.name} by ${this.creatorName} (${this.id})`,
			description: this.description,
			thumbnail: {
				url: this.difficultyFace
			},
			color: Math.floor(Math.random() * (0xFFFFFF + 1)),
			fields: [
				{
					name: "Stats",
					value: `Downloads: ${this.downloads}\nLikes: ${this.likes}\nLength: ${this.length}`
				},
				{
					name: "Song",
					value: this.song
				},
				{
					name: "Star rate",
					value: this.starRate
				},
				{
					name: "Coins",
					value: this.coins
				},
				{
					name: "Level version",
					value: this.version
				},
				{
					name: "Game version",
					value: this.gameVersion
				},
				{
					name: "Objects",
					value: this.objects
				},
				{
					name: "Password",
					value: !isNaN(this.password) ? `||${this.password}||` : this.password
				},
				{
					name: "Uploaded",
					value: this.uploaded,
				},
				{
					name: "Updated",
					value: this.updated,
				}
			],
			timestamp: new Date(),
			footer: {
				text: env.FOOTER
			}
		});

		if (this.original) embed.addField("Original", this.original);
		if (this.objects > 40000) embed.addField("Over 40k objects", "May lag on low-end devices");

		return embed;
	}
}

class User {
	constructor(query, gd) {
		this.query = query;
		this.gd = gd;
	}

	async init() {
		let userData = this.gd.parse(await this.gd.getData("getGJUsers20", {
			str: this.query
		}));
		userData = this.gd.parse(await this.gd.getData("getGJUserInfo20", {
			targetAccountID: userData[16]
		}));

		this.username = userData[1];
		this.moderator = moderator[userData[49]];
		this.stars = userData[3];
		this.diamonds = userData[46];
		this.secretCoins = userData[13];
		this.userCoins = userData[17];
		this.demons = userData[4];
		this.cp = userData[8];
		this.id = userData[2];
		this.accountID = userData[16];
		this.rank = userData[30];
		this.youtube = userData[20] ? `https://www.youtube.com/channel/${userData[20]}` : "None";
		this.twitter = {
			username: userData[44],
			url: `https://twitter.com/${userData[44]}`
		}
		this.twitch = {
			username: userData[45],
			url: `https://twitter.com/${userData[45]}`
		}
		this.messages = profileSettings.messages[userData[18]];
		this.friendRequests = profileSettings.friendRequests[userData[19]];
		this.commentHistory = profileSettings.commentHistory[userData[50]];

		return this;
	}

	getEmbed() {
		return new MessageEmbed({
			title: `${this.username} (${this.id})`,
			description: this.moderator,
			color: Math.floor(Math.random() * (0xFFFFFF + 1)),
			fields: [
				{
					name: "Stats",
					value: `Stars: ${this.stars}\nDiamonds: ${this.diamonds}\nSecret Coins: ${this.secretCoins}\nUser Coins: ${this.userCoins}\nDemons: ${this.demons}\nCreator Points: ${this.cp}`
				},
				{
					name: "Account ID",
					value: this.accountID
				},
				{
					name: "Global Rank",
					value: this.rank != "0" ? this.rank : "Unknown"
				},
				{
					name: "Socials",
					value: `YouTube: ${this.youtube != "None" ? `[Open link](${this.youtube})` : "None"}\nTwitter: ${this.twitter.username ? `[@${this.twitter.username}](${this.twitter.url})` : "None"}\nTwitch: ${this.twitch.username ? `[${this.twitch.username}](${this.twitch.url})` : "None"}`
				},
				{
					name: "Settings",
					value: `Messages: ${this.messages}\nFriend Requests: ${this.friendRequests}\nComment History: ${this.commentHistory}`
				}
			],
			footer: {
				text: env.FOOTER
			}
		});
	}
}

class GeometryDash {
	constructor(endpoint) {
		this.endpoint = endpoint;
	}
	
	static Level = Level;
	static ExtendedLevel = ExtendedLevel;
	static User = User;

	async getData(file, params) {
		let response = await fetch(`http://${this.endpoint}/${file}.php`, {
			method: "POST",
			body: new URLSearchParams({ ...params, secret: "Wmfd2893gb7", gameVersion: "21", binaryVersion: "35" })
		}).then(res => res.text());

		return response;
	}

	parse(data, splitter = ":") {
		if (!data || data == "-1") return {};
		
		let response = data.split("#")[0].split(splitter);
		let res = {};
		
		for (let i = 0; i < response.length; i += 2) {
			res[response[i]] = response[i + 1];
		}

		return res;
	}

	xorDecrypt(text, key) {
		function xor(t, k) {
			return String.fromCodePoint(...t.split("").map((char, index) => char.charCodeAt(0) ^ k.toString().charCodeAt(index % k.toString().length)));
		}

		return xor(Buffer.from(text.replace(/\//g, "_").replace(/\+/g, "-"), "base64").toString(), key);
	}
}

module.exports = GeometryDash;