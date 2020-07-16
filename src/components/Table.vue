<template>
    <table class="table table-sm table-borderless" v-if="type === 'vertical'">
        <tr v-for="(content, key) in vertical" :key="key">
            <th class="w-1">{{ content.header }}</th>
            <td>{{ content.value }}</td>
        </tr>
    </table>

    <table class="table table-sm" v-else>
        <thead>
            <tr v-if="nested">
                <th v-for="(header, key) in Object.keys(data)" :key="key">{{ formatHeader(header) }}</th>
            </tr>
            <tr v-else>
                <th v-for="(header, key) in Object.keys(data[0])" :key="key">{{ formatHeader(header) }}</th>
            </tr>
        </thead>
        <tbody v-if="nested">
            <tr>
                <td v-for="(object, key) in data" :key="key">{{ object }}</td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr v-for="(object, key) in data" :key="key">
                <td v-for="(content, index) in object" :key="index">{{ content }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: 'Table',
        props: ['type', 'nested', 'data', 'sortKey', 'sortOrder'],
        methods: {
            formatHeader(header) {
                header = header.charAt(0).toUpperCase() + header.slice(1);
                return header.replace('_', ' ');
            }
        },
        computed: {
            vertical() {
                let response = [];
                let ctr = 0;
                Object.keys(this.data).forEach(key => {
                    if (typeof this.data[key] === 'number') {
                        this.data[key] = parseFloat(this.data[key]).toFixed(2);
                    }

                    // TODO provide proper generic type handling
                    if (ctr < 6) {
                        if (key === 'temp') {
                            this.data[key] = this.data[key] + '°C';
                        }
                        if(key === 'freq') {
                            this.data[key] = this.data[key] + ' MHz';
                        }
                        if(key === 'usage') {
                            this.data[key] = this.data[key] + '%';
                        }
                        if(key === 'used' || key === 'free' || key === 'total') {
                            this.data[key] = this.data[key] + ' GB';
                        }
                    }

                    response.push({
                        header: this.formatHeader(key),
                        value: this.data[key]
                    });

                    ++ctr;
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