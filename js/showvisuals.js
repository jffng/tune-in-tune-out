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
var meshMaterial;
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
	camera.position.set(1000,475,-775);
	camera.lookAt(scene.position);

	scene.fog = new THREE.FogExp2(0xcccccc, 0.0005);

	//light
	light = new THREE.AmbientLight(0xCCFFFF);
	light.position.set(1,1,1);
	scene.add(light);

	light = new THREE.DirectionalLight(0xCCFFFF);
	light.position.set(1,1,1);
	scene.add(light);

	//renderer
	renderer = new THREE.WebGLRenderer( {antialias: true} );
	renderer.setClearColor(scene.fog.color, 1);
	renderer.setSize(width, height);
	$('#container').append(renderer.domElement);

	//controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	//geometry
	cubeGeometry = new THREE.CubeGeometry(20,20,20);
	meshMaterial = new THREE.MeshLambertMaterial();
	meshMaterial.ambient = new THREE.Color( 0x003366 );

	// cubeMaterial.wireframe = true;
	lineMaterial = new THREE.LineBasicMaterial({
        color: 0x993333,
        linewidth: 3
    });

	//BUILD_MESHES_SPHERE
	////////////////////////////////////////////////////////////
	// var modelMaterial = new THREE.MeshLambertMaterial( {color: 0xe6ec27} );
	// sphereGeometry = new THREE.SphereGeometry(10,32,32);
	// // for(var i=0; i<samples; i++){
	// // 	s[i] = Math.random()*2*Math.PI;
	// // 	t[i] = Math.random()*2*Math.PI;
	// // 	xAngle[i] = Math.cos(s[i]) * Math.sin(t[i]);
	// // 	yAngle[i] = Math.sin(s[i]) * Math.sin(t[i]);
	// // 	zAngle[i] = Math.cos(t[i]);
	// // 	spheres[i] = new THREE.Mesh(sphereGeo, modelMaterial);
	// // 	// spheres[i].scale.set(1,1,1);
	// // 	scene.add(spheres[i]);
	// // }

	// //BUILD_MESHES_SPIKE
	// ////////////////////////////////////////////////////////////
	// modelMaterial = new THREE.MeshLambertMaterial( {color: 0x00ffff} );
	// loadModelSpike("models/spikeStar.js", modelMaterial);

	// //BUILD_MESHES_RABBIT
	// ////////////////////////////////////////////////////////////
	// modelMaterial = new THREE.MeshLambertMaterial( {color: 0xf26d95} );
	// loadModelRabbit("models/rabbit.js", modelMaterial);	

	// meshes = {
	// 	"sphere": sphereGeometry,
	// 	"cube": cubeGeometry,
	// 	"spike": spikeGeometry,
	// 	"rabbit": rabbitGeometry
	// };

	for(var i=0; i<samples; i++){
		s[i] = Math.random()*2*Math.PI;
		t[i] = Math.random()*2*Math.PI;
		xAngle[i] = Math.cos(s[i]) * Math.sin(t[i]);
		yAngle[i] = Math.sin(s[i]) 	* Math.sin(t[i]);
		zAngle[i] = Math.cos(t[i]);
		updateMeshes[i] = new THREE.Mesh(cubeGeometry, meshMaterial);
		scene.add(updateMeshes[i]);

		lineGeometry[i] = new THREE.Geometry();
		var line = new THREE.Line(lineGeometry[i], lineMaterial);
		scene.add(line);		
	}

    window.addEventListener( 'resize', onWindowResize, false );
}	

function loadModelSpike (model, meshMat) {
	var material = meshMat;
	var loader = new THREE.JSONLoader();

	loader.load(model, function(geometry){
		spikeGeometry = geometry;
		// for(var i=0; i<samples; i++){
		// 	s[i] = Math.random()*2*Math.PI;
		// 	t[i] = Math.random()*2*Math.PI;
		// 	xAngle[i] = Math.cos(s[i]) * Math.sin(t[i]);
		// 	yAngle[i] = Math.sin(s[i]) * Math.sin(t[i]);
		// 	zAngle[i] = Math.cos(t[i]);
		// 	spikes[i] = new THREE.Mesh(geometry, material);
		// 	spikes[i].scale.set(0.001,0.001,0.001);
		// 	scene.add(spikes[i]);
		// }

	}, "js");
}

function loadModelRabbit (model, meshMat) {
	var material = meshMat;
	var loader = new THREE.JSONLoader();

	loader.load(model, function(geometry){
		rabbitGeometry = geometry;
		// for(var i=0; i<samples; i++){
		// 	s[i] = Math.random()*2*Math.PI;
		// 	t[i] = Math.random()*2*Math.PI;
		// 	xAngle[i] = Math.cos(s[i]) * Math.sin(t[i]);
		// 	yAngle[i] = Math.sin(s[i]) * Math.sin(t[i]);
		// 	zAngle[i] = Math.cos(t[i]);
		// 	rabbits[i] = new THREE.Mesh(geometry, material);
		// 	rabbits[i].scale.set(0.001,0.001,0.001);
		// 	scene.add(rabbits[i]);
		//}
	}, "js");
}

//CHANGE_MODELS_BASED_ON_WAVE_FORM
///////////////////////////////////////////////////////////////
function changeModel(_waveForm){
	for(var i = 0; i<samples -1 ; i++){
		// meshes[i].geometry.verticesNeedUpdate = true;
		// meshes[i].geometry.buffersNeedUpdate = true;
		// meshes[i].geometry.dynamic = true;
		// meshes[i].geometry.elementsNeedUpdate = true;	
		if(_waveForm == "sine"){
			meshes[i].geometry = sphereGeometry;
		}
		else if(_waveForm == "square"){
			meshes[i].geometry = cubeGeometry;		
		}
		else if(_waveForm == "sawtooth"){
			meshes[i].geometry = spikeGeometry;
		}
		else if(_waveForm == "triangle"){
			meshes[i].geometry = rabbitGeometry;
		}
	}
}

function update(){
	controls.update();
	var x,y,z;
	
	// for(var i=0; i<samples; i++){
	// 	if(currentWaveform == "sine") updateMeshes[i].geometry = meshes.sphere;
	// 	else if (currentWaveform == "square") updateMeshes[i].geometry = meshes.cube;
	// 	else if (currentWaveform == "sawtooth") updateMeshes[i].geometry = meshes.spike;
	// 	else if (currentWaveform == "triangle") updateMeshes[i].geometry = meshes.rabbit;
	// }
	
	for(var i = 0; i<samples; i++){
		x = 2*frequencyData[i]*xAngle[i];
		y = 2*frequencyData[i]*yAngle[i];
		z = 2*frequencyData[i]*zAngle[i];
		updateMeshes[i].position.set(x, y, z);

		lineGeometry[i].verticesNeedUpdate = true;
		lineGeometry[i].vertices[0] = new THREE.Vector3(0, 0, 0);
		lineGeometry[i].vertices[1] = new THREE.Vector3(x, y, z);	
		// lineMaterial.needsUpdate = true;
		// lineMaterial.color.setRGB(x,y,z);	
		// vertices[i] = new THREE.Vector3(x,y,z);
		// euclideanBubbleSort(vertices);
	}
	// var distance = Math.sqrt(
	// 	Math.pow(camera.position.x, 2) + 
	// 	Math.pow(camera.position.y, 2) + 
	// 	Math.pow(camera.position.z, 2) );

	// volume = Math.min(0.05,Math.max(0,0.005+(1/distance))); 
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