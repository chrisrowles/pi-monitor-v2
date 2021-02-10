<template>
    <div class="highcharts-gauge">
        <div class="chart-legend text-center">
            <h3>{{ legend }}</h3>
        </div>
        <div :id="id"></div>
    </div>
</template>

<script>
    import { splineMaker } from "@/helpers/charts";

    export default {
        props: ['id', 'legend', 'title', 'data'],
        data() {
            return {
                graph: null
            }
        },
        created() {
            this.$bus.$on('update-spline-' + this.id, data => {
                splineMaker.addPoint(data);
            });
        },
        mounted() {
            splineMaker.create({
                id: this.id,
                title: this.title,
                data: this.data
            })
        }
    }
</script>