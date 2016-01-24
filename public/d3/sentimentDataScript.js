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
        ['x', 5, 10, 15, 20, 25, 30],
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
