var clintonData = ['Clinton'];
var bernieData = ['Sanders'];
var trumpData = ['Trump'];
var rubioData = ['Rubio'];

$('.sentimentBtn').on('click', function(evt) {
  ReactDOM.unmountComponentAtNode(document.getElementById('container'));

  $.ajax('/sentiments', {
   success: function(data) {
     data.forEach(function(obj){
       clintonData.push(obj.data.candidates['hillary clinton']*100);
       bernieData.push(obj.data.candidates['bernie sanders']*100);
       trumpData.push(obj.data.candidates['donald trump']*100);
       rubioData.push(obj.data.candidates['marco rubio']*100);
     });
     var chart = c3.generate({
      bindto: '#container',
      data: {
        x: 'x',
        columns: [
          ['x', 5, 10, 15, 20, 25, 30],
          clintonData,
          bernieData,
          trumpData,
          rubioData
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
});
