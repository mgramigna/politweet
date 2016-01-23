
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

});


var Tweet = React.createClass({
 render: function() {
   var mailIcon = {
     paddingLeft:'180px',
     paddingRight: '5px'
   }
   var otherIcon = {
     paddingLeft: '10px',
     paddingRight: '3px',
   }
   var paragraph = {
     verticalAlign: 'textTop',
     fontSize: '12px',
     fontWeight: 'normal'
     //lineHeight: '16px'
   }
   var outLine ={
     display: 'inlineBlock',
     fontSize: '10px',
     fontWeight: 'bold',
     lineHeight: '16px',
     borderColor: '#eee',
     borderRadius: '5px',
     borderStyle: 'solid',
     borderWidth: '1px',
     marginLeft: '10px',
     marginRight: '5px',
     paddingRight: '16px',
     paddingLeft: '16px',
     paddingBottom: '16px',

     backgroundColor: 'white',
     verticalAlign: 'textTop',

     fontFamily: 'Verdana',
     color: '#7f8c8d ',
   }

   var avatarStyle = {
     width: '50px',
     height: '50px',
     position: 'relative',
     display: 'inline-block',
     float: 'left',
     marginRight: '10px',
     borderRadius: '50%'
   }

   return (
     <div>
       <link href="http://netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.css" rel="stylesheet" />

       <blockquote style={outLine} className="twitter-tweet">

       <div>
       <img style={avatarStyle} src={this.props.image}/>
           <p style={paragraph}>{this.props.text}</p>
           —{this.props.name} (@{this.props.screenName}) May 21, 2006
           <div style={otherIcon} className="icon-retweet action" />{this.props.retweet}
           <div style={otherIcon} className="icon-star" />{this.props.favorite}
         </div>
       </blockquote>
     </div>
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
      height: '300px',
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
      var tweet = this.props.data[i].tweet;
      console.log(tweet);
      console.log(tweet.retweet_count);
      tweetRows.push(<Tweet key={i} text={tweet.text} favorite={tweet.favorite_count} retweet={tweet.retweet_count} name={tweet.user.name} screenName={tweet.user.screen_name} image={tweet.user.profile_image_url_https}/>)
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
