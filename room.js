import * as THREE from 'three';
import { roomLoader } from './roomLoader.js';

let  camera, renderer, targetPosition, targetLookAt, Animationflag, textBox, ui; 
let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
const SPEED = 0.0075;

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
    createTextBox("about");
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
    pointLight.shadow.mapSize.height = 1024; 
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
            console.log(targetPosition);

            if(targetPosition.equals(new THREE.Vector3(0.75, 1.5, 2))){
                createTextBox("about");
            }
            else if(targetPosition.equals(new THREE.Vector3(0.75, 1.5, 0.75))){
                createTextBox("academics");
            }
            else if(targetPosition.equals(new THREE.Vector3(2.5, 1.5, 0.5))){
                createTextBox("experience");
            }
            else if(targetPosition.equals(new THREE.Vector3(2.0, 1.0, 1.5))){
                createTextBox("skills")

            }

        }
    }
}

function createTextBox(tab) {
    ui = document.createElement("div");
    ui.id = "ui";

    textBox = document.createElement("div");
    textBox.id = "textBox";

    switch(tab){
        case "about":
            textBox.innerHTML = `<div class="intro">
            <h1>Sebastian Del Pino Mendivil</h1>
            <p>Motivated part-time computer science student seeking a full-time software development role to gain industry experience and grow technical skills. Open to working across all areas of software, with a personal interest in computer graphics and vision.</p>
            </div>`;
            break;
        case "academics": textBox.innerHTML = `<div class="education">
            <h1>Education</h1>
            <div class="school">
                <p>
                <strong>University of Ottawa</strong>, Honours BSc in Computer Science<br>
                <span class="date">Sept. 2021 - Dec. 2025 (Expected)</span>
                </p>
                <p><strong>CGPA:</strong> 8.0 / 10.0</p>
                <p>
                <strong>Relevant Coursework:</strong><br>
                Computer Graphics, Computer Vision, Real-Time Systems, Computer Architecture, Operating Systems, Data Structures & Algorithms, Introduction to AI, Fundamentals of Data Science, Databases, Data Communications and Networking
                </p>
            </div>
            </div>`;
            break;
        case "experience": textBox.innerHTML = `<div class="experience">
            <h1>Experience</h1>
            <div class="job">
                <p><strong>Software Developer</strong>, Matrox Graphics Inc. - Montreal, QC<br>
                <span class="date">Jan. 2024 - Apr. 2024</span></p>
                <ul>
                <li>Built a prototype integrating Matrox's proprietary SDK and SMPTE ST 2110 NIC cards with the GStreamer multimedia framework using C/C++.</li>
                <li>Presented research findings and prototype updates to 50+ employees and executives, demonstrating successful integration of Matrox video cards with GStreamer.</li>
                <li>Improved build systems, SDKs, and video tools by implementing new features and fixing bugs.</li>
                </ul>
            </div>

            <div class="job">
                <p><strong>ABAP Developer</strong>, Government of Canada (PSPC) - Hull, QC<br>
                <span class="date">Jun. 2023 - Aug. 2023</span></p>
                <ul>
                <li>Designed and implemented an ABAP program to automate data transfer from Excel to SAP, reducing manual work and improving data accuracy.</li>
                </ul>
            </div>
            </div>`;
            break;
        case "skills": textBox.innerHTML = `<div class="skills">
            <h1>Skills</h1>
            <ul>
            <li><strong>Programming Languages:</strong> C++, C, Java, Python, JavaScript, SQL, HTML, CSS, Go</li>
            <li><strong>Technologies:</strong> Git, Vite.js, Vulkan, OpenGL, OpenCV, PyTorch</li>
            <li><strong>Tools:</strong> Visual Studio, VSCode, Jupyter, MySQL</li>
            <li><strong>Operating Systems:</strong> Windows, Linux, macOS</li>
            <li><strong>Spoken Languages:</strong> English, French, Spanish</li>
            </ul>
            </div>`;
            break;
    }


    ui.appendChild(textBox);
    document.body.appendChild(ui);

    setTimeout(() => {
        textBox.style.opacity = "1";
        textBox.style.transform = "translateY(0)";
    }, 100);
}

function deleteTextBox() {
    textBox.style.opacity = "0";
    textBox.style.transform = "translateY(10px)";

    setTimeout(() => {
        if (ui && ui.parentNode) {
            ui.parentNode.removeChild(ui);
        }
    }, 250); 
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
    deleteTextBox();
    closeNav();

    switch(location){
        case "bookshelf":
            targetPosition.set(0.75, 1.5, 0.75);
            targetLookAt.set(0.50, 1.25, -0.5);
            break;
        case "laptop":
            targetPosition.set(2.5, 1.5, 0.5);
            targetLookAt.set(1.5, 0.75, -0.5);
            break;
        case "guitar":
            targetPosition.set(0.75, 1.5, 2);
            targetLookAt.set(-2, 1.15, -1);
            break;
        case "lamp":        
            targetPosition.set(2.0, 1.0, 1.5);
            targetLookAt.set(-2, 0.25, -1);
            break;
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
