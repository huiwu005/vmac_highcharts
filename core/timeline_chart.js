// async function start() {
  const timeline_data_json = await fetch("files/timeline_data.json") ;
  const formatted_timeline_data = await timeline_data_json.json();

  var data = [];
  formatted_timeline_data.forEach((item) => {
    var date = new Date(item.x);
    var newx = Date.UTC(date.getUTCFullYear(), date.getUTCMonth());
    data.push({
      x: newx,
      name: item.name,
      label: item.label
    });
  });

  // Create timeline chart
  Highcharts.chart('u24_dashboard_timeline_chart', {
    chart: {
      // zooming: {type: 'y'},
      type: 'timeline',
      inverted: true
    },
    xAxis: {
      type: 'datetime',
      visible: false
    },
    yAxis: {
      gridLineWidth: 1,
      title: null,
      labels: {
        enabled: false
      }
    },
    legend: {
      enabled: false
    },
    title: {
      text: 'ADSP-PHC Key Dates'
    },
    tooltip: {
      style: {
        width: 300
      },
      formatter: function () {
        return '<b>' + Highcharts.dateFormat('%b %Y', this.x) + '</b><br/>' +
          'Event: ' + this.point.name + '<br/>';
      }
    },
    colors: [ "#2caffe", "#544fc5", "#00e272", "#fe6a35", "#6b8abc", "#d568fb", "#2ee0ca", "#fa4b42", "#feb56a", "#91e8e1",
      '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4' ],
    series: [{
      dataLabels: {
        allowOverlap: false,
        format: '<span style="color:{point.color}">● </span><span style="font-weight: bold;" > ' +
          '{point.x:%b %Y}</span><br/>{point.label}'
      },
      marker: {
        symbol: 'circle'
      },
      data: data
    }],
  
    exporting: false,
    credits: false
  });
// }