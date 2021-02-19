<template>
  <div class="container d-flex h-100 justify-content-around">
    <Title :title="'Login'"></Title>
    <div class="row align-self-center w-100">
      <div class="col-12 offset-0 col-md-6 offset-md-3">
        <div id="login" class="card shadow border-0">
          <div class="card-header login">
            <Header :title="'Login'"></Header>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <form v-on:submit.prevent="login" method="POST">
                  <div class="form-group">
                    <label for="email-address" class="sr-only">Email address</label>
                    <input v-model="email" type="email" class="form-control" id="email-address" placeholder="Username">
                  </div>
                  <div class="form-group">
                    <label for="password" class="sr-only">Password</label>
                    <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
                  </div>
                  <button type="submit" class="btn login">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/common/Title';
import Header from '@/components/common/Header';

import notify from '@/helpers/notify';

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login() {
      let credentials = {
        email: this.email,
        password: this.password
      };

      this.$store.dispatch('login', credentials)
          .then(response => this.verify(response))
          .catch(error => notify.send('error', error));
    },
    verify(user) {
      this.$store.dispatch('verify', user.Authorization)
          .then(() => this.$router.push({ name: 'dashboard'}))
          .catch(error => notify.send('error', error));
    }
  },
  components: {
    Title,
    Header
  }
}
</script>

<style>
input.form-control {
  border: none;
  background: transparent;
  border-bottom: 1px solid #999999;
  border-radius: 0;
  border-width: thin;
}
</style>
