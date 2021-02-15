<template>
  <div id="app" class="h-100" :class="{'login-overlay': $route.name === 'login'}">
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">{{ this.name }}</a>
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a v-on:click="logout" href="#" class="nav-link">Logout</a>
        </li>
      </ul>
    </nav>
    <div class="container-fluid h-100 pt-5 pt-md-2">
      <div class="row h-100">
        <nav v-if="$store.getters.isAuthorized" class="col-md-2 d-none d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link :to="{name: 'dashboard'}" class="nav-link">
                  <i class="fas fa-home mr-2"></i>
                  Dashboard
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{name: 'network'}" class="nav-link">
                  <i class="fas fa-broadcast-tower mr-2"></i>
                  Network
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
        <main role="main" :class="columnLayout" class="ml-sm-auto px-4">
          <router-view/>
        </main>
      </div>
    </div>
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
  },
  computed: {
    columnLayout() {
      if (this.$store.getters.isAuthorized) {
        return 'col-md-9 col-lg-10'
      } else {
        return 'col-lg-12'
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