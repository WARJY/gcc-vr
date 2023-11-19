import * as THREE from 'three';
import { Box3, Vector3 } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

const raycaster = new THREE.Raycaster();

const TYPE_MAP = {
    "[object Undefined]": undefined,
    "[object Null]": null,
    "[object Object]": Object,
    "[object Array]": Array,
    "[object String]": String,
    "[object Number]": Number,
    "[object Boolean]": Boolean,
    "[object Function]": Function,
    "[object Date]": Date,
    "[object JSON]": JSON
}

const tempMatrix = new THREE.Matrix4()

export const fontLoader = new FontLoader()
export const svgLoader = new SVGLoader()

export const is = function (obj) {
    if (!obj === obj) return NaN
    return TYPE_MAP[Object.prototype.toString.call(obj)]
}

export const getIntersections = function (controller, targets) {
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(targets, true);
}

export const updateBoundingBox = function (box1, box2) {
    if (box1.isEmpty()) return box2
    if (box2.isEmpty()) return box1
    let minX = Math.min(box1.min.x, box2.min.x)
    let minY = Math.min(box1.min.y, box2.min.y)
    let minZ = Math.min(box1.min.z, box2.min.z)

    let maxX = Math.max(box1.max.x, box2.max.x)
    let maxY = Math.max(box1.max.y, box2.max.y)
    let maxZ = Math.max(box1.max.z, box2.max.z)

    let box = new Box3(
        new Vector3(minX, minY, minZ),
        new Vector3(maxX, maxY, maxZ),
    )

    return box
}