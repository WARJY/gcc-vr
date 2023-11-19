import * as THREE from 'three';
import { getIntersections } from './utils.js'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { VRButton } from '@/utils/VRButton';
import { is, fontLoader } from './utils.js'
import { _OBJ_MAP_ } from './class/index'

export * from './class'

let _scene

export let controllerL
export let controllerR

const initBaseFont = async function () {
    await fontLoader.loadAsync("fonts/helvetiker_regular.typeface.json")
}

const reciveHoverByController = function (controller, from) {
    let currentController;
    if (from === "left") currentController = controllerL
    if (from === "right") currentController = controllerR

    const intersections = getIntersections(controller, _scene.children);
    let currentObj = intersections[0]?.object
    let globalObj = currentController.hover

    if (globalObj && (currentObj?.uuid !== globalObj?.uuid)) {
        if (is(globalObj?.onLeave) === Function) globalObj?.onLeave({ controller: currentController })
    }

    if (currentObj && (currentObj?.uuid !== globalObj?.uuid)) {
        if (is(currentObj?.onHover) === Function) currentObj?.onHover({ controller: currentController })
    }

    currentController.hover = currentObj
}

const reciveHoverEvent = function () {
    reciveHoverByController(controllerL, "left")
    reciveHoverByController(controllerR, "right")
}

export const runGlobalEvent = function () {
    reciveHoverEvent()
}

const reciveSelectStartByController = function (controller) {
    const intersections = getIntersections(controller, _scene.children);

    if (intersections.length === 0) return controller.userData.selecte = ""
    for (let i = 0; i < intersections.length; i++) {
        let currentObj = intersections[i].object
        if (currentObj?.name === "MeshUI-Frame") {
            if (is(currentObj?.onSelectStart) === Function) currentObj?.onSelectStart({ controller })
            controller.userData.selecte = currentObj?.object
            break
        }
    }
}

const reciveSelectEndByController = function (controller) {
    const intersections = getIntersections(controller, _scene.children);

    if (intersections.length === 0) return controller.userData.selecte = ""
    for (let i = 0; i < intersections.length; i++) {
        let currentObj = intersections[i].object
        if (currentObj?.name === "MeshUI-Frame") {
            if (is(currentObj?.onSelectEnd) === Function) currentObj?.onSelectEnd({ controller })
            controller.userData.selecte = ""
            break
        }
    }
}

const onSelectStart = function (event) {
    const currentController = event.target;
    reciveSelectStartByController(currentController)
}

const onSelectEnd = function (event) {
    const currentController = event.target;
    reciveSelectEndByController(currentController)
}

const animate = function (renderer, render) {
    renderer.setAnimationLoop(() => {
        render()
        runGlobalEvent()
        for (let index in _OBJ_MAP_) {
            if (_OBJ_MAP_[index].onUpdate && (is(_OBJ_MAP_[index].onUpdate) === Function)) _OBJ_MAP_[index].onUpdate()
        }
    });
}

const initVRButton = function (renderer) {
    let button = VRButton.createButton(renderer)
    document.body.appendChild(button);
}

const buildController = function (data) {
    let geometry, material;

    switch (data.targetRayMode) {
        case 'tracked-pointer':
            geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 10], 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

            material = new THREE.LineBasicMaterial({ blending: THREE.AdditiveBlending });
            let line = new THREE.Line(geometry, material);
            line.name = 'line';

            controllerL.add(line.clone());
            controllerR.add(line.clone());
            return line
        case 'gaze':
            geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
            material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
            return new THREE.Mesh(geometry, material);
    }
}

export const initController = function (renderer, scene) {
    _scene = scene

    controllerL = renderer.xr.getController(0);
    controllerL.addEventListener('selectstart', onSelectStart);
    controllerL.addEventListener('selectend', onSelectEnd);
    controllerL.addEventListener('connected', function (event) {
        this.add(buildController(event.data));
    });
    controllerL.addEventListener('disconnected', function () {
        this.remove(this.children[0]);
    });
    scene.add(controllerL);

    controllerR = renderer.xr.getController(1);
    controllerR.addEventListener('selectstart', onSelectStart);
    controllerR.addEventListener('selectend', onSelectEnd);
    controllerR.addEventListener('connected', function (event) {
        this.add(buildController(event.data));
    });
    controllerR.addEventListener('disconnected', function () {
        this.remove(this.children[0]);
    });
    scene.add(controllerR);

    const controllerModelFactory = new XRControllerModelFactory();

    const controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    const controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);
}

export const init = async function ({ renderer, scene, render }) {
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    _scene = scene

    initVRButton(renderer)
    initController(renderer, scene)

    document.body.appendChild(VRButton.createButton(renderer));
    animate(renderer, render)

    await initBaseFont()
}