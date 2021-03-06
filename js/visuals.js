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

function initVisuals(){
	//THREE.JS
	$('body').append('<div id="container"></div>');
	$('#container').append('<div id="info" style="font-size: 14px; font-weight: bold; font-style: italic; display: block; position: absolute; margin-top: 75px; margin-left: 40px;">' 
		+ music.currentKey + ' ' + music.currentScale + ' ' + music.currentMode +
		'</div>');

	//scene
	scene = new THREE.Scene();
	//camera
	camera = new THREE.PerspectiveCamera( 55, width/height, 0.1, 100000 );
	scene.add(camera);
	camera.position.set(760,84,183);
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
	for(var i=0; i<objects.length; i++){
		if(frequencyData[i]>250){
			objects[i].material.color.setHex(0xffff00);
			count ++;
			objectsB[i].material.color.setHex(0xffff00);
			objectsB[i].position.y = frequencyData[i];
			objectsC[count].position.y = frequencyData[count];

		} else if(frequencyData[i]>100){
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