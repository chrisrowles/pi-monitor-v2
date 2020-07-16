<template>
    <section id="heading" class="mt-5">
        <div class="row d-flex justify-content-between align-items-center">
            <div class="col-md-4">
                <h1 class="text-muted header-decor">Raspberry Pi Monitor</h1>
                <h2 class="header">{{ title }}</h2>
            </div>
            <div class="col-md-8 text-left text-md-right">
                <small class="text-muted">API:
                    <span v-if="status" :class="{'text-success': status, 'text-danger': !status }">{{ message }}</span>
                </small>
                <br>
                <small class="text-muted">Version: 0.0.1-alpha</small>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        props: ['status', 'title', 'message']
    }
</script>