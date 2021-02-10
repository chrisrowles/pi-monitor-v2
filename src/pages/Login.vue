<template>
  <div>
    <Title :title="'Login'"></Title>

    <div class="container">
      <div id="login" class="card shadow my-4">
        <div class="card-header">
          <Header :title="'Login'"></Header>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-12">
              <form v-on:submit.prevent="login" method="POST">
                <div class="form-group">
                  <label for="email-address">Email address</label>
                  <input v-model="email" type="email" class="form-control" id="email-address" placeholder="Enter email">
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </form>
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

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  created() {
    if (localStorage.getItem('auth')) {
      this.$router.push({name: 'dashboard'})
    }
    this.$bus.$on('post-login', () => this.$router.push('dashboard').catch(() => {}))
  },
  methods: {
    login() {
      this.$api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({email: this.email, password: this.password})
      }).then(response => {
        localStorage.setItem('auth', response.Authorization)
        this.$bus.$emit('post-login');
      })
    }
  },
  components: {
    Title,
    Header
  }
}
</script>
