<template>
    <div id="app">
        <div class="d-flex flex-column flex-md-row align-items-center p-4 px-md-4 mb-0 mb-md-3 bg-white box-shadow">
            <h5 class="my-0 mr-md-auto font-weight-normal">{{ name }}</h5>
            <nav class="my-2 my-md-0 mr-md-3" id="nav">
                <router-link to="/" class="p-2">Dashboard</router-link>
                <router-link to="/network" class="p-2">Network</router-link>
                <router-link to="/ssh" class="p-2">Remote SSH</router-link>
            </nav>
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        props: ['name']
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