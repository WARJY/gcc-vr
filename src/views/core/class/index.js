export let _OBJ_MAP_ = {}

export const ENGINE_OBJ_TYPE_Map = {
    UI: "UI",
    TEXT: "TEXT",
    ICON: "ICON"
}

export const createObj = function(obj3D){
    _OBJ_MAP_[obj3D.id] = obj3D
    obj3D._IS_ENGINE_OBJ_ = true
}

export * from './ui/index.js'
export * from './text/index.js'
export * from './icon/index.js'