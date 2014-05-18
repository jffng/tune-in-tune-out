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
var volume = .1;

// GLOBAL MUSIC OBJECT
var music = new Music(ref);

var objB = [], objC = [];
var currentWaveform = oscType;

function updateAudio() {
	fft.getByteFrequencyData(frequencyData);
	
	for (var i=0; i<numOsc; i++) {
		// oscVol[i].gain.value = mapRange([10000, 0], [0, 0.05], camera.position.z);
		oscVol[i].gain.value = volume * 0.025;
		oscillators[i].setFrequency(music.snapToNote(frequencyData[i]), 1);
	}
}

function changeOscillator (_oscType) {
	for(var i = 0; i < numOsc; i++){
		console.log(waveforms[_oscType]);
		oscillators[i].oscillator.type = waveforms[_oscType];
	}
	currentWaveform = _oscType;
}

function initAudio () {
	// var request = new XMLHttpRequest();
	// request.open("GET", 'gardenchild.mp3', true);
	// request.responseType = "arraybuffer";

	// request.onload = function() {
	//     var source = tone.context.createBufferSource();
	//     source.buffer = tone.context.createBuffer(request.response, false);
	//     console.log('loaded!');
	//     source.connect(fft);
	//     source.toMaster();
	//     source.start();
	// }

	// request.send();

	for (var i = 0; i < numOsc; i++) {
		oscVol[i] = tone.context.createGainNode();
		oscVol[i].gain.value = 0.025;
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

var waveforms = {
	sine: "sine",
	square: "square",
	sawtooth: "sawtooth",
	triangle: "triangle"
}