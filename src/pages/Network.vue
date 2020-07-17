<template>
    <div>
        <Title :title="'Network | RaspiMon - A Lightweight Monitor for the Raspberry Pi'"></Title>

        <Loading :show="!loaded" :status="status" :message="message"></Loading>

        <transition name="fade">
            <div class="container" v-if="loaded">

                <Header :title="'Network Overview'"></Header>

                <section id="overview" class="my-4">
                    <div class="row">
                        <div class="col-12 col-md-12 col-lg-4 mb-4 mb-lg-0">
                            <div class="card border-0 bg-dark shadow">
                                <div class="card-header bg-dark border-0 text-white d-flex justify-content-between align-items-center w-100">
                                    <strong>Wireless Network</strong>
                                    <i class="fa fa-wifi card-icon"></i>
                                </div>
                                <div class="card-body bg-dark border-radius-5 text-white">
                                    <strong>{{ details.name }}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
                            <div class="card bg-dark border-0 shadow" :class="downloadClass">
                                <div :class="downloadClass" class="card-header border-0 text-white d-flex justify-content-between align-items-center w-100">
                                    <strong>Download Speed</strong>
                                    <i class="fa fa-arrow-circle-down card-icon"></i>
                                </div>
                                <div :class="downloadClass" class="card-body border-radius-5 text-white">
                                    <i class="fa fa-arrow-circle-down"></i> <strong>{{ speed.download }}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
                            <div class="card bg-dark border-0 shadow" :class="uploadClass">
                                <div :class="uploadClass" class="card-header border-0 text-white d-flex justify-content-between align-items-center w-100">
                                    <strong>Upload Speed</strong>
                                    <i class="fa fa-arrow-circle-up card-icon"></i>
                                </div>
                                <div :class="uploadClass" class="card-body border-radius-5 text-white">
                                    <i class="fa fa-arrow-circle-up"></i> <strong>{{ speed.upload }}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="interface-wlan0" class="bg-white p-4 my-4 shadow border-radius-5" v-if="interfaces.wlan0.mb_received > 0">
                    <div class="row">
                        <div class="col-12">
                            <div class="card border-0 bg-white h-100">
                                <div class="card-header bg-white">
                                    <strong class="text-muted">Interface wlan0</strong>
                                </div>
                                <div class="card-body">
                                    <Graph :id="'wlan0'"
                                           :title="'Interface wlan0'"
                                           :data="interfacesGraphData.wlan0">
                                    </Graph>
                                    <div class="mt-4">
                                        <Table :type="'horizontal'" :data="interfaces.wlan0" :nested="true"></Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="interface-eth0" class="bg-white p-4 my-4 shadow border-radius-5" v-if="interfaces.eth0.mb_received > 0">
                    <div class="row">
                        <div class="col-12">
                            <div class="card border-0 bg-white h-100">
                                <div class="card-header bg-white">
                                    <strong class="text-muted">Interface eth0</strong>
                                </div>
                                <div class="card-body">
                                    <Graph :id="'eth0'"
                                           :title="'Interface wlan0'"
                                           :data="interfacesGraphData.eth0">
                                    </Graph>
                                    <div class="mt-4">
                                        <Table :type="'horizontal'" :data="interfaces.eth0" :nested="true"></Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="interface-lo" class="bg-white p-4 my-4 shadow border-radius-5" v-if="interfaces.lo.mb_received > 0">
                    <div class="row">
                        <div class="col-12">
                            <div class="card border-0 bg-white h-100">
                                <div class="card-header bg-white">
                                    <strong class="text-muted">Interface lo</strong>
                                </div>
                                <div class="card-body">
                                    <Graph :id="'lo'"
                                           :title="'Interface lo'"
                                           :data="interfacesGraphData.lo">
                                    </Graph>
                                    <div class="mt-4">
                                        <Table :type="'horizontal'" :data="interfaces.lo" :nested="true"></Table>
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
    import Graph from "@/components/charts/Graph";
    import Table from "@/components/common/Table";
    import Title from "@/components/common/Title";
    import Loading from "@/components/common/Loading";
    import Header from "@/components/common/Header";

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
                    download: 'Loading...',
                    upload: 'Loading...'
                },

                interfacesGraphData: {
                    wlan0: [],
                    eth0: [],
                    lo: [],
                },

                loaded: false,
                status: false,
                message: '',
            }
        },
        created() {
            this.message = 'Retrieving wifi information and running speed test, please wait...';
            this.getNetworkInterfaces();
            this.getNetworkWifi();
        },
        mounted() {
            this.runNetworkWifiSpeedTest();
        },
        methods: {
            getNetworkInterfaces() {
                const url = 'http://rowles.ddns.net:8888/network';
                fetch(url).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('ERROR: (' + response.status + ') could not fetch network data.');
                    }
                }).then(json => {
                    if (json.data) {
                        Object.keys(this.interfaces).forEach(inet => {
                            Object.keys(this.interfaces[inet]).forEach(metric => {
                                this.interfaces[inet][metric] = Math.round(parseInt(json.data.interfaces[inet][metric]))
                            })
                        });

                        this.formatInterfaceGraphData('wlan0');
                        this.formatInterfaceGraphData('eth0');
                        this.formatInterfaceGraphData('lo');
                    } else {
                        throw new Error('Oh shit.')
                    }
                }).catch(error => {
                    this.loaded = false;
                    this.status = 'error';
                    this.message = error.message;
                });
            },
            getNetworkWifi() {
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
                        Object.keys(this.details).forEach(key => {
                            this.details[key] = json.data[key];
                        });
                        this.loaded = true;
                    } else {
                        throw new Error('Oh shit.')
                    }
                }).catch(error => {
                    this.loaded = false;
                    this.status = 'error';
                    this.message = error.message;
                });
            },
            runNetworkWifiSpeedTest() {
                const url = 'http://rowles.ddns.net:8888/network/wifi/speed';
                fetch(url).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('ERROR: (' + response.status + ') could not run speed test.');
                    }
                }).then(json => {
                    if (json.data) {
                        Object.keys(this.speed).forEach(key => {
                            this.speed[key] = json.data[key];
                        });
                    } else {
                        throw new Error('Oh shit.')
                    }
                }).catch(() => {
                    this.speed.download = 'Error.';
                    this.speed.upload = 'Error.';
                });
            },
            formatInterfaceGraphData(inet) {
                let response = [];
                Object.keys(this.interfaces[inet]).forEach(key => {
                    if (key === 'mb_sent' || key === 'mb_received') {
                        response.push({
                            name: key,
                            data: [this.interfaces[inet][key]]
                        });
                    }
                })
                this.interfacesGraphData[inet] = response;
            }
        },
        computed: {
            downloadClass() {
                if (this.speed.download >= 10) {
                    return 'bg-success'
                } else if (this.speed.download < 10 &&  this.speed.download >= 5) {
                    return 'bg-warning'
                }  else {
                    return 'bg-dark'
                }
            },
            uploadClass() {
                if (this.speed.upload >= 5) {
                    return 'bg-success'
                } else if (this.speed.upload < 2 && this.speed.upload >= 1) {
                    return 'bg-warning'
                } else {
                    return 'bg-dark'
                }
            },
        },
        components: {
            Graph,
            Table,
            Title,
            Loading,
            Header
        }
    }
</script>