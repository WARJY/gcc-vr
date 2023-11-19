import * as THREE from 'three';
import store from '../store.js'

let selectState = false;
let touchState = false;

let objsToTest = []

store.objsToTest = objsToTest

const raycaster = new THREE.Raycaster();

const raycast = function () {

    if (!store.container) return

    return objsToTest.reduce((closestIntersection, obj) => {

        // keys in panels that are hidden are not tested
        if (!store.container.getObjectById(obj.id) || obj.visible === false) {
            return closestIntersection;
        }

        const intersection = raycaster.intersectObject(obj, true);

        // if intersection is an empty array, we skip
        if (!intersection[0]) return closestIntersection;

        // if this intersection is closer than any previous intersection, we keep it
        if (!closestIntersection || intersection[0].distance < closestIntersection.distance) {

            // Make sure to return the UI object, and not one of its children (text, frame...)
            intersection[0].object = obj;

            return intersection[0];
        }

        return closestIntersection;

    }, null);
}

const componentsUpdate = function () {

    // Find closest intersecting object

    let intersect;

    if (store.renderer.xr.isPresenting) {

        store.vrControl.setFromController(0, raycaster.ray);

        intersect = raycast();

        // Position the little white dot at the end of the controller pointing ray
        if (intersect) store.vrControl.setPointerAt(0, intersect.point);

    } else if (store.mouse.x !== null && store.mouse.y !== null) {

        raycaster.setFromCamera(store.mouse, store.camera);

        intersect = raycast();

    }
    
    // Update targeted button state (if any)
    if (intersect && intersect.object.isUI) {

        store.right.detail = intersect

        if ((selectState && intersect.object.currentState === 'hovered') || touchState) {

            // Component.setState internally call component.set with the options you defined in component.setupState
            if (intersect.object.states?.['selected']) intersect.object.setState('selected');

        } else if (!selectState && !touchState) {

            // Component.setState internally call component.set with the options you defined in component.setupState
            if (intersect.object.states?.['hovered']) intersect.object.setState('hovered');
        }

    }else{
        store.right.detail = ""
    }

    // Update non-targeted buttons state

    objsToTest.forEach((obj) => {

        if ((!intersect || obj !== intersect.object) && obj.isUI) {

            // Component.setState internally call component.set with the options you defined in component.setupState
            if (obj.states?.['idle']) obj.setState('idle');

        }

    });

}

const initController = function () {
    window.addEventListener('pointermove', (event) => {
        store.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        store.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('pointerdown', () => {
        selectState = true;
    });

    window.addEventListener('pointerup', () => {
        selectState = false;
    });

    window.addEventListener('touchstart', (event) => {
        touchState = true;
        store.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        store.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('touchend', () => {
        touchState = false;
        store.mouse.x = null;
        store.mouse.y = null;
    });

    store.right.controller = store.vrControl.controllers[0]

    store.right.controller.addEventListener('selectstart', event => {
        store.right.selected = true
        selectState = true
    });

    store.right.controller.addEventListener('selectend', event => {
        store.right.selected = false
        selectState = false;
    });
}

export {
    objsToTest,
    initController,
    componentsUpdate,
}