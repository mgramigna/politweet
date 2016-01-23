var fs = require('fs');
var Candidate = require('./Candidate');
var candidates;

fs.readFile('../candidates.json', function read(err, data) {
    if (err) {
        console.error(err);
    }
    candidates = JSON.parse(data);
});

module.exports.onTweet = function(callback) {
  if (candidates) {
    for (var i = 0; i < candidates.length; i++) {
      Candidate.register(candidates[i], callback);
    }
  }
}
