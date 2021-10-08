<template>
  <div id="app" class="h-100" :class="{'login-overlay': $route.name === 'login'}">
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">{{ this.name }}</a>
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a v-if="$store.getters.isAuthorized" v-on:click="logout" href="#" class="nav-link">Logout</a>
        </li>
      </ul>
    </nav>
    <div class="container-fluid h-100" style="margin-top: 56px;">
      <div class="row h-100">
        <nav v-if="$store.getters.isAuthorized" class="col-md-2 d-none d-md-block bg-light sidebar mt-3">
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link :to="{name: 'dashboard'}" class="nav-link">
                  <fa-icon :icon="['fas', 'home']" class="mr-3"></fa-icon>Dashboard
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{name: 'network'}" class="nav-link">
                  <fa-icon :icon="['fas', 'broadcast-tower']" class="mr-3"></fa-icon>Network
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{name: 'services'}" class="nav-link">
                  <fa-icon :icon="['fas', 'server']" class="mr-3"></fa-icon>Services
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{name: 'terminal'}" class="nav-link">
                  <fa-icon :icon="['fas', 'terminal']" class="mr-3"></fa-icon>Terminal
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{name: 'network'}" class="nav-link">
                  <fa-icon :icon="['fas', 'users']" class="mr-3"></fa-icon>Users
                </router-link>
              </li><li class="nav-item">
              <router-link :to="{name: 'network'}" class="nav-link">
                <fa-icon :icon="['fas', 'list']" class="mr-3"></fa-icon>Logging
              </router-link>
            </li>
              <li class="nav-item">
                <router-link :to="{name: 'network'}" class="nav-link">
                  <fa-icon :icon="['fas', 'cogs']" class="mr-3"></fa-icon>Settings
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