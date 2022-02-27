import * as THREE from 'three';
import { data, source } from './data'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export const uiGroup = new THREE.Group()
uiGroup.name = "ui"

let score, desc, startButton;

function generateText(text, { name, geometry, material }) {
    let res = new THREE.Mesh(new TextGeometry(text, {
        font: source.fonts.helvetiker_regular,
        size: 0.5,
        height: 0,
        ...geometry
    }), new THREE.MeshLambertMaterial({
        color: 0xeeeeee,
        ...material
    }))
    res.name = name
    return res
}

export function initUI(scene) {
    scene.add(uiGroup)

    score = generateText("0", { name: "score" })
    score.position.set(0, 1.8, -3)
    uiGroup.add(score)

    desc = generateText("Aim and push button to shoot in 60s", {
        name: "desc", geometry: {
            size: 0.1
        }
    })
    desc.position.set(-0.9, 2.5, -3)
    uiGroup.add(desc)

    startButton = generateText("START", {
        name: "desc", geometry: {
            size: 0.2
        },
        material: {
            color: 0xffffff
        }
    })
    startButton.name = "startButton"
    startButton.position.set(-0.23, 1.4, -3)
    uiGroup.add(startButton)
}

export function hideUI(){
    uiGroup.remove(desc)
    uiGroup.remove(startButton)
}

export function showUI(){
    uiGroup.add(desc)
    uiGroup.add(startButton)
}

export function updateScore() {
    let score = uiGroup.getObjectByName("score")
    score.geometry = new TextGeometry(data.score.toString(), {
        font: source.fonts.helvetiker_regular,
        size: 1,
        height: 0,
    })
}