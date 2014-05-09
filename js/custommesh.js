//Three.js
var container;
var width = window.innerWidth;
var height = window.innerHeight;
var renderer, scene, camera, controls, stats, light;
var bg;
var clock = new THREE.Clock();

//shapes
var cubes = [];
var lineGeometry = [];
var triangles = [];
var circles = [];

var materials = [];
var mouse = new THREE.Vector2();
var xAngle = [];
var yAngle = [];
var zAngle = [];

var triGeo, triMat, tris=[];

//angles of rotation
var s = [];
var t = [];

//FOR_FILTERED_DATA
var cubesB = [], materialsB = [];
var cubesC = [], materialsC = [];


var framesToSkip = 4; 
var counter = 0;

var framesToSkips = {
	1: "1",
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	10: "10"
}

function initVisuals(){
	//THREE.JS
	$('body').append('<div id="container"></div>');
	$('#container').append('<div id="info" style="font-size: 14px; font-style: italic; display: block; position: absolute; margin-top: 100px; margin-left: 40px;"><p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + oscType+'</p><p>Speed: ' + framesToSkip+'</p></div>');

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

	light = new THREE.DirectionalLight(0xffff00);
	light.position.set(-1,-1,-1);
	scene.add(light);

	//renderer
	renderer = new THREE.WebGLRenderer( {antialias: true} );
	renderer.setClearColor(scene.fog.color, 1);
	renderer.setSize(width, height);
	$('#container').append(renderer.domElement);

	//controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	//geometry
	var cubeGeometry = new THREE.CubeGeometry(20,20,20);
	var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
	var tetGeometry = new THREE.TetrahedronGeometry(10,0);
	var circleGeometry = new THREE.CircleGeometry(10,16);

	var geometry = [];

	for(var i=0; i<samples; i++){
		s[i] = Math.random()*2*Math.PI;
		t[i] = Math.random()*2*Math.PI;
		xAngle[i] = Math.cos(s[i]) * Math.sin(t[i]);
		yAngle[i] = Math.sin(s[i]) * Math.sin(t[i]);
		zAngle[i] = Math.cos(t[i]);

		// var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x35d8c0});

		// var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

		// scene.add(cube);
		// cubes.push(cube);
		// materials.push(cubeMaterial);

		// lineGeometry[i] = new THREE.Geometry();
		// var line = new THREE.Line(lineGeometry[i], lineMaterial);
		// scene.add(line);

		geometry[i] = new THREE.Geometry();
		geometry[i].vertices.push(new THREE.Vector3(xAngle[i]*10,yAngle[i]*10,zAngle[i]*10));
		if(i%3 === 0 && i>0){
			geometry[i].faces.push(new THREE.Face3(i,i-1,i-2));
			// geometry.computeFaceNormals();
			var mesh = new THREE.Mesh(geometry[i], new THREE.MeshNormalMaterial());
			console.log(mesh);
			scene.add(mesh);
		}
	}

    window.addEventListener( 'resize', onWindowResize, false );
}

function update(){
	controls.update();
	// fftVisuals.getByteFrequencyData(frequencyDataVisuals);

	// for(var i=0; i<cubes.length; i++){
	// 	var x = 2*frequencyData[i] * xAngle[i];
	// 	var y = 2*frequencyData[i] * yAngle[i];
	// 	var z = 2*frequencyData[i] * zAngle[i];

	// 	cubes[i].position.set(x, y, z);

	// 	lineGeometry[i].verticesNeedUpdate = true;
	// 	lineGeometry[i].vertices[0] = new THREE.Vector3(0, 0, 0);
	// 	lineGeometry[i].vertices[1] = new THREE.Vector3(x, y, z);
	// 	// cubes[i].material.color.setRGB(256/frequencyData[i],25/frequencyData[i],25/frequencyData[i]);
	// }
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function changeSpeed (_speed) {
	framesToSkip = framesToSkips[_speed];
}

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