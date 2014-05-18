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
			// $("#info").html('<p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + currentWaveform+'</p><p>Speed: ' + currentSpeed+'</p>');
		});
		if(n == thisKey){
			$("#"+n).addClass('info');
		}
	}
	for(var s in scales) {
		// $("#scale").append('<li id="'+ s +'"><a href="#">'+ s +'</a></li>');
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
			// $("#info").html('<p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + currentWaveform+'</p><p>Speed: ' + currentSpeed+'</p>');
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
	for(var s in waveforms) {
		$("#sound").append('<li id="'+ s +'"><a href="#">'+ s +'</a></li>')
		$("#"+s).click(function(eventData) {
			currentWaveform = eventData.currentTarget.id;
			changeOscillator(currentWaveform);
			$("#info").html('<p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + currentWaveform+'</p><p>Speed: ' + currentSpeed+'</p>');
			// console.log(thisSound);
		});		
	}

	// speed dropdown
	for(var s in framesToSkips) {
		$("#speed").append('<li id="'+ s +'"><a href="#">'+ s +'</a></li>')
		$("#"+s).click(function(eventData) {
			currentSpeed = eventData.currentTarget.id;
			changeSpeed(currentSpeed);
			$("#info").html('<p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + currentWaveform+'</p><p>Speed: ' + currentSpeed+'</p>');
			// console.log(thisSound);
		});		
	}	

	$(function() {
		///////////////////////// SLIDERS
		var previous = 0;
		var previousDolly = 0;		
		$( "#slider-vertical" ).slider({
			orientation: "vertical",
			min: 0,
			max: 100,
			value: 0,
			slide: function( event, ui ) {
				if(ui.value > previousDolly){
					var dolly = (ui.value - previousDolly) / 25 + 1.05;
					controls.dollyIn(dolly);
					previousDolly = ui.value;
				}
				else{
					var dolly = (previousDolly - ui.value) / 25 + 1.05;
					controls.dollyOut(dolly);
					previousDolly = ui.value;
				}
			}
		});
		$(function() {
		$( "#slider" ).slider({
			range: false,
			min: 0,
			max: 100,
			value: 0,
			slide: function(event, ui) {
				if(ui.value > previous){
					controls.rotateLeft( 2*Math.PI / 90);
					previous = ui.value;
				}
				else{
					controls.rotateLeft(-2*Math.PI / 90);
					previous = ui.value;
				}
			}
			});
		});
	});
}