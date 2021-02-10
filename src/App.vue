<template>
  <div id="app">
    <div class="d-flex flex-column flex-md-row align-items-center p-4 px-md-4 mb-0 mb-md-3 bg-white box-shadow">
      <h5 class="my-0 mr-md-auto font-weight-normal">{{ name }}</h5>
      <nav class="my-2 my-md-0 mr-md-3" id="nav">
        <div v-if="$store.getters.isAuthorized">
          <router-link :to="{name: 'dashboard'}" class="p-2">Dashboard</router-link>
          <router-link :to="{name: 'network'}" class="p-2">Network</router-link>
          <a v-on:click="logout" href="#" class="p-2">Logout</a>
        </div>
        <div v-else>
          <router-link :to="{name: 'login'}" class="p-2">Login</router-link>
        </div>
      </nav>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  props: ['name'],
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' }).catch(() => {});
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