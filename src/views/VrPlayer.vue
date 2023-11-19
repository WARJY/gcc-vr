<template>
    <div id="container">
        <video id="player" loop muted crossorigin="anonymous" playsinline style="display:none">
            <!-- <source src="https://gccvr.com/video/Magnificent%20Yet%20Incomplete%20%20The%20Imaginary,%20Part%204%20(VR180).webm" /> -->
            <source src="/videos/MaryOculus.webm" />
        </video>
    </div>
</template>

<script>
import { init } from '@/player/index'

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
    mounted() {
        let video = document.getElementById('player');
        init(video)
    },
    methods: {
        /* METHOD APPEND FLAG, dont del this line */
    },
    /* OPTION APPEND FLAG, dont del this line */
}
</script>
