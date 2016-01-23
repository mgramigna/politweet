var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
	canditate: String,
	tweet: Object
});

var Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;