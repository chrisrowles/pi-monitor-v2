<template>
  <div id="app" class="h-100" :class="{'login-overlay': $route.name === 'login'}">
    <nav class="navbar navbar-dark py-3 bg-dark flex-md-nowrap shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">{{ this.name }}</a>
    </nav>
    <div class="container-fluid px-5">
      <div class="row">
        <main role="main" class="col-12">
          <router-view/>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import notify from '@/helpers/notify';

export default {
  props: ['name'],
  methods: {
    logout() {
      this.$store.dispatch('logout').then(response => {
        notify.send('success', response.message);
        this.$router.push({ name: 'login' }).catch(()=>{});
      }).catch(error => {
        notify.send('error', error);
      });
    }
  },
  computed: {
    columnLayout() {
      if (this.$store.getters.isAuthorized) {
        return 'col-12 col-md-10'
      } else {
        return 'col-12'
      }
    }
  }
}
</script>

<style lang="scss">
#nav {
  a {
    color: #6c757d;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>