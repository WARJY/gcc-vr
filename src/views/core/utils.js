import * as THREE from 'three';

const tempMatrix = new THREE.Matrix4()

export const getIntersections = function (controller, targets) {
    const raycaster = new THREE.Raycaster();
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(targets, false);
}