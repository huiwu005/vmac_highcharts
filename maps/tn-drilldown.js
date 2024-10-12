/*
reference: https://jsfiddle.net/huiwu005/uL7gjqc5/
TODO:
- Check data labels after drilling. Label rank? New positions?
*/

const zipcode_json = await fetch("files/data1.json") ;
const series_data_es3 = await zipcode_json.json();

// map zipcode to geoid, then sum
const geoids_json = await fetch("files/data2.json") ;
const geoids = await geoids_json.json();

var data = Highcharts.geojson(Highcharts.maps['countries/us/TN/tl_2023_47_county']),
  separators = Highcharts.geojson(Highcharts.maps['countries/us/TN/tl_2023_47_county'], 'mapline'),
  // Some responsiveness
  small = $('#chart_es3').width() < 400;

// Set drilldown pointers
$.each(data, function(i) {
  this.value = 0;
  this.drilldown = this.properties['GEOID'];
  var geoid = geoids.find(geoid => geoid.geoid == this.properties['GEOID']);
  if (geoid != null) {
    this.value = geoid.value ; // Non-random bogus data
  }
});

// Instantiate the map
Highcharts.mapChart('chart_es3', {
  chart: {
    borderWidth: 1,
    events: {
      drilldown: function(e) {
        if (!e.seriesOptions) {
          var chart = this,
            mapKey = 'countries/us/TN/tl_2023_47/tl_2023_' + e.point.drilldown,
            roadKey = 'countries/us/TN/tl_rd22_47_RTTYP_IUS/tl_rd22_' + e.point.drilldown + '_roads_RTTYP_IUS',
            // Handle error, the timeout is cleared on success
            fail = setTimeout(function() {
              if (!Highcharts.maps[mapKey]) {
                chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);
                fail = setTimeout(function() {
                  chart.hideLoading();
                }, 1000);
              }
            }, 3000);

          // Show the spinner
          chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

          // Load the drilldown map
					// console.log("mapKey",mapKey);
          // $.getScript('https://code.highcharts.com/mapdata/' + mapKey + '.js', function() {

          data = Highcharts.geojson(Highcharts.maps[mapKey],'map');
          var zipcode_boundaries = data.filter(function(item) {
              var layer = item.properties.layer;
              return layer.includes("county_fips")
          });
          var county_boundary = data.filter(function(item) {
              var layer = item.properties.layer;
              return layer.includes('GEOID')
          });
          
          // console.log("zipcode_boundaries",zipcode_boundaries);

          var ddSeries = [
            {
              name: e.point.name,
              data: series_data_es3,
              mapData: zipcode_boundaries,
              joinBy: ["zipcode", 'code'],
              fillOpacity: 0.1,
              dataLabels: {
                enabled: true,
                style: {
                    width: '80px', // force line-wrap
                    textTransform: 'uppercase',
                    fontWeight: 'normal',
                    textOutline: 'none',
                    color: '#888'
                },
                format: '{point.name}<br/>{point.zipcode}'
              },
              tooltip: {
                  pointFormat: '{point.name} ({point.zipcode}): <b>{point.value}</b>'
              }
            }
          ];
          // Hide loading and add series
          chart.hideLoading();
          clearTimeout(fail);
          chart.addSeriesAsDrilldown(e.point, ddSeries[0]
          );
          // });
        }

        this.setTitle(null, {
          text: e.point.name
        });
      },
      drillup: function() {
        this.setTitle(null, {
          text: ''
        });
      }
    }
  },

  title: {
    text: 'Highcharts Map Drilldown'
  },

  subtitle: {
    text: '',
    floating: true,
    align: 'right',
    y: 50,
    style: {
      fontSize: '16px'
    }
  },

  legend: small ? {} : {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
  },

  colorAxis: {
    min: 0,
    minColor: '#E6E7E8',
    maxColor: '#005645'
  },

  mapNavigation: {
    enabled: true,
    buttonOptions: {
      verticalAlign: 'bottom'
    }
  },

  plotOptions: {
    map: {
      states: {
        hover: {
          color: '#EEDD66'
        }
      }
    }
  },

  series: [{
    data: data,
    name: 'TN',
    dataLabels: {
      enabled: true,
      format: '{point.properties.NAME}'
    }
  }, {
    type: 'mapline',
    data: separators,
    color: 'silver',
    enableMouseTracking: false,
    animation: {
      duration: 500
    }
  }],

  drilldown: {
    activeDataLabelStyle: {
      color: '#FFFFFF',
      textDecoration: 'none',
      textOutline: '1px #000000'
    },
    breadcrumbs: {
        buttonTheme: {
            fill: '#f7f7f7',
            padding: 8,
            stroke: '#cccccc',
            'stroke-width': 1
        },
        floating: true,
        position: {
            align: 'right'
        },
        showFullPath: false
    },
    drillUpButton: {
      relativeTo: 'spacingBox',
      position: {
        x: 0,
        y: 60
      }
    }
  }
});