import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { asyncFun } from '@/utils/util'
import { data, source } from './data'

let tip, shoot;
let helvetiker_regular;

export async function initAudition(camera) {
    const tipListener = new THREE.AudioListener()
    camera.add(tipListener)
    tip = new THREE.PositionalAudio(tipListener)

    const shootListener = new THREE.AudioListener()
    camera.add(shootListener)
    shoot = new THREE.PositionalAudio(shootListener)

    const audioLoader = new THREE.AudioLoader()

    await asyncFun(audioLoader.load, "/audition/shoot.mp3", audioLoader).then(buffer => {
        tip.setBuffer(buffer)
        tip.setVolume(0.5)
    })

    await asyncFun(audioLoader.load, "/audition/pin.mp3", audioLoader).then(buffer => {
        shoot.setBuffer(buffer)
        shoot.setVolume(0.5)
    })

    data.load.auditions = true
    source.auditions = {
        tip,
        shoot
    }
}

export async function initFont() {
    const loader = new FontLoader();
    await asyncFun(loader.load, "/fonts/helvetiker_regular.typeface.json", loader).then(f => {
        helvetiker_regular = f
    })

    data.load.fonts = true
    source.fonts = {
        helvetiker_regular
    }
}

export async function initSource(camera) {
    // initAudition(camera)
    await initFont()
}