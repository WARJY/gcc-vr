import * as THREE from 'three';
import ThreeMeshUI from '@/three-mesh-ui/three-mesh-ui.js';
import { createComponent } from './base.js'
import { createButton } from './button.js'
import store from '../store.js'

export const createProgress = function (params) {
    let length = params.width
    let { onProgress, flag = true } = params
    let container, progress, currentProgress, startFlag, currentFlag;

    container = createButton({
        contentDirection: "row",
        justifyContent: 'start',
        width: 1.3,
        height: 0.1,
        borderRadius: 0.01,
        backgroundOpacity: 0,
    });
    container.setupState({
        state: 'selected',
        onSet: (e) => {
            let current = store.right.detail.uv.x
            console.log(current)
            if (onProgress) onProgress(current)
        }
    });

    progress = new ThreeMeshUI.Block({
        contentDirection: "row",
        justifyContent: 'start',
        width: 1.3,
        height: 0.01,
        borderRadius: 0.01,
        backgroundOpacity: 1,
        ...params,
        backgroundColor: new THREE.Color(0x666666),
    });
    container.add(progress)

    currentProgress = new ThreeMeshUI.Block({
        contentDirection: "row",
        justifyContent: 'end',
        width: 0,
        height: 0.01,
        borderRadius: 0.01,
        backgroundOpacity: 1,
        ...params,
        backgroundColor: new THREE.Color(0xcccccc),
    });
    progress.add(currentProgress)

    startFlag = new ThreeMeshUI.Block({
        width: 0.001,
        height: 0.001,
    });
    startFlag.autoLayout = false;
    startFlag.position.set(0, 0, 0);
    startFlag.visible = false
    progress.add(startFlag)

    if (flag) {
        let flagParams = {
            ...params,
            width: params.height * 2.5,
            height: params.height * 2.5,
            borderRadius: params.height * 1.5,
        }
        currentFlag = new ThreeMeshUI.Block({
            width: 0.025,
            height: 0.025,
            borderRadius: 0.015,
            backgroundOpacity: 1,
            backgroundColor: new THREE.Color(0xffffff),
            ...flagParams
        });
        currentProgress.add(currentFlag)
    }

    container.setProgress = function (val) {
        currentProgress.set({
            width: length * val
        })
    }

    createComponent(container)

    return container
}