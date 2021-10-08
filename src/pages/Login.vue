<template>
  <div class="container d-flex h-100 justify-content-around">
    <PageTitle title="Login"></PageTitle>
    <div class="row align-self-center w-100">
      <div class="col-12 offset-0 col-md-6 offset-md-3">
        <div id="login" class="card shadow border-0">
          <div class="card-header login">
            <MainHeader title="Login"></MainHeader>
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
                  <button type="submit" class="btn login" v-bind:disabled="submitting">
                    Submit <span v-if="submitting"><i class="fas fa-spinner fa-spin ml-2"></i></span>
                  </button>
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
import PageTitle from '@/components/common/PageTitle';
import MainHeader from '@/components/common/MainHeader';

import notify from '@/helpers/notify';

export default {
  data() {
    return {
      email: '',
      password: '',
      submitting: false,
    }
  },
  methods: {
    login() {
      this.submitting = true;
      let credentials = {
        email: this.email,
        password: this.password
      };

      this.$store.dispatch('login', credentials)
          .then(response => {
            this.submitting = false;
            this.verify(response);
          })
          .catch(error => {
            this.submitting = false;
            notify.send('error', error)
          });
    },
    verify(user) {
      this.$store.dispatch('verify', user.Authorization)
          .then(() => {
            this.$router.push({ name: 'dashboard'})
          })
          .catch(error => {
            notify.send('error', error)
          });
    }
  },
  components: {
    PageTitle,
    MainHeader
  }
}
</script>