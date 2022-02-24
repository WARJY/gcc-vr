import * as THREE from 'three';

const DURATION = 2000

let tip;
let shoot;

export function initAudio(camera) {
    const tipListener = new THREE.AudioListener()
    camera.add(tipListener)
    tip = new THREE.PositionalAudio(tipListener)

    const shootListener = new THREE.AudioListener()
    camera.add(shootListener)
    shoot = new THREE.PositionalAudio(shootListener)

    const audioLoader = new THREE.AudioLoader()
    audioLoader.load('/audition/shoot.mp3', function (buffer) {
        tip.setBuffer(buffer)
        tip.setVolume(0.5)
    });

    audioLoader.load('/audition/pin.mp3', function (buffer) {
        shoot.setBuffer(buffer)
        shoot.setVolume(0.5)
    });
}

export class Target {

    constructor() {
        const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.5, 3)
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
        const target = new THREE.Mesh(geometry, material);

        target.position.x = Math.random() * 4 - 2
        target.position.y = Math.random() * 2;
        target.position.z = Math.random() * -3

        this.target = target
    }

    show(scene) {
        if(tip) tip.play()
        scene.add(this.target)
        let timer = setTimeout(() => {
            scene.remove(this.target)
            clearTimeout(timer)
        }, DURATION)
    }

}

export { tip, shoot }