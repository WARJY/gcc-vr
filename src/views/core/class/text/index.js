import { ENGINE_OBJ_TYPE_Map, createObj } from '../index'

export const TEXT_OBJ_TYPE_Map = {
    SHAPE: "SHAPE",
    STROKE: "STROKE",
}

export const createText = function(obj3D){
    obj3D._ENGINE_OBJ_TYPE = ENGINE_OBJ_TYPE_Map.TEXT
    createObj(obj3D)
}

export * from './shape.js'