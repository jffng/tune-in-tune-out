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
			$("#info").html(music.currentKey + ' ' + music.currentScale + ' ' + music.currentMode);
			console.log(music.currentKey);
			console.log(music.currentScale);
			console.log(music.currentMode);
		});
	}

	// scale dropdown
	for(var s in scales) {
		$("#scale").append('<li id="'+ s +'"><a href="#">'+ s +'</a></li>');
		$("#"+s).click(function(eventData) {
			thisScale = eventData.currentTarget.id;
			music.setSeptScale(scales[thisScale], thisScale);
			console.log(thisScale);
			$("#info").html(music.currentKey + ' ' + music.currentScale + ' ' + music.currentMode);						
		});	
	}

	// modes dropdown
	for(var m in modes) {
		$("#mode").append('<li id="'+ m +'"><a href="#">'+ m +'</a></li>')
		$("#"+m).click(function(eventData) {
			thisMode = eventData.currentTarget.id;
			if(modes[thisMode].length === scales[thisScale].length) {
				music.setMode(modes[thisMode], thisMode);
				$("#info").html(music.currentKey + ' ' + music.currentScale + ' ' + music.currentMode);
			}
			else{
				alert("No such musical transformation!")
			}
			console.log(thisMode);
		});		
	}

	// sound dropdown
	for(var s in sounds) {
		$("#sound").append('<li id="'+ s +'"><a href="#">'+ s +'</a></li>')
		$("#"+s).click(function(eventData) {
			thisSound = eventData.currentTarget.id;
			changeOscillator(thisSound);
			console.log(thisSound);
		});		
	}
}