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

    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.4; 
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;

    scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
    initCamera();
    initLighting()

    roomLoader().then(room => {
        room.position.set(0, 0, 0); 
        room.castShadow = true;
        room.receiveShadow = true;

        room.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
        scene.add(room);
    })

    //controls = new OrbitControls(camera, renderer.domElement)
    render();
}

function initCamera(){
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(40, aspect, 1, 1000);
    camera.position.set(2.5, 1.5, 0.5);
    camera.lookAt(1.5, 0.75, -0.5);
}

function initLighting() {
    const pointLight = new THREE.PointLight(0xefc070, 1, 500 );
    pointLight.position.set(0.75,0.75,1.25);
    pointLight.castShadow = true; 
    pointLight.shadow.cameraNear = 0.1;
    pointLight.shadow.cameraFar = 20; 
    pointLight.shadow.bias = -0.002;
    pointLight.shadow.mapSize.width = 1024; 
    pointLight.shadow.mapSize.height = 1024; // Reduce resolution
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0x506886, 3);
    directionalLight.position.set(3, 2, -4);
    directionalLight.target.position.set(0.75,0.75,1.25);
    directionalLight.castShadow = true; 
    directionalLight.shadow.cameraNear = 0.1;
    directionalLight.shadow.cameraFar = 20;
    directionalLight.shadow.bias = -0.002;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    
    scene.add(directionalLight);

    const ambientLightColor = new THREE.Color();
    ambientLightColor.lerpColors(pointLight.color, directionalLight.color, 0.5);
    const ambientLight = new THREE.AmbientLight(ambientLightColor, 0.15);
    scene.add(ambientLight)
}

function render() {
    requestAnimationFrame(render);
    //controls.update()
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