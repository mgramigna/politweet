var data = [
  "This is a tweet.",
  "This is another tweet.",
  "This is a third tweet.",
  "These are kind of boring tweets with no #hashtags.",
  "Also they all end in periods",
  "sdblj hjhbhjkb h hvhvjk kvhj kv v jvkv",
  "kkhv hkv hv hkv hv hjv hv h vh v."
]

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
    var tweetRows = [];
    for (var i = 0; i < this.props.data.length; i++) {
      tweetRows.push(<Tweet key={i} text={this.props.data[i]} />)
    }
    return (
      <div style={listStyle}>
        <h2 style={headingStyle}>Donald Trump</h2>
        <div style={scrollStyle}>
          {tweetRows}
        </div>
      </div>
    );
  }
});
ReactDOM.render(
  <TweetList data={data} />,
  document.getElementById('container')
);
