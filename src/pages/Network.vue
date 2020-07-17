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
                            <Stat :color="'bg-dark'" :title="'Wireless Network'">
                                <template v-slot:icon>
                                    <i class="fa fa-wifi card-icon"></i>
                                </template>
                                <template v-slot:content>
                                    <strong>{{ details.name }}</strong>
                                </template>
                            </Stat>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
                            <Stat :color="downloadClass" :title="'Download Speed'">
                                <template v-slot:icon>
                                    <i class="fa fa-arrow-circle-down card-icon"></i>
                                </template>
                                <template v-slot:content>
                                    <i v-if="speedTestStatus" class="fa fa-arrow-circle-down mr-2"></i>
                                    <strong>{{ speed.download }}</strong>
                                </template>
                            </Stat>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
                            <Stat :color="uploadClass" :title="'Download Speed'">
                                <template v-slot:icon>
                                    <i class="fa fa-arrow-circle-up card-icon"></i>
                                </template>
                                <template v-slot:content>
                                    <i v-if="speedTestStatus" class="fa fa-arrow-circle-up mr-2"></i>
                                    <strong>{{ speed.upload }}</strong>
                                </template>
                            </Stat>
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
    import api from '../api';
    import bus from '../services/bus';

    import Stat from '@/components/common/Stat';
    import Graph from '@/components/charts/Graph';
    import Table from '@/components/common/Table';
    import Title from '@/components/common/Title';
    import Loading from '@/components/common/Loading';
    import Header from '@/components/common/Header';

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
                    download: '',
                    upload: ''
                },
                speedTestStatus: false,

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
            this.message = 'Retrieving network information, please wait...';
            this.getNetworkInterfaces();
            this.getNetworkWifi();
            bus.$on('api-disconnect', () => {
                this.status = 'error';
                this.message = 'Unable to connect, please try again.'
            });
        },
        mounted() {
            this.runNetworkWifiSpeedTest();
        },
        methods: {
            getNetworkInterfaces() {
                api.get('/network/').then(response => {
                    if (response.data) {
                        Object.keys(this.interfaces).forEach(inet => {
                            Object.keys(this.interfaces[inet]).forEach(metric => {
                                this.interfaces[inet][metric] = Math.round(parseInt(response.data.interfaces[inet][metric]))
                            });
                        });

                        this.formatInterfaceGraphData('wlan0');
                        this.formatInterfaceGraphData('eth0');
                        this.formatInterfaceGraphData('lo');
                    }
                }).catch(error => {
                    this.loaded = false;
                    this.status = 'error';
                    this.message = error.message;
                });
            },
            getNetworkWifi() {
                api.get('/network/wifi').then(response => {
                    if (response.data) {
                        Object.keys(this.details).forEach(key => {
                            this.details[key] = response.data[key];
                        });
                        this.loaded = true;
                    } else {
                        throw new Error('Oh shit.');
                    }
                }).catch(error => {
                    this.loaded = false;
                    this.status = 'error';
                    this.message = error.message;
                });
            },
            runNetworkWifiSpeedTest() {
                let progress = {}
                Object.keys(this.speed).forEach(key => {
                    progress[key] = this.progress(key)
                })

                api.get('/network/wifi/speed').then(response => {
                    this.speedTestStatus = true;
                    if (response.data) {
                        Object.keys(this.speed).forEach(key => {
                            clearInterval(progress[key]);
                            this.speed[key] = response.data[key];
                        });
                    } else {
                        throw new Error('Oh shit.');
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
                });
                this.interfacesGraphData[inet] = response;
            },
            progress(metric) {
                let up = true;
                return setInterval(() => {
                    if (up) {
                        this.speed[metric] += ".";
                    } else {
                        this.speed[metric] = this.speed[metric].substring(1, this.speed[metric].length);
                        if (this.speed[metric] === ".") {
                            up = true;
                        }
                    }
                    if (this.speed[metric].length > 6) {
                        up = false;
                    }
                }, 100)
            }
        },
        computed: {
            downloadClass() {
                if (this.speed.download >= 10) {
                    return 'bg-success';
                } else if (this.speed.download < 10 &&  this.speed.download >= 5) {
                    return 'bg-warning';
                } else if (this.speed.download < 3.5 && this.speed.download > 0) {
                    return 'bg-danger';
                } else {
                    return 'bg-dark';
                }
            },
            uploadClass() {
                if (this.speed.upload >= 5) {
                    return 'bg-success';
                } else if (this.speed.upload < 3 && this.speed.upload >= 2) {
                    return 'bg-warning';
                } else if (this.speed.upload < 2 && this.speed.upload > 0) {
                    return 'bg-danger';
                } else {
                    return 'bg-dark';
                }
            },
        },
        components: {
            Stat,
            Graph,
            Table,
            Title,
            Loading,
            Header
        }
    }
</script>