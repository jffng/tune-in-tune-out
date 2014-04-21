// var maxFreq = 20000;

// var Music = function(valueToBeMadeIntoMusic) {
// 	var baseFreq = 440;

// 	var Major = [2, 2, 1, 2, 2, 2, 1];

// }

// Music.prototype.getFreq = function (val) {
// 	mapRange()
// }

// Music.prototype.changeRoot = function(freq) {
// 	this.baseFreq = freq;
// }

// Music.prototype.changeScale = function() {
	
// }

// Music.prototype.changeMode = function (argument) {
// 	// body...
// }

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

var tone = new Tone();
var mic = new Tone.Microphone();
var feedbackDelay = new Tone.FeedbackDelay(.1);
var analyzer = Tone.context.createAnalyser();
analyzer.fftSize = 64;
var frequencyData = new Uint8Array(analyzer.frequencyBinCount);
var numOsc = analyzer.frequencyBinCount;
var oscillators = {};
var vol = tone.context.createGainNode();

// var drawCanvas = document.getElementById("testCanvas"); 
// var drawContext = drawCanvas.getContext("2d"); 

// drawCanvas.width = window.innerWidth;
// drawCanvas.height = window.innerHeight;

function update () {
	requestAnimationFrame(update);
	analyzer.getByteFrequencyData(frequencyData)
	var freqDomain = new Uint8Array(analyzer.frequencyBinCount);
	analyzer.getByteFrequencyData(freqDomain);
	// drawContext.clearRect ( 0 , 0 , window.innerWidth , window.innerHeight );
	for (var i = 0; i < analyzer.frequencyBinCount; i++) {
	  var value = freqDomain[i];
	  // var percent = value / 256;
	  oscillators[i].frequency.value = mapRange([0, 256], [440, 880], value);
	  // var height = window.innerHeight * percent;
	  // var offset = window.innerHeight - height - 1;
	  // var barWidth = window.innerWidth/analyzer.frequencyBinCount;
	  // var hue = i/analyzer.frequencyBinCount * 360;
	  // drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
	  // drawContext.fillRect(i * barWidth, offset, barWidth, height);
	}
}

$(document).ready(function() {
	for (var i = 0; i < numOsc; i++) {
	  oscillators[i] = Tone.context.createOscillator();
	  oscillators[i].connect(vol);
	  	  oscillators[i].start();

	}

	vol.connect(tone);
	vol.gain.value = .75;
	mic.connect(analyzer);
	mic.connect(feedbackDelay);

	// mic.toMaster();
	feedbackDelay.toMaster();
	analyzer.toMaster();

	tone.input.connect(tone.output);
	tone.toMaster();

	mic.start();
	update();		
});
