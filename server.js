var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tweets');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to tweets database');
});

app.use(express.static(__dirname + '/public'));

server.listen(3000, function() {
  console.log("Server started, listening on port 3000");
});
