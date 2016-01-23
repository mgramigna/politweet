var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
	candidate: String,
	party: String,
	tweet: Object,
	date: Date
});

var Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
