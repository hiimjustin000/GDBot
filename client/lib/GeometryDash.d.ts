import { MessageEmbed } from "discord.js";

class GeometryDash {
	public constructor(endpoint: string);
	public endpoint: string;
	public getData(file: string, params: any): string;
	public parse(data: string, splitter?: string): any;
	public levelPassword(password: string): string;
	public static Level: typeof Level;
	public static ExtendedLevel: typeof ExtendedLevel;
	public static User: typeof User;
}

type LevelResults = {
	embed: MessageEmbed;
	query: string;
	ids: string[];
}

type UserResults = {
	embed: MessageEmbed;
	ids: string[];
}

type Song = {
	id?: string;
	name: string;
	author: string;
	size?: string;
}

type Social = {
	username: string;
	url: string;
}

class Level {
	public constructor(id: string, gd: GeometryDash);
	public id: string;
	public gd: GeometryDash;
	public name: string;
	public creatorName: string;
	public coins: string;
	public song: string;
	public songObj: Song;
	public objects: string;
	public downloads: string;
	public likes: string;
	public length: string;
	public starRate: string;
	public version: string;
	public gameVersion: string;
	public original?: string;
	public difficultyFace: string;
	public static getDailyEmbed(gd: GeometryDash): MessageEmbed
	public static getWeeklyEmbed(gd: GeometryDash): MessageEmbed
	public static getSearchResults(query: string, gd: GeometryDash, page: number): LevelResults;
	public static getLevelsByUser(query: string, gd: GeometryDash, page: number): UserResults;
}

class ExtendedLevel extends Level {
	public constructor(id: string, gd: GeometryDash);
	public password: string;
	public uploaded: string;
	public updated: string;
	public getEmbed(): MessageEmbed;
}

class User {
	constructor(query: string, gd: GeometryDash);
	public username: string;
	public moderator: string;
	public stars: string;
	public diamonds: string;
	public secretCoins: string;
	public userCoins: string;
	public demons: string;
	public cp: string;
	public id: string;
	public accountID: string;
	public rank: string;
	public youtube: string;
	public twitter: Social;
	public twitch: Social;
	public messages: string;
	public friendRequests: string;
	public commentHistory: string;
	public getEmbed(): MessageEmbed;
}

export = GeometryDash;