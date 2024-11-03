
const data = await (await fetch('files/venn/venn_mega.json')).json();
const formatter = new Intl.NumberFormat('en-US');

// const elig_grid = elig.split("\n").filter((item) => item != "GRID")

// const mega = await (await fetch('files/MEGAFinal.fam')).text();
// const mega_grid_all = []
// mega.split("\n").forEach((line,index) => {
//   mega_grid_all.push(line.split(" ")[1]);
// })
// const mega_grid = [...new Set(mega_grid_all)]

// const mega_elig = elig_grid.filter(value => mega_grid.includes(value));

function formatNumberWithCommas(number) {
  return number.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
}

Highcharts.chart('chart_venn', {
    accessibility: {
        point: {
            descriptionFormat: '{add index 1}. Intersection: {sets}. ' +
                '{#if (gt sets.length 1)}{name}. {/if}' +
                'Value {value}'
        }
    },
    tooltip: {
        formatter: function(){
            var name = this.point.name.split('<br>n=')[0];
            var value = formatter.format(this.point.value);
            return '<b>Name:</b> ' + name + '<br><b>Value:</b> ' + value;
        }
    },
    series: [{
        type: 'venn',
        data: [{
            name: 'Eligiblities 2024-08<br>n=' + formatter.format(data[0].elig), 
            sets: ['A'],
            value: data[0].elig
        }, {
            name: 'MEGAex<br>n=' + formatter.format(data[0].mega),
            sets: ['B'],
            value: data[0].mega
        }, {
            name: 'MEGAex_v4<br>n=' + formatter.format(data[0].megaex_v4),
            sets: ['A', 'B'],
            value: data[0].megaex_v4
        }]
    }],
    title: {
        text: 'MEGAex_v4'
    }
});
