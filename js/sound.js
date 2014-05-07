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
var oscType = "square";

// GLOBAL MUSIC OBJECT
var music = new Music(ref);

var objB = [], objC = [];

function updateAudio() {
	fft.getByteFrequencyData(frequencyData);
	
	for (var i=0; i<numOsc; i++) {
		oscVol[i].gain.value = mapRange([0, 256], [0, .05], frequencyData[i]);
		oscillators[i].setFrequency(music.snapToNote(frequencyData[i]), 1);
	}
}

function changeOscillator (_oscType) {
	for(var i = 0; i < numOsc; i++){
		console.log(sounds[_oscType]);
		oscillators[i].oscillator.type = sounds[_oscType];
	}
}

function initAudio () {
	for (var i = 0; i < numOsc; i++) {
		oscVol[i] = tone.context.createGainNode();
		oscVol[i].gain.value = 0;
		oscVol[i].connect(tone);
		oscillators[i] = new Tone.Oscillator(220, oscType);
		oscillators[i].connect(oscVol[i]);
		oscillators[i].start();
	}

	mic.connect(fft);
	// mic.connect(fftVisuals);
	mic.start();

	tone.input.connect(tone.output);
	tone.toMaster();

	////////// LAURA ///////////
	for(var i=0; i<samples; i++){
		objB.push(0);
	}

	for(var i=0; i<samples/4; i++){
		objC.push(0);
	}
}

var sounds = {
	sine: 0,
	square: 1,
	sawtooth: 2,
	triangle: 3
}