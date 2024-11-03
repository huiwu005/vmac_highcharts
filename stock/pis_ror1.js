const data_json = await fetch("files/ror1_data.json") ;
const data = await data_json.json();
const plotLines_json = await fetch("files/ror1_plotlines.json") ;
const plotLines = await plotLines_json.json();

Highcharts.stockChart('chart_ror1',{
  chart: {
    height: 1000,
    borderWidth: 1,
    marginRight: 60,
    zoomType: 'xy'
  },
  title: {
    text: 'Interaction Type'
  },
  rangeSelector: {
    enabled: true,
    selected: 4,
    buttons: [{
        type: 'month',
        count: 6,
        text: '6m'
    }, {
        type: 'ytd',
        text: 'YTD'
    }, {
        type: 'year',
        count: 1,
        text: '1y'
    }, {
        type: 'year',
        count: 2,
        text: '2y'
    }, {
        type: 'year',
        count: 4,
        text: '4y'
    }, {
        type: 'year',
        count: 6,
        text: '6y'
    }, {
        type: 'all',
        text: 'All'
    }]
  },
  yAxis: [{
    allowDecimals: false,
    height: '33%',
    opposite: false,
    title: {
      text: 'Pre-Screen'
    },

  }, { // 1
    allowDecimals: false,
    height: '33%',
    opposite: true,
    offset: 30,
    title: {
      text: 'Total'
    },
    plotLines:[
      plotLines['prescreen-call_comp'],
      plotLines['prescreen-call_incomp'],
      plotLines['prescreen-email'],
      plotLines['prescreen-letter'],
      plotLines['prescreen-text']
    ]
  }, {
    top: '33%',
    height: '33%',
    allowDecimals: false,
    opposite: false,
    offset: 0,
    title: {
      text: 'Registry Enrollment'
    }
  }, { //3
    top: '33%',
    height: '33%',
    allowDecimals: false,
    opposite: true,
    offset: 30,
    title: {
      text: 'Total'
    },
    plotLines:[
      plotLines['regenroll-call_comp'],
      plotLines['regenroll-call_incomp'],
      plotLines['regenroll-email'],
      plotLines['regenroll-letter'],
      plotLines['regenroll-text']
    ]      
  }, {
    top: '66%',
    height: '33%',
    allowDecimals: false,
    opposite: false,
    offset: 0,
    title: {
      text: 'Registry Update'
    }
  }, { //5
    top: '66%',
    height: '33%',
    allowDecimals: false,
    opposite: true,
    offset: 30,
    title: {
      text: 'Total'
    },
    plotLines:[
      plotLines['update-call_comp'],
      plotLines['update-call_incomp'],
      plotLines['update-email'],
      plotLines['update-letter'],
      plotLines['update-text']
    ]       
  }],

  xAxis: [{
    crosshair: true,
    type: "datetime",
    labels: {
      formatter: function() {
        return Highcharts.dateFormat('%d-%b<br>%Y', this.value);
      }
    }
  }],
  tooltip: {
    width: 200,
    formatter: function() {
      var week = '?';
      var s = [];

      $.each(this.points, function(i, p) {
        if (week === '?') week = p.point.week;

        s.push('<span style="color:' + p.series.color + '">\u25CF</span> ' + p.series.name.replace("<br>", "") + ': <strong>' + p.y + '</strong>'
        + '<span style="color:' + p.series.color + '"> --- </span> ' +'Pre 12w Avg: <strong>'+ Highcharts.numberFormat(average[p.series.userOptions.id])+ '</strong>'
        );
        if (p.series.name.includes("SMS")) s.push('<hr>');
      });

      // Create date from x point and format it 
      var date = new Date(this.x);
      var dateString = Highcharts.dateFormat('%d %B %Y', date);
      return '<strong>' + dateString + '</strong><br />' + s.join('<br />');
    },
    style: { fontSize: "14px" },
    crosshairs: true,
    distance: 50,
    shared: true
  },
  legend: {
    enabled: true,
    align: 'center',
    itemWidth: 150,
    width: 750,
    itemMarginBottom: 12,
    // x: 10,
    verticalAlign: 'bottom',
    floating: false,
    borderWidth: 1,
    backgroundColor:
      Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
    shadow: true
  },
  plotOptions:{
    series:{
      events: {
          legendItemClick: function() {
              var series = this,
                  xAxis = series.yAxis,
                  localPlotLines = xAxis.plotLinesAndBands;
              if (localPlotLines.length) {
                  localPlotLines.forEach(function(plotLine, index) {
                  if (series.userOptions.id === plotLine.id ) {
                      if (series.visible) {
                          xAxis.removePlotLine(plotLine.id);
                      }
                  } else if (plotLines[series.userOptions.id]) {
                      xAxis.addPlotLine(plotLines[series.userOptions.id]);
                  }
                  });
              } else if (plotLines[series.userOptions.id]) {
                  xAxis.addPlotLine(plotLines[series.userOptions.id]);
              }
          }
      }        
    }
  },      
  series: data,
  credits: { enabled: false }
});