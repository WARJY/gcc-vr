<template>
    <div id="container">
        <video id="player" loop muted crossorigin="anonymous" playsinline style="display:none">
            <!-- <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4" /> -->
            <!-- <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm" /> -->
            <source src="/videos/MaryOculus.mp4" />
        </video>
    </div>
</template>

<script>
// import 'video.js/dist/video-js.min.css'
import videojs from 'video.js'
import * as THREE from 'three';
import * as Engine from './core/index.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

let camera, scene, renderer;

const onWindowResize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const init = function () {
    const container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
    camera.layers.enable(1); // render left view when no stereo available

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101010);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

const initVideo = function () {
    document.getElementById('container').addEventListener('click', function () {
        video.play();
    });

    const video = document.getElementById('player');
    video.play();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101010);

    // left
    const texture1 = new THREE.VideoTexture(video);

    const geometry1 = new THREE.SphereGeometry(500, 60, 40);
    geometry1.scale(- 1, 1, 1);

    const uvs1 = geometry1.attributes.uv.array;
    for (let i = 0; i < uvs1.length; i += 2) {
        if (uvs1[i] >= 0.49) {
            uvs1[i] = -100
            uvs1[i + 1] = -100
        }
    }

    const material1 = new THREE.MeshBasicMaterial({ map: texture1 });

    const mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.rotation.y = - Math.PI;
    mesh1.layers.set(1); // display in left eye only
    scene.add(mesh1);

    // right
    const texture2 = new THREE.VideoTexture(video);
    texture2.offset.set(0.5, 0)

    const geometry2 = new THREE.SphereGeometry(500, 60, 40);
    geometry2.scale(- 1, 1, 1);

    const uvs2 = geometry2.attributes.uv.array;
    for (let i = 0; i < uvs2.length; i += 2) {
        // uvs2[i] *= 0.5;
        // uvs2[i] += 0.5;
    }

    const material2 = new THREE.MeshBasicMaterial({ map: texture2 });

    const mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.rotation.y = - Math.PI;
    mesh2.layers.set(2); // display in right eye only
    scene.add(mesh2);
}

const render = function () {
    renderer.render(scene, camera);
}

const animate = function () {
    renderer.setAnimationLoop(render);
}

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
        init()
        animate()
        initVideo()
        Engine.init(renderer, scene)

        const geometry_panel = new RoundedBoxGeometry(10, 2, 1, 6, 1);
        const material_panel = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry_panel, material_panel);
        scene.add(plane);
        plane.position.set(0, 0, -10)
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
