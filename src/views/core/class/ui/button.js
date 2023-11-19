import { UI_OBJ_TYPE_Map, createUi } from './index.js'
import { createPanel } from './panel.js'
import { createTextShape } from '../text/shape.js'
import { createSvgIcon } from '../icon/svg'

export const createButton = async function (params) {
    let textMesh, svgMesh
    let { width, height, depth, segments } = params
    let { onHover, onLeave, onSelectStart, onSelectEnd } = params

    const button = createPanel(params)

    button.onHover = function (event) {
        button.scale.set(1.05, 1.05, 1.05)
        onHover?.call(button, event)
    }
    button.onLeave = function (event) {
        button.scale.set(1, 1, 1)
        onLeave?.call(button, event)
    }
    button.onSelectStart = function (event) {
        button.scale.set(0.95, 0.95, 0.95)
        onSelectStart?.call(button, event)
    }
    button.onSelectEnd = function (event) {
        button.scale.set(1, 1, 1)
        onSelectEnd?.call(button, event)
    }

    if (params.font?.text) {
        textMesh = await createTextShape({ size: height, ...params.font })
        button.add(textMesh)
        textMesh.position.z = 1
    }

    if (params.icon?.url) {
        svgMesh = await createSvgIcon({ ...params.icon })
        button.add(svgMesh)
        svgMesh.position.z = 1
    }

    if(params.font?.text && params.icon?.url){
        textMesh.position.x += ((svgMesh.boundingBox.max.x - svgMesh.boundingBox.min.x) * svgMesh.scale.x)
    }

    createUi(button)

    button._UI_OBJ_TYPE = UI_OBJ_TYPE_Map.BUTTON

    return button
}

