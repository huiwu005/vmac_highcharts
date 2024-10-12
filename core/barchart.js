Highcharts.chart('u24_dashboard_bar_chart', {
  chart: {
      type: 'bar',
      events: {
      load: function() {
        const chart = this,
          info = document.querySelector('#info');
          
        info.addEventListener('mouseover', function() {
          if (!chart.infoTooltip) {
            chart.infoTooltip = chart.renderer.label('Data use agreements (DUAs)<br/> are required between each<br/> cohort and NIAGADS to allow<br/> for incorporation of<br/> cohort data into ADSP-PHC<br/> harmonization pipelines.', 10, 10).attr({
              zIndex: 12,
              fill: '#fff',
              'stroke-width': 1,
              stroke: 'black',
              padding: 8,
              r: 3,
            }).add();
          }
          
          const bBox = chart.infoTooltip.getBBox(),
            titleBBox = chart.title.getBBox(),
            x = chart.title.x + titleBBox.width / 2 - bBox.width / 2 - 80,
            y = chart.title.y + titleBBox.height / 2;
          
          chart.infoTooltip.show();
          chart.infoTooltip.attr({x, y})
        });
        info.addEventListener('mouseout', function() {
          chart.infoTooltip.hide();
        });
      }
    }
  },
  title: {
    useHTML: true,
    text: 'Cohort DUA Status<svg id="info" style="cursor: pointer; margin-left: 5px;" fill="#000000" width="25px" height="20px"><path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"/></svg>'

  },
  xAxis: {
      visible: false,
      categories: [
          'DUA Complete',
          'DUA In Progress',
          'DUA Pending'
      ]
  },
  yAxis: {
      visible: true,
      title: {
          text: ''
      }
  },
  tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b><br/> of Total Cohorts: 39'
  },
  plotOptions: {
      bar: {
          allowPointSelect: true,
          dataLabels: {
              enabled: true,
              format: '<b>{point.y}',
              align: 'right',
              x: -8,
              inside: true,
              style: {
                  fontSize: '15px'
              }
          },
          showInLegend: true,
          groupPadding: 0 
      }
  },
  colors: ['#31356E', '#41B8D5', '#2D8BBA'],
  series: [{
    name: 'DUA Complete',
    data: [{name: 'Data Harmonization Complete', y: 20.0}]
    // data: [{name: 'Data Harmonization Complete', y: cohorts_ready}]
  }, {
    name: 'DUA In Progress',
    data: [{name: 'Data Harmonization In Progress', y: 5.0}]
    // data: [{name: 'Data Harmonization In Progress', y: cohorts_in_progress}]
  }, {
    name: 'DUA Pending',
    data: [{name: 'Data Harmonization In Pending', y: 14.0}]
    // data: [{name: 'Data Harmonization In Pending', y: cohorts_pending}]
  }],
  exporting: false,
  credits: false
});