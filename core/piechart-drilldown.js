const data1_json = await fetch("files/piechart_data1.json") ;
const series_data = await data1_json.json();

// map zipcode to geoid, then sum
const data2_json = await fetch("files/piechart_data2.json") ;
const drilldown_data = await data2_json.json();

Highcharts.AST.allowedAttributes.push('onmousedown')

Highcharts.chart("chart_psv2_preScreen", {
  chart: {
    borderWidth: 1,
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
    height: 500,
  },
  title: {
    text: "Pre-Screen"
  },
  tooltip: {
    positioner: function (labelWidth, labelHeight, point) {
      var tooltipX = point.plotX - 400;
      var tooltipY = point.plotY - 10;
      return { x: tooltipX, y: tooltipY };
    },
    enabled: true,
    useHTML: true,
    stickOnContact: true,
    followPointer: false,
    formatter: function() {
      var ids = this.point.vmac_ids.replace(/(.*?\s.*?\s.*?\s.*?\s.*?\s)/g, '$1'+'<br>');
      if ( this.point.type === "percentage"){
        return `
        <div class="customTooltip" onmousedown="event.stopPropagation();">
          <p>${this.point.name}: <br/><b>${this.point.y_percent}%</b> (n=<b>${this.point.y}</b>)</p>
          <p>${ids}</p>
        </div>
        `
      } else {
        return `
        <div class="customTooltip" onmousedown="event.stopPropagation();">
          <p><b>${this.percentage.toFixed(2)}%</b> (n=<b>${this.point.y}</b>)</p>  
          <p>${ids}</p>
        </div>
        `
      }
    },
  },
  plotOptions: {
    pie: {
      size: 250,
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        formatter: function(){
          return this.point.name + ":<br/> " + this.point.y;
        }
      },
    }
  },
  series: [{
    name: "Races",
    colorByPoint: false,
    data: series_data
  }],

  drilldown: {
    series: drilldown_data 
  },
  credits: { enabled: false }
});