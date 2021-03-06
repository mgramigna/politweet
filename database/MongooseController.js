var mongoose = require('mongoose');
var Sentiment = require('./schemas/Sentiment');
var State = require('./schemas/State');
var Tweet = require('./schemas/Tweet');

mongoose.connect('mongodb://localhost/tweets');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to tweets database');
});

module.exports.saveTweet = function(tweet) {
    tweet.save(function(err, tweet) {
        if (err) return console.error(err);
        //console.log('Tweet Saved at: ' + tweet.tweet['created_at']);
    });
};

module.exports.getAllTweetsSince = function(date, callback) {
  Tweet.find({
    'date': {$gte: date}
  }).exec(function(err, tweets){
    if (err) return console.error(err);
    callback(tweets);
  });
};

module.exports.getTweetsByCandidate = function(candidate, num, callback) {
    Tweet.find({
        'candidate': candidate
    }).limit(num).select('tweet').exec(function(err, tweets) {
        if (err) return console.error(err);
        callback(tweets);
    });
};

module.exports.getTweetsByCandidateSince = function(candidate, date, callback) {
    Tweet.find({
        'candidate': candidate,
        'date': {$gte: date}
    }).select('tweet').exec(function(err, tweets) {
        if (err) return console.error(err);
        callback(tweets);
    });
};

module.exports.getTweetsByParty = function(party, num, callback) {
    Tweet.find({
        'party': party
    }).limit(num).select('candidate tweet').exec(function(err, tweets) {
        if (err) return console.error(err);
        callback(tweets);
    });
};

module.exports.getTweetsByPartySince = function(party, date, callback) {
    Tweet.find({
        'party': party,
        'date': date
    }).select('candidate tweet').exec(function(err, tweets) {
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

module.exports.saveSentiment = function(sentiment) {
    sentiment.save(function(err, sentiment){
      if (err) return console.error(err);
      console.log('Sentiment Saved');
    });
};

module.exports.getAllSentimentsSince = function(date, callback){
    Sentiment.find({date: {$gte: date}}).select('data').exec(function(err, sentiments){
      if (err) return console.error(err);
      callback(sentiments);
    });
};

module.exports.saveState = function(state) {
    state.save(function(err, state){
      if (err) return console.error(err);
      console.log('State Data saved');
    });
};

module.exports.getAllStateSentimentsSince = function(date, callback){
  State.find({date: {$gte: date}}).select('data').exec(function(err, stateSentiments){
    if (err) return console.error(err);
    callback(stateSentiments);
  });
};
