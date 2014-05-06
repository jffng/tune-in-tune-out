////////////////////////////////////////////////////////////////////////////////
//																			  //
//							HELPER FUNCTIONS								  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

// to move n semitones up or down in frequency, multiply or divide respectively.
function twelthRootOf(n) {
	return Math.pow(2,n/12);
}

// map values
function mapRange(from, to, num) {
	return to[0] + (num - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
};

function isUndef(val){
	return typeof val === "undefined";
}

function average(arr)
{
	return _.reduce(arr, function(memo, num)
	{
		return memo + num;
	}, 0) / arr.length;
}

////////////////////////////////////////////////////////////////////////////////
//																			  //
//							CORE MUSIC CLASS								  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

var ref = 55;

function createScale(baseFreq, interval, numNotes) {
	var scale = [];
	scale[0] = baseFreq; 
	for (var i = 1; i <= interval.length*4; i++){
		scale[i] = scale[i-1] * twelthRootOf(interval[i-1]);
		if(i > numNotes) scale[i] = scale[i-1] * twelthRootOf(interval[i-numNotes-1]);
		if(i > numNotes*2) scale[i] = scale[i-1] * twelthRootOf(interval[i-numNotes*2-1]);
		if(i > numNotes*3) scale[i] = scale[i-1] * twelthRootOf(interval[i-numNotes*3-1]);
		if(i > numNotes*4) scale[i] = scale[i-1] * twelthRootOf(interval[i-numNotes*3-1]);
	}

	return scale;
}

// instantiate the music class with a base reference frequency 
var Music = function(_baseFreq) {
	this.baseFreq = this.defaultArg(_baseFreq, ref);

	this.interval = [2, 2, 1, 2, 2, 2, 1];

	this.currentScale = "major";

	this.currentKey = "A";

	this.currentMode = "ionian";

	this.scale = createScale(this.baseFreq, this.interval, this.interval.length);
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

//based on closure library 'inherit' function
Music.extend = function(child, parent){
	if (isUndef(parent)){
		parent = Music;
	}

	/** @constructor */
	function tempConstructor() {};
	tempConstructor.prototype = parent.prototype;
	child.prototype = new tempConstructor();
	// * @override 
	child.prototype.constructor = child;
}

//if the given argument is undefined, go with the default
//@param {*} given
//@param {*} fallback
//@returns {*}
Music.prototype.defaultArg = function(given, fallback){
	return isUndef(given) ? fallback : given;
}

////////////////////////////////////////////////////////////////////////////////
//																			  //
//							TRANSFORMING THE MUSIC CLASS					  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

Music.prototype.setKey = function(key, id) {
	this.baseFreq = key;
	this.currentKey = id;
	this.scale = createScale(key, this.interval, this.interval.length);
}

Music.prototype.setSeptScale = function(scaleInterval, id){
	// reset the scale to Major
	this.scale = createScale(this.baseFreq, this.interval, this.interval.length);

	this.currentScale = id;

	var newSeptatonicScale = [];
	
	for (var i = 0; i < (scaleInterval.length)*4-3; i++){
		newSeptatonicScale[i] = this.scale[i] * twelthRootOf(scaleInterval[i]);
		if(i>7) newSeptatonicScale[i] = this.scale[i] * twelthRootOf(scaleInterval[i-7]);
		if(i>14) newSeptatonicScale[i] = this.scale[i] * twelthRootOf(scaleInterval[i-14]);
		if(i>21) newSeptatonicScale[i] = this.scale[i] * twelthRootOf(scaleInterval[i-21]);
		if(i>28) newSeptatonicScale[i] = this.scale[i] * twelthRootOf(scaleInterval[i-28]);
		}
	this.scale = newSeptatonicScale;
	console.log(this.currentScale);
	console.log(this.currentMode);
	console.log(this.scale);
}

Music.prototype.setPentScale = function(scaleInterval){
	var newScale = [];

	// reset the scale to Major
	this.scale = createScale(this.baseFreq, this.interval, scaleInterval.length)

	for (var i = 0; i < scaleInterval.length; i++){
		if(scaleInterval[i] != 0) {
			newScale[i] = this.scale[i] * twelthRootOf(scaleInterval[i]);
		}
	}
}

Music.prototype.setMode = function(mode, id){
	// reset the scale to the current id
	this.setSeptScale(scales[this.currentScale], this.currentScale);

	this.currentMode = id;

	var newMode = [];

	for (var i = 0; i < (mode.length)*4-3; i++){
		newMode[i] = this.scale[i] * twelthRootOf(mode[i]);
		if(i>7) newMode[i] = this.scale[i] * twelthRootOf(mode[i-7]);
		if(i>14) newMode[i] = this.scale[i] * twelthRootOf(mode[i-14]);
		if(i>21) newMode[i] = this.scale[i] * twelthRootOf(mode[i-21]);
		if(i>28) newMode[i] = this.scale[i] * twelthRootOf(mode[i-28]);
	}

	this.scale = newMode;
	console.log(this.currentScale);	
	console.log(this.currentMode);
	console.log(this.scale);
}

////////////////////////////////////////////////////////////////////////////////
//																			  //
//							MUSIC THEORY									  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

var modes = {
	ionian: [0, 0, 0, 0, 0, 0, 0, 0],
	dorian: [0, 0, 1, 0, 0, 0, -1, 0],
	phrygian: [0, -1, -1, 0, 0, -1, -1, 0],
	lydian: [0, 0, 0, 1, 0, 0, 0, 0],
	mixolydian: [0, 0, 0, 0, 0, 0, -1, 0],
	aeolian: [0, 0, -1, 0, 0, -1, -1, 0],
	locrian: [0, -1, -1, 0, -1, -1, -1, 0],
};

var scales = {
	major: [0, 0, 0, 0, 0, 0, 0, 0],
	naturalMinor: [0, 0, -1, 0, 0, -1, -1, 0],
	harmonicMinor: [0, 0, -1, 0, 0, -1, 0, 0],
	melodicMinor: [0, 0, -1, 0, 0, 0, 0, 0],
};

var baseNotes = {
	G: 97.9989,
	Gb:	92.4986,
	F:	87.3071,
	E:	82.4069,
	Eb:	77.7817,
	D:	73.4162,
	Db:	69.2957,
	C:	65.4064,
	B:	61.7354,
	Bb:	58.2705,
	A:	55
};
