import * as THREE from 'three';
import { TEXT_OBJ_TYPE_Map, createText } from './index'
import { fontLoader } from '../../utils.js'

export const createTextShape = async function (params) {
    let textMesh;
    let { font = "fonts/helvetiker_regular.typeface.json", text, size } = params

    let fontObj = await fontLoader.loadAsync(font)

    const matLite = new THREE.MeshBasicMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        color: 0x006699,
        opacity: 0.8,
        ...params
    });

    const shapes = fontObj.generateShapes(text, size);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();

    const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    const yMid = - 0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y);
    geometry.translate(xMid, yMid, 0);

    textMesh = new THREE.Mesh(geometry, matLite);

    createText(textMesh)

    textMesh._TEXT_OBJ_TYPE = TEXT_OBJ_TYPE_Map.SHAPE

    return textMesh
}