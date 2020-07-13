<script>
    export default {
        name: 'Title',
        props: ['title'],
        watch: {
            title: {
                immediate: true,
                handler() {
                    document.title = this.title;
                }
            }
        }
    }
</script>