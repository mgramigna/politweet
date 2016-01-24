var clintonData = ['Clinton'];
var bernieData = ['Sanders'];
var trumpData = ['Trump'];
var rubioData = ['Rubio'];
var cruzData = ['Cruz'];
var omalleyData = ["O'Malley"];
var demGuageData = ["Democratic Party"];
var repGuageData = ["Republican Party"];

$.ajax('/sentiments', {
 success: function(data) {
   repGuageData.push(data[data.length-1].data.party.rep*100);
   demGuageData.push(data[data.length-1].data.party.dem*100);
   console.log(repGuageData, demGuageData)
   data.forEach(function(obj){
     clintonData.push(obj.data.candidates['hillary clinton']*100);
     bernieData.push(obj.data.candidates['bernie sanders']*100);
     trumpData.push(obj.data.candidates['donald trump']*100);
     rubioData.push(obj.data.candidates['marco rubio']*100);
     cruzData.push(obj.data.candidates['ted cruz']*100);
     omalleyData.push(obj.data.candidates["martin o'malley"]*100);
   });

   window.lineChart = c3.generate({
    bindto: '#graphContainer',
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

   window.demGuage = c3.generate({
     bindto: '#demGuageContainer',
      data: {
          columns: [
              demGuageData
          ],
          type: 'gauge',
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      },
      color: {
          pattern: ['blue']
      },
      size: {
          height: 180
      }
   });
  window.repGuage = c3.generate({
    bindto: '#repGuageContainer',
     data: {
         columns: [
             repGuageData
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
   console.error('error');
 }
});

$('#hideGraphBtn').on('click', function(evt) {
  $('#repGuageContainer').hide();
  $('#graphContainer').hide();
  $('#demGuageContainer').hide();
  $('#container').show();
})

$('#showGraphBtn').on('click', function(evt) {
  $('#repGuageContainer').hide();
  $('#demGuageContainer').hide();
  $('#container').hide();
  $('#graphContainer').show();
  window.lineChart.resize();
});

$('#showPieBtn').on('click', function(evt) {
  $('#container').hide();
  $('#graphContainer').hide();
  $('#repGuageContainer').show();
  $('#demGuageContainer').show();
  window.demGuage.resize();
  window.repGuage.resize();
});

$('#hidePieBtn').on('click', function(evt) {
  $('#container').show();
  $('#graphContainer').hide();
  $('#repGuageContainer').hide();
  $('#demGuageContainer').hide();
});
