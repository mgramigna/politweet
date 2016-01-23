var Twitter = require('twitter');
var fs = require('fs');

// var client = new Twitter({
//   consumer_key: '9k6yfIRzCCntZetQaMcJFauxm',
//   consumer_secret: 'ENzHsOLDUDZ05yHI0TMEZSCauXAzlFC1SUAeiBQ1baWf4vhDny',
//   access_token_key: '1411207356-cPgpbrDMbVGueVxXX5EHjka8B1bSs9olGN6Os6i',
//   access_token_secret: 'ATf5OfeVAWwgixJ2Z7nZjjtNXtkhTxAqXrdqps6AejJhX'
// });

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
