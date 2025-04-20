import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function roomLoader() {
    const loader = new GLTFLoader();
    const path = "https://github.com/dalostseed23/dalostseed23.github.io/blob/696d1d49c58d0db6169e59a3d7251e7e4eb4379d/models/room/scene.gltf";
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
