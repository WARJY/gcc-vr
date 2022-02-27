import * as THREE from 'three';
import { STATIC, data, source } from './data'
import { updateScore } from './ui';

export const targetGroup = new THREE.Group()
targetGroup.name = "target"

let lastTime = 0;

export function generateTarget(time) {
    if (data.started === false) return

    if (time - lastTime >= STATIC.FREQUENCY) {
        lastTime = time

        const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.5, 3)
        const material = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            roughness: 0.7,
            metalness: 0.0
        })
        const target = new THREE.Mesh(geometry, material);

        target.name = "target"
        target.castShadow = true;
        target.receiveShadow = true;

        target.position.x = Math.random() * 4 - 2
        target.position.y = Math.random() * 2;
        target.position.z = Math.random() * -3

        let tip = source.auditions.tip
        if (tip) tip.play()
        targetGroup.add(target)

        let timer = setTimeout(() => {
            targetGroup.remove(target)
            clearTimeout(timer)
        }, STATIC.DURATION)
    }
}

export function removeTarget(target) {
    targetGroup.remove(target)
    let shoot = source.auditions.shoot
    if (shoot) shoot.play()
    data.score += 1
    updateScore()
}

export function initTarget(scene) {
    scene.add(targetGroup)
}