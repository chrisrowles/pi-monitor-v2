<template>
    <div class="highcharts-gauge">
        <div class="chart-legend text-center text-muted">
            {{ title }}
        </div>
        <div :id="id" class="gauge"></div>
    </div>
</template>

<script>
    import bus from '../../services/event-bus';
    import { gaugeMaker } from '../../services/chart-creator';

    export default {
        props: ['title', 'id', 'metric', 'format'],
        created() {
            bus.$on('update-gauge-' + this.id, data => {
                gaugeMaker.updatePoint(data);
            });
        },
        mounted() {
            gaugeMaker.create({
                id: this.id,
                data: this.metric,
                format: this.format
            });
        }
    }
</script>

<style scoped>
    .gauge {
        max-width: 400px;
        height: 300px;
        margin: 0 auto;
    }
</style>