<template>
    <div>
        <div id="container"></div>
    </div>
</template>

<script>
import { init } from '@/three-mesh-ui/examples/align_items'

export default {
    name: "",
    data() {
        return {
            /* DATA APPEND FLAG, dont del this line */
        }
    },
    computed: {
        /* COMPUTED APPEND FLAG, dont del this line */
    },
    async mounted() {
        init()
    },
    methods: {
        /* METHOD APPEND FLAG, dont del this line */
    },
    /* OPTION APPEND FLAG, dont del this line */
}
</script>

<style scoped>
.label {
    color: #fff;
}
</style>
