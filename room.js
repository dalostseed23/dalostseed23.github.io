import * as THREE from 'three';
import { roomLoader } from './roomLoader.js';

let  camera, renderer, targetPosition, targetLookAt, Animationflag
let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
const SPEED = 0.005;


function main(){
    initRenderer();
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
    render();
}

function initRenderer(){
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
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000);
    camera.position.set(0.75, 1.5, 2);
    camera.lookAt(-2, 1.15, -1);

    targetPosition = new THREE.Vector3(camera.position);
    targetLookAt = new THREE.Vector3(-2, 1.15, -1);
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
    translationAnimation();
    renderer.render(scene, camera);
}


function translationAnimation(){
    if(Animationflag === true){
        const direction = new THREE.Vector3().subVectors(targetPosition, camera.position).normalize();
        const distance = camera.position.distanceTo(targetPosition);
        camera.position.add(direction.multiplyScalar(SPEED));
        camera.lookAt(targetLookAt);

        if(distance <= 0.05){
            Animationflag = false;
            camera.lookAt(targetLookAt);
        }
    }
}

function onResize() {
    aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function next(event) {
    const location = event.target.getAttribute("location");
    Animationflag = true;

    if(location === "bookshelf"){
        targetPosition.set(0.75, 1.5, 0.75);
        targetLookAt.set(0.50, 1.25, -0.5)
    }
    else if(location === "laptop"){
        targetPosition.set(2.5, 1.5, 0.5);
        targetLookAt.set(1.5, 0.75, -0.5);
    }
    else if(location === "guitar"){
        targetPosition.set(0.75, 1.5, 2);
        targetLookAt.set(-2, 1.15, -1);
    }
    else if(location === "lamp"){
        targetPosition.set(2.0, 1.0, 1.5);
        targetLookAt.set(-2, 0.25, -1);
    }
}

function openNav() {
    document.getElementById("menu").style.width = "250px";
}

function closeNav() {
    document.getElementById("menu").style.width = "0";
}

document.getElementById("closebtn").addEventListener("click", closeNav);
document.getElementById("openbtn").addEventListener("click", openNav)
const buttons = document.querySelectorAll('.option');
buttons.forEach(button => {
    button.addEventListener("click", next);
})

window.onload = main;
window.addEventListener("resize", onResize, true);
