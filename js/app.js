$(document).ready(function() {
	initInterface();
	initAudio();
	initVisuals();
	animate();		
});

var framesToSkip = 1, counter = 0;

function animate(){
	requestAnimationFrame(animate);
	update();
	render();

	//DELAY_UPDATE_AUDIO	
	if(counter<framesToSkip){
		counter++;
		return;
	} else {
		updateAudio();
		counter = 0;
	}
}


// function animate(){
// 	update();
// 	updateAudio();
// 	render();
// 	requestAnimationFrame(animate);
// }

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