<template>
  <div id="app" class="h-100" :class="{'login-overlay': $route.name === 'login'}">
    <nav v-if="$store.getters.isAuthorized" class="navbar navbar-expand-lg navbar-light bg-light">
      <a href="#" class="navbar-brand">{{ name }}</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse"
              data-target="#main-navbar"
              aria-controls="main-navbar"
              aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="main-navbar">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link :to="{name: 'dashboard'}" class="nav-link">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'network'}" class="nav-link">Network</router-link>
          </li>
          <li class="nav-item">
            <a v-on:click="logout" href="#" class="nav-link">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  props: ['name'],
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' }).catch((e) => {
        console.log(e);
      });
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