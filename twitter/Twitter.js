var fs = require('fs');
var Candidate = require('./Candidate');

module.exports.onTweet = function(callback) {
  fs.readFile('./candidates.json', function read(err, data) {
      if (err) {
          console.error(err);
      }
      var candidates = JSON.parse(data);
      fs.readFile('./twitter/keys.json', function read(err, data) {
          if (err) {
              console.error(err);
          }
          var keys = JSON.parse(data);
          for(var i = 0; i < candidates.length; i++){
            Candidate.register(candidates[i], keys[i], callback);
          }
      });
  });
}
