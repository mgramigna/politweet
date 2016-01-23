var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
async = require('async');
var fs = require('fs');
var CronJob = require('cron').CronJob;

var twitter = require('./twitter/Twitter');
var db = require('./database/MongooseController');
var Tweet = require('./database/schemas/Tweet');
var indico = require('./indico/IndicoController');

//Get Candidates List and Make asyncObject
var candidates = [];
var asyncObject = {};
fs.readFile('./candidates.json', function read(err, data) {
  if (err) {
    console.error(err);
  }
  candidates = JSON.parse(data);
  candidates.forEach(function(candidate){
    asyncObject[candidate.name] = function(callback){
      db.getTweetsByCandidate(candidate.name, 5, function(tweets){
        callback(null, tweets);
      });
    };
  });
});

//Serve Client
app.use(express.static(__dirname + '/public'));

//Get Candidate List via GET
app.get('/candidates', function(req, res){
  res.json(candidates);
});

//Initial Tweet Feed via GET
app.get('/init', function(req, res){
  async.series(asyncObject, function(err, response){
    res.json(response);
  });
});

//Sentiment Data via GET
app.get('/sentiments', function(req, res){
  var now = Date.now();
  db.getAllSentimentsSince(now.setDate(now.getDate() - 1), function(sentiments){
    res.json(sentiments);
  });
});

//State Sentiment Data via GET
app.get('/states', function(req, res){
  var now = Date.now();
  db.getAllStateSentimentsSince(now.setDate(now.getDate() - 1), function(sentiments){
    res.json(sentiments);
  });
});

//Socket Connections
var users = [];
io.on('connection', function(socket){
  users.push(socket);
});

//Tweet Handler
twitter.onTweet(function(tweet){
  db.saveTweet(new Tweet({
    party: tweet.party,
    candidate: tweet.candidate,
    tweet: tweet.tweet,
    date: new Date()
  }));
  users.forEach(function(user){
    user.volatile.emit('tweet', tweet);
  });
});

//Start the Server
server.listen(3000, function() {
  console.log("Server started, listening on port 3000");
});


//Cron Job Changing the Sentiments every 5 minutes
var job = new CronJob('0 */5 * * * *',
  Calculate, //Job
  function () {}, //After Job
  true, /* Start the job right now */
  'America/New_York' //TimeZone
);

var Calculate = function(){
  console.log('job executed');
};
//Test
// indico.getSentiment(['positive', 'happy'], function(sentiment){
//   console.log(sentiment);
// });
