<template>
    <div class="card border-0 shadow h-100" :class="color">
        <div class="card-header border-0 text-white d-flex justify-content-between align-items-center w-100"
             :class="color">
            <strong>{{ title }}</strong>
            <slot name="icon"></slot>
        </div>
        <div class="card-body border-radius-5 text-white" :class="color">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title', 'color']
    }
</script>