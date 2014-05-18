var tone = new Tone();
var mic = new Tone.Microphone();

// CREATE ANALYSER
var fft = Tone.context.createAnalyser();
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
var numOsc = samples;
var oscType = "sine";
var volume = 0.1;
var	filter = tone.context.createBiquadFilter();

// GLOBAL MUSIC OBJECT
var music = new Music(ref);

var currentWaveform = oscType;

function updateAudio() {
	fft.getByteFrequencyData(frequencyData);

	// get euclidean distance from the origin
	var distance = Math.sqrt(
		Math.pow(camera.position.x, 2) + 
		Math.pow(camera.position.y, 2) + 
		Math.pow(camera.position.z, 2) );

	volume = Math.min(0.05,Math.max(0,(1/distance))); 
	for (var i=0; i<numOsc; i++) {
		// oscVol[i].gain.value = mapRange([10000, 0], [0, 0.05], camera.position.z);
		oscVol[i].gain.value = volume;
		oscillators[i].setFrequency(music.snapToNote(frequencyData[i]), 1);
	}
}

function changeOscillator (_oscType) {
	for(var i = 0; i < numOsc; i++){
		oscillators[i].oscillator.type = waveforms[_oscType];
	}
	currentWaveform = _oscType;
}

function initAudio () {
	for (var i = 0; i < numOsc; i++) {
		oscVol[i] = tone.context.createGainNode();
		oscVol[i].gain.value = 0.025;
		oscVol[i].connect(tone);
		oscillators[i] = new Tone.Oscillator(220, oscType);
		oscillators[i].connect(oscVol[i]);
		oscillators[i].start();
	}

	filter.type = filter.PEAKING;
	filter.frequency.value = 1000;
	filter.Q.value = .06;
	filter.gain.value = .1;

	mic.connect(filter);

	filter.connect(fft);

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