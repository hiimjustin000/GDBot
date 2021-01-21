class GDCommand {
	constructor(options = {}){
		this.name = options.name;
		this.description = options.description;
		this.aliases = options.aliases;
		this.usage = options.usage;
		this.examples = options.examples;
		this.requiredPerms = options.requiredPerms;
		this.execute = options.execute;
	}
}

module.exports = GDCommand;