import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { VRButton } from '@/utils/VRButton';
import { targetGroup, initTarget, generateTarget, removeTarget } from './target'
import { uiGroup, initUI, showUI, hideUI } from './ui'
import { initSource, initAudition } from './source'
import { data, STATIC } from './data';

const orientation = new THREE.Vector4()
const tempMatrix = new THREE.Matrix4()

let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let room, cameraCar;
let raycaster;

async function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 0, 3);

    cameraCar = new THREE.Object3D();
    scene.add(cameraCar);
    cameraCar.add(camera);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    await initSource()
    initEnv()
    initLight()
    initVR()

    initUI(scene)
    initTarget(scene)

    window.addEventListener('resize', onWindowResize);
}

function initEnv() {
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 1.0,
        metalness: 0.0
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    room = new THREE.Mesh(
        new THREE.SphereGeometry(5, 64, 32),
        new THREE.MeshStandardMaterial({ color: 0x666666, side: THREE.DoubleSide })
    );
    room.geometry.translate(0, 3, 0);
    scene.add(room);

    raycaster = new THREE.Raycaster();
}

function initLight() {
    scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 10, 0)
    light.castShadow = true;
    light.shadow.mapSize.set(4096, 4096);
    scene.add(light);
}

function initVR() {
    renderer.xr.enabled = true;

    let button = VRButton.createButton(renderer, () => {
        initAudition(camera)
    })
    document.body.appendChild(button);

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

    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);
}

function start() {
    data.started = true
    data.startTime = data.time
    data.score = 0
    hideUI()
}

function end() {
    data.started = false
    targetGroup.clear()
    showUI()
}

function onSelectStart(event) {

    const controller = event.target;

    const intersections = getIntersections(controller, targetGroup.children);
    if (intersections.length > 0) {
        const intersection = intersections[0];
        const object = intersection.object;
        removeTarget(object)
        controller.userData.selected = object;
    }

    const tapUI = getIntersections(controller, uiGroup.children);
    if (tapUI.length > 0) {
        const intersection = tapUI[0];
        const object = intersection.object;
        if (object.name === "startButton") start()
        controller.userData.selected = object;
    }
}

function onSelectEnd(event) {

    const controller = event.target;

    if (controller.userData.selected !== undefined) {
        controller.userData.selected = undefined;
    }

}

function buildController(data) {

    let geometry, material;

    switch (data.targetRayMode) {

        case 'tracked-pointer':

            geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 10], 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

            material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

            let line = new THREE.Line(geometry, material);
            line.name = 'line';

            controller1.add(line.clone());
            controller2.add(line.clone());

            return line

        case 'gaze':

            geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
            material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
            return new THREE.Mesh(geometry, material);

    }

}

function handleController(XRFrame) {
    if (!XRFrame) return

    let session = XRFrame.session

    if (session && session !== null) {
        const inputSources = session.inputSources

        const right = inputSources[0]
        const left = inputSources[1]
    }
}

function getIntersections(controller, targets) {

    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(targets, false);
}

function handleView(XRFrame) {
    if (!XRFrame) return

    let refSpace = renderer.xr.getReferenceSpace()
    let pose = XRFrame.getViewerPose(refSpace)

    // 视角方向的四元数
    let currentOrientation = pose.views[0].transform.orientation

    let x = currentOrientation.x
    let y = currentOrientation.y
    let z = currentOrientation.z
    let w = currentOrientation.w

    if (orientation.x !== x || orientation.y !== y || orientation.z !== z || orientation.w !== w) {
        camera.setRotationFromQuaternion(currentOrientation)
        camera.rotation.z = 0
        camera.rotation.x = 0
    }

    orientation.set(x, y, z, w)
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    renderer.setAnimationLoop(render);
}

function render(time, XRFrame) {

    data.time = time
    if (data.started === true && ((time - data.startTime) > STATIC.LIMIT)) end()

    handleController(XRFrame)
    handleView(XRFrame)
    generateTarget(time, XRFrame)

    renderer.render(scene, camera);
}

export function main() {
    init();
    animate();
}