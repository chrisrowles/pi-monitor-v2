<template>
    <div class="highcharts-gauge">
        <div class="chart-legend text-center">
            <h3>{{ legend }}</h3>
        </div>
        <div :id="id"></div>
    </div>
</template>

<script>
    import bus from "../../util/bus";
    import * as Highcharts from 'highcharts';

    export default {
        props: ['id', 'legend', 'title', 'data'],
        data() {
            return {
                graph: null
            }
        },
        created() {
            bus.$on('data-request', () => {
                this.addPoint();
            })
        },
        mounted() {
            setInterval(() => {
                // TODO this is a proof of concept for dynamically updating chart data
                bus.$emit('data-request', this.graph);
            }, 1000)
            this.draw({id: this.id, title: this.title, data: this.data});
        },
        // watch: {
        //     data() {
        //         bus.$emit('data-request', this.graph)
        //     }
        // },
        methods: {
            draw({id, title}) {
                this.graph = Highcharts.chart(id, {
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
                            // generate an array of random data
                            let data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -19; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1000,
                                    y: Math.random()
                                });
                            }
                            return data;
                        }())
                    }]
                });

                return this.graph;
            },
            addPoint() {
                let series = this.graph.series[0];
                let x = (new Date()).getTime(), y = Math.random();
                series.addPoint([x, y], true, true);
            }
        }
    }
</script>