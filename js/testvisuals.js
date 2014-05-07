//Three.js
var container;
var width = window.innerWidth;
var height = window.innerHeight;
var renderer, scene, camera, controls, stats, light;
var clock = new THREE.Clock();

var cubes = [];
var materials = [];
var mouse = new THREE.Vector2();

var triGeo, triMat, tris=[];

//angles of rotation
var s = [];
var t = [];

//FOR_FILTERED_DATA
var cubesB = [], materialsB = [];
var cubesC = [], materialsC = [];

function initVisuals(){
	//THREE.JS
	$('body').append('<div id="container"></div>');
	$('#container').append('<div id="info" style="font-size: 14px; font-style: italic; display: block; position: absolute; margin-top: 100px; margin-left: 40px;"><p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + oscType+'</p></div>');

	//scene
	scene = new THREE.Scene();
	//camera
	camera = new THREE.PerspectiveCamera( 55, width/height, 0.1, 100000 );
	scene.add(camera);
	camera.position.set(362,-430,492);
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
	$('#container').append(renderer.domElement);

	//controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	//cube
	var cubeGeometry = new THREE.CubeGeometry(20,20,20);
	
	for(var i=0; i<samples; i++){
		s[i] = Math.random()*2*Math.PI;
		t[i] = Math.random()*2*Math.PI;
		var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x35d8c0});
		var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		scene.add(cube);
		cubes.push(cube);
		materials.push(cubeMaterial);
	}

	//tetrahedronGeometry
	triGeometry = new THREE.TetrahedronGeometry(10);
	for(var i=0; i<10; i++){
		s[i] = Math.random()*2*Math.PI;
		t[i] = Math.random()*2*Math.PI;
		var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x35d8c0});
		var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		scene.add(cube);
		cubes.push(cube);
		materials.push(cubeMaterial);
	}

    window.addEventListener( 'resize', onWindowResize, false );
}

function createTri(){

}

function update(){
	controls.update();
	// fftVisuals.getByteFrequencyData(frequencyDataVisuals);

	for(var i=0; i<cubes.length; i++){
		// set angle multipliers
		var xAngle = Math.cos(s[i]) * Math.sin(t[i]);
		var yAngle = Math.sin(s[i]) * Math.sin(t[i]);
		var zAngle = Math.cos(t[i]);
		var x = 2*frequencyData[i] * xAngle;
		var y = 2*frequencyData[i] * yAngle;
		var z = 2*frequencyData[i] * zAngle;
		cubes[i].position.set(x, y, z);
		// cubes[i].position.x--;
		// cubes[i].position.y--;
		// cubes[i].position.z--;
		// cubes[i].material.color.setRGB(256/frequencyData[i],25/frequencyData[i],25/frequencyData[i]);
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

var framesToSkip = 4, counter = 0;

function render(){
	update();

	//DELAY_UPDATE_AUDIO	
	if(counter<framesToSkip){
		counter++;
		return;
	} else {
		updateAudio();
		counter = 0;
	}

	renderer.render(scene, camera);
}