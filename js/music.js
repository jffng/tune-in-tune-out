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
	var baseFreq = _baseFreq;

	this.interval = [2, 2, 1, 2, 2, 2, 1];

	this.scale = createScale(baseFreq, this.interval, this.interval.length);
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

////////////////////////////////////////////////////////////////////////////////
//																			  //
//							TRANSFORMING THE BASE CLASS						  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

Music.Transform = function (_baseFreq, transformObject) {
	Music.call(this);

	var baseFreq = _baseFreq;

	for (var i = transformObject.length - 1; i >= 0; i--) {
		this.interval[i] += transformObject[i];
	};

	this.scale = createScale(baseFreq, this.interval, this.interval.length);
}

Music.extend(Music.Transform);

////////////////////////////////////////////////////////////////////////////////
//																			  //
//							MUSIC THEORY									  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

var modes = {
	dorian: [0, -1, 0, 0, 0, -1, 0],
	phrygian: [-1, -1, 0, 0, -1, -1, 0],
	lydian: [0, 0, 1, 0, 0, 0, 0],
	mixolydian: [0, 0, 0, 0, 0, -1, 0],
	aeolian: [0, -1, 0, -1, 0, -1, 0],
	locrian: [-1, -1, 0, -1, -1, -1, 0],
};

var scales = {
	naturalMinor: [0, -1, 0, -1, 0, -1, 0],
	harmonicMinor: [0, -1, 0, 0, -1, 0, 0],
	melodicMinor: [0, -1, 0, 0, 0, 0, 0],
}

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
