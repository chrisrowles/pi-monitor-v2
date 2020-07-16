<template>
    <div class="highcharts-gauge">
        <div class="chart-legend text-center">
            <h3>{{ legend }}</h3>
        </div>
        <div :id="id"></div>
    </div>
</template>

<script>
    import * as Highcharts from 'highcharts';

    export default  {
        props: ['id', 'legend', 'title', 'subtitle', 'categories', 'data', 'yAxisText', 'xAxisText'],
        mounted() {
            this.draw({
                id: this.id,
                title: this.title,
                subtitle: this.subtitle,
                categories: this.categories,
                data: this.data,
                yAxisText: this.yAxisText,
                xAxisText: this.xAxisText
            });
        },
        methods: {
            draw({id, title, subtitle, data, yAxisText = null, xAxisText = null}) {
                Highcharts.chart(id, {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: title
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: ['processes'],
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
            }
        }
    }
</script>