import * as Highcharts from 'highcharts';
import * as HighchartsMore from 'highcharts/highcharts-more';
import * as HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

const splineMaker  = {};
let spline = [];
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
    return spline;
}
splineMaker.addPoint = data => {
    let series = spline[data.id].series[0];
    let x = (new Date()).getTime(), y = data.value;
    series.addPoint([x, y], true, true);
}

const gaugeMaker = {};
let gauge = [];
gaugeMaker.create = ({id, data, format}) => {
    gauge[id] = Highcharts.chart(id, {
        chart: {
            type: 'solidgauge'
        },
        title: null,
        credits: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        pane: {
            center: ['50%', '50%'],
            size: '80%',
            startAngle: 0,
            endAngle: 360,
            background: {
                borderWidth: 0,
                backgroundColor: {
                    radialGradient: {cx: 0.5, cy: 0.5, r: 0.46},
                    stops: [
                        [0, '#000'],
                        [1, '#D6DADC']
                    ]
                },
                innerRadius: '90%',
                outerRadius: '100%',
                shape: 'circle'
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            stops: [
                [0, '#41B883']
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            labels: {
                enabled: false
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: true,
                    y: -31,
                    borderWidth: 0,
                    useHTML: true,
                    format: format,
                    style: {
                        fontSize: '42px',
                        fontFamily: 'Lato',
                        fontWeight: '300',
                        color: '#4A4A4A'
                    }
                }
            }
        },
        series: [{
            innerRadius: '90%',
            data: [Math.round(data)]
        }]
    });
    return gauge;
}
gaugeMaker.updatePoint = data => {
    let series = gauge[data.id].series[0].points[0];
    series.update(Math.round(data.value));
}

const graphMaker = {};
let graph = [];
graphMaker.create = ({id, title, data, yAxisText = null, xAxisText = null}) => {
    graph[id] = Highcharts.chart(id, {
        chart: {
            type: 'bar'
        },
        title: {
            text: title
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: [id],
            title: {
                text: xAxisText
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: yAxisText,
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueDecimals: 2,
            valueSuffix: ' MiB'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: data
    });
    return graph;
}
graphMaker.addPoint = data => {
    let series = graph[data.id].series[0];
    let x = (new Date()).getTime(), y = data.value;
    series.addPoint([x, y], true, true);
}

export {
    splineMaker,
    gaugeMaker,
    graphMaker
}