<template>
    <div v-if="loaded">
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
    </div>
</template>

<script>
    import Gauge from "../components/Gauge";
    import Table from "../components/Table";

    export default {
        data() {
            return {
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
                loaded: false
            }
        },
        mounted() {
            this.getWifi();
        },
        methods: {
            getWifi() {
                const url = 'http://rowles.ddns.net:8888/network/wifi';
                fetch(url).then(response => {
                    if (response.ok) {
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
                    console.log(error)
                });
            }
        },
        components: {
            Gauge,
            Table
        }
    }
</script>