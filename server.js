var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var twitter = require('./twitter/Twitter');
var db = require('./database/MongooseController');
var Tweet = require('./database/schemas/tweet');
var candidates = [];

app.use(express.static(__dirname + '/public'));

app.get('/init', function(req, res){
  //Async.series stuff
});

var users = [];
io.on('connection', function(socket){
  users.push(socket);
});

twitter.onTweet(function(tweet){
  db.saveTweet(new Tweet(tweet));
  users.forEach(function(user){
    user.volatile.emit('tweet', tweet);
  });
});

server.listen(3000, function() {
  console.log("Server started, listening on port 3000");
});
