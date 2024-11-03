
const data = await (await fetch('files/venn/venn_agd.json')).json();
console.log(data.a)
const formatter = new Intl.NumberFormat('en-US');

function formatNumberWithCommas(number) {
  return number.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
}
function intersect(arr1,arr2) {
    return arr1.filter(value => arr2.includes(value));
}

Highcharts.chart('chart_venn_agd', {
    accessibility: {
        point: {
            descriptionFormat: '{add index 1}. Intersection: {sets}. ' +
                '{#if (gt sets.length 1)}{name}. {/if}' +
                'Value {value}'
        }
    },
    tooltip: {
        formatter: function(){
            var name = this.point.name;
            var value = formatter.format(this.point.value);
            var ids = this.point.ids.join(', ').replace(/(.*?\s.*?\s.*?\s.*?\s.*?\s)/g, '$1'+'<br>')
            return '<b>Name:</b> ' + name + '<br><b>Value:</b> ' + value + '<br><b>ids:</b> ' + ids;
        },        
        pointFormat: '' +
            '{#if (eq 1 point.sets.length)}' +
                'Product:<br><b>Highcharts {point.sets.0}</b>' +
            '{else}' +
                'Products:<br>' +
                '{#each point.sets}' +
                    'Highcharts <b>{this}</b>{#unless @last} and {/unless}' +
                '{/each}<br><br>' +
                'Shared components:<br>' +
                '<b>{point.name}</b><br>' +
            '{/if}'
    },
    series: [{
        type: 'venn',
        data: [{
            name: 'AGD Q1_125k', 
            sets: ['A'],
            value: data.a.length,
            ids: data.a
        }, {
            name: 'AGD Q2_163k',
            sets: ['B'],
            value: data.b.length,
            ids: data.b
        }, {
            name: 'AGD Q3_35k',
            sets: ['C'],
            value: data.c.length,
            ids: data.c
        },{
            name: 'Q1+Q2',
            sets: ['A','B'],
            ids: intersect(data.a,data.b),
            value: intersect(data.a,data.b).length
        },{
            name: 'Q1+Q3',
            sets: ['A','C'],
            ids: intersect(data.a,data.c),
            value: intersect(data.a,data.c).length
        },{
            name: 'Q2+Q3',
            sets: ['B','C'],
            ids: intersect(data.b,data.c),
            value: intersect(data.b,data.c).length
        },{
            name: 'Q1+Q2+Q3',
            sets: ['A','B','C'],
            ids: intersect(data.a,intersect(data.b,data.c)),
            value: intersect(data.a,intersect(data.b,data.c)).length
        }]
    }],
    title: {
        text: 'AGD Q1-3'
    }
});
