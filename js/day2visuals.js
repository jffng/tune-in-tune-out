//Three.js
var container;
var width = window.innerWidth;
var height = window.innerHeight;
var renderer, scene, camera, controls, stats, light;
var bg;
var clock = new THREE.Clock();

//shapes
var meshes;
var cubes = [];
var lineGeometry = [];
var lineMaterial;
var meshMaterial = [];
var triangles = [];
var circles = [];

var materials = [];
var mouse = new THREE.Vector2(); 
var xAngle = [];
var yAngle = [];
var zAngle = [];
var vertices = [];
var geometry = [];

// var triGeo, triMat, tris=[];
// var spikes = [], rabbits = [], spheres = [];
var cubeGeometry, sphereGeometry, spikeGeometry, rabbitGeometry;
var updateMeshes = [];

//angles of rotation
var s = [];
var t = [];

//FOR_FILTERED_DATA
var cubesB = [], materialsB = [];
var cubesC = [], materialsC = [];

var framesToSkip = 1; 
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
};

function euclideanBubbleSort(arrayOfVertices) {
	var distances = [];

	for(var i = 0; i < arrayOfVertices.length - 1; i++){
		distances[i] = Math.sqrt(
		Math.pow((arrayOfVertices[i].x - arrayOfVertices[i+1].x), 2) + 
		Math.pow((arrayOfVertices[i].y - arrayOfVertices[i+1].y), 2) +
		Math.pow((arrayOfVertices[i].z - arrayOfVertices[i+1].z), 2) );			
	}

	var swapped;
	do{
		swapped = false;
		for(i = 0; i < arrayOfVertices.length - 1; i++){
			if(distances[i] > distances[i + 1]) {
				var temp = arrayOfVertices[i];
				arrayOfVertices[i] = arrayOfVertices[i + 1];
				arrayOfVertices[i + 1] = temp;
				var tempDistance = distances[i];
				distances[i] = distances[i+1];
				distances[i + 1] = tempDistance;
				swapped = true;
			}
		}
	} while (swapped);
}

function initVisuals(){
	//THREE.JS
	$('body').append('<div id="container"></div>');
	// $('#container').append('<div id="info" style="font-size: 14px; font-style: italic; display: block; position: absolute; margin-top: 100px; margin-left: 40px;"><p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + oscType+'</p><p>Speed: ' + framesToSkip+'</p></div>');
	// $("#container").append('<div id="slider-vertical" style="height: 80%; position: absolute; right: 40px; top: 100px"></div>');
	$("#container").append('<div id="slider" style="width: 20%; position: absolute; left: 120px; top: 300px;"></div>');
	$("#container").append('<div id="speed" style="position: absolute; left: 45px; top: 295px;"><b>Speed: 1</div>');
	// $("#container").append('<div id="speed" style="width: 10%; position: absolute; left: 40px: top: 100px;"><input type="range" name="points" min="1" max="10"></input></div>');

	//scene
	scene = new THREE.Scene();
	//camera
	camera = new THREE.PerspectiveCamera( 55, width/height, 0.1, 100000 );
	scene.add(camera);
	camera.position.set(-790,215,650);
	camera.lookAt(scene.position);

	// scene.fog = new THREE.FogExp2(0xcccccc, 0.0005);

	//light
	light = new THREE.AmbientLight(0xfffff);
	light.position.set(1,1,1);
	scene.add(light);

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1,100,100);
	scene.add(light);

	//renderer
	renderer = new THREE.WebGLRenderer( {antialias: true} );
	// renderer.setClearColor(scene.fog.color, 1);
	renderer.setSize(width, height);
	$('#container').append(renderer.domElement);

	//controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	//geometry
	cubeGeometry = new THREE.CubeGeometry(40,40,40);

	// cubeMaterial.wireframe = true;
	lineMaterial = new THREE.LineBasicMaterial({
        color: 0x993333,
        linewidth: 3
    });

	for(var i=0; i<samples; i++){
		meshMaterial[i] = new THREE.MeshLambertMaterial();
		meshMaterial[i].ambient = new THREE.Color( 0x003366 );
		updateMeshes[i] = new THREE.Mesh(cubeGeometry, meshMaterial[i]);
		scene.add(updateMeshes[i]);
		updateMeshes[i].position.set(0,-10*i,0)

		lineGeometry[i] = new THREE.Geometry();
		var line = new THREE.Line(lineGeometry[i], lineMaterial);
		scene.add(line);		
	}

    window.addEventListener( 'resize', onWindowResize, false );
}	



function update(){
	controls.update();
	var x,y,z;
	
	for(var i = 0; i<samples; i++){
		x = -400+40*i;
		y = 2*frequencyData[i]-300;
		z = 0;
		updateMeshes[i].position.set(x,y,z);
		meshMaterial[i].needsUpdate = true;
		if (frequencyData[i]>180){
			meshMaterial[i].color.setRGB(1.0,0.0,0.0);
		}
		else if(frequencyData[i]>100){
			meshMaterial[i].color.setRGB(0.1,0.8,0.1);
		}
		else {
			meshMaterial[i].color.setHex(0x003366);
		}

		// lineGeometry[i].verticesNeedUpdate = true;
		// lineGeometry[i].vertices[0] = new THREE.Vector3(0, 0, 0);
		// lineGeometry[i].vertices[1] = new THREE.Vector3(x, y, z);	
		// lineMaterial.needsUpdate = true;
		// lineMaterial.color.setRGB(x,y,z);	
		// vertices[i] = new THREE.Vector3(x,y,z);
		// euclideanBubbleSort(vertices);
	}
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