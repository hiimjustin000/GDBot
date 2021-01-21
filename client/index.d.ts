import { Client, ClientEvents, ClientOptions, Message } from "discord.js";
import GeometryDash from "./lib/GeometryDash";

type GDClientOptions = ClientOptions & {
	token: string;
	prefix: string;
	commandFolder: string;
	eventFolder: string;
}

type GDCommandOptions = {
	name: string;
	description: string;
	aliases?: string[];
	usage: string;
	examples: string[];
	requiredPerms?: string[];
	execute(client: GDClient, message: Message, args: string[], ...otherProps: any[]): void;
}

type GDEventOptions<K extends keyof ClientEvents> = {
	name: K;
	listener(client: GDClient, ...args: ClientEvents[K]): void;
}

export class GDClient extends Client {
	constructor(options: GDClientOptions);

	public commands: {
		general: {
			[commandName: string]: GDCommand;
		}
		gd: {
			[commandName: string]: GDCommand;
		}
	}
	public options: GDClientOptions;
	public gd: GeometryDash;
	public defaultPrefix: string;
	public prefixes: {
		[guildID: string]: string;
	}
	public login(): Promise<string>;
	public randomColor(): number;

	public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

	public once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

	public emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
}


export class GDCommand {
	constructor(options: GDCommandOptions);

	public name: string;
	public description: string;
	public aliases: string[];
	public usage: string;
	public examples: string[];
	public requiredPerms: string[];
	public execute(client: GDClient, message: Message, args: string[], ...otherProps: any[]): void;
}

export class GDEvent<K extends keyof ClientEvents> {
	constructor(options: GDEventOptions<K>);
	
	public name: string;
	public listener(client: GDClient, ...args: any[]): void;
}