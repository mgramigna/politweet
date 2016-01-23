var mongoose = require('mongoose');

var sentimentSchema = mongoose.Schema({
	data: Object,
	date: Date
});

var Sentiment = mongoose.model("Sentiment", sentimentSchema);

module.exports = Sentiment;
