//Three.js
var container;
var width = window.innerWidth;
var height = window.innerHeight;
var renderer, scene, camera, controls, stats, light;
var clock = new THREE.Clock();

var objects = [];
var materials = [];
var mouse = new THREE.Vector2();

//FOR_FILTERED_DATA
var objectsB = [], materialsB = [];
var objectsC = [], materialsC = [];

//Web Audio API
var context, source, analyser, buffer, audioBuffer;
var analyserView1;
var bufferLoader;

var isPlaying = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var detectorElem, canvasContext, pitchElem, noteElem, detuneElem, detuneAmount;
var confidence = 0;
var currentPitch = 0;

var buf;
var setup = false;

function initVisuals(){
	//THREE.JS
	container = document.createElement('div');
	document.body.appendChild(container);

	//scene
	scene = new THREE.Scene();
	//camera
	camera = new THREE.PerspectiveCamera( 55, width/height, 0.1, 100000 );
	scene.add(camera);
	camera.position.set(0,50,50);
	camera.lookAt(scene.position);

	scene.fog = new THREE.FogExp2(0xcccccc, 0.0005);

	//light
	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1,1,1);
	scene.add(light);

	light = new THREE.DirectionalLight(0xf0db00);
	light.position.set(-1,-1,-1);
	scene.add(light);

	//renderer
	renderer = new THREE.WebGLRenderer( {antialias: true} );
	renderer.setClearColor(scene.fog.color, 1);
	renderer.setSize(width, height);
	container.appendChild(renderer.domElement);

	//controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	//waves
	// for(var i=0; i<3; i++) {
	// 	var sw = new SinWave(time, frequency*4, amplitude, offset);
	// 	sinW.push(sw);
	// }

	//cube
	var cubeGeometry = new THREE.CubeGeometry(10,10,10);
	
	for(var i=0; i<samples; i++){
		var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x35d8c0});
		var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.x = 10*i;
		scene.add(cube);
		objects.push(cube);
		materials.push(cubeMaterial);

		//FILTERED_DATA_B
		cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff});
		cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.x = 10*i;
		cube.position.z = 100;
		cube.position.y = 0;
		scene.add(cube);
		objectsB.push(cube);
		materialsB.push(cubeMaterial);
	}

	for(var i=0; i<samples/4; i++){
		//FILTERED_DATA_C
		cubeMaterial = new THREE.MeshLambertMaterial({color: 0xc4f084});
		cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.x = 10*i;
		cube.position.z = 200;
		cube.position.y = 0;
		scene.add(cube);
		objectsC.push(cube);
		materialsC.push(cubeMaterial);		
	}

    window.addEventListener( 'resize', onWindowResize, false );
}

function update(){
	controls.update();
	var count = 0;
	updateAudio();
	for(var i=0; i<objects.length; i++){
		if(frequencyData[i]>250){
			objects[i].material.color.setHex(0xffff00);
			count ++;
			objectsB[i].material.color.setHex(0xffff00);
			objectsB[i].position.y = frequencyData[i];
			objectsC[count].position.y = frequencyData[count];

		} else if(frequencyData[i]>200){
			objects[i].material.color.setHex(0xff0000);
			objectsB[i].material.color.setHex(0xf084e9);
		} else {
			objects[i].material.color.setHex(0x35d8c0);

			if (objectsB[i].position.y>0)
				objectsB[i].position.y--;
			objectsB[i].material.color.setHex(0x00ffff);
		}
		objects[i].position.y = frequencyData[i];
	}

	for(var i=0; i<objectsC.length; i++){
		if (objectsC[i].position.y>0)
			objectsC[i].position.y --;		
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function render(){
	renderer.render(scene, camera);
}

function animate(){
	requestAnimationFrame(animate);
	update();
	render();
}