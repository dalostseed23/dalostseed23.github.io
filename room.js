import * as THREE from 'three';
import { roomLoader } from './roomLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

let scene, camera, renderer, controls

function main(){
    
    var container = document.createElement("div");
	document.body.appendChild(container);
	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0x00000000));
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    initCamera();
    initLighting()
    roomLoader().then(room => {
        scene.add(room);
        room.position.set(0, 0, 0); 
    })
    controls = new OrbitControls(camera, renderer.domElement)
    render();
}

function initCamera(){
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
    camera.position.set(1,0,0)
    camera.lookAt(scene.position);
}

function initLighting() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
  scene.add(ambientLight)
}

function render() {
    requestAnimationFrame(render);
    controls.update()
    renderer.render(scene, camera);
}


function onResize() {
    var aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = main;
window.addEventListener("resize", onResize, true);