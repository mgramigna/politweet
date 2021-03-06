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
var Sentiment = require('./database/schemas/Sentiment');
var State = require('./database/schemas/State');
var currentSentiment = {
  candidates: {},
  party: {
    dem: 0.0,
    rep: 0.0
  }
};
var stateList = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL",
"GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME",
"MH", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV",
"NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN", "TX", "UT",
"VA", "VI", "VT", "WA", "WI", "WV", "WY"];
var currentState = {};
stateList.forEach(function(state){
  currentState[state] = {
    candidates: {},
    party: {
      dem: 0.0,
      rep: 0.0
    }
  };
});

//Get Candidates List and Make asyncObject
var candidates = [];
var asyncObject = {};
fs.readFile('./candidates.json', function read(err, data) {
  if (err) {
    console.error(err);
  }
  candidates = JSON.parse(data);
  candidates.forEach(function(candidate){
    currentSentiment.candidates[candidate.name] = 0.0;
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

app.get('/count/:candidate', function(req, res){
  db.getTweetsByCandidateSince(req.params.candidate, new Date(0), function(tweets){
    res.json(tweets.length);
  });
});

//Initial Tweet Feed via GET
app.get('/init', function(req, res){
  async.series(asyncObject, function(err, response){
    res.json(response);
  });
});

//Sentiment Data via GET
app.get('/sentiments', function(req, res){
  var d = new Date();
  d.setDate(d.getDate() - 1);
  db.getAllSentimentsSince(d, function(sentiments){
    res.json(sentiments);
  });
});

//Average Sentiment over time via GET
app.get('/sentiments/average', function(req, res){
  res.json(currentSentiment);
});

//State Sentiment Data via GET
app.get('/states', function(req, res){
  res.json(currentState);
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

//Initialize data for the current sentiment algorithm
var initialD = new Date();
initialD.setHours(initialD.getHours() - 1);
db.getAllSentimentsSince(initialD, function(sentiments){
  sentiments.forEach(function(sentiment){
    var sentimentCount = 1;
    for(var key in sentiment.data.candidates){
      currentSentiment.candidates[key] = averageAlgorithm(sentiment.data.candidates[key], currentSentiment.candidates[key], sentimentCount);
    }
    currentSentiment.party.dem = averageAlgorithm(sentiment.data.party.dem, currentSentiment.party.dem, sentimentCount);
    currentSentiment.party.rep = averageAlgorithm(sentiment.data.party.rep, currentSentiment.party.rep, sentimentCount);
    sentimentCount++;
  });
});

//Initialize data for each state's sentiment
var dat = new Date();
dat.setHours(dat.getHours() - 1);
db.getAllStateSentimentsSince(dat, function(sentiments){
  sentiments.forEach(function(sentiment){
    var sentimentCount = 1;
    for(var state in currentState){
      for(var key in sentiment.data[state].candidates){
        currentState[states].candidates[key] = averageAlgorithm(sentiment.data[state].candidates[key], currentState[state].candidates[key], sentimentCount);
      }
      currentState[state].party.dem = averageAlgorithm(sentiment.data[state].party.dem, currentState[state].party.dem, sentimentCount);
      currentState[state].party.rep = averageAlgorithm(sentiment.data[state].party.rep, currentState[state].party.rep, sentimentCount);
      sentimentCount++;
    }
  });
});

//Cron Job Changing the Sentiments every 5 minutes
var job = new CronJob('0 */1 * * * *',
  function(){
    //Get all tweets for the past d minutes
    var d = new Date();
    d.setMinutes(d.getMinutes() - 1);
    db.getAllTweetsSince(d, function(tweets){
      var asyncSentiment = {};
      //For each candidate, make a list of tweets to analyze
      candidates.forEach(function(candidate){
        var list = [];
        tweets.forEach(function(tweet){
          if(tweet.candidate === candidate.name){
            list.push(tweet.tweet.text);
          }
        });
        //Create the async object to give to .series
        asyncSentiment[candidate.name] = function(callback){
          if(list.length > 0){
            indico.getSentiment(list, function(sentiment){
              callback(null, sentiment);
            });
          } else {
            callback(null, 0.0);
          }
        };
      });
      //Analyze the sentiment in series
      async.series(asyncSentiment, function(err, response){
        var now = new Date();
        var newSentiment = {
          data: {
            candidates: response,
            party: {
              dem: 0.0,
              rep: 0.0
            }
          },
          date: now
        };
        //Average the candidates data per party
        var n = 0;
        candidates.forEach(function(candidate){
          if(candidate.party == 'democratic'){
            newSentiment.data.party.dem += newSentiment.data.candidates[candidate.name];
            n++;
          }
        });
        newSentiment.data.party.dem = newSentiment.data.party.dem / n;
        n = 0;
        candidates.forEach(function(candidate){
          if(candidate.party == 'republican'){
            newSentiment.data.party.rep += newSentiment.data.candidates[candidate.name];
            n++;
          }
        });
        newSentiment.data.party.rep = newSentiment.data.party.rep / n;

        //Update current sentiment via Jacks Algorithm, spit out via socket.io
        var initialDate = new Date();
        initialDate.setHours(initialDate.getHours() - 1);
        db.getAllSentimentsSince(initialDate, function(sentiments){
          sentiments.push(newSentiment);
          var sentimentCount = 1;
          sentiments.forEach(function(sentiment){
            for(var key in sentiment.data.candidates){
              currentSentiment.candidates[key] = averageAlgorithm(sentiment.data.candidates[key], currentSentiment.candidates[key], sentimentCount);
            }
            currentSentiment.party.dem = averageAlgorithm(sentiment.data.party.dem, currentSentiment.party.dem, sentimentCount);
            currentSentiment.party.rep = averageAlgorithm(sentiment.data.party.rep, currentSentiment.party.rep, sentimentCount);
            sentimentCount++;
          });
        });
        users.forEach(function(user){
          user.volatile.emit('sentimentUpdate', currentSentiment);
        });

        //Send this newSentiment over Socket.io and save it in Mongoose
        users.forEach(function(user){
          user.volatile.emit('newSentiment', newSentiment);
        });
        db.saveSentiment(new Sentiment(newSentiment));
      });
    });
  }, //Job
  function () {}, //After Job
  true, /* Start the job right now */
  'America/New_York' //TimeZone
);

var averageAlgorithm = function(newRating, savedRating, count){
  if(newRating > 0) {
    return (newRating - savedRating) / count + savedRating
  } else {
  return savedRating;
  }
};
