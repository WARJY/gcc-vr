import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { ICON_OBJ_TYPE_Map, createIcon } from './index'
import { svgLoader, updateBoundingBox } from '../../utils.js'
import { Box3 } from 'three';

export const createSvgIcon = async function (params) {
    let { url, color, scale = 0.001 } = params
    let { onHover, onLeave, onSelectStart, onSelectEnd } = params

    const svg = new THREE.Group();

    svg.onHover = function (event) {
        svg.scale.set(1.05, 1.05, 1.05)
        onHover?.call(svg, event)
    }
    svg.onLeave = function (event) {
        svg.scale.set(1, 1, 1)
        onLeave?.call(svg, event)
    }
    svg.onSelectStart = function (event) {
        svg.scale.set(0.95, 0.95, 0.95)
        onSelectStart?.call(svg, event)
    }
    svg.onSelectEnd = function (event) {
        svg.scale.set(1, 1, 1)
        onSelectEnd?.call(svg, event)
    }

    let box = new Box3()
    let data = await svgLoader.loadAsync(url)
    const paths = data.paths;

    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const fillColor = path.userData.style.fill;

        if (fillColor !== undefined && fillColor !== 'none') {
            const material = new THREE.MeshBasicMaterial({
                color: color || new THREE.Color().setStyle(fillColor).convertSRGBToLinear(),
                opacity: path.userData.style.fillOpacity,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                wireframe: false
            });

            const shapes = SVGLoader.createShapes(path);
            for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j];
                const geometry = new THREE.ShapeGeometry(shape);
                const mesh = new THREE.Mesh(geometry, material);
                mesh.geometry.computeBoundingBox();
                let currentBox = new Box3().copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld)
                box = updateBoundingBox(box, currentBox)
                svg.add(mesh);
            }
        }

        const strokeColor = path.userData.style.stroke;
        if (strokeColor !== undefined && strokeColor !== 'none') {
            const material = new THREE.MeshBasicMaterial({
                color: color || new THREE.Color().setStyle(strokeColor).convertSRGBToLinear(),
                opacity: path.userData.style.strokeOpacity,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                wireframe: false
            });

            for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
                const subPath = path.subPaths[j];
                const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);

                if (geometry) {
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.geometry.computeBoundingBox();
                    let currentBox = new Box3().copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld)
                    box = updateBoundingBox(box, currentBox)
                    svg.add(mesh);
                }
            }
        }
    }

    svg.boundingBox = box
    const xMid = - 0.5 * (svg.boundingBox.max.x - svg.boundingBox.min.x);
    const yMid = - 0.5 * (svg.boundingBox.max.y - svg.boundingBox.min.y);
    svg.translateX(xMid * scale)
    svg.translateY(yMid * scale)
    svg.scale.multiplyScalar(scale);

    createIcon(svg)

    svg._TEXT_OBJ_TYPE = ICON_OBJ_TYPE_Map.SVG

    return svg
}