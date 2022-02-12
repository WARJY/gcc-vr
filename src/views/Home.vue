<template>
    <div class="home"></div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRButton } from '@/utils/VRButton';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { asyncFun } from '@/utils/util'

export default defineComponent({
    name: 'Home',
    setup() {
        let camera, scene, renderer;
        let controller1, controller2;
        let controllerGrip1, controllerGrip2;

        const clock = new THREE.Clock();

        async function init() {

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x505050);

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);
            camera.position.set(0, 0, 3);

            scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

            const light = new THREE.DirectionalLight(0xffffff);
            light.position.set(1, 1, 1).normalize();
            scene.add(light);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.xr.enabled = true;
            document.body.appendChild(renderer.domElement);

            document.body.appendChild(VRButton.createButton(renderer));

            function onSelectStart({ data }) {
                this.userData.isSelecting = true;
            }

            function onSelectEnd({ data }) {
                let x = data.gamepad.axes[2]
                let y = data.gamepad.axes[3]
                if (x !== 0) {
                    camera.position.translateX(x)
                }
                if (y !== 0) {
                    camera.position.translateY(y)
                }
                this.userData.isSelecting = false;
            }

            controller1 = renderer.xr.getController(0);
            controller1.addEventListener('selectstart', onSelectStart);
            controller1.addEventListener('selectend', onSelectEnd);

            controller1.addEventListener('connected', function (event) {
                this.add(buildController(event.data));
            });
            controller1.addEventListener('disconnected', function () {
                this.remove(this.children[0]);
            });
            scene.add(controller1);

            controller2 = renderer.xr.getController(1);
            controller2.addEventListener('selectstart', onSelectStart);
            controller2.addEventListener('selectend', onSelectEnd);

            controller2.addEventListener('connected', function (event) {
                this.add(buildController(event.data));
            });
            controller2.addEventListener('disconnected', function () {
                this.remove(this.children[0]);
            });
            scene.add(controller2);

            // The XRControllerModelFactory will automatically fetch controller models
            // that match what the user is holding as closely as possible. The models
            // should be attached to the object returned from getControllerGrip in
            // order to match the orientation of the held device.

            const controllerModelFactory = new XRControllerModelFactory();

            controllerGrip1 = renderer.xr.getControllerGrip(0);
            controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
            scene.add(controllerGrip1);

            controllerGrip2 = renderer.xr.getControllerGrip(1);
            controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
            scene.add(controllerGrip2);

            window.addEventListener('resize', onWindowResize);

            const loader = new GLTFLoader();

            let map = ""
            await asyncFun(loader.load, "/models/cs_assault_with_real_light/scene.gltf", loader).then(gltf => {
                map = gltf.scene
                scene.add(gltf.scene);
            })

            map.position.set(0, 7, 0)

        }

        function buildController(data) {

            console.log(data)

            let geometry, material;

            switch (data.targetRayMode) {

                case 'tracked-pointer':

                    geometry = new THREE.BufferGeometry();
                    geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
                    geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

                    material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

                    return new THREE.Line(geometry, material);

                case 'gaze':

                // geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
                // material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
                // return new THREE.Mesh(geometry, material);

            }

        }

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        }

        function handleController(controller) {

            // if (controller.userData.isSelecting) {

            //     const object = room.children[count++];

            //     object.position.copy(controller.position);
            //     object.userData.velocity.x = (Math.random() - 0.5) * 3;
            //     object.userData.velocity.y = (Math.random() - 0.5) * 3;
            //     object.userData.velocity.z = (Math.random() - 9);
            //     object.userData.velocity.applyQuaternion(controller.quaternion);

            //     if (count === room.children.length) count = 0;

            // }

        }

        function animate() {
            renderer.setAnimationLoop(render);

        }

        function render() {

            console.log(1)

            handleController(controller1);
            handleController(controller2);

            const delta = clock.getDelta() * 0.8; // slow down simulation

            renderer.render(scene, camera);

        }

        onMounted(() => {
            init();
            animate();
        })
    },
});
</script>
