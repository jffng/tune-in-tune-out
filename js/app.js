$(document).ready(function() {
	initInterface();
	initAudio();
	initVisuals();
	animate();		
});

var framesToSkip = 8, counter = 0;

function animate(){
	update();
	updateAudio();
	render();
	requestAnimationFrame(animate);
}

// function animate(){
// 	if(counter<framesToSkip){
// 		counter++;
// 		requestAnimationFrame(animate);
// 		return;
// 	}
// 	update();
// 	updateAudio();
// 	render();

// 	counter = 0;
// 	requestAnimationFrame(animate);
// }