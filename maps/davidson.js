// Prepare demo data. The data is joined to map using value of 'zipcode'
// property by default. See API docs for 'joinBy' for more info on linking
// data and map.
const data_json = await fetch("files/data1.json") ;
const data = await data_json.json();

// Create the chart
// use geojson file
var county_boundary = await fetch('../assets/maps/qgis/tl_2023_47_county/GEOID_47037.geojson').then(response => response.json());
county_boundary = county_boundary.features

var zipcode_boundaries = await fetch('../assets/maps/qgis/tl_2023_47_county_join_zcta520/tl_2023_47_county_join_zcta520_47037.geojson').then(response => response.json());
zipcode_boundaries = Highcharts.geojson(zipcode_boundaries, 'map');

var lms_waters = await fetch('../assets/maps/qgis/tl_2023_47037_arealm_areawater.geojson').then(response => response.json());
lms_waters = lms_waters.features

var roadsiu = await fetch('../assets/maps/qgis/tl_2023_47037_roads_IUS.geojson').then(response => response.json());
roadsiu = roadsiu.features

// Skip or move some labels to avoid collision
roadsiu.forEach(item => {
    var type = item.properties.RTTYP;
    if (type != "I") item.color = "#ffc414" 
})

// assign different colors for areawater and area landmarks
lms_waters.forEach(item => {
    var layer = item.properties.layer;
    // landmarks
    if (layer == "47037_arealm"){
        var name = item.properties.FULLNAME;
        if (name == null) {
            item.color = Highcharts.color("#8bc492").setOpacity(0.75).get()
            item.dataLabels = {enabled: false }
        } else {
            if (name.includes("International")){
                // International airport
                item.color = Highcharts.color("#c4d9ef").setOpacity(0.75).get()
                item.dataLabels = {
                    enabled: true,
                    style: {color: '#4889cd',width: '80px'},
                    format: '{point.properties.FULLNAME}' + '<br/><i class="fa fa-plane" style="font-size: 1.5em"></i>',
                    y: -25,
                    useHTML: true
                }
            } else if (name.includes("Univ")){
                // University
                item.color = Highcharts.color("#b89065").setOpacity(0.75).get()
                item.dataLabels = {
                    enabled: true,
                    style: {color: "#7a5a38",width: '80px'},
                    y: -25,
                    format: '{point.properties.FULLNAME}' + '<br/><i class="fa fa-graduation-cap" style="font-size: 1.5em"></i>',
                    useHTML: true
                }
            } else if (name.includes("Park")){
                // Park
                item.color = Highcharts.color("#53ca60").setOpacity(0.75).get()
                item.dataLabels = {
                    enabled: true,
                    style: {color: '#2a8834',width: '80px'},
                    y: -25,
                    format: '{point.properties.FULLNAME}' + '<br/><i class="fa fa-tree" style="font-size: 1.5em"></i>',
                    useHTML: true
                }
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
            joinBy: ["ZCTA5CE20", 'code'],
            fillOpacity: 0.05,
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function() {
                    var name = this.point.name, zipcode = this.point.ZCTA5CE20;
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