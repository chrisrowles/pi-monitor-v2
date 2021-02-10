<template>
  <table class="table table-sm table-borderless table-responsive" v-if="type === 'vertical'">
    <tr v-for="(content, key) in vertical" :key="key">
      <th class="w-1">{{ content.header }}</th>
      <td>{{ content.value }}</td>
    </tr>
  </table>

  <table class="table table-sm table-responsive-sm" v-else>
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
import _ from 'lodash';

export default {
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
      Object.keys(this.data).forEach(key => {
        if (typeof this.data[key] === 'number') {
          this.data[key] = parseFloat(this.data[key]).toFixed(2);
        }

        response.push({
          header: this.formatHeader(key),
          value: this.data[key]
        });
      });
      return _.orderBy(response, this.sortKey, this.sortOrder);
    }
  }
}
</script>

<style scoped>
.w-1 {
  width: 1px;
}
</style>