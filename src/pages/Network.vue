<template>
    <div>
        <Title :title="'Network | RaspiMon - A Lightweight Monitor for the Raspberry Pi'"></Title>

        <Loading :show="!loaded" :status="status" :message="message"></Loading>

        <transition name="fade">
            <div class="container py-5 px-3" v-if="loaded">
                <div class="row">
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="card border-0 bg-white h-100">
                            <div class="card-header bg-white">
                                <strong class="text-muted">Wireless</strong>
                            </div>
                            <div class="card-body">
                                <Table :type="'vertical'" :data="details"></Table>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="card border-0 bg-white h-100">
                            <Gauge :id="'download'" :metric="speed.download" :format="'{y} Mb/s ↓'"></Gauge>
                        </div>
                    </div>
                    <div class="col-12 col-md-12 col-lg-4">
                        <div class="card border-0 bg-white h-100">
                            <Gauge :id="'upload'" :metric="speed.upload" :format="'{y} Mb/s ↑'"></Gauge>
                        </div>
                    </div>
                </div>

                <section id="interfaces">
                    <div class="row">
                        <div class="col-12">
                            <div class="card border-0 bg-white h-100">
                                <div class="card-header bg-white">
                                    <strong class="text-muted">Interface wlan0</strong>
                                </div>
                                <div class="card-body">
                                    <Table :type="'horizontal'" :data="this.interfaces.wlan0" :nested="true"></Table>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card border-0 bg-white h-100">
                                <div class="card-header bg-white">
                                    <strong class="text-muted">Interface eth0</strong>
                                </div>
                                <div class="card-body">
                                    <Table :type="'horizontal'" :data="this.interfaces.eth0" :nested="true"></Table>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card border-0 bg-white h-100">
                                <div class="card-header bg-white">
                                    <strong class="text-muted">Interface lo</strong>
                                </div>
                                <div class="card-body">
                                    <Table :type="'horizontal'" :data="this.interfaces.lo" :nested="true"></Table>
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

    export default {
        data() {
            return {
                interfaces: {
                    eth0: {
                        mb_sent: 0,
                        mb_received: 0,
                        pk_sent: 0,
                        pk_received: 0,
                        error_in: 0,
                        error_out: 0,
                        dropout: 0
                    },
                    wlan0: {
                        mb_sent: 0,
                        mb_received: 0,
                        pk_sent: 0,
                        pk_received: 0,
                        error_in: 0,
                        error_out: 0,
                        dropout: 0
                    },
                    lo: {
                        mb_sent: 0,
                        mb_received: 0,
                        pk_sent: 0,
                        pk_received: 0,
                        error_in: 0,
                        error_out: 0,
                        dropout: 0
                    }
                },
                connections: {
                    ssh: []
                },
                details: {
                    name: '',
                    quality: '',
                    channel: '',
                    encryption: '',
                    address: '',
                    signal: ''
                },
                speed: {
                    ping: 0,
                    download: 0,
                    upload: 0
                },
                loaded: false,
                status: false,
                message: '',
            }
        },
        created() {
            this.message = 'Retrieving wifi information and running speed test, please wait...';
            this.getWifi();
            this.getInet();
        },
        methods: {
            getInet() {
                const url = 'http://rowles.ddns.net:8888/network';
                fetch(url).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('ERROR: (' + response.status + ') could not fetch network data.');
                    }
                }).then(json => {
                    if (json) {
                        Object.keys(this.interfaces).forEach(inet => {
                            Object.keys(this.interfaces[inet]).forEach(metric => {
                                this.interfaces[inet][metric] = Math.round(parseInt(json.interfaces[inet][metric]))
                            })
                        });
                    } else {
                        throw new Error('Oh shit.')
                    }
                }).catch(error => {
                    this.loaded = false;
                    this.status = 'error';
                    this.message = error.message;
                });
            },
            getWifi() {
                const url = 'http://rowles.ddns.net:8888/network/wifi';
                fetch(url).then(response => {
                    if (response.ok) {
                        this.message = 'Data successfully received, initialising network view...';
                        return response.json();
                    } else {
                        throw new Error('ERROR: (' + response.status + ') could not fetch system statistics.');
                    }
                }).then(json => {
                    if (json.data) {
                        ['details', 'speed'].forEach(key => {
                            Object.keys(this[key]).forEach(result => {
                                this[key][result] = json.data[key][result];
                            });
                        });
                        this.loaded = true;
                    } else {
                        this.loaded = false;
                        throw new Error('Oh shit.')
                    }
                }).catch(error => {
                    this.loaded = false;
                    this.status = 'error';
                    this.message = error.message;
                });
            }
        },
        components: {
            Gauge,
            Table,
            Title,
            Loading
        }
    }
</script>