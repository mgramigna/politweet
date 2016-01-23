var mongoose = require('mongoose');
var Tweet = require('./schemas/tweet');

mongoose.connect('mongodb://localhost/tweets');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to tweets database');
});

module.exports.saveTweet = function(tweet) {
    tweet.save(function(err, tweet) {
        if (err) return console.error(err);
        console.log('Tweet saved to db');
    });
};

module.exports.getTweetsByCandidate = function(candidate, num, callback) {
    Tweet.find({
        'candidate': candidate
    }).limit(num).exec(function(err, tweets) {
        if (err) return console.error(err);
        callback(tweets);
    });
};

module.exports.getTweetsByParty = function(party, num, callback) {
    Tweet.find({
        'party': party
    }).limit(num).exec(function(err, tweets) {
        if (err) return console.error(err);
        callback(tweets);
    });
};

module.exports.deleteTweet = function(tweetId) {
    Tweet.remove({
        'tweet.id': tweetId
    }, function(err) {
        if (err) return console.error(err);
        console.log('Tweet deleted from db');
    });
};