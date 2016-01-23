var indico = require('indico.io');
var fs = require('fs');

var average = function(list){
  var result = 0.0;
  list.forEach(function(item){
    result += item;
  });
  return result / list.length;
};

module.exports.getSentiment = function(list, callback){
  fs.readFile('./indico/key.json', function read(err, data) {
    if (err) {
      console.error(err);
    }
    indico.apiKey = JSON.parse(data)[0];
    indico.sentiment(list)
      .then(function(res){
        callback(average(res));
      })
      .catch(function(err){
        console.log(err);
      });
  });
};
