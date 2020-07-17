<template>
    <div>
        <Title :title="'Dashboard | RaspiMon - A Lightweight Monitor for the Raspberry Pi'"></Title>

        <Loading :show="!loaded" :status="status" :message="message"></Loading>

        <transition name="fade">
            <div class="container" v-if="loaded">

                <Header :title="'Dashboard Overview'"></Header>

                <section id="overview" class="my-4">
                    <div class="row">
                        <div class="col-12 col-md-12 col-lg-6 mb-4 mb-lg-0">
                            <div class="platform-header">
                                <div class="card bg-dark border-0 shadow">
                                    <div class="card-header border-0 bg-dark text-white d-flex justify-content-between align-items-center w-100">
                                        <strong>Platform</strong>
                                        <i class="fa fa-server card-icon"></i>
                                    </div>
                                    <div class="card-body border-radius-5 bg-dark text-white">
                                        <strong>Distro</strong> {{ platform.distro }}<br>
                                        <strong>Kernel</strong> {{ platform.kernel }}<br>
                                        <strong>Uptime</strong> {{ platform.uptime }}<br>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
                            <div class="cpu-header">
                                <div class="card bg-success border-0 shadow">
                                    <div class="card-header bg-success border-0 text-white d-flex justify-content-between align-items-center w-100">
                                        <strong>CPU</strong>
                                        <i class="fa fa-tachometer-alt card-icon"></i>
                                    </div>
                                    <div class="card-body border-radius-5 bg-success text-white">
                                        <strong>Temp</strong> {{ cpu.temp }}°C<br>
                                        <strong>Usage</strong> {{ cpu.usage }}%<br>
                                        <strong>Frequency</strong> {{ cpu.freq }}MHz<br>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3">
                            <div class="disk-header">
                                <div class="card bg-success border-0 shadow">
                                    <div class="card-header bg-success border-0 text-white d-flex justify-content-between align-items-center w-100">
                                        <strong>Disk</strong>
                                        <i class="fa fa-hdd card-icon btt-1"></i>
                                    </div>
                                    <div class="card-body border-radius-5 bg-success text-white">
                                        <strong>Used</strong> {{ disk.used }}GB<br>
                                        <strong>Free</strong> {{ disk.free }}GB<br>
                                        <strong>Total</strong> {{ disk.total }}GB<br>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="charts" class="bg-white p-4 my-4 shadow border-radius-5">
                    <div class="card border-0">
                        <div class="card-header bg-white text-muted">
                            <strong>Statistics</strong>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12 col-md-6 col-lg-4 ml-auto">
                                    <Gauge :title="'Temperature'" :id="'temp'" :metric="cpu.temp"
                                           :format="'{y}°C'"></Gauge>
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

                <section id="running_processes" class="my-4 border-radius-5">
                    <div class="row">
                        <div class="col-12 col-md-12 mb-4 mb-lg-0">
                            <div class="card bg-white border-0 shadow">
                                <div class="card-header bg-white">

                                </div>
                                <div class="card-body bg-white">
                                    <Spline :id="'live_temp'" :title="'Process Usage'" :data="parseInt(cpu.temp)"></Spline>
                                </div>
                            </div>
                        </div>
<!--                        <div class="col-12 col-md-6 mb-4 mb-lg-0">-->
<!--                            <div class="card bg-white border-0 shadow">-->
<!--                                <div class="card-header bg-white">-->

<!--                                </div>-->
<!--                                <div class="card-body bg-white">-->
<!--                                    <Spline :id="'running3'" :data="parseInt(cpu.temp)"></Spline>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
                    </div>
                </section>

                <section id="metrics" class="bg-white p-4 my-4 shadow border-radius-5">
                    <div class="row">
                        <div class="col-12">
                            <div class="card border-0">
                                <div class="card-header bg-white text-muted">
                                    <strong>Top Processes</strong>
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
    import api from '../api';
    import bus from '../services/bus';

    // import liveCpu from "../services/live-data";

    import Gauge from '@/components/charts/Gauge';
    import Graph from '@/components/charts/Graph';
    import Spline from '@/components/charts/Spline';
    import Table from '@/components/common/Table';
    import Title from '@/components/common/Title';
    import Loading from '@/components/common/Loading';
    import Header from '@/components/common/Header';

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
                connectionAttempt: 0
            }
        },
        created() {
            this.message = 'Retrieving data from API, please wait...';
            this.getSystem();
            bus.$on('api-disconnect', () => {
                this.status = 'error';
                this.message = 'Unable to connect, please wait...'
            });
            bus.$on('api-reconnect', () => {
                this.status = 'success'
                this.message = 'Connection successful, reloading view...'
                this.getSystem();
            });
            // setInterval(() => {
            //     liveCpu.temp();
            // }, 10000)
        },
        methods: {
            getSystem() {
                ++this.connectionAttempt;
                api.get('/system/').then(response => {
                    if (response.data) {
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
                        this.loaded = true;
                    } else {
                        throw new Error('Oh shit.');
                    }
                }).catch(error => {
                    if (this.connectionAttempt < 3) {
                        this.getSystem();
                    } else {
                        this.loaded = false;
                        this.status = 'error';
                        this.message = error.message;
                    }
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
            }
        },
        components: {
            Gauge,
            Graph,
            Spline,
            Title,
            Table,
            Loading,
            Header
        }
    }
</script>