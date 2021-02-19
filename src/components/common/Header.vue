<template>
  <section id="heading">
    <div class="row d-flex justify-content-between align-items-center">
      <div class="col-6">
        <h1 class="text-muted header-decor">{{ name }}</h1>
        <h2 class="header">{{ title }}</h2>
      </div>
      <div class="col-6 text-left text-md-right">
        <small class="text-muted">API:
          <span :class="{'text-success': status, 'text-danger': !status }">{{ message }}</span>
        </small>
        <br>
        <small v-if="$store.getters.isAuthorized" class="text-muted">User: {{ $store.state.email }}</small>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['title'],
  data() {
    return {
      status: true,
      message: 'connected',
      connection: null,
      name: this.$app_name
    }
  },
  created() {
    this.$bus.$on('api-disconnect', () => {
      this.status = false
      this.message = 'disconnected'
    })
    this.$bus.$on('api-reconnect', () => {
      this.status = true
      this.message = 'connected'
    })
  }
}
</script>