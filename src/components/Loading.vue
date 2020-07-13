<template>
    <div>
        <div class="please-wait">
            <p class="text-muted text-center">Loading, please wait...</p>
        </div>
        <div class="out">
            <div class="load">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Loading'
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
        top: 55%;
        left: 0;
        z-index: 999;
        right: 0;
        width: 100%;
    }

    .out {
        background: white;
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