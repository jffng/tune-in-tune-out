$(document).ready(function() {
	initInterface();
	initAudio();
	initVisuals();
	animate();		
});


function animate(){
	requestAnimationFrame(animate);
	render();
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
// 		update();
// 		render();			
// 		requestAnimationFrame(animate);
// 		return;
// 	}

// 	update();
// 	render();
// 	updateAudio();
// 	requestAnimationFrame(animate);
// 	counter = 0;
// }
