function initInterface() {
	// key dropdown
	var keys = [];
	for(var k in baseNotes) {
		$("#key").append('<li id="'+ k +'"><a href="#">'+ k +'</a></li>')
	}

	// scale dropdown
	var keys = [];
	for(var k in scales) {
		$("#scale").append('<li id="'+ k +'"><a href="#">'+ k +'</a></li>')
	}

	// modes dropdown
	var keys = [];
	for(var k in modes) {
		$("#mode").append('<li id="'+ k +'"><a href="#">'+ k +'</a></li>')
	}
}