
var socket = io.connect(location.host);
var tweetStore = {}
socket.on('tweet', function(tweet) {
  if (tweetStore.hasOwnProperty(tweet.candidate)) {
    if (tweetStore[tweet.candidate].length >= 5) {
        tweetStore[tweet.candidate].pop()
    }
    tweetStore[tweet.candidate].unshift(tweet)
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
      fontSize: '12px',
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
      width: '500px',
      margin: '10px'
    }
    var headingStyle = {
      fontFamily: 'verdana',
      backgroundColor: '#73AD21',
      margin: '0px',
      textAlign: 'center',
      padding: '10px'
    }
    var scrollStyle = {
      height: '200px',
      overflow: 'hidden'
    }
    return (
      <div style={listStyle}>
        <h2 style={headingStyle}>{this.props.title}</h2>
        <div style={scrollStyle}>
          {this.renderTweetRows()}
        </div>
      </div>
    );
  },
  renderTweetRows: function() {
    var tweetRows = [];
    for (var i = 0; i < this.props.data.length; i++) {
      console.log(this);
      tweetRows.push(<Tweet key={i} text={this.props.data[i].tweet.text} />)
    }
    return tweetRows
  }
});

var TweetListContainer = React.createClass({

  componentWillMount: function() {
    var self = this;
    $.ajax('/init', {
      success: function(data) {
        console.log(data);
        tweetStore = data;
        self.setState({tweetStore: data});
      },
      error: function() {

      }
    });
  },
  getInitialState: function() {
    return {}
  },

  _onUpdateTweets: function(tweetStore) {
      this.setState({tweetStore: tweetStore});
  },

  render: function() {
    var boxStyle = {
      padding: '20px'
    }

    var leftStyle ={
      left: '5%',
      position: 'relative',
      float: 'left',
      display: 'inline-block'
    }
    var rightStyle = {
      right: '5%',
      position: 'relative',
      float: 'right',
      display: 'inline-block'
    }

    if (!this.state.tweetStore) {
      return(<p>Hello</p>);
    } else {
      return (
        <div>
          <div style={leftStyle}>
            <TweetList title={'Bernie Sanders'} data={this.state.tweetStore['bernie sanders']} />
            <TweetList title={'Hillary Clinton'} data={this.state.tweetStore['hillary clinton']} />
          </div>
          <div style={rightStyle}>
            <TweetList title={'Marco Rubio'} data={this.state.tweetStore['marco rubio']} />
            <TweetList title={'Donald Trump'} data={this.state.tweetStore['donald trump']} />
          </div>
        </div>
      );
    }
  }
})

var tweetListContainer = ReactDOM.render(
  <TweetListContainer />,
  document.getElementById('container')
);
