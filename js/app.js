$(document).ready(function() {
	initInterface();
	initAudio();
	initVisuals();
	animate();		
});

var framesToSkip = 10, counter = 0;

// function animate(){
// 	update();
// 	updateAudio();
// 	render();
// 	requestAnimationFrame(animate);
// }

function animate(){
	if(counter<framesToSkip){
		counter++;
		update();
		render();			
		requestAnimationFrame(animate);
		return;
	}

	update();
	render();
	updateAudio();
	counter = 0;
	requestAnimationFrame(animate);
}