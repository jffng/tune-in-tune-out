var tone = new Tone();
var mic = new Tone.Microphone();

// CREATE FILTER
var filter = Tone.context.createBiquadFilter();
filter.type = 0;
filter.frequency.value = 30;


// CREATE ANALYSER
var fft = Tone.context.createAnalyser();
fft.fftSize = 2048;
var samples = 64;
var frequencyData = new Uint8Array(samples);

// CREATE OSCILLATORS
var oscillators = {};
var numOsc = samples;

// GLOBAL MUSIC OBJECT
var cMajor = new Music(440);

function updateAudio() {
	fft.getByteFrequencyData(frequencyData);
	// var freqDomain = new Uint8Array(analyzer.frequencyBinCount);
	// fft.getByteFrequencyData(freqDomain);
	for (var i = 0; i < samples; i++) {
	  // var value = freqDomain[i];
	  oscillators[i].frequency.value = cMajor.snapToNote(frequencyData[i]);
	}
}

function initAudio () {
	var vol = tone.context.createGainNode();
	vol.connect(tone);
	vol.gain.value = .25;

	for (var i = 0; i < numOsc; i++) {
	  oscillators[i] = Tone.context.createOscillator();
	  oscillators[i].connect(vol);
	  oscillators[i].start();
	}
	
	mic.connect(fft);
	mic.connect(filter);
	fft.toMaster();

	tone.input.connect(tone.output);
	tone.toMaster();

	mic.start();
}