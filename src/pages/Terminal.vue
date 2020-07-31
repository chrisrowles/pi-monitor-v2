<template>
    <div>
        <div class="container">

            <Header :title="'Remote SSH'"></Header>

            <div v-if="!xterm_active">
                <section class="bg-white p-4 my-4 shadow border-radius-5">
                    <div class="card border-0">
                        <div class="card-header bg-white text-muted">
                            <i class="fa fa-cogs mr-2"></i> Configure Connection
                        </div>
                        <div class="card-body">
                            <form v-on:submit.prevent="connect" id="connect" action="http://127.0.0.1:3400" type="post" enctype="multipart/form-data">
                                <div class="form-group row">
                                    <div class="col-6">
                                        <label for="Hostname">Hostname</label>
                                        <input class="form-control" type="text" name="hostname" v-model="hostname">
                                    </div>
                                    <div class="col-6">
                                        <label for="Port">Port</label>
                                        <input class="form-control" type="text" name="port" v-model="port">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-6">
                                        <label for="Username">Username</label>
                                        <input class="form-control" type="text" name="username" v-model="username">
                                    </div>
                                    <div class="col-6">
                                        <label for="Username">Private Key</label>
                                        <input class="form-control file-control" type="file" name="privatekey" value="">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-6">
                                        <label for="Password">Password</label>
                                        <input class="form-control" type="password" name="password" placeholder=""  v-model="password">
                                    </div>
                                </div>
                                {% module xsrf_form_html() %}
                                <div class="form-group row mt-3">
                                    <div class="col-md-12">
                                        <button type="submit" class="btn btn-success btn-connect">Connect 
                                            <span class="loading"><i class="fa fa-spinner fa-spin ml-2"></i></span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>

            <div class="row">
                <div class="col-12">
                    <div id="terminal"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/common/Header';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import axios from 'axios';

export default {
    data() {
        return {
            url: '',
            data: null,

            hostname: '',
            port: '22',
            username: '',
            password: '',
            private_key: null,

            xterm_active: false,
            message: '',
        }
    },
    methods: {
        connect(e) {
            this.url = e.target.action;
            this.data = new FormData();
            this.data.append('hostname', this.hostname);
            this.data.append('port', this.port);
            this.data.append('username', this.username);
            this.data.append('password', this.password);

            if (this.private_key && this.private_key.size > 16384) {
                this.message = 'Key size exceeds maximum value.';
            }
    
            axios({
                method: 'POST',
                headers: {
                    "Cache-Control": "no-cache",
                    'Access-Control-Allow-Origin': '*',
                },
                url: this.url,
                data: this.data
            }).then(response => {
                console.log(response);
                this.process(response.data);
            }).catch(error => {
                console.log(error);
            });
        },
        process(msg) {
            const ws_url = 'ws://127.0.0.1:3400/ws?id=' + msg.id;
            const websocket = new WebSocket(ws_url);

            const terminal = document.getElementById('terminal');
            const xterm = new Terminal({ cursorBlink: true });
            const xdisplay = new FitAddon();
            xterm.loadAddon(xdisplay);

            xterm.onData(data => {
                websocket.send(data)
            });

            websocket.onopen = () => {
                this.xterm_active = true;
                xterm.open(terminal);
                this.toggle_display();
                xdisplay.fit();
            };

            websocket.onmessage = msg => {
                xterm.write(msg.data);
            }

            websocket.onclose = () => {
                this.toggle_display();
                xterm.dispose();
                this.xterm_active = false;
            };

            websocket.onerror = event => {
                console.log(event);
            }
        },
        toggle_display() {
            document.querySelector('.xterm-viewport').classList.toggle('xterm_display');
        }
    },
    components: {
        Header
    }
}
</script>