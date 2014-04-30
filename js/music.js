////////////////////////////////////////////////////////////////////////////////
//																			  //
//							Helper Functions								  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

// to move one semitone up or down in frequency, multiply or divide respectively.
function twelthRootOf(n) {
	return Math.pow(2,n/12);
}

// map values
var mapRange = function(from, to, num) {
	return to[0] + (num - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
};


////////////////////////////////////////////////////////////////////////////////
//																			  //
//							Core Music Class								  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

// var maxFreq = 20000;

// instantiate the music class with a base reference frequency 
var Music = function(_baseFreq) {
	var baseFreq = _baseFreq;

	var majorForwards = [2, 2, 1, 2, 2, 2, 1];
	var majorBackwards = [-1, -2, -2, -2, -1, -2, -2];

	var index = 1;

	this.scale = [];
	this.scale[0] = baseFreq;

	for (var i = 0; i < majorForwards.length; i++){
		this.scale[index] = this.scale[index-1] * twelthRootOf(majorForwards[index-1]);
		index++;
	}
	for (var i = 1; i <= majorBackwards.length; i++){
		if(i == 1) this.scale[i+index] = this.scale[0] * twelthRootOf(majorBackwards[i - 1]);
		else this.scale[i+index] = this.scale[i+index-1] * twelthRootOf(majorBackwards[i - 1]);
	}

	this.scale.sort(function(a,b){
		return a - b;
	});

	this.scale.pop();
}

Music.prototype.snapToNote = function(valueToBeTransformed) {
	var mappedVal = mapRange([0,256], [this.scale[0], this.scale[this.scale.length-1]], valueToBeTransformed)

	var runningClosest = 10000;
	var returnNoteIndex;

	for(var i = 0; i < this.scale.length; i++){
		var difference = Math.abs(this.scale[i] - mappedVal);
		if (difference < runningClosest) {
			runningClosest = difference;
			returnNoteIndex = i; 
		}
	}

	return this.scale[returnNoteIndex];
}

