var tone = new Tone();
var mic = new Tone.Microphone();

// CREATE FILTER
// var filter = Tone.context.createBiquadFilter();
// filter.type = 0;
// filter.frequency.value = 30;


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

//////// LAURA /////////
var objB = [], objC = [];


function updateAudio() {
	fft.getByteFrequencyData(frequencyData);
	// var freqDomain = new Uint8Array(analyzer.frequencyBinCount);
	// fft.getByteFrequencyData(freqDomain);


	//////////// LAURA //////////////
	//TRIM_INPUT
	var count = 0;
	for(var i=0; i<samples; i++){
		if(frequencyData[i]>100){
			objB[i]=(frequencyData[i]);
			objC[count]=(frequencyData[i]);
			count ++;

		} else {
			if (objB[i]>0)
				objB[i] --;
		}
	}

	for(var i=0; i<objC.length; i++){
		if (objC[i]>0)
			objC[i] --;		
	}
	////////// END OF LAURA //////////

	//ORIGINAL
	// for (var i=0; i<samples; i++) {
	//   // var value = freqDomain[i];
	//   oscillators[i].frequency.value = cMajor.snapToNote(frequencyData[i]);
	//   if(oscillators[i].frequency.value < 220){ oscillators[i].stop(); } 
	// }

	//OBJ_B
	// for (var i=0; i<samples; i++) {
	//   oscillators[i].frequency.value = cMajor.snapToNote(objB[i]);
	//   // if(oscillators[i].frequency.value < 220){ oscillators[i].stop(); } 
	//   if(oscillators[i].frequency.value < 220){ oscillators[i].noteOff(0); } 
	// }

	//OBJ_C
	for (var i=0; i<objC.length; i++) {
	  oscillators[i].frequency.value = cMajor.snapToNote(objC[i]);
	  // if(oscillators[i].frequency.value < 220){ oscillators[i].stop(); } 
	  if(oscillators[i].frequency.value < 220){ oscillators[i].noteOff(0); } 
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
	// mic.connect(filter);
	fft.toMaster();

	tone.input.connect(tone.output);
	tone.toMaster();

	mic.start();

	////////// LAURA ///////////
	for(var i=0; i<samples; i++){
		objB.push(0);
	}

	for(var i=0; i<samples/4; i++){
		objC.push(0);
	}
}