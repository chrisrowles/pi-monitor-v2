<template>
    <div class="card border-0 shadow h-100" :class="`bg-${color}`">
        <div class="card-header border-0 text-white d-flex justify-content-between align-items-center w-100"
             :class="`bg-${color}`">
            <strong>{{ title }}</strong>
          <fa-icon :icon="['fas', icon]" class="card-icon"></fa-icon>
        </div>
        <div class="card-body border-radius-5 text-white" :class="`bg-${color}`">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title', 'color', 'icon']
    }
</script>