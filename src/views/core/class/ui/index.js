import { ENGINE_OBJ_TYPE_Map, createObj } from '../index'

export const UI_OBJ_TYPE_Map = {
    BUTTON: "BUTTON",
    PANEL: "PANEL",
}

export const createUi = function(obj3D){
    obj3D._ENGINE_OBJ_TYPE = ENGINE_OBJ_TYPE_Map.UI
    createObj(obj3D)
}

export * from './button.js'
export * from './panel.js'