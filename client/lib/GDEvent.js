class GDEvent {
	constructor(options = {}){
		this.name = options.name;
		this.listener = options.listener;
	}
}

module.exports = GDEvent;