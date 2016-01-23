var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var twitter = require('./twitter/Twitter');
twitter.onTweet(function(tweet) {
  console.log(tweet.candidate + ": " + tweet.tweet.text + "\n");
});

app.use(express.static(__dirname + '/public'));

server.listen(3000, function() {
  console.log("Server started, listening on port 3000");
});
