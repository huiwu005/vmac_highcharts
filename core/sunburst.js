const sunburstData_data_json = await fetch("files/sunburst_data.json") ;
const sunburstData = await sunburstData_data_json.json();
  
  // Create sunburst chart
  const colors = ['#895273', '#2F5F98', '#6BBBC4', '#5E3967', '#31356E']; //'#2D8BBA', '#41B8D5'
  Highcharts.chart('u24_dashboard_sunburst', {
    chart: {
        height: '50%'
    },
    colors: colors,
    title: {
        text: 'Available Harmonized Data'
    },
    subtitle: {
      text: 'Hover to Explore'
    },
    caption: {
      text: 'Click on a category to drill down and inspect the cohorts in more detail.',
      align: 'center'
    },
    series: [{
        type: 'sunburst',
        data: sunburstData.map(item => ({
          ...item,
          color: item.center ? 'transparent' : item.color,
        })),
        name: 'Categories',
        allowDrillToNode: true,
        borderRadius: 6,
        cursor: 'pointer',
        dataLabels: {
            format: '{point.name}',
            filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 16
            },
            style: {
              fontSize: '10px'
            },
            color: 'white'
        },
        levels: [{
            level: 1,
            levelIsConstant: false,
            allowDrillToNode: false,
            dataLabels: {
                filter: {
                    property: 'outerArcLength',
                    operator: '>',
                    value: 64
                }
            },
            innerSize: '90%',
            outerSize: '100%'
        }, {
            level: 2,
            colorByPoint: true,
            allowDrillToNode: false,
        },
        {
            level: 3,
            colorVariation: {
                key: 'brightness',
                to: 0.3
            },
            allowDrillToNode: false,
        },
        {
          level: 4,
          colorVariation: {
              key: 'brightness',
              to: 0.3
          },
          allowDrillToNode: false,
      }]
  
    }],
    plotOptions: {
      series: {
          maxpointWidth: 20
      }
    },
    tooltip: {
      formatter: function () {
          if (this.point.node.level === 2) {
              return 'Domain: <b>' + this.point.name + '</b>' + '<br/>Number of Individuals: <b>' + this.point.value + '</b>';
          } else if (this.point.node.level === 3) {
              return 'Cohort: <b>' + this.point.name + '</b>' + '<br/>Number of Individuals: <b>' + this.point.value + '</b>';
          } else {
              return 'Total Number of Individuals: ' + this.point.value;
          }
      }
    },
    
    exporting: false,
    credits: false
  });
  
  // })