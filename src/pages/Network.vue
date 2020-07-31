<template>
    <div>
        <Title :title="'Network'"></Title>

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
                                    <i v-if="speedTestCompleted" class="fa fa-arrow-circle-down mr-2"></i>
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
                                    <i v-if="speedTestCompleted" class="fa fa-arrow-circle-up mr-2"></i>
                                    <strong>{{ speed.upload }}</strong>
                                </template>
                            </Stat>
                        </div>
                    </div>
                </section>

                <div v-for="(idx, inet) in interfaces" :key="inet">
                    <section class="bg-white p-4 my-4 shadow border-radius-5"
                             v-if="typeof interfaces[inet] !== 'undefined' && interfaces[inet].mb_received > 0">
                        <div class="row">
                            <div class="col-12">
                                <div class="card border-0 bg-white h-100">
                                    <div class="card-header bg-white text-muted">
                                        <i class="fa fa-broadcast-tower mr-2"></i> Interface {{ inet }}
                                    </div>
                                    <div class="card-body">
                                        <Graph :id="inet"
                                               :title="'Interface ' + inet"
                                               :data="interfacesGraphData[inet]">
                                        </Graph>
                                        <div class="mt-4">
                                            <Table :type="'horizontal'" :data="interfaces[inet]" :nested="true"></Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import util from "../components/utils";
    import Stat from '@/components/common/Stat';
    import Graph from '@/components/charts/Graph';
    import Table from '@/components/common/Table';
    import Title from '@/components/common/Title';
    import Loading from '@/components/common/Loading';
    import Header from '@/components/common/Header';

    export default {
        data() {
            return {
                interfaces: {},
                interfacesGraphData: {},
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
                speedTestCompleted: false,
                loaded: false,
                status: false,
                message: '',
            }
        },
        created() {
            this.message = 'Retrieving network information, please wait...';
            this.getNetwork();
            this.$bus.$on('api-disconnect', () => {
                this.status = 'error';
                this.message = 'Unable to connect, please try again.';
            });
            this.$bus.$on('api-reconnect', () => {
                this.status = 'success';
                this.message = 'Connection successful, reloading view...';
                this.getNetwork();
            });
        },
        methods: {
            getNetwork() {
                this.setNetworkInterfaces();
                this.$on('interfaces-retrieved', () => this.getNetworkInformation());
                this.$on('information-retrieved', () => this.getNetworkWifi());
            },
            setNetworkInterfaces() {
                this.$api.get('/network/interfaces').then(response => {
                    if (typeof response === 'undefined' || response.length === 0) {
                        throw new Error('Unable to fetch network interfaces.');
                    }
                    response.forEach(inet => {
                        this.interfaces[inet] = {
                            mb_sent: 0,
                            mb_received: 0,
                            pk_sent: 0,
                            pk_received: 0,
                            error_in: 0,
                            error_out: 0,
                            dropout: 0
                        };
                        this.interfacesGraphData[inet] = [];
                    });
                    this.$emit('interfaces-retrieved');
                }).catch(error => {
                    this.setError(error.message);
                });
            },
            getNetworkInformation() {
                this.$api.get('/network/').then(response => {
                    Object.keys(this.interfaces).forEach(inet => {
                        Object.keys(this.interfaces[inet]).forEach(metric => {
                            this.interfaces[inet][metric] = Math.round(parseInt(response.data.interfaces[inet][metric]))
                        });
                        this.formatInterfaceGraphData(inet)
                    });
                    this.$emit('information-retrieved');
                }).catch(error => {
                    this.setError(error.message);
                });
            },
            getNetworkWifi() {
                this.$api.get('/network/wifi').then(response => {
                    Object.keys(this.details).forEach(key => {
                        this.details[key] = response.data[key];
                    });
                    this.runNetworkWifiSpeedTest();
                    this.loaded = true;
                }).catch(error => {
                    this.setError(error.message);
                });
            },
            runNetworkWifiSpeedTest() {
                let progress = {}
                Object.keys(this.speed).forEach(key => {
                    progress[key] = this.progress(key)
                })
                this.$api.get('/network/wifi/speed').then(response => {
                    this.speedTestCompleted = true;
                    Object.keys(this.speed).forEach(key => {
                        clearInterval(progress[key]);
                        this.speed[key] = response.data[key];
                    });
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
            },
            setError(message) {
                this.loaded = false;
                this.status = 'error';
                this.message = message;
            }
        },
        computed: {
            downloadClass() {
                return util.computeDisplayClass(this.speed.download, {min: 0, mid: 5, max: 10});
            },
            uploadClass() {
                return util.computeDisplayClass(this.speed.upload, {min: 0, mid: 3, max: 5});
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