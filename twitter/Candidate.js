var Twitter = require('twitter');
var fs = require('fs');

module.exports.register = function(candidate, key, callback) {
  var client = new Twitter(key);
  client.stream('statuses/filter', {track: candidate.name},  function(stream){
    stream.on('data', function(tweet) {
      callback({candidate: candidate.name, party: candidate.party, tweet: tweet});
    });
    stream.on('error', function(error) {
      console.error(error);
    });
  })
}
