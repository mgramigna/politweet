window.pageIndex = 0;
var nextPage = function() {
  console.log(window.pageIndex);
  window.pageIndex += 1;
  if (window.pageIndex >= 4) {
    window.pageIndex = 0;
  }
  switch(window.pageIndex) {
    case 0:
      $('#container1').hide();
      $('#container2-1').hide();
      $('#container2-2').hide();
      $('#container3').hide();
      $('#container0').show();
      break;
    case 1:
      $('#container0').hide();
      $('#container2-1').hide();
      $('#container2-2').hide();
      $('#container3').hide();
      $('#container1').show();
      window.lineChart.resize();
      break;
    case 2:
      $('#container0').hide();
      $('#container1').hide();
      $('#container3').hide();
      $('#container2-1').show();
      $('#container2-2').show();
      window.demGauge.resize();
      window.repGauge.resize();
      break;
    case 3:
      $('#container0').hide();
      $('#container1').hide();
      $('#container2-1').hide();
      $('#container2-2').hide();
      $('#container3').show();
      break;
  }
}
