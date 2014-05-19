function initInterface() {
	// key dropdown
	var thisKey = music.currentKey;
	var thisMode = music.currentMode;
	var thisScale = music.currentScale;
	var currentSpeed = framesToSkip;

	//////////// INITIALIZE THE MUSIC TABLE
	for(var n in baseNotes) {
		$("#tableKey").append('<td id="'+ n +'">'+ n +'</td>');
		$("#"+n).click(function(eventData) {
			thisKey = eventData.currentTarget.id;
			ref = baseNotes[thisKey];
			music.setKey(baseNotes[thisKey], thisKey);
			for(var n in baseNotes){
				if(n == thisKey) {
					$("#"+n).addClass('info');	
				}
				else{
					$("#"+n).removeClass('info');
				}
			}
			// console.log(thisKey);
		});
		if(n == thisKey){
			$("#"+n).addClass('info');
		}
	}
	for(var s in scales) {
		$("#tableScale").append('<td id="'+ s +'">'+ s +'</td>');		
		$("#"+s).click(function(eventData) {
			thisScale = eventData.currentTarget.id;
			music.setSeptScale(scales[thisScale], thisScale);
			for(var s in scales){
				if(s == thisScale) {
					$("#"+s).addClass('info');			
				}
				else{
					$("#"+s).removeClass('info');
				}
			}			
			// console.log(thisScale);
		});	
		if(s == thisScale){
			$("#"+s).addClass('info');
		}
	}
	for(var m in modes) {
		// $("#mode").append('<li id="'+ m +'"><a href="#">'+ m +'</a></li>')
		$("#tableMode").append('<td id="'+ m +'">'+ m +'</td>');		
		$("#"+m).click(function(eventData) {
			thisMode = eventData.currentTarget.id;
			for(var m in modes){
				if(m == thisMode) {
					$("#"+m).addClass('info');			
				}
				else{
					$("#"+m).removeClass('info');
				}
			}
			if(modes[thisMode].length === scales[thisScale].length) {
				music.setMode(modes[thisMode], thisMode);
				// $("#info").html('<p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + currentWaveform+'</p><p>Speed: ' + currentSpeed+'</p>');
			}
			else{
				alert("No such musical transformation!")
			}
			// console.log(thisMode);
		});
		if(m == thisMode){
			$("#"+m).addClass('info');
		}		
	}

	// sound dropdown
	for(var w in waveforms) {
		$("#tableWaveform").append('<td id="'+ w +'">'+ w +'</td>');		
		$("#"+w).click(function(eventData) {
			currentWaveform = eventData.currentTarget.id;
			changeOscillator(currentWaveform);

			for(var w in waveforms){
				if(w == currentWaveform) {
					$("#"+w).addClass('info');			
				}
				else{
					$("#"+w).removeClass('info');
				}
			}			
			// console.log(thisScale);
		});	
		if(w == currentWaveform){
			$("#"+w).addClass('info');
		}		
	}	

	$(function() {
		$( "#slider" ).slider({
			range: false,
			min: 1,
			max: 10,
			value: 1,
			slide: function(event, ui) {
				currentSpeed = ui.value;
				changeSpeed(currentSpeed);
				$( "#speed" ).html( "<b>Speed: " + ui.value );		
				}
			});
	    $( "#speed" ).val( $( "#slider" ).slider( "value" ) );	
	});

	// $(function() {
	// 	///////////////////////// SLIDERS
	// 	var previous = 0;
	// 	var previousDolly = 0;		
	// 	$( "#slider-vertical" ).slider({
	// 		orientation: "vertical",
	// 		min: 0,
	// 		max: 100,
	// 		value: 0,
	// 		slide: function( event, ui ) {
	// 			if(ui.value > previousDolly){
	// 				var dolly = (ui.value - previousDolly) / 25 + 1.05;
	// 				controls.dollyIn(dolly);
	// 				previousDolly = ui.value;
	// 			}
	// 			else{
	// 				var dolly = (previousDolly - ui.value) / 25 + 1.05;
	// 				controls.dollyOut(dolly);
	// 				previousDolly = ui.value;
	// 			}
	// 		}
	// 	});
	// 	$(function() {
	// 	$( "#slider" ).slider({
	// 		range: false,
	// 		min: 0,
	// 		max: 100,
	// 		value: 0,
	// 		slide: function(event, ui) {
	// 			if(ui.value > previous){
	// 				controls.rotateLeft( 2*Math.PI / 90);
	// 				previous = ui.value;
	// 			}
	// 			else{
	// 				controls.rotateLeft(-2*Math.PI / 90);
	// 				previous = ui.value;
	// 			}
	// 		}
	// 		});
	// 	});
	// });
}