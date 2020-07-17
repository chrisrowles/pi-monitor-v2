<template>
    <section id="heading" class="mt-5">
        <div class="row d-flex justify-content-between align-items-center">
            <div class="col-md-4">
                <h1 class="text-muted header-decor">Raspberry Pi Monitor</h1>
                <h2 class="header">{{ title }}</h2>
            </div>
            <div class="col-md-8 text-left text-md-right">
                <small class="text-muted">API:
                    <span :class="{'text-success': status, 'text-danger': !status }">{{ message }}</span>
                </small>
                <br>
                <small class="text-muted">Version: 0.0.1-alpha</small>
            </div>
        </div>
    </section>
</template>

<script>
    import bus from '../../services/bus'

    export default {
        props: ['title'],
        data() {
            return {
                status: true,
                message: 'connected',
                connection: null,
            }
        },
        created() {
            bus.$on('api-disconnect', () => {
                this.status = false
                this.message = 'disconnected'
            })

            bus.$on('api-reconnect', () => {
                this.status = true
                this.message = 'connected'
            })
        }
    }
</script>