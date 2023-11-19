import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import ThreeMeshUI from '@/three-mesh-ui/three-mesh-ui.js';
import VRControl from '@/utils/VRControl.js';
import ShadowedLight from '@/utils/ShadowedLight.js';

import { initController, componentsUpdate } from './components/index'
import { initVideo, videoUpdate } from './video.js'

import store from './store.js'

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const init = function (videoEl) {

	store.scene = new THREE.Scene();
	store.scene.background = new THREE.Color(0x505050);

	store.camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 1000);
	store.camera.layers.enable(1);

	const light = ShadowedLight({
		z: 10,
		width: 6,
		bias: -0.0001
	});

	const hemLight = new THREE.HemisphereLight(0x808080, 0x606060);

	store.scene.add(light, hemLight);

	store.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	store.renderer.setPixelRatio(window.devicePixelRatio);
	store.renderer.setSize(WIDTH, HEIGHT);
	store.renderer.xr.enabled = true;
	let VRButtonEl = VRButton.createButton(store.renderer)
	document.body.appendChild(VRButtonEl);
	document.body.appendChild(store.renderer.domElement);

	store.controls = new OrbitControls(store.camera, store.renderer.domElement);
	store.camera.position.set(0, 0, 0);
	store.controls.target = new THREE.Vector3(0, 0, -1);
	store.controls.update();

	store.vrControl = VRControl(store.renderer, store.camera, store.scene);
	store.scene.add(store.vrControl.controllerGrips[0], store.vrControl.controllers[0]);

	initController()

	let { mesh1, mesh2, panel } = initVideo(videoEl)
	panel.position.set(0, 0.5, -1.5)

	const container = new THREE.Group();
	container.add(mesh1);
	container.add(mesh2);
	container.add(panel);
	store.scene.add(container)
	panel.visible = false

	store.container = container

	store.renderer.setAnimationLoop(loop);

	VRButtonEl.addEventListener("click", () => {
		panel.visible = true
	})
}

const onWindowResize = function () {
	store.camera.aspect = window.innerWidth / window.innerHeight;
	store.camera.updateProjectionMatrix();
	store.renderer.setSize(window.innerWidth, window.innerHeight);
}

const loop = function () {
	ThreeMeshUI.update();
	store.controls.update();
	store.renderer.render(store.scene, store.camera);
	componentsUpdate()
	videoUpdate()
}

window.addEventListener('resize', onWindowResize);

export {
	init,
}