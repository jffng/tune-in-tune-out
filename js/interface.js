function initInterface() {
	// key dropdown
	var thisKey, thisMode;
	var thisScale = "major";
	for(var n in baseNotes) {
		$("#key").append('<li id="'+ n +'"><a href="#">'+ n +'</a></li>');
		$("#"+n).click(function(eventData) {
			thisKey = eventData.currentTarget.id;
			ref = baseNotes[thisKey];
			music.setKey(baseNotes[thisKey], thisKey)
			// console.log(thisKey);
			$("#info").html('<p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + currentWaveform+'</p><p>Speed: ' + currentSpeed+'</p>');
		});
	}

	// scale dropdown
	for(var s in scales) {
		$("#scale").append('<li id="'+ s +'"><a href="#">'+ s +'</a></li>');
		$("#"+s).click(function(eventData) {
			thisScale = eventData.currentTarget.id;
			music.setSeptScale(scales[thisScale], thisScale);
			// console.log(thisScale);
			$("#info").html('<p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + currentWaveform+'</p><p>Speed: ' + currentSpeed+'</p>');
		});	
	}

	// modes dropdown
	for(var m in modes) {
		$("#mode").append('<li id="'+ m +'"><a href="#">'+ m +'</a></li>')
		$("#"+m).click(function(eventData) {
			thisMode = eventData.currentTarget.id;
			if(modes[thisMode].length === scales[thisScale].length) {
				music.setMode(modes[thisMode], thisMode);
				$("#info").html('<p>Key: '+music.currentKey + '</p><p>Scale: '+ music.currentScale + '</p><p>Mode: ' + music.currentMode+'</p><p>Waveform: ' + currentWaveform+'</p><p>Speed: ' + currentSpeed+'</p>');
			}
			else{
				alert("No such musical transformation!")
			}
			// console.log(thisMode);
		});		
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
}