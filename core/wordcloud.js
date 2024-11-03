const variables = []
const title_exclude = 'variable'

const text1 = await (await fetch('files/wordcloud/ADSP_Metadata.csv')).text();
text1.split("\n").forEach((line,index) => {
  var v = line.split(",")[4];
  if (v != title_exclude) {
	variables.push(v);
  }
})

const text2 = await (await fetch('files/wordcloud/metadata_20220819_VMAP.csv')).text();
text2.split("\n").forEach((line,index) => {
  var v = line.split(",")[2];
  if (v != title_exclude) {
	variables.push(v);
  }
})

var  data = variables.reduce((arr, word) => {
        let obj = Highcharts.find(arr, obj => obj.name === word);
        if (obj) {
            obj.weight += 1;
        } else {
            obj = {
                name: word,
                weight: 1
            };
            arr.push(obj);
        }
        return arr;
    }, []);

Highcharts.chart('word_cloud', {
    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<h5>{chartTitle}</h5>' +
                '<div>{chartSubtitle}</div>' +
                '<div>{chartLongdesc}</div>' +
                '<div>{viewTableButton}</div>'
        }
    },
    series: [{
        type: 'wordcloud',
        data,
        name: 'Occurrences'
      }],
    title: {
        text: 'Wordcloud of VMAC-DCC Variables across Studies',
        align: 'left'
    },
    subtitle: {
        text: 'VMAP, ADSP-PHC',
        align: 'left'
    },
    tooltip: {
        headerFormat: '<span style="font-size: 16px"><b>{point.key}</b>' +
            '</span><br>'
    }
});
