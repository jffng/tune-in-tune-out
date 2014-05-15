$(document).ready(function() {
	initAudio();
	initVisuals();
	initInterface();
	animate();		
});


function animate(){
	requestAnimationFrame(animate);
	render();
}