import * as THREE from 'three';
import moment from 'moment'

const tempMatrix = new THREE.Matrix4()
const raycaster = new THREE.Raycaster();

export function asyncFun(fun, params, bind) {
    return new Promise(function (r, j) {
        try {
            fun.call(bind, params, res => {
                r(res)
            })
        } catch (error) {
            j(error)
        }
    })
}

export function durationFormat(duration) {
    let time = moment.duration(duration)
    let hours = time.hours()
    let minutes = time.minutes()
    let seconds = time.seconds()
    return `${hours}:${minutes}:${seconds}`
}

export function getIntersections(controller, targets) {
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(targets, true);
}