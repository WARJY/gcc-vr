import * as THREE from 'three';

const initStore = function () {
    return {
        scene: "",
        camera: "",
        renderer: "",

        mouse: new THREE.Vector2(),
        controls: "",
        vrControl: "",

        left: {
            controller: "",
            selected: false,
            touched: false,
            detail: {}
        },
        right: {
            controller: "",
            selected: false,
            touched: false,
            detail: {}
        },

        state: {
            duration: 0,
            currentTime: 0,
            playing: true,
            showPanel: false
        },
        container: "",
        objsToTest: []
    }
}

let store = initStore()

export default store