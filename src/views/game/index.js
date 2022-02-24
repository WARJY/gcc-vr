import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from '@/utils/VRButton';
import { asyncFun } from '@/utils/util'
import { Target, initAudio, shoot } from './Target'

const orientation = new THREE.Vector4()
const tempMatrix = new THREE.Matrix4()

const FREQUENCY = 500

let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let room, cameraCar, group;
let raycaster;
let score, scoreCount;
let font;

scoreCount = 0

const clock = new THREE.Clock()

async function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 0, 3);

    scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    cameraCar = new THREE.Object3D();
    scene.add(cameraCar);
    cameraCar.add(camera);

    room = new THREE.LineSegments(
        new BoxLineGeometry(10, 10, 10, 10, 10, 10),
        new THREE.LineBasicMaterial({ color: 0x808080 })
    );
    room.geometry.translate(0, 3, 0);
    scene.add(room);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    let button = VRButton.createButton(renderer, () => {
        initAudio(camera);
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

    group = new THREE.Group();
    scene.add(group);

    raycaster = new THREE.Raycaster();

    const loader = new FontLoader();

    loader.load('/fonts/helvetiker_regular.typeface.json', function (f) {
        font = f
        score = new THREE.Mesh(new TextGeometry(scoreCount.toString(), {
            font: font,
            size: 2,
            height: 1,
        }), new THREE.MeshLambertMaterial({
            color: 0x407000
        }))

        scene.add(score)

        score.position.set(0, 0, -10)
    });

    // const loader = new GLTFLoader();

    // let map = ""
    // await asyncFun(loader.load, "/models/cs_assault_with_real_light/scene.gltf", loader).then(gltf => {
    //     map = gltf.scene
    //     scene.add(gltf.scene);
    // })

    // map.position.set(0, 7, 0)
}

function onSelectStart(event) {

    const controller = event.target;

    const intersections = getIntersections(controller);

    if (intersections.length > 0) {

        const intersection = intersections[0];

        const object = intersection.object;
        group.remove(object)
        shoot.play()

        scoreCount += 1
        
        let gem = new TextGeometry(scoreCount.toString(), {
            font: font,
            size: 2,
            height: 1,
        })
        score.geometry = gem

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

            // return new THREE.Line(geometry, material);

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

        handleLeftController(left)
        handleRightController(right)
    }
}

function handleLeftController(inputSource) {
}

function handleRightController(inputSource) {
    if (!inputSource) return

    let gamepad = inputSource.gamepad
    let button3 = gamepad?.buttons[3]
}

function getIntersections(controller) {

    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(group.children, false);
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

let lastTime = 0;
function generateTarget(time, XRFrame) {
    if (time - lastTime >= FREQUENCY) {
        lastTime = time
        let target = new Target()
        target.show(group)
    }
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

    handleController(XRFrame)

    handleView(XRFrame)

    generateTarget(time, XRFrame)

    const delta = clock.getDelta() * 0.8; // slow down simulation

    renderer.render(scene, camera);

}

export function main() {
    init();
    animate();
}