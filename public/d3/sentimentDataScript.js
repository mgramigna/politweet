var clintonData = ['Clinton'];
var bernieData = ['Sanders'];
var trumpData = ['Trump'];
var rubioData = ['Rubio'];
var cruzData = ['Cruz'];
var omalleyData = ["O'Malley"];
var demGaugeData = ["Democratic Party"];
var repGaugeData = ["Republican Party"];

$.ajax('/sentiments', {
 success: function(data) {
   data.forEach(function(obj){
     clintonData.push((obj.data.candidates['hillary clinton']*100).toFixed(1));
     bernieData.push((obj.data.candidates['bernie sanders']*100).toFixed(1));
     trumpData.push((obj.data.candidates['donald trump']*100).toFixed(1));
     rubioData.push((obj.data.candidates['marco rubio']*100).toFixed(1));
     cruzData.push((obj.data.candidates['ted cruz']*100).toFixed(1));
     omalleyData.push((obj.data.candidates["martin o'malley"]*100).toFixed(1));
   });

   window.lineChart = c3.generate({
    bindto: '#container1',
    size: {
      height: 500
    },
    data: {
      x: 'x',
      columns: [
        ['x', 1, 2, 3, 4, 5, 6],
        clintonData,
        bernieData,
        trumpData,
        rubioData,
        cruzData,
        omalleyData
      ]
    },
    axis: {
      x: {
        label: 'Time Since Last Calculation (Minutes)'
      },
      y: {
        label: 'Tweet Positivity (%)'
      }
    }
   });
 },
 error: function() {
   console.error('error');
 }
});

$.ajax('/sentiments/average', {
  success: function(data) {
    repGaugeData.push((data.party.rep*100).toFixed(1));
    demGaugeData.push((data.party.dem*100).toFixed(1));
    window.demGauge = c3.generate({
      bindto: '#container2-1',
       data: {
           columns: [
               demGaugeData
           ],
           type: 'gauge',
       },
       color: {
           pattern: ['blue']
       },
       size: {
           height: 180
       }
    });
   window.repGauge = c3.generate({
     bindto: '#container2-2',
      data: {
          columns: [
              repGaugeData
          ],
          type: 'gauge',
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      },
      color: {
          pattern: ['red ']
      },
      size: {
          height: 180
      }
    });
  },
  error: function() {

  }
});

var sandersTweetCount;
var clintonTweetCount;
var omalleyTweetCount;
var trumpTweetCount;
var rubioTweetCount;
var cruzTweetCount;

$.ajax('/count/' + 'bernie%20sanders', {
  success: function(data) {
    sandersTweetCount = data;
    loadTweetCountGraph();
  }, error: function() {

  }
});

$.ajax('/count/' + 'hillary%20clinton', {
  success: function(data) {
    clintonTweetCount = data;
    loadTweetCountGraph();
  }, error: function() {

  }
})

$.ajax('/count/' + 'martin%20omalley', {
  success: function(data) {
    omalleyTweetCount = data;
    loadTweetCountGraph();
  }, error: function() {

  }
})

$.ajax('/count/' + 'donald%20trump', {
  success: function(data) {
    trumpTweetCount = data;
    loadTweetCountGraph();
  }, error: function() {

  }
})

$.ajax('/count/' + 'marco%20rubio', {
  success: function(data) {
    rubioTweetCount = data;
    loadTweetCountGraph();
  }, error: function() {

  }
})

$.ajax('/count/' + 'ted%20cruz', {
  success: function(data) {
    cruzTweetCount = data;
    loadTweetCountGraph();
  }, error: function() {

  }
});
var loadTweetCountGraph = function() {
  window.tweetCountGraph = c3.generate({
    bindto: '#container3',
      data: {
          columns: [
            ['Tweet Count', sandersTweetCount, clintonTweetCount, omalleyTweetCount, trumpTweetCount, rubioTweetCount, cruzTweetCount]
          ],
          type: 'bar'
      },
      axis: {
        x: {
          type: 'category',
          categories: ['Bernie Sanders', 'Hillary Clinton', 'Martin O\'Malley', 'Donald Trump', 'Marco Rubio', 'Ted Cruz']
        },
        rotated: true
      }
  });
}

loadTweetCountGraph();
