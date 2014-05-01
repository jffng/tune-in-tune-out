////////////////////////////////////////////////////////////////////////////////
//																			  //
//							HELPER FUNCTIONS								  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

// to move one semitone up or down in frequency, multiply or divide respectively.
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

function createScale() {
	// body...
}


////////////////////////////////////////////////////////////////////////////////
//																			  //
//							CORE MUSIC CLASS								  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

// var maxFreq = 20000;

// instantiate the music class with a base reference frequency 
var Music = function(_baseFreq) {
	var baseFreq = _baseFreq;

	// var majorForwards = [2, 2, 1, 2, 2, 2, 1];
	// var majorBackwards = [-1, -2, -2, -2, -1, -2, -2];

	this.scaleF = [2, 2, 1, 2, 2, 2, 1];
	this.scaleB = [-1, -2, -2, -2, -1, -2, -2];	

	this.scale = [];
	this.scale[0] = baseFreq;

	//	this.scale = createScale()
	this.index = 1;
	for (var i = 0; i < this.scaleF.length; i++){
		this.scale[this.index] = this.scale[this.index-1] * twelthRootOf(this.scaleF[this.index-1]);
		this.index++;
	}
	for (var i = 1; i <= this.scaleF.length; i++){
		if(i == 1) this.scale[i+this.index] = this.scale[0] * twelthRootOf(this.scaleB[i - 1]);
		else this.scale[i+this.index] = this.scale[i+this.index-1] * twelthRootOf(this.scaleB[i - 1]);
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

	this.transformObj = transformObject;
	// var baseFreq = _baseFreq;
	for (var i = transformObject.f.length - 1; i >= 0; i--) {
		this.scaleF[i] += transformObject.f[i];
	};
	// var majorForwards = [2, 2, 1, 2, 2, 2, 1];
	// var majorBackwards = [-1, -2, -2, -2, -1, -2, -2];

	// var index = 1;

	// this.scale = [];
	this.scale[0] = _baseFreq;
	this.index = 1;
	for (var i = 0; i < this.scaleF.length; i++){
		this.scale[this.index] = this.scale[this.index-1] * twelthRootOf(this.scaleF[this.index-1]);
		this.index++;
	}
	for (var i = 1; i <= this.scaleF.length; i++){
		if(i == 1) this.scale[i+this.index] = this.scale[0] * twelthRootOf(this.scaleB[i - 1]);
		else this.scale[i+this.index] = this.scale[i+this.index-1] * twelthRootOf(this.scaleB[i - 1]);
	}

	this.scale.sort(function(a,b){
		return a - b;
	});

	this.scale.pop();

}

Music.Transform.prototype.setFreq = function (_baseFreq) {
	
}

Music.extend(Music.Transform);

////////////////////////////////////////////////////////////////////////////////
//																			  //
//							MUSIC THEORY									  //
//																			  //
////////////////////////////////////////////////////////////////////////////////

var minor = {
	'f':[0, 0, -1, 0, -1, -1, 0],
	'b':[0, -1, -1, 0, -1, 0, 0]
};