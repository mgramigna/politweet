var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var dbCtrl = require('./database/MongooseController');

app.use(express.static(__dirname + '/public'));

server.listen(3000, function() {
  console.log("Server started, listening on port 3000");
});
