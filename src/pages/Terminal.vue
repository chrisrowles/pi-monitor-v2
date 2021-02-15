<template>
  <div>
    <Title :title="title"></Title>

    <div class="pt-5">
      <Header :title="'Remote SSH'"></Header>

      <section id="overview" class="my-4">
        <div class="row">
          <div class="col-12">
            <div class="cpu-header">
              <Stat :color="'bg-dark'" :title="'Connected Host'">
                <template v-slot:icon>
                  <i class="fa fa-tachometer-alt card-icon"></i>
                </template>
                <template v-slot:content>
                  <strong>User</strong> {{ username }}<br>
                  <strong>Hostname</strong> {{ hostname }}<br>
                </template>
              </Stat>
            </div>
          </div>
        </div>
      </section>

      <div v-if="!xterm_active">
        <section class="bg-white p-4 my-4 shadow border-radius-5">
          <div class="card border-0">
            <div class="card-header bg-white text-muted">
              <i class="fa fa-cogs mr-2"></i> Configure Connection
            </div>
            <div class="card-body">
              <form v-on:submit.prevent="connect" id="connect" action="" type="post" enctype="multipart/form-data">
                <div class="form-group row">
                  <div class="col-6">
                    <label for="hostname">Hostname</label>
                    <input id="hostname" class="form-control" type="text" name="hostname" v-model="hostname">
                  </div>
                  <div class="col-6">
                    <label for="port">Port</label>
                    <input id="port" class="form-control" type="text" name="port" v-model="port">
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-6">
                    <label for="username">Username</label>
                    <input id="username" class="form-control" type="text" name="username" v-model="username">
                  </div>
                  <div class="col-6">
                    <label for="privatekey">Private Key</label>
                    <input id="privatekey" class="form-control file-control" type="file" name="privatekey"
                           @change="attach_private_key">
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-6">
                    <label for="password">Password</label>
                    <input id="password" class="form-control" type="password" name="password" placeholder=""
                           v-model="password">
                  </div>
                </div>
                <div class="form-group row mt-3">
                  <div class="col-md-12">
                    <button type="submit" class="btn btn-success btn-connect">Connect
                      <i v-if="submitting" class="fa fa-spinner fa-spin ml-2"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      <section class="my-4" v-if="xterm_active">
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow">
              <div class="card-body bg-black border-radius-5">
                <div id="terminal"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Stat from "@/components/common/Stat";
import Title from '@/components/common/Title';
import Header from '@/components/common/Header';

import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';

export default {
  data() {
    return {
      title: 'Remote SSH',

      url: '',
      data: null,
      submitting: false,

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
    attach_private_key(e) {
      let files = e.target.files || e.dataTransfer.files;
      this.private_key = files[0];
    },
    connect() {
      this.submitting = true;
      this.xterm_active = true;
      this.title = this.username + '@' + this.hostname;

      this.url = process.env.VUE_APP_WS_URL;
      this.data = new FormData();
      this.data.append('hostname', this.hostname);
      this.data.append('port', this.port);
      this.data.append('username', this.username);
      this.data.append('password', this.password);
      this.data.append('privatekey', this.private_key);

      if (this.private_key && this.private_key.size > 16384) {
        this.message = 'Key size exceeds maximum value.';
      }

      fetch(this.url, {
        mode: 'cors',
        credentials: 'same-origin',
        method: 'POST',
        body: this.data
      }).then(response => {
        this.submitting = false;
        if (!response.ok) {
          throw new Error('Could not connect.')
        }

        return response.json();
      }).then(data => {
        this.process(data);
      }).catch(error => {
        console.log(error);
      });
    },
    process(msg) {
      const ws_url = process.env.VUE_APP_WS_CONN_URL + msg.id;
      const websocket = new WebSocket(ws_url);

      const terminal = document.getElementById('terminal');
      const xterm = new Terminal({cursorBlink: true});
      const xdisplay = new FitAddon();
      xterm.loadAddon(xdisplay);

      xterm.onData(data => {
        websocket.send(data)
      });

      websocket.onopen = () => {
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
        this.title = 'Remote SSH';
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
    Header,
    Title,
    Stat
  }
}
</script>