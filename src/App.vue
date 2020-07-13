<template>
    <div id="app">
        <div class="d-flex flex-column flex-md-row align-items-center p-4 px-md-4 mb-0 mb-md-3 bg-white box-shadow">
            <h5 class="my-0 mr-md-auto font-weight-normal">RaspiMon <small class="text-muted">v0.0.1-alpha</small></h5>
            <nav class="my-2 my-md-0 mr-md-3">
                <a class="p-2 text-dark" href="#">Dashboard</a>
                <a class="p-2 text-dark" href="#">Network</a>
                <a class="p-2 text-dark" href="#">Settings</a>
            </nav>
        </div>

        <div class="container py-5 px-3" v-if="!loaded">
            <Loading></Loading>
        </div>

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
                                    <Table :type="'vertical'" :data="platform"></Table>
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
                                    <Table :type="'vertical'" :data="cpu"></Table>
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
                                    <Table :type="'vertical'" :data="disk"></Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
    </div>
</template>

<script>

    import Gauge from "./components/Gauge";
    import Table from "./components/Table";
    import Loading from "./components/Loading";

    export default {
        name: 'App',
        data() {
            return {
                platform: {
                    distro: '',
                    kernel: '',
                    uptime: ''
                },
                cpu: {
                    freq: 0,
                    temp: 0,
                    usage: 0
                },
                disk: {
                    used: 0,
                    free: 0,
                    total: 0,
                },
                disk_percent: null,
                fan: {
                    status: '',
                },
                processes: {},
                loaded: false
            }
        },
        created() {
            // TODO remove timeout (its for testing the loading animation)
            setTimeout(() => {
                this.getSystem();
            }, 3000)
        },
        methods: {
            getSystem() {
                fetch('http://api.raspberrypi.local/system').then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Could not fetch system statistics.");
                    }
                }).then(json => {
                    if (json.data) {
                        let metric = json.data;
                        ['platform', 'cpu', 'disk'].forEach(key => {
                            if (typeof this[key] === 'undefined' || typeof metric[key] === 'undefined') {
                                throw new Error('Undefined metric in API response.');
                            }

                            Object.keys(this[key]).forEach(result => {
                                this[key][result] = metric[key][result];
                            });
                        });
                        this.disk_percent = metric.disk.percent;
                        this.processes = metric.processes;
                        this.loaded = true;
                    }
                }).catch(error => {
                    this.loaded = false;
                    console.log(error);
                });
            }
        },
        components: {
            Gauge,
            Table,
            Loading
        }
    }
</script>