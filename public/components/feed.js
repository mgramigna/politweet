var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
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
socket.on('sentimentUpdate', function(data) {
  tweetListContainer._onUpdateSentiment(data);
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
     fontSize: '12px',
     fontWeight: 'normal',
     marginTop: '5px',
     marginBottom: '20px'
     //lineHeight: '16px'
   }
   var outLine ={
     display: 'inlineBlock',
     fontSize: '14px',
     fontWeight: 'bold',
     lineHeight: '16px',
     borderColor: '#eee',
     borderRadius: '5px',
     borderStyle: 'solid',
     borderWidth: '1px',
     marginLeft: '5px',
     marginRight: '5px',
     marginTop: '5px',
     marginBottom: '0px',
     paddingTop: '7px',
     paddingRight: '16px',
     paddingLeft: '16px',
     verticalAlign: 'center',

     //backgroundColor: 'white',

     fontFamily: 'Verdana',
     color: '#7f8c8d ',
   }

   var avatarStyle = {
     width: '50px',
     height: '50px',
     display: 'inline-block',
     float: 'left',
     marginRight: '10px',
     marginTop: '5px',
     borderRadius: '50%',
     verticalAlign: 'center',
   }

   var test = {
     verticalAlign: 'center',
   }

   return (
     <div>
       <link href="http://netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.css" rel="stylesheet" />

       <blockquote style={outLine} className="twitter-tweet">
         <div style={test}>
         <img style={avatarStyle} src={this.props.image}/>
            {this.props.name} (@{this.props.screenName})
            <div style={otherIcon} className="icon-retweet action" />{this.props.retweet}
            <div style={otherIcon} className="icon-star" />{this.props.favorite}
            <p style={paragraph}>{this.props.text}</p>
         </div>
       </blockquote>
     </div>
   );
 }
});

var TweetList = React.createClass({
  render: function() {
    var listStyle = {
      width: '500px',
      margin: '10px'
    }
    var headingStyle = {
      fontFamily: 'verdana',
      margin: '0px',
      textAlign: 'center',
      padding: '10px',
      color: 'white'
    }
    var percentStyle = {
      position: 'relative'
    }
    if (this.props.party == 'democratic') {
      headingStyle.backgroundColor = '#000099'
      listStyle.border = '2px solid #000099'
      percentStyle.float = 'right'
    } else {
      headingStyle.backgroundColor = '#990000'
      listStyle.border = '2px solid #990000'
      percentStyle.float = 'left'
    }
    var scrollStyle = {
      height: '300px',
      overflow: 'hidden'
    }


    return (
      <div style={listStyle}>
        <h2 style={headingStyle}>{this.props.title}<span style={percentStyle}>37%</span></h2>
        <div className="tweets" style={scrollStyle} >
        <ReactCSSTransitionGroup transitionName="tweet" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {this.renderTweetRows()}
        </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  },
  renderTweetRows: function() {
    var tweetRows = [];
    for (var i = 0; i < this.props.data.length; i++) {
      var tweet = this.props.data[i].tweet;
      tweetRows.push(<Tweet key={tweet.id} text={tweet.text} favorite={tweet.favorite_count} retweet={tweet.retweet_count} name={tweet.user.name} screenName={tweet.user.screen_name} image={tweet.user.profile_image_url_https}/>)
    }
    return tweetRows
  }
});

var TweetListContainer = React.createClass({

  componentWillMount: function() {
    var self = this;
    $.ajax('/init', {
      success: function(data) {
        tweetStore = data;
        self.setState({tweetStore: data});
      },
      error: function() {

      }
    });
    $.ajax('sentiment/average', {
      success: function(firstSentiment) {
        self.setState({sentiment: firstSentiment});
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

  _onUpdateSentiment: function(newSentiment) {
    this.setState({sentiment: newSentiment});
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
            <TweetList title={'Bernie Sanders'} data={this.state.tweetStore['bernie sanders']} party={'democratic'} />
            <TweetList title={'Hillary Clinton'} data={this.state.tweetStore['hillary clinton']} party={'democratic'} />
          </div>
          <div style={rightStyle}>
            <TweetList title={'Marco Rubio'} data={this.state.tweetStore['marco rubio']} party={'republican'} />
            <TweetList title={'Donald Trump'} data={this.state.tweetStore['donald trump']} party={'republican'} />
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
