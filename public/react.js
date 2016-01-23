var NewComponent = React.createClass({
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
      fontSize: '16px',
      fontWeight: 'normal'
      //lineHeight: '16px'
    }
    var outLine ={
      display: 'inlineBlock',
      fontSize: '12px',
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
      width: '468px',
      backgroundColor: 'white',
      verticalAlign: 'textTop',

      fontFamily: 'Quicksand',
      color: '#7f8c8d',
    }



    return (
      <div>
        <link href="http://netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.css" rel="stylesheet" />
        <blockquote style={outLine} className="twitter-tweet">
          <p style={paragraph}>Bernie is fun!</p>
          —Jack (@jack) May 21, 2006
          <div style={mailIcon} className="icon-mail-reply action" />10
          <div style={otherIcon} className="icon-retweet action" />25
          <div style={otherIcon} className="icon-star" />10
        </blockquote>
      </div>
    );
  }
});

ReactDOM.render(
  <NewComponent />,
  document.getElementById('content')
);
