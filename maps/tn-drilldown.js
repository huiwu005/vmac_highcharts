const zipcode_json = await fetch("files/data1.json") ;
const series_data_es3 = await zipcode_json.json();

// map zipcode to geoid, then sum
const geoids_json = await fetch("files/data2.json") ;
const geoids = await geoids_json.json();

var data = Highcharts.geojson(Highcharts.maps['countries/us/TN/tl_2023_47_county']);
var separators = Highcharts.geojson(Highcharts.maps['countries/us/TN/tl_2023_47_county'], 'mapline');

// Set drilldown pointers
$.each(data, function(i) {
  this.value = 0;
  this.drilldown = this.properties['GEOID'];
  var geoid = geoids.find(geoid => geoid.geoid == this.properties['GEOID']);
  if (geoid != null) {
    this.value = geoid.value ; 
  }
});

// Instantiate the map
Highcharts.mapChart('chart_es3', {
  chart: {
    events: {
      drilldown: function(e) {
        if (!e.seriesOptions) {
          var chart = this,
            mapKey = 'countries/us/TN/tl_2023_47/tl_2023_' + e.point.drilldown,
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
          data = Highcharts.geojson(Highcharts.maps[mapKey],'map');
          var zipcode_boundaries = data.filter(function(item) {
              var fips = item.properties.county_fips;
              var layer = item.properties.layer;
              return layer.includes("county_fips") && fips == e.point.drilldown
          });
          
          var ddSeries = {
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
          };
          // Hide loading and add series
          chart.hideLoading();
          clearTimeout(fail);
          chart.addSeriesAsDrilldown(e.point, ddSeries);
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
    text: 'Tennessee State Map by County'
  },
  subtitle: {
    text: 'drilldown to ZIPCODE'
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
    series: [],
    activeDataLabelStyle: {
      color: '#FFFFFF',
      textDecoration: 'none',
      textOutline: '1px #000000'
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