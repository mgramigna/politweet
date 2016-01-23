var data = [
  "This is a tweet about Trump",
  "Name",
  "Tag",
  "Text",
  "Date",
  "Location",
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
      width: '600px',
      backgroundColor: 'ADD8E6',
    }
    var headingStyle = {
      fontFamily: 'verdana',
      backgroundColor: 'ADD8E6',
      margin: '0px',
      textAlign: 'left',
      padding: '10px',
      height: '0px',

    }
    var scrollStyle = {
      overflow: 'hidden',
      height: '40px',
    }
    var tweetRows = [];
    for (var i = 0; i < this.props.data.length; i++) {
      tweetRows.push(<Tweet key={i} text={this.props.data[i]} />)
    }
    return (
      <div style={listStyle}>
        <h3 style={headingStyle}>Name</h3>
        <div style={scrollStyle}>
          {tweetRows}
        </div>
      </div>
    );
  }
});
ReactDOM.render(
  <TweetList data={data} />,
  document.getElementById('content')
);
