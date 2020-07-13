<template>
    <table class="table table-sm table-borderless" v-if="type === 'vertical'">
        <tr v-for="(content, key) in vertical" :key="key">
            <th class="w-1">{{ content.header }}</th>
            <td>{{ content.value }}</td>
        </tr>
    </table>

    <table class="table table-sm" v-else>
        <thead>
            <tr><th v-for="(header, key) in Object.keys(data[0])" :key="key">{{ formatHeader(header) }}</th></tr>
        </thead>
        <tbody>
            <tr v-for="(object, key) in data" :key="key">
                <td v-for="(content, index) in object" :key="index">{{ content }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: 'Table',
        props: ['type', 'data', 'sortKey', 'sortOrder'],
        methods: {
            formatHeader(header) {
                return header.charAt(0).toUpperCase() + header.slice(1);

            }
        },
        computed: {
            vertical() {
                let response = [];
                Object.keys(this.data).forEach(key => {
                    if (typeof this.data[key] === 'number') {
                        this.data[key] = parseFloat(this.data[key]).toFixed(2);
                    }
                    response.push({
                        header: this.formatHeader(key),
                        value: this.data[key]
                    });
                });
                return this.$_.orderBy(response, this.sortKey, this.sortOrder);
            }
        }
    }
</script>

<style scoped>
    .w-1 {
        width: 1px;
    }
</style>