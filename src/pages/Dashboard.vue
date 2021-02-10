<template>
  <div>
    <Title :title="'Dashboard'"></Title>

    <Loading :show="!loaded" :status="status" :message="message"></Loading>

    <transition name="fade">
      <div class="container" v-if="loaded">

        <Header :title="'Dashboard Overview'"></Header>

        <section id="overview" class="my-4">
          <div class="row">
            <div class="col-12 col-md-12 col-lg-6 mb-4 mb-lg-0">
              <div class="platform-header">
                <Stat :color="'bg-dark'" :title="'Platform'">
                  <template v-slot:icon>
                    <i class="fa fa-server card-icon"></i>
                  </template>
                  <template v-slot:content>
                    <strong>Distro</strong> {{ platform.distro }}<br>
                    <strong>Kernel</strong> {{ platform.kernel }}<br>
                    <strong>Uptime</strong> {{ platform.uptime }}<br>
                  </template>
                </Stat>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
              <div class="cpu-header">
                <Stat :color="'bg-success'" :title="'CPU'">
                  <template v-slot:icon>
                    <i class="fa fa-tachometer-alt card-icon"></i>
                  </template>
                  <template v-slot:content>
                    <strong>Temp</strong> {{ cpu.temp }}°C<br>
                    <strong>Usage</strong> {{ cpu.usage }}%<br>
                    <strong>Frequency</strong> {{ cpu.freq }}MHz<br>
                  </template>
                </Stat>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
              <div class="disk-header">
                <Stat :color="'bg-success'" :title="'Disk'">
                  <template v-slot:icon>
                    <i class="fa fa-hdd card-icon btt-1"></i>
                  </template>
                  <template v-slot:content>
                    <strong>Used</strong> {{ disk.used }}GB<br>
                    <strong>Free</strong> {{ disk.free }}GB<br>
                    <strong>Total</strong> {{ disk.total }}GB<br>
                  </template>
                </Stat>
              </div>
            </div>
          </div>
        </section>

        <section id="charts" class="bg-white p-4 my-4 shadow border-radius-5">
          <div class="card border-0">
            <div class="card-header bg-white text-muted">
              <i class="fa fa-tasks mr-2"></i> Statistics
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-12 col-md-6 col-lg-4 ml-auto">
                  <Gauge :title="'Temperature'" :id="'temp'" :metric="cpu.temp" :format="'{y}°C'"></Gauge>
                </div>
                <div class="col-12 col-md-6 col-lg-4 ml-auto">
                  <Gauge :title="'CPU'" :id="'cpu'" :metric="cpu.usage" :format="'{y}%'"></Gauge>
                </div>
                <div class="col-12 col-md-12 col-lg-4 ml-auto">
                  <Gauge :title="'Disk'" :id="'disk'" :metric="disk_percent" :format="'{y}%'"></Gauge>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="metrics" class="bg-white p-4 my-4 shadow border-radius-5">
          <div class="row">
            <div class="col-12">
              <div class="card border-0">
                <div class="card-header bg-white text-muted">
                  <i class="fa fa-cogs mr-2"></i> Top Processes
                </div>
                <div class="card-body">
                  <Graph :id="'processes'"
                         :title="'Top Processes'"
                         :data="processesGraphData">
                  </Graph>
                  <div class="mt-4">
                    <Table :type="'horizontal'" :data="processes"></Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script>
import {liveCpu} from '@/services/live-data';

import Stat from '@/components/common/Stat';
import Gauge from '@/components/charts/Gauge';
import Graph from '@/components/charts/Graph';
import Table from '@/components/common/Table';
import Title from '@/components/common/Title';
import Header from '@/components/common/Header';
import Loading from '@/components/common/Loading';

export default {
  data() {
    return {
      platform: {
        distro: '',
        kernel: '',
        uptime: '',
      },
      cpu: {
        temp: 0,
        freq: 0,
        usage: 0
      },
      disk: {
        used: 0,
        free: 0,
        total: 0,
      },
      disk_percent: 0,
      fan: {
        status: '',
      },
      processes: {},
      processesGraphData: [],
      loaded: false,
      status: false,
      message: '',
      liveChartExists: false
    }
  },
  created() {
    this.message = 'Retrieving system information, please wait...';
    this.getSystem();
    this.$bus.$on('api-disconnect', () => {
      this.status = 'error';
      this.message = 'Unable to connect, please wait...'
    });
    this.$bus.$on('api-reconnect', () => {
      this.status = 'success'
      this.message = 'Connection successful, reloading view...'
      this.getSystem();
    });
  },
  methods: {
    getSystem() {
      this.$api.request('/system/').then(response => {
        ['platform', 'cpu', 'disk'].forEach(key => {
          if (typeof this[key] === 'undefined' || typeof response.data[key] === 'undefined') {
            throw new Error('Undefined metric in API response.');
          }
          Object.keys(this[key]).forEach(result => {
            this[key][result] = response.data[key][result];
          });
        });
        this.disk_percent = response.data.disk.percent;
        this.processes = response.data.processes;
        this.formatProcessesDataForGraphs();
        this.liveTemp();
        this.loaded = true;
      }).catch(error => {
        this.setError(error.message);
      });
    },
    formatProcessesDataForGraphs() {
      let response = [];
      this.processes.forEach(proc => {
        response.push({
          name: proc.name,
          data: [proc.mem]
        });
      });
      this.processesGraphData = response;
    },
    liveTemp() {
      setInterval(() => {
        liveCpu.get('temp').then(temp => {
          this.cpu.temp = temp;
          this.$bus.$emit('update-gauge-temp', {value: temp, id: 'temp'})
        })
      }, 5000)
    },
    setError(message) {
      this.loaded = false;
      this.status = 'error';
      this.message = message;
    }
  },
  components: {
    Stat,
    Gauge,
    Graph,
    Title,
    Table,
    Loading,
    Header
  }
}
</script>