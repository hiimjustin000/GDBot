import { MessageEmbed } from "discord.js";

class GeometryDash {
	public constructor(endpoint: string);
	public endpoint: string;
	public async getData(file: string, params: any): Promise<string>;
	public parse(data: string, splitter?: string): any;
	public xorDecrypt(text: string, key: 26364): string;
	public static Level: typeof Level;
	public static User: typeof User;
}

type Results = {
	embed: MessageEmbed;
	page: number;
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
	public constructor(id: string, gd: GeometryDash): Promise<Level>;
	public id: string;
	public gd: GeometryDash;
	public name: string;
	public creatorName: string;
	public password: string;
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
	public uploaded: string;
	public updated: string;
	public original?: string;
	public difficultyFace: string;
	public async init(): Promise<Level>;
	public getEmbed(): MessageEmbed;
	public static async getDailyEmbed(gd: GeometryDash): Promise<MessageEmbed>
	public static async getWeeklyEmbed(gd: GeometryDash): Promise<MessageEmbed>
	public static async getSearchResults(query: string, gd: GeometryDash, page: number): Promise<Results>;
	public static async getLevelsByUser(query: string, gd: GeometryDash, page: number): Promise<Results>;
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
	public async init(): Promise<User>;
	public getEmbed(): MessageEmbed;
}

export = GeometryDash;