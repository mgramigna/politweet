var event = new Event('tweet');

var data = [
  "This is a tweet.",
  "This is another tweet.",
  "This is a third tweet.",
  "These are kind of boring tweets with no #hashtags.",
  "Also they all end in periods",
  "sdblj hjhbhjkb h hvhvjk kvhj kv v jvkv",
  "kkhv hkv hv hkv hv hjv hv h vh v."
]

var socket = io.connect(location.host);
var tweetStore = {}
socket.on('tweet', function(tweet) {
  if (tweetStore.hasOwnProperty(tweet.candidate)) {
    if (tweetStore[tweet.candidate].length >= 5) {
        tweetStore[tweet.candidate].shift()
    }
    tweetStore[tweet.candidate].push(tweet)
  }
  else {
    tweetStore[tweet.candidate] = [tweet]
  }
  // Push the store to the TweetListContainer
  tweetListContainer._onUpdateTweets(tweetStore)

})


var Tweet = React.createClass({
  render: function() {
    var tweetStyle = {
      fontFamily: 'verdana',
      margin: '16px'
    };
    return (
      <p style={tweetStyle}>{this.props.text}</p>
    );
  }
});

var TweetList = React.createClass({
  render: function() {
    var listStyle = {
      border: '2px solid #73AD21',
      width: '300px'
    }
    var headingStyle = {
      fontFamily: 'verdana',
      backgroundColor: '#73AD21',
      margin: '0px',
      textAlign: 'center',
      padding: '10px'
    }
    var scrollStyle = {
      overflow: 'hidden',
      height: '200px',
    }
    return (
      <div style={listStyle}>
        <h2 style={headingStyle}>Donald Trump</h2>
        <div style={scrollStyle}>
          {this.renderTweetRows()}
        </div>
      </div>
    );
  },
  renderTweetRows: function() {
    var tweetRows = [];
    for (var i = 0; i < this.props.data.length; i++) {
      tweetRows.push(<Tweet key={i} text={this.props.data[i].tweet.text} />)
    }
  }
});

var TweetListContainer = React.createClass({

  getInitialState: function() {
    return {}
  },

  _onUpdateTweets: function(tweetStore) {
      this.setState({tweetStore: tweetStore});
  },

  render: function() {
    var ts = this.state.tweetStore;
    if (ts == undefined) {
      return <div />
    }
    else {
      for(var candidate in ts) {
        return <TweetList data={ts[candidate]} />
      }
    }
  }
})

var tweetListContainer = ReactDOM.render(
  <TweetListContainer data={data} />,
  document.getElementById('container')
);
