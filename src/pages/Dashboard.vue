<template>
    <div id="app">
        <Title :title="'Dashboard | RaspiMon - A Lightweight Monitor for the Raspberry Pi'"></Title>
        <div class="d-flex flex-column flex-md-row align-items-center p-4 px-md-4 mb-0 mb-md-3 bg-white box-shadow">
            <h5 class="my-0 mr-md-auto font-weight-normal">RaspiMon <small class="text-muted">v0.0.1-alpha</small></h5>
            <nav class="my-2 my-md-0 mr-md-3">
                <!--                <a class="p-2 text-dark" href="#">Dashboard</a>-->
                <!--                <a class="p-2 text-dark" href="#">Network</a>-->
                <!--                <a class="p-2 text-dark" href="#">Settings</a>-->
            </nav>
        </div>

        <Loading :show="!loaded" :status="status" :message="message"></Loading>

        <transition name="fade">
            <div class="container py-5 px-3" v-if="loaded">
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

                <section id="overview">
                    <div class="row">
                        <div class="col-12 col-md-12 col-lg-5">
                            <div class="overview-header">
                                <div class="card border-0">
                                    <div class="card-header bg-white text-muted">
                                        <strong>Overview</strong>
                                    </div>
                                    <div class="card-body">
                                        <Table :type="'vertical'" :data="platform" :sort-key="'header'"
                                               :sort-order="'asc'"></Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3">
                            <div class="cpu-header">
                                <div class="card border-0">
                                    <div class="card-header bg-white text-muted">
                                        <strong>CPU</strong>
                                    </div>
                                    <div class="card-body">
                                        <Table :type="'vertical'" :data="cpu" :sort-key="'header'"
                                               :sort-order="'desc'"></Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="disk-header">
                                <div class="card border-0">
                                    <div class="card-header bg-white text-muted">
                                        <strong>Disk</strong>
                                    </div>
                                    <div class="card-body">
                                        <Table :type="'vertical'" :data="disk" :sort-key="'header'"
                                               :sort-order="'desc'"></Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="network">
                    <Network></Network>
                </section>

                <section id="metrics">
                    <div class="row">
                        <div class="col-12">
                            <div class="card border-0">
                                <div class="card-header bg-white text-muted">
                                    <strong>Top Processes</strong>
                                </div>
                                <div class="card-body">
                                    <Table :type="'horizontal'" :data="processes"></Table>
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
    import Gauge from "../components/Gauge";
    import Table from "../components/Table";
    import Title from "../components/Title";
    import Loading from "../components/Loading";
    import Network from "./Network";

    export default {
        name: 'Dashboard',
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

                loaded: false,
                status: false,
                message: '',

                connectionAttempt: 0
            }
        },
        created() {
            this.message = 'Retrieving data from API, please wait...';
            this.getSystem();
        },
        methods: {
            getSystem() {
                ++this.connectionAttempt;

                const url = 'http://rowles.ddns.net:8888/system/';
                fetch(url).then(response => {
                    if (response.ok) {
                        this.message = 'Data successfully retrieved, initialising dashboard...';
                        return response.json();
                    } else {
                        throw new Error('ERROR: (' + response.status + ') could not fetch system statistics.');
                    }
                }).then(json => {
                    if (json.data) {
                        setTimeout(() => {
                            ['platform', 'cpu', 'disk'].forEach(key => {
                                if (typeof this[key] === 'undefined' || typeof json.data[key] === 'undefined') {
                                    throw new Error('Undefined metric in API response.');
                                }

                                Object.keys(this[key]).forEach(result => {
                                    this[key][result] = json.data[key][result];
                                });
                            });
                            this.disk_percent = json.data.disk.percent;
                            this.processes = json.data.processes;
                            this.loaded = true;
                        }, 1000);
                    } else {
                        throw new Error('Oh shit.')
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
            }
        },
        components: {
            Gauge,
            Title,
            Table,
            Loading,
            Network
        }
    }
</script>