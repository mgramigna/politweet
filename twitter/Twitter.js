var Candidate = require('./Candidate');
var candidates = ["donald trump", "hillary clinton"];

var registerAll = function(callback) {
  for (var i = 0; i < candidates.length; i++) {
    Candidate.register(candidates[i], callback);
  }
}

modules.exports = registerAll;
