var Candidate = require('./Candidate');
var candidates = ["donald trump", "hillary clinton"];

module.exports.onTweet = function(callback) {
  for (var i = 0; i < candidates.length; i++) {
    Candidate.register(candidates[i], callback);
  }
}
