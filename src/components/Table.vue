<template>
    <table class="table table-sm table-borderless" v-if="type === 'vertical'">
        <tr v-for="(metric, key) in data" :key="key">
            <th class="w-1">{{ metric.header }}</th>
            <td>{{ metric.value }}</td>
        </tr>
    </table>
</template>

<script>
    export default {
        props: ['type', 'data']
    }
</script>

<style scoped>
    .w-1 {
        width: 1px;
    }
</style>