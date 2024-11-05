const variables = [], categories = [];

const text1 = await (await fetch('files/wordcloud/ADSP_Metadata.csv')).text();
text1.split("\n").forEach((line,index) => {
    var v = line.split(",")[4];
    if (v != "variable") {
        variables.push(v);
    }
    var v = line.split(",")[1];
    if (v != "category") {
        categories.push(v);
    }
})

const text2 = await (await fetch('files/wordcloud/metadata_20220819_VMAP.csv')).text();
text2.split("\n").forEach((line,index) => {
    var v = line.split(",")[2];
    if (v != "variable") {
        variables.push(v);
    }
    var v = line.split(",")[1];
    if (v != "category") {
        categories.push(v);
    }
})

var data_arr = [variables,categories];
["Variable","Category"].forEach((title,index) => {
    var title_low = title.toLowerCase()
    var data = data_arr[index].reduce((arr, word) => {
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
    
    Highcharts.chart('word_cloud_'+title_low, {
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
            text: 'VMAC-DCC <span style="color:blue;">'+title+'</span> across Studies',
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
})
