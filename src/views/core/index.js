import * as THREE from 'three';
import { getIntersections } from './utils.js'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { VRButton } from '@/utils/VRButton';
import { is } from 'cutil'


let _scene

export let controllerL
export let controllerR

export const initVRButton = function (renderer) {
    let button = VRButton.createButton(renderer)
    document.body.appendChild(button);
}

export const buildController = function (data) {
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

export const onSelectStart = function (event) {
    const currentController = event.target;
    controller.userData.selected = true;
    const intersections = getIntersections(currentController, _scene.children);
    if (intersections.length > 0) {
        for (let intersection of intersections) {
            const object = intersection.object;
            if (object.onSelectStart && is(object.onSelectStart) === Function) object.onSelectStart()
        }
    }
}

export const onSelectEnd = function (event) {
    const currentController = event.target;
    currentController.userData.selected = false;
}

export const initController = function (renderer, scene) {
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

export const init = function (renderer, scene) {
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    _scene = scene

    initVRButton(renderer)
    initController(renderer, scene)

    document.body.appendChild(VRButton.createButton(renderer));
}