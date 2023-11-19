import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { UI_OBJ_TYPE_Map, createUi } from '.'

export const createPanel = function (params) {
    let { width, height, depth, segments, radius, color = 0xeeeeee, onHover, onLeave, onSelectStart, onSelectEnd } = params
    const geometry_panel = new RoundedBoxGeometry(width, height, depth, segments, radius);
    const material_panel = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    const panel = new THREE.Mesh(geometry_panel, material_panel)

    createUi(panel)

    panel._UI_OBJ_TYPE = UI_OBJ_TYPE_Map.PANEL

    return panel
}