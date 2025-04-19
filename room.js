let camera, renderer, lights;

function init(){
    
    var container = document.createElement("div");
	document.body.appendChild(container);
	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0x99c0e3));
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

 
    var scene = new THREE.Scene();
}




function onResize() {
    var aspect = window.innerWidth / window.innerHeight;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

window.addEventListener("resize", onResize, true);