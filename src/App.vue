<template>
    <div id="app">
        <div class="d-flex flex-column flex-md-row align-items-center p-4 px-md-4 mb-0 mb-md-3 bg-white box-shadow">
            <h5 class="my-0 mr-md-auto font-weight-normal">RaspiMon <small class="text-muted">v0.0.1-alpha</small></h5>
            <nav class="my-2 my-md-0 mr-md-3">
                <router-link to="/" class="p-2 text-muted">Dashboard</router-link>
                <router-link to="/network" class="p-2 text-muted">Network</router-link>
            </nav>
        </div>
        <router-view/>
    </div>
</template>

<style lang="scss">
#nav {
  a {
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>