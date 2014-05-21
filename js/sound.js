var tone = new Tone();
var mic = new Tone.Microphone();

// GLOBAL MUSIC OBJECT
var music = new Music(ref);

// CREATE ANALYSER
var fft = tone.context.createAnalyser();
fft.fftSize = 2048;
var samples = 64;
var frequencyData = new Uint8Array(samples);

// REAL TIME ANALYSER
var fftVisuals = Tone.context.createAnalyser();
fftVisuals.fftSize = 2048;
var frequencyDataVisuals = new Uint8Array(samples);

// CREATE OSCILLATORS
var oscillators = {};
var oscVol = {};
var numOsc = samples/2;
var oscType = "sine";
var currentWaveform = oscType;
var volume;
var	filter = tone.context.createBiquadFilter();

var currentWaveform = oscType;

function updateAudio() {
	fft.getByteFrequencyData(frequencyData);
	// get euclidean distance from the origin

	for (var i=0; i<numOsc; i++) {
		oscVol[i].gain.value = (frequencyData[i]) * (.05) / (256);	
		oscillators[i].setFrequency(music.snapToNote(frequencyData[i]));
	}

}

function changeOscillator (_oscType) {
	for(var i = 0; i < numOsc; i++){
		oscillators[i].oscillator.type = waveforms[_oscType];
	}
	currentWaveform = _oscType;
}

function initAudio () {
	// loadBuffer('../17.mp3');

	for (var i = 0; i < numOsc; i++) {
		oscVol[i] = tone.context.createGainNode();
		oscVol[i].gain.value = 0.025;
		oscVol[i].connect(tone);
		oscillators[i] = new Tone.Oscillator(220, oscType);
		oscillators[i].connect(oscVol[i]);
		oscillators[i].start();
	}

	// filter.type = filter.HIGHPASS;
	// filter.frequency.value = 100;
	// // filter.Q.value = .06;
	// // filter.gain.value = .5;

	mic.connect(fft);

	// filter.connect(fft);

	mic.start();

	tone.input.connect(tone.output);
	tone.toMaster();
}

function loadBuffer(bufferUrl) {
	var request = new XMLHttpRequest();
	request.open("GET", bufferUrl, true);
	request.responseType = "arraybuffer";

	request.onload = function() {
	    var source = tone.context.createBufferSource();
	    source.buffer = tone.context.createBuffer(request.response, false);
	    console.log('loaded!');
	    source.connect(fft);
	    source.toMaster();
	    source.start();
	};

	request.send();
}

var waveforms = {
	sine: "sine",
	square: "square",
	sawtooth: "sawtooth",
	triangle: "triangle"
}