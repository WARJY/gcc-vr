import { ENGINE_OBJ_TYPE_Map, createObj } from '../index'

export const ICON_OBJ_TYPE_Map = {
    SVG: "SVG",
}

export const createIcon = function(obj3D){
    obj3D._ENGINE_OBJ_TYPE = ENGINE_OBJ_TYPE_Map.ICON
    createObj(obj3D)
}

export * from './svg.js'