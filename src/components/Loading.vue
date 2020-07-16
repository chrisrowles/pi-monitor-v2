<template>
    <transition name="fade">
        <div class="container" id="loading" v-if="show">
            <div class="please-wait">
                <p class="text-muted text-center">{{ message }}</p>
            </div>
            <div class="mask">
                <div class="error" v-if="status === 'error'">
                    <i class="fa fa-exclamation-triangle text-danger fa-3x"></i>
                </div>
                <div class="load" v-else>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'Loading',
        props: ['show', 'status', 'message'],
    }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;
    }

    .please-wait {
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 999;
        right: 0;
        width: 100%;
    }

    .mask {
        display: flex;
        height: 100vh;
        align-items: center;
        justify-content: center;
        perspective: 200px;
    }

    .load {
        height: 50px;
        width: 50px;
        border-radius: 15px;
        background: #41B883;
        animation: loading 2s linear infinite;
    }

    @keyframes loading {
        0% {
            transform: rotateX(0deg) rotateY(0deg);
        }

        50% {
            transform: rotateX(0deg) rotateY(180deg);
        }

        100% {
            transform: rotateX(180deg) rotateY(180deg);
        }
    }

    @media (max-width:480px)  {
        .please-wait {
            top: 20%;
        }
        .out {
            align-items: start;
            margin-top: 60px;
            perspective: initial;
        }
    }
</style>