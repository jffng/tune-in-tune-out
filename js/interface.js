function initInterface() {
	// key dropdown
	var thisKey, thisMode;
	var thisScale = "major";
	for(var n in baseNotes) {
		$("#key").append('<li id="'+ n +'"><a href="#">'+ n +'</a></li>');
		$("#"+n).click(function(eventData) {
			thisKey = eventData.currentTarget.id;
			ref = baseNotes[thisKey];
			music.setKey(ref)
			console.log(thisKey);
		});
	}

	// scale dropdown
	for(var s in scales) {
		console.log(s);
		$("#scale").append('<li id="'+ s +'"><a href="#">'+ s +'</a></li>');
		$("#"+s).click(function(eventData) {
			thisScale = eventData.currentTarget.id;
			music.setSeptScale(scales[thisScale], thisScale);
			console.log(thisScale);
		});	
	}

	// modes dropdown
	for(var m in modes) {
		$("#mode").append('<li id="'+ m +'"><a href="#">'+ m +'</a></li>')
		$("#"+m).click(function(eventData) {
			thisMode = eventData.currentTarget.id;
			if(modes[thisMode].length === scales[thisScale].length) music.setMode(modes[thisMode], thisMode);
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