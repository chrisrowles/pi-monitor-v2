<template>
    <div id="app">
        <div class="d-flex flex-column flex-md-row align-items-center p-4 px-md-4 mb-3 bg-white border-bottom box-shadow">
            <h5 class="my-0 mr-md-auto font-weight-normal">RaspiMon <small class="text-muted">v0.0.1-alpha</small></h5>
            <nav class="my-2 my-md-0 mr-md-3">
                <a class="p-2 text-dark" href="#">Dashboard</a>
                <a class="p-2 text-dark" href="#">Network</a>
                <a class="p-2 text-dark" href="#">Settings</a>
            </nav>
        </div>

        <div class="container py-5" v-if="!loaded">
            <Loading></Loading>
        </div>

        <div class="container" v-if="loaded">
            <div class="row">
                <div class="col-12 col-md-6 col-lg-4 ml-auto">
                    <Gauge :title="'Temperature'" :id="'temp'" :metric="cpu.temp" :format="'{y}°C'"></Gauge>
                </div>
                <div class="col-12 col-md-6 col-lg-4 ml-auto">
                    <Gauge :title="'CPU'" :id="'cpu'" :metric="cpu.usage" :format="'{y}%'"></Gauge>
                </div>
                <div class="col-12 col-md-12 col-lg-4 ml-auto">
                    <Gauge :title="'Disk'" :id="'disk'" :metric="disk.percent" :format="'{y}%'"></Gauge>
                </div>
            </div>

            <section id="overview">
                <div class="overview-header px-3 py-3 pt-md-4 pb-md-4 mx-auto">
                    <div class="card border-0">
                        <div class="card-header bg-white text-muted">
                            <strong>Overview</strong>
                        </div>
                        <div class="card-body">
                            <Table :type="'vertical'" :data="[
                                {header: 'Distro', value: distro},
                                {header: 'Kernel', value: kernel},
                                {header: 'Uptime', value: uptime}
                            ]"></Table>
                        </div>
                    </div>
                </div>
            </section>

            <section id="metrics">

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
                distro: '',
                kernel: '',
                uptime: '',
                cpu: {
                    freq: 0,
                    temp: 0,
                    usage: 0
                },
                disk: {
                    used: 0,
                    free: 0,
                    total: 0,
                    percent: 0,
                },
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
            }, 5000)
        },
        methods: {
            getSystem() {
                // fetch('http://api.raspberrypi.local/system').then(response => {
                //     if (response.ok) {
                //         return response.json();
                //     } else {
                //         throw new Error("Could not fetch system statistics.");
                //     }
                // }).then(json => {
                //     if (json.data) {
                //         let metric = json.data;
                //
                //         this.distro = metric.platform.distro;
                //         this.kernel = metric.platform.kernel;
                //         this.uptime = metric.uptime;
                //
                //         this.cpu.freq = metric.cpu.freq;
                //         this.cpu.temp = metric.cpu.temp;
                //         this.cpu.usage = metric.cpu.usage;
                //
                //         this.disk.used = metric.disk.used;
                //         this.disk.free = metric.disk.free;
                //         this.disk.total = metric.disk.total;
                //         this.disk.percent = metric.disk.percent;
                //
                //         this.processes = metric.processes;
                //         this.loaded = true;
                //     }
                // }).catch(error => {
                //     this.loaded = false;
                //     console.log(error);
                // })
            }
        },
        components: {
            Gauge,
            Table,
            Loading
        }
    }
</script>