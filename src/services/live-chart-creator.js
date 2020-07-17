import * as Highcharts from 'highcharts';

const splineMaker  = {};
let spline = null;
splineMaker.create = ({id, title, data}) => {
    console.log(data);
    spline = Highcharts.chart(id, {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10
        },

        time: {
            useUTC: false
        },

        title: {
            text: title
        },

        accessibility: {
            announceNewData: {
                enabled: true,
                minAnnounceInterval: 15000,
                announcementFormatter: function (allSeries, newSeries, newPoint) {
                    if (newPoint) {
                        return 'New point added. Value: ' + newPoint.y;
                    }
                    return false;
                }
            }
        },

        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },

        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },

        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
        },

        legend: {
            enabled: false
        },

        exporting: {
            enabled: false
        },

        series: [{
            name: 'Random data',
            data: (function () {
                let data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: (Math.random() * 10) + 50
                    });
                }
                return data;
            }())
        }]
    });
}
splineMaker.addPoint = (data) => {
    console.log(data)
    let series = spline.series[0];
    let x = (new Date()).getTime(), y = data;
    series.addPoint([x, y], true, true);
}

export {
    splineMaker
}