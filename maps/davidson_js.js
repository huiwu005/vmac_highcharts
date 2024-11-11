// maps/davidson_js.js

/* Prepare demo data. The data is joined to map using value of 'zipcode'
 property by default. See API docs for 'joinBy' for more info on linking
data and map.*/

// load data. data used in 1st layer "zipcode_boundaries"
const data_json = await fetch("files/data1.json") ;
const data = await data_json.json();

// Create the chart
// read in javascript maps
const geoIU = Highcharts.maps["countries/us/TN/tl_rd22_47_RTTYP_IUS/tl_rd22_47037_roads_RTTYP_IUS"],
    zipjson = Highcharts.maps["countries/us/TN/tl_2023_47/tl_2023_47037"],
    countyjson = Highcharts.maps["countries/us/TN/tl_2023_47_county"];
const roadsiu = Highcharts.geojson(geoIU, 'mapline'),
    zips = Highcharts.geojson(zipjson, 'map'),
    counties = Highcharts.geojson(countyjson, 'map');

// split zips file into three layers
var zipcode_boundaries = zips.filter(function(item) {
    var layer = item.properties.layer;
    return layer.includes("county_fips")
});
var county_boundary = zips.filter(function(item) {
    var layer = item.properties.layer;
    return layer.includes('GEOID')
});
var lms_waters = zips.filter(function(item) {
    var layer = item.properties.layer;
    return layer.includes("area")
});

// Skip or move some labels to avoid collision
roadsiu.forEach(item => {
    var type = item.properties.RTTYP;
    if (type != "I") item.color = "#ffc414" 
})

// assign different colors for areawater and area landmarks
lms_waters.forEach(item => {
    var layer = item.properties.layer;
    // landmarks
    // if (layer == "47037_arealm"){
    if (layer.includes('arealm')){
        var name = item.properties.FULLNAME;
        if (name.includes("International")){
            item.color = Highcharts.color("#c4d9ef").setOpacity(0.75).get()
            item.dataLabels = {
                enabled: true,
                style: {color: '#4889cd'},
                format: '{point.properties.FULLNAME}' + '<br/><i class="fa fa-plane" style="font-size: 1.5em"></i>',
                useHTML: true
            }
        }
        if (name.includes("Park")){
            item.color = Highcharts.color("#53ca60").setOpacity(0.75).get()
            item.dataLabels = {
                enabled: true,
                style: {color: '#2a8834'},
                format: '{point.properties.FULLNAME}' + '<br/><i class="fa fa-tree" style="font-size: 1.5em"></i>',
                useHTML: true
            }
        }
        if (name.includes("Univ")){
            item.color = Highcharts.color("#b89065").setOpacity(0.75).get()
            item.dataLabels = {
                enabled: true,
                style: {color: "#7a5a38"},
                format: '{point.properties.FULLNAME}' + '<br/><i class="fa fa-graduation-cap" style="font-size: 1.5em"></i>',
                useHTML: true

            }
        }
    };

    // area waters
    if (layer.includes('areawater')){
        item.color = Highcharts.color("#3172e8").setOpacity(0.5).get()
        item.dataLabels = {enabled: false}
    }
});

Highcharts.mapChart('chart_davidson', {
    chart: {
        height: 800,
        borderWidth: 1
    },
    title: {
        text: 'Davidson County Event by Zip Code'
    },
    exporting: {
        sourceWidth: 600,
        sourceHeight: 500
    },
    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },
    colorAxis: {
        min: 0,
        minColor: '#efecf3',
        maxColor: '#990041'
    },
    legend: {
        title: {
            text: 'Total Events'
        }
    },
    series: [
        {
            name: 'Total Events',
            data: data,
            mapData: zipcode_boundaries,
            allAreas: true,
            joinBy: ["zipcode", 'code'],
            fillOpacity: 0.05,
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function() {
                    var name = this.point.name, zipcode = this.point.zipcode;
                    if (name === "Nashville") {
                        return zipcode
                    } else {
                        return name + "<br>" + zipcode
                    }
                },
                style: {
                    width: '80px', // force line-wrap
                    textTransform: 'uppercase',
                    fontWeight: 'normal',
                    textOutline: 'none',
                    color: '#888'
                }
            },
            tooltip: {
                pointFormat: '{point.properties.name} ({point.properties.zipcode}): <b>{point.value}</b>'
            }
        },{
            // Interstates and US HWYs
            name: 'Interstate & US HWY',
            type: 'mapline',
            data: roadsiu,
            allAreas: false,
            color: '#ec9b00',
            affectsMapView: false,
            dataLabels: {enabled: false},
            enableMouseTracking: false,
            showInLegend: true
        },{
            // area waters and landmarkers
            name: 'Area Waters & Landmarkers',
            type: 'map',
            data: lms_waters,
            allAreas: false,
            color: '#6495ed',
            dataLabels: {enabled: false},
            enableMouseTracking: false,
            tooltip: {enabled: false},
            affectsMapView: false,
            showInLegend: true
        },{
            // County Boundary
            name: 'County Boundary',
            type: 'mapline',
            data: county_boundary,
            allAreas: false,
            dashStyle: 'LongDash',
            color: 'grey',
            lineWidth: 3,
            affectsMapView: false,
            dataLabels: {enabled: false},
            showInLegend: true,
            tooltip: {
                pointFormat: '{point.properties.county_name}'
            }
        }
    ],
    credits: { enabled: false }
});