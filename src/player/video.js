import * as THREE from 'three';
import ThreeMeshUI from '@/three-mesh-ui/three-mesh-ui.js';
import videojs from 'video.js'

import FontJSON from '@/assets/Roboto-msdf.json';
import FontImage from '@/assets/Roboto-msdf.png';

import PlayTexture from '@/assets/texture/play-circle.png'
import PauseTexture from '@/assets/texture/time-out.png'

import { createButton } from './components/button'
import { createProgress } from './components/progress'

import { durationFormat } from '@/utils/util.js'

import store from './store.js'

let player, panel, progress, currentTime, duration, play, volume;
let timer;

const colors = {
    panel: 0x858585,
    button: 0x363636,
    hovered: 0x9f9f9f,
    selected: 0xaaaaaa
};

const createPanel = function () {
    panel = new ThreeMeshUI.Block({
        contentDirection: "column",
        alignItems: 'center',
        justifyContent: 'start',
        width: 1.5,
        height: 0.4,
        padding: 0.05,
        borderRadius: 0.03,
        fontFamily: FontJSON,
        fontTexture: FontImage,
        backgroundOpacity: 1,
        backgroundColor: new THREE.Color(colors.panel),
    });
    panel.name = "videoPanel"
    panel.rotation.set(-Math.PI / 12, 0, 0)

    progress = createProgress({
        width: 1.3,
        height: 0.01,
        borderRadius: 0.01,
        backgroundOpacity: 1,
        onProgress(val) {
            progress.setProgress(val)
            player.currentTime(val * store.state.duration);
        }
    });
    progress.name = "videoProgress"
    panel.add(progress)

    duration = new ThreeMeshUI.Text({
        content: "0",
        fontColor: new THREE.Color(0x434343),
        fontSize: 0.04
    });
    duration.autoLayout = false;
    duration.position.set(0.65, -0.09, 0)
    panel.add(duration)

    currentTime = new ThreeMeshUI.Text({
        content: "0",
        fontColor: new THREE.Color(0x434343),
        fontSize: 0.04
    });
    currentTime.autoLayout = false;
    currentTime.position.set(-0.65, -0.09, 0)
    panel.add(currentTime)

    play = createButton({
        height: 0.2,
        width: 0.2,
        margin: 0.01,
        borderRadius: 0,
        justifyContent: 'center',
        backgroundColor: new THREE.Color(colors.panel),
        backgroundTexture: PauseTexture,
        backgroundTextureActive: PlayTexture,
        onSelect() {
            if (store.state.playing === true) {
                player.pause()
                store.state.playing = false
            } else {
                player.play()
                store.state.playing = true
            }
        }
    })
    play.name = "playButton"
    panel.add(play)

    // volume = createProgress({
    //     flag: false,
    //     width: 0.2,
    //     height: 0.01,
    //     borderRadius: 0.01,
    //     backgroundOpacity: 1,
    //     onProgress(val) {
    //         progress.setProgress(val)
    //         player.currentTime(val * store.state.duration);
    //     }
    // });
    // volume.name = "videoVolume"
    // volume.autoLayout = false;
    // volume.position.set(0.01, -0.05, 0)
    // panel.add(volume)
}

const initDuration = function () {
    let dura = player.duration()
    if (isNaN(dura)) timer = setTimeout(initDuration, 200)
    else {
        player.play()
        store.state.duration = dura
        duration.set({
            content: durationFormat(store.state.duration * 1000)
        })
        clearTimeout(timer)
    }
}

const initVideo = function (video) {
    player = videojs(video)
    player.ready(function () {
        initDuration()
    });

    // left
    const texture1 = new THREE.VideoTexture(video);
    const geometry1 = new THREE.SphereGeometry(10, 60, 40);
    geometry1.scale(- 1, 1, 1);

    const uvs1 = geometry1.attributes.uv.array;
    for (let i = 0; i < uvs1.length; i += 2) {
        if (uvs1[i] >= 0.49) {
            uvs1[i] = -100
            uvs1[i + 1] = -100
        }
    }

    const material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });

    const mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.name = "left"
    mesh1.rotation.y = - Math.PI;
    mesh1.layers.set(1); // display in left eye only

    // right
    const texture2 = new THREE.VideoTexture(video);
    texture2.offset.set(0.5, 0)
    const geometry2 = new THREE.SphereGeometry(10, 60, 40);
    geometry2.scale(- 1, 1, 1);

    const uvs2 = geometry2.attributes.uv.array;
    for (let i = 0; i < uvs2.length; i += 2) {
        // uvs2[i] *= 0.5;
        // uvs2[i] += 0.5;
    }

    const material2 = new THREE.MeshBasicMaterial({ map: texture2, side: THREE.DoubleSide });
    const mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.name = "right"
    mesh2.rotation.y = - Math.PI;
    mesh2.layers.set(2); // display in right eye only

    createPanel()
    // panel.visible = false

    store.right.controller.addEventListener('selectstart', event => {
        if (!store.state.showPanel || (!store.right.detail && store.state.showPanel)) {
            store.state.showPanel = !store.state.showPanel
            panel.visible = store.state.showPanel
        }
    });

    return {
        mesh1,
        mesh2,
        panel
    }
}

const videoUpdate = function () {
    store.state.currentTime = player.currentTime()
    progress.setProgress(store.state.currentTime / store.state.duration)
    currentTime.set({
        content: durationFormat(store.state.currentTime * 1000)
    })
}

export {
    player,
    initVideo,
    videoUpdate
}