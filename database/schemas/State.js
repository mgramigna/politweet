var mongoose = require('mongoose');

var stateSchema = mongoose.Schema({
	data: Object,
	date: Date
});

var State = mongoose.model("State", stateSchema);

module.exports = State;
