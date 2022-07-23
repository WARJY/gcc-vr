<template>
    <div class="container">
        <video id="player">
            <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
            <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm" />
        </video>
    </div>
</template>

<script>
import 'video.js/dist/video-js.min.css'
import videojs from 'video.js'

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
        this.initPlayer()
    },
    beforeDestroy() {
        this.player?.dispose();
    },
    methods: {
        initPlayer() {
            let player = videojs(document.querySelector('#player'), {
                controls: true
            })
            this.player = player
        },
        /* METHOD APPEND FLAG, dont del this line */
    },
    /* OPTION APPEND FLAG, dont del this line */
}
</script>
