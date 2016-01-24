var clintonData = ['Clinton'];
var bernieData = ['Sanders'];
var trumpData = ['Trump'];
var rubioData = ['Rubio'];

$('.sentimentBtn').on('click', function(evt) {
  document.getElementById('light').style.display='block';
  document.getElementById('fade').style.display='block';
  $.ajax('/sentiments', {
   success: function(data) {
     console.log(data);
     data.forEach(function(obj){
       clintonData.push(obj.data.candidates['hillary clinton']*100);
       bernieData.push(obj.data.candidates['bernie sanders']*100);
       trumpData.push(obj.data.candidates['donald trump']*100);
       rubioData.push(obj.data.candidates['marco rubio']*100);
     });
     var chart = c3.generate({
      bindto: '#light',
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

$('.black_overlay').on('click', function(e) {
  document.getElementById('light').style.display='none';
  document.getElementById('fade').style.display='none';
});
