var clintonData = ['Clinton'];
var bernieData = ['Sanders'];
var trumpData = ['Trump'];
var rubioData = ['Rubio'];
var cruzData = ['Cruz'];
var omalleyData = ["O'Malley"];
var demPieData = ["Democratic Party"];
var repPieData = ["Republican Party"];

$.ajax('/sentiments', {
 success: function(data) {
   demPieData.push(data[0].data.party.dem);
   repPieData.push(data[0].data.party.rep);


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

   window.pieChart = c3.generate({
    bindto: '#pieContainer',
    data: {
       columns: [
           demPieData,
           repPieData
       ],
       type: 'pie'
     },
     pie: {
       label: {
           format: function (value, ratio, id) {
               return d3.format('%')(value);
           }
       }
     }
   });
 },
 error: function() {
   console.error('error');
 }
});

$('#hideGraphBtn').on('click', function(evt) {
  $('#pieContainer').hide();
  $('#graphContainer').hide();
  $('#container').show();
})

$('#showGraphBtn').on('click', function(evt) {
  $('#pieContainer').hide();
  $('#container').hide();
  $('#graphContainer').show();
  window.lineChart.resize();
});

$('#showPieBtn').on('click', function(evt) {
  $('#container').hide();
  $('#graphContainer').hide();
  $('#pieContainer').show();
  window.pieChart.resize();
});

$('#hidePieBtn').on('click', function(evt) {
  $('#container').show();
  $('#graphContainer').hide();
  $('#pieContainer').hide();
});
