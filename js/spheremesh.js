//Three.js
var container;
var width = window.innerWidth;
var height = window.innerHeight;
var renderer, scene, camera, controls, stats, light;
var bg;
var clock = new THREE.Clock();

//shapes
var cubes = [];
var lineGeometry, lineMaterial;
var triangles = [];
var circles = [];

var materials = [];
var mouse = new THREE.Vector2(); 
var xAngle = [];
var yAngle = [];
var zAngle = [];
var vertices = [];
var geometry = [];

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
};

var sphere, sphereGeo, sphereMat;
var plane, planeGeo, planeMat;


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
	$('#container').append('<div id="info" style="font-size: 14px; font-style: italic; display: block; position: absolute; margin-top: 100px; margin-left: 40px;"><p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + oscType+'</p><p>Speed: ' + framesToSkip+'</p></div>');
	$("#container").append('<div id="slider-vertical" style="height: 80%; position: absolute; right: 40px; top: 100px"></div>');
	$("#container").append('<div id="slider" style="width: 90%; position:absolute; left: 40px; bottom: 40px;"></div>');

	//scene
	scene = new THREE.Scene();
	//camera
	camera = new THREE.PerspectiveCamera( 55, width/height, 0.1, 100000 );
	scene.add(camera);
	camera.position.set(362,-430,492);
	camera.lookAt(scene.position);

	// scene.fog = new THREE.FogExp2(0xcccccc, 0.0005);

	//light
	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1,1,1);
	scene.add(light);

	light = new THREE.DirectionalLight(0xffff00);
	light.position.set(-1,-1,-1);
	scene.add(light);

	//renderer
	renderer = new THREE.WebGLRenderer( {antialias: true} );
	// renderer.setClearColor(scene.fog.color, 1);
	renderer.setSize(width, height);
	$('#container').append(renderer.domElement);

	//controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	//geometry
	var cubeGeometry = new THREE.CubeGeometry(20,20,20);
	lineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000
    });
	var tetGeometry = new THREE.TetrahedronGeometry(10,0);
	var circleGeometry = new THREE.CircleGeometry(10,16);

	lineGeometry = new THREE.Geometry();

	for(var i=0; i<samples; i++){
		s[i] = Math.random()*2*Math.PI;
		t[i] = Math.random()*2*Math.PI;
		// s[i] = Math.PI*2/samples;
		// t[i] = Math.PI*2/samples;

		xAngle[i] = Math.cos(s[i]) * Math.sin(t[i]);
		yAngle[i] = Math.sin(s[i]) * Math.sin(t[i]);
		zAngle[i] = Math.cos(t[i]);
		vertices[i] = new THREE.Vector3(xAngle[i]*2,yAngle[i]*2,zAngle[i]*2);
		lineGeometry.vertices.push(vertices[i]);
	}

	var line = new THREE.Line(lineGeometry, lineMaterial);
	scene.add(line);

	//SPHERE
	sphereGeo = new THREE.SphereGeometry(10,7,7);
	sphereGeo.dynamic = true;
	sphereGeo.computeFaceNormals();
	sphereGeo.computeVertexNormals();

	sphereMat = new THREE.MeshLambertMaterial({color: 0x00ffff});
	sphere = new THREE.Mesh(sphereGeo, sphereMat);
	scene.add(sphere);

	//PLANE
	planeGeo = new THREE.PlaneGeometry(100,100,8,8);
	planeGeo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	planeGeo.dynamic=true;
	sphereGeo.computeFaceNormals();
	sphereGeo.computeVertexNormals();

	planeMat = new THREE.MeshLambertMaterial({color: 0xffff00});
	plane = new THREE.Mesh(planeGeo, planeMat);
	// scene.add(plane);

	// for(i=0; i<samples; i++){
	// 	if(i==samples-1){
	// 		geometry[i] = new THREE.Geometry();
	// 		geometry[i].vertices.push(vertices[i]);	
	// 		geometry[i].vertices.push(vertices[0]);
	// 	}
	// 	else{
	// 		geometry[i] = new THREE.Geometry();
	// 		geometry[i].vertices.push(vertices[i]);	
	// 		geometry[i].vertices.push(vertices[i+1]);
	// 	}
	// 	var line = new THREE.Line(geometry[i], lineMaterial);
	// 	scene.add(line);
	// }

	// for(i=0; i<samples/3-1; i++){
	// 	geometry[i] = new THREE.Geometry();
	// 	geometry[i].vertices.push(vertices.shift());	
	// 	geometry[i].vertices.push(vertices.shift());
	// 	geometry[i].vertices.push(vertices.shift());
	// 	geometry[i].faces.push(new THREE.Face3(0,1,2));
	// 	geometry[i].computeFaceNormals();
	// 	var mesh = new THREE.Mesh(geometry[i], new THREE.MeshNormalMaterial());
	// 	scene.add(mesh);
	// }

    window.addEventListener( 'resize', onWindowResize, false );
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function update(){
	controls.update();
	var x,y,z;
	for(var i = 0; i<samples; i++){
		
		x = 2*(frequencyData[i]+2)*xAngle[i];
		y = 2*(frequencyData[i]+2)*yAngle[i];
		z = 2*(frequencyData[i]+2)*zAngle[i];
		// cubes[i].position.set(x, y, z);
		// lineGeometry[i].verticesNeedUpdate = true;
		// lineGeometry[i].vertices[0] = new THREE.Vector3(0, 0, 0);
		// lineGeometry[i].vertices[1] = new THREE.Vector3(x, y, z);		
		vertices[i] = new THREE.Vector3(x,y,z);
		euclideanBubbleSort(vertices);

		//SPHERE
		// var xM = map_range(x, -50, 50, 0, 30);
		// var yM = map_range(y, -50, 50, 0, 30);
		// var zM = map_range(z, -50, 50, 0, 30);
		// sphereGeo.vertices[i].x = x/5;
		// sphereGeo.vertices[i].y = y/5;
		// sphereGeo.vertices[i].z = z/5;

		sphereGeo.vertices[i].x = x;
		sphereGeo.vertices[i].y = y;
		sphereGeo.vertices[i].z = z;

		sphere.geometry.verticesNeedUpdate = true;


		//PLANE
		// planeGeo.vertices[ i ].y = 35 * Math.sin( i / 5 + ( x + i ) / 7 );
		// plane.geometry.verticesNeedUpdate = true;
	}

	for(i = 0; i<samples;i++){
		lineGeometry.verticesNeedUpdate = true;
		if(i==samples-1){
			lineGeometry.vertices[i] = vertices[i];
			lineGeometry.vertices[i+1] = vertices[0];
			// geometry[i].vertices[0] = vertices[i];
			// geometry[i].vertices[1] = vertices[0];	
		}
		else{
			lineGeometry.vertices[i] = vertices[i];
			lineGeometry.vertices[i+1] = vertices[i+1];
			// geometry[i].vertices[0] = vertices[i];
			// geometry[i].vertices[1] = vertices[i+1];				
		}
		lineMaterial.needsUpdate = true;
		lineMaterial.color.setRGB(x,y,z);
	}

	//SPHERE
	// if(sphere){
	// 	for(var i=0; i<sphereGeo.vertices.length; i++){

	// 	}
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