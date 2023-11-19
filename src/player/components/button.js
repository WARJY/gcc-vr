import * as THREE from 'three';
import ThreeMeshUI from '@/three-mesh-ui/three-mesh-ui.js';
import { createComponent } from './base.js'

const textureLoader = new THREE.TextureLoader();

export const createButton = function (params) {
    let button, block, blockActive;
    let { backgroundTexture, backgroundTextureActive, onSelect } = params

    let blockParams = { ...params }
    delete blockParams.backgroundTexture

    button = new ThreeMeshUI.Block(blockParams)
    button.userData = {
        actived: false
    }

    if (backgroundTexture) {
        textureLoader.load(backgroundTexture, texture => {
            block = new ThreeMeshUI.Block({
                width: params.width * 0.8,
                height: params.height * 0.8,
                backgroundSize: 'contain',
                backgroundTexture: texture
            })
            button.add(block);
            block.autoLayout = false;
            block.position.set(0, 0, 0);
        })
    }

    if (backgroundTextureActive) {
        textureLoader.load(backgroundTextureActive, texture => {
            blockActive = new ThreeMeshUI.Block({
                width: params.width * 0.8,
                height: params.height * 0.8,
                backgroundSize: 'contain',
                backgroundTexture: texture
            })
            button.add(blockActive);
            blockActive.autoLayout = false;
            blockActive.position.set(0, 0, 0);
            blockActive.visible = false
        })
    }

    button.setupState({
        state: 'idle',
        attributes: {
            offset: 0.01,
        },
    });

    button.setupState({
        state: 'hovered',
        attributes: {
            offset: 0.03,
        },
        onSet: () => {
            if (!button || !blockActive) return
        }
    });

    button.setupState({
        state: 'selected',
        attributes: {
            offset: 0.02,
        },
        onSet: () => {
            button.userData.actived = !button.userData.actived
            if(!block || !blockActive) return
            if (button.userData.actived === true) {
                blockActive.visible = true
                block.visible = false
            } else {
                blockActive.visible = false
                block.visible = true
            }
            if (onSelect) onSelect()
        }
    });

    createComponent(button)

    return button
}