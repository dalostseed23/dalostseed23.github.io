import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function roomLoader() {
    const loader = new GLTFLoader();
    const path = "/models/room/scene.gltf";
    try {
        const gltf = await new Promise((resolve, reject) => {
            loader.load(path, resolve, undefined, reject);
        })

        const room = gltf.scene;

        return room;
    } catch(e){
        console.error("Error loading Room:", e);
    }
}
