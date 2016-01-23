var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
async = require('async');

var twitter = require('./twitter/Twitter');
var db = require('./database/MongooseController');
var Tweet = require('./database/schemas/tweet');
var candidates = [];

//Serve Client
app.use(express.static(__dirname + '/public'));

//Initial Database Query on GET
var asyncObject = {};
candidates.forEach(function(candidate){
  asyncObject[candidate.name] = function(callback){
    db.getTweetsByCandidate(candidate.name, 1, function(tweets){
      callback(null, tweets);
    });
  };
});
app.get('/init', function(req, res){
  async.series(asyncObject, function(err, response){
    res.json(response);
  });
});

//Socket Connections
var users = [];
io.on('connection', function(socket){
  users.push(socket);
});

//Tweet Handler
twitter.onTweet(function(tweet){
  db.saveTweet(new Tweet(tweet));
  users.forEach(function(user){
    user.volatile.emit('tweet', tweet);
  });
});

server.listen(3000, function() {
  console.log("Server started, listening on port 3000");
});
