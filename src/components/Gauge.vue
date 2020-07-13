<template>
    <div class="highcharts-gauge">
        <div class="chart-legend text-center">
            <h3>{{ title }}</h3>
        </div>
        <div :id="id" class="doughnut"></div>
    </div>
</template>

<script>
    import * as Highcharts from 'highcharts';
    import * as HighchartsMore from 'highcharts/highcharts-more';
    import * as HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

    HighchartsMore(Highcharts);
    HighchartsSolidGauge(Highcharts);

    export default {
        name: 'Gauge',
        props: ['title', 'id', 'metric', 'format'],
        mounted() {
            this.draw({
                id: this.id,
                data: this.metric,
                format: this.format
            });
        },
        methods: {
            draw: ({id, data, format}) => {
                Highcharts.chart(id, {
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
                        size: '75%',
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
            }
        }
    }
</script>

<style scoped>
    .doughnut {
        min-width: 310px;
        max-width: 400px;
        height: 300px;
        margin: 0 auto;
    }
</style>