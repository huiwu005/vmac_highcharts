const data_json = await fetch("files/es1_data.json") ;
const data = await data_json.json();

// var data = series_data_es1;

Highcharts.stockChart('combined_col_line',{
    chart: {
        height: 600,
        // borderWidth: 1,
        zoomType: 'xy'
    },
    title: {
        text: 'Event Types and Attendees'
    },
    xAxis: [{
        crosshair: true,
        type: "datetime",
        labels: {
            formatter: function() {
                return Highcharts.dateFormat('%b<br>%Y', this.value);
            }
        }
    }],
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
    yAxis: [{ // Primary yAxis
        opposite: false,
        title: {
            text: 'Number of Events',
            style: { color: Highcharts.getOptions().colors[1] }
        },
        labels: {
            style: { color: Highcharts.getOptions().colors[1] }
        }
    }, { // Secondary yAxis
        labels: {
            style: { color: Highcharts.getOptions().colors[1] }
        },
        title: {
            text: 'Total Attendance',
            style: { color: Highcharts.getOptions().colors[1] }
        },
        opposite: true
    }],
    tooltip: {
        formatter: function() {
            var week = '?';
            var s = [];

            $.each(this.points, function(i, p) {
                if (week === '?') week = p.point.week;
                s.push('<span style="color:' + p.series.color + '">\u25CF</span> ' + p.series.name + ': ' + p.y);
            });

            // Create date from x point and format it 
            var date = new Date(this.x);
            var dateString = Highcharts.dateFormat('%B %Y', date);
            return '<strong>' + dateString + '</strong><br />' + s.join('<br />');
        },
        distance: 20,
        shared: true
    },
    legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        floating: false,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)',
        shadow: true
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: data,
    credits: { enabled: false }
});