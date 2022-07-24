
<template>
    <div>
        <div id="container"></div>
        <video id="video" loop muted crossorigin="anonymous" playsinline style="display:none">
            <!-- <source src="/videos/MaryOculus.mp4" /> -->
            <!-- <source src="/videos/render.mp4" /> -->
            <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
            <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm" />
        </video>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import * as THREE from 'three';
import { VRButton } from '@/utils/VRButton';

let camera, scene, renderer;

export default defineComponent({
    name: 'Home',
    mounted() {

        init();
        animate();

        function init() {

            const container = document.getElementById('container');
            container.addEventListener('click', function () {
                video.play();
            });

            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
            camera.layers.enable(1); // render left view when no stereo available

            // video
            const video = document.getElementById('video');
            video.play();

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x101010);

            // left
            const texture1 = new THREE.VideoTexture(video);
            // texture1.repeat.set(0.5, 1)

            const geometry1 = new THREE.SphereGeometry(500, 60, 40);
            geometry1.scale(- 1, 1, 1);

            const uvs1 = geometry1.attributes.uv.array;
            for (let i = 0; i < uvs1.length; i += 2) {
                if(uvs1[i] >= 0.49){
                    uvs1[i] = -100
                    uvs1[i+1] = -100
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

            // controller
            // const geometry_panel = new THREE.PlaneGeometry(10, 10);
            // const material_panel = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
            // const plane = new THREE.Mesh(geometry_panel, material_panel);
            // scene.add(plane);
            // plane.position.set(0,0,0)

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.xr.enabled = true;
            renderer.xr.setReferenceSpaceType('local');
            container.appendChild(renderer.domElement);

            document.body.appendChild(VRButton.createButton(renderer));

            window.addEventListener('resize', onWindowResize);

        }

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        }

        function animate() {

            renderer.setAnimationLoop(render);

        }

        function render() {
            renderer.render(scene, camera);
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
