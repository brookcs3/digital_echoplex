# All Tone.js References in echoplex-pro.js

Total: 119 references found

## Categories of Conversion Needed:

1. **Tone.Gain()** → `audioContext.createGain()`
2. **Tone.Player()** → `AudioBufferSourceNode` 
3. **Tone.Recorder()** → `MediaRecorder`
4. **Tone.Delay()** → `DelayNode`
5. **Tone.Filter()** → `BiquadFilterNode`
6. **Tone.CrossFade()** → Custom crossfade with gain nodes
7. **Tone.Destination** → `audioContext.destination`
8. **Tone.Transport.seconds** → `audioContext.currentTime`
9. **Tone.now()** → `audioContext.currentTime`
10. **Tone.dbToGain()** → Custom function
11. **Tone.start()** → `audioContext.resume()`
12. **Tone.context** → `audioContext`
13. **Tone.ToneAudioBuffer** → `AudioBuffer`

## Line-by-line breakdown:

**Line 5604:** `startTimestamp: Tone.Transport.seconds`
**Line 5623:** `startTimestamp: Tone.Transport.seconds`
**Line 6014:** `console.warn('⚠️ Tone.js not available - Sample Play audio chain disabled');`
**Line 6022:** `sampleSystem.sampleOutput = new Tone.Gain(sampleSystem.sampleVolume);`
**Line 6023:** `sampleSystem.sampleGain = new Tone.Gain(1.0);`
**Line 6024:** `sampleSystem.sampleFilter = new Tone.Filter(8000, 'lowpass');`
**Line 6029:** `sampleSystem.sampleOutput.connect(Tone.Destination);`
**Line 6333:** `console.warn('⚠️ Tone.js not available - cannot create sample player');`
**Line 6341:** `const player = new Tone.Player({`
**Line 7435:** `startPointSystem.startPointGain = new Tone.Gain(1.0);`
**Line 7436:** `startPointSystem.startPointDelay = new Tone.Delay(0);`
**Line 7437:** `startPointSystem.crossfader = new Tone.CrossFade(0);`
**Line 8093:** `recordModeSystem.recordingGain = new Tone.Gain(1.0);`
**Line 8094:** `recordModeSystem.recordingFilter = new Tone.Filter(8000, 'lowpass');`
**Line 8095:** `recordModeSystem.fadeProcessor = new Tone.Gain(1.0);`
**Line 11607:** `this.masterGain.gain.rampTo(Tone.dbToGain(volumeDb), 0.1);`
**Line 11645:** `this.inputGain.gain.rampTo(Tone.dbToGain(gainDb), 0.1);`
**Line 12077:** `this.feedbackSystem.feedbackGain = new Tone.Gain(this.getFeedbackGainValue());`
**Line 12080:** `this.feedbackSystem.feedbackDelay = new Tone.Delay(0.01);`
**Line 12083:** `this.feedbackSystem.feedbackFilter = new Tone.Filter(8000, 'lowpass');`
**Line 12086:** `this.feedbackSystem.feedbackOutput = new Tone.Gain(1.0);`
**Line 12089:** `this.feedbackSystem.feedbackGain.connect(this.feedbackSystem.feedbackDelay);`
**Line 12090:** `this.feedbackSystem.feedbackDelay.connect(this.feedbackSystem.feedbackFilter);`
**Line 12091:** `this.feedbackSystem.feedbackFilter.connect(this.feedbackSystem.feedbackOutput);`
**Line 12092:** `this.feedbackSystem.feedbackOutput.connect(Tone.Destination);`
**Line 12107:** `const feedbackValue = Tone.dbToGain(`
**Line 12163:** `const player = new Tone.Player(buffer);`
**Line 12167:** `player.connect(Tone.Destination);`
**Line 12195:** `currentLoop.player = new Tone.Player(buffer);`
**Line 12197:** `currentLoop.player.connect(Tone.Destination);`
**Line 12222:** `if (!this.loopSystem.currentLoopGain) this.loopSystem.currentLoopGain = new Tone.Gain(1.0);`
**Line 12223:** `if (!this.loopSystem.loopOutput) this.loopSystem.loopOutput = new Tone.Gain(1.0);`
**Line 12244:** `this.loopSystem.currentLoopGain.connect(Tone.Destination);`
**Line 12245:** `this.loopSystem.loopOutput.connect(Tone.Destination);`
**Line 12346:** `this.loopSystem.currentLoopGain.gain.rampTo(Tone.dbToGain(gainDb), 0.1);`
**Line 12380:** `if (!this.inputGain) this.inputGain = new Tone.Gain(1.0);`
**Line 12383:** `this.inputGain.gain.rampTo(Tone.dbToGain(gainDb), 0.1);`
**Line 12419:** `if (!this.outputGain) this.outputGain = new Tone.Gain(1.0);`
**Line 12422:** `this.outputGain.gain.rampTo(Tone.dbToGain(gainDb), 0.1);`
**Line 12423:** `this.outputGain.connect(Tone.Destination);`
**Line 12460:** `if (!this.mixGain) this.mixGain = new Tone.Gain(1.0);`
**Line 12463:** `this.mixGain.gain.rampTo(Tone.dbToGain(gainDb), 0.1);`
**Line 12464:** `this.mixGain.connect(Tone.Destination);`
**Line 12502:** `if (!this.feedbackGain) this.feedbackGain = new Tone.Gain(1.0);`
**Line 12505:** `this.feedbackGain.gain.rampTo(Tone.dbToGain(gainDb), 0.1);`
**Line 12508:** `this.feedbackGain.connect(Tone.Destination);`
**Line 12585:** `this.realTimeProcessor = new Tone.Gain(1.0);`
**Line 12586:** `this.realTimeProcessor.connect(Tone.Destination);`
**Line 12615:** `this.realTimeProcessor.gain.rampTo(Tone.dbToGain(amplitudeDb), 0.05);`
**Line 12636:** `// Main audio system init via Tone.js`
**Line 12637:** `await Tone.start();`
**Line 12638:** `console.log('🔊 Tone.js AudioContext started');`
**Line 12645:** `AudioEngine: typeof Tone !== 'undefined' ? 'Tone.js' : 'Web Audio',`
**Line 12646:** `Context: Tone.context || 'Not available',`
**Line 12647:** `SampleRate: Tone.context ? Tone.context.sampleRate + ' Hz' : 'Unknown'`
**Line 12651:** `if (Tone && Tone.context) {`
**Line 12652:** `this.audioContext = Tone.context;`
**Line 12653:** `console.log(\`🎵 Using Tone.js AudioContext (\${this.audioContext.sampleRate}Hz)\`);`
**Line 12754:** `this.inputGain = new Tone.Gain(0.8);`
**Line 12755:** `this.outputGain = new Tone.Gain(0.8);`
**Line 12756:** `this.mixGain = new Tone.Gain(0.5);`
**Line 12757:** `this.feedbackGain = new Tone.Gain(0.7);`
**Line 12760:** `this.outputGain.connect(Tone.Destination);`
**Line 12781:** `this.outputGain.connect(Tone.Destination);`
**Line 12840:** `this.recorder = new Tone.Recorder();`
**Line 12844:** `this.recordingStartTime = Tone.now();`
**Line 12852:** `this.levelMeter = new Tone.Meter();`
**Line 12859:** `console.warn('⚠️ Tone.js not available - audio system degraded');`
**Line 12945:** `const audioBuffer = await Tone.getContext().decodeAudioData(arrayBuffer);`
**Line 12970:** `if (buffer && buffer instanceof Tone.ToneAudioBuffer) {`
**Line 13062:** `this.loopSystem.loopGain = new Tone.Gain(gain);`
**Line 13063:** `this.loopSystem.loopGain.connect(Tone.Destination);`
**Line 13115:** `this.loopSystem.loopPlayer = new Tone.Player(buffer);`
**Line 13117:** `this.loopSystem.loopPlayer.connect(this.loopSystem.loopGain || Tone.Destination);`
**Line 13123:** `console.warn('⚠️ Tone.js not available - loop playback degraded');`
**Line 13166:** `this.loopSystem.loopPlayer = new Tone.Player(buffer);`
**Line 13168:** `this.loopSystem.loopPlayer.connect(this.loopSystem.loopGain || Tone.Destination);`
**Line 13174:** `console.warn('⚠️ Tone.js not available - loop restart degraded');`
**Line 13234:** `const feedbackValue = Tone.dbToGain(`
**Line 13246:** `this.feedbackGain.gain.rampTo(Tone.dbToGain(-12), 0.5);`
**Line 13357:** `this.overdubSystem.overdubGain = new Tone.Gain(overdubLevel);`
**Line 13358:** `this.overdubSystem.overdubGain.connect(Tone.Destination);`
**Line 13364:** `console.warn('⚠️ Tone.js not available - overdub system degraded');`
**Line 13477:** `const overdubPlayer = new Tone.Player(overdubBuffer);`
**Line 13481:** `overdubPlayer.connect(this.overdubSystem.overdubGain || Tone.Destination);`
**Line 13487:** `console.warn('⚠️ Tone.js not available - overdub playback degraded');`
**Line 13568:** `this.multiplySystem.multiplyGain = new Tone.Gain(1.0);`
**Line 13569:** `this.multiplySystem.multiplyGain.connect(Tone.Destination);`
**Line 13575:** `console.warn('⚠️ Tone.js not available - multiply system degraded');`
**Line 13618:** `const multiplyPlayer = new Tone.Player(multiplyBuffer);`
**Line 13622:** `multiplyPlayer.connect(this.multiplySystem.multiplyGain || Tone.Destination);`
**Line 13628:** `console.warn('⚠️ Tone.js not available - multiply playback degraded');`
**Line 13706:** `this.insertSystem.insertGain = new Tone.Gain(1.0);`
**Line 13707:** `this.insertSystem.insertGain.connect(Tone.Destination);`
**Line 13713:** `console.warn('⚠️ Tone.js not available - insert system degraded');`
**Line 13753:** `const insertPlayer = new Tone.Player(insertBuffer);`
**Line 13757:** `insertPlayer.connect(this.insertSystem.insertGain || Tone.Destination);`
**Line 13763:** `console.warn('⚠️ Tone.js not available - insert playback degraded');`
**Line 13825:** `this.muteSystem.muteGain = new Tone.Gain(this.state.isMuted ? 0 : 1);`
**Line 13826:** `this.muteSystem.muteGain.connect(Tone.Destination);`
**Line 13832:** `console.warn('⚠️ Tone.js not available - mute system degraded');`

## Priority Order for Conversion:

### 1. Critical Audio System (needed for basic recording):
- Line 12637: `await Tone.start();`
- Line 12652: `this.audioContext = Tone.context;`
- Line 12840: `this.recorder = new Tone.Recorder();`
- Line 12754-12757: Basic gain nodes (input, output, mix, feedback)

### 2. Basic Playback:
- Line 13115: `this.loopSystem.loopPlayer = new Tone.Player(buffer);`
- Line 12760/12781: `this.outputGain.connect(Tone.Destination);`

### 3. Timing System:
- Line 5604/5623: `Tone.Transport.seconds`
- Line 12844: `this.recordingStartTime = Tone.now();`

### 4. Effects & Advanced Features:
- All the delay, filter, crossfade nodes
- Sample player system
- Complex routing

This gives us a clear roadmap - we can start with the critical audio system and work our way down!