/*
====================================================
ECHOPLEX DIGITAL PRO PLUS - MINIMAL STARTING POINT
====================================================
This file is organized linearly by hardware control.
It contains the core class and the logic for each function.
VERSION: RECORD button final fixes applied.
*/

// ============================================================================
//  ENGINE DEFINITIONS (Catch-all for Layers & Processors)
// ============================================================================

// AudioWorklet Processor Code (as string to load as module)
const RECORDER_PROCESSOR_CODE = `
class RecorderProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.isRecording = false;
        this.port.onmessage = (event) => {
            if (event.data.isRecording !== undefined) {
                this.isRecording = event.data.isRecording;
            }
        };
    }
    
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input.length > 0 && input[0].length > 0 && this.isRecording) {
            // Send a copy of the audio data to the main thread
            this.port.postMessage(input[0]);
        }
        return true;
    }
}
registerProcessor('recorder-processor', RecorderProcessor);
`;

// Map of which segments are lit for each numeral
const SEGMENT_MAP = {
    '0':['a','b','c','d','e','f'], '1':['b','c'], '2':['a','b','g','e','d'],
    '3':['a','b','g','c','d'], '4':['f','g','b','c'], '5':['a','f','g','c','d'],
    '6':['a','f','g','c','d','e'], '7':['a','b','c'], '8':['a','b','c','d','e','f','g'],
    '9':['a','b','c','d','f','g']
};


// Conceptual Layers (State and low-level logic will live here)
const SignalChainLayer = {
    audioContext: null,
    audioNodes: {
        inputGain: null,
        outputGain: null,
        feedbackGain: null,
        microphoneSource: null,
        recorderWorklet: null
    }
};

const ControllerLayer = {
    state: {
        loopState: 'idle' // 'idle', 'recording', 'playing'
    }
};

const BufferLayer = {
    state: {
        loops: [
            { buffer: null, playbackNode: null }
        ],
        recordedChunks: [],
    }
};

const FeedbackLayer = {
    state: {
        timerInterval: null,
        timerStartTime: null,
    }
};


// ============================================================================
//  MAIN ECHOPLEX CLASS
// ============================================================================

class EchoplexMinimal {
    constructor() {
        this.state = {
            power: false,
            parameterMode: 0, // 0=PLAY, 1=P1, 2=P2, 3=P3, 4=P4
            controlValues: {
                feedback: 127
            }
        };
        this.elements = {};
        this.displayTimeout = null;
        this.MAX_LOOP_SECONDS = 198;
    }

    async init() {
        console.log('🎛️ Initializing Echoplex...');
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }
        this.setupElements();
        this.setupEventListeners();
        console.log('✅ Echoplex Ready');
    }

    setupElements() {
        this.elements = {
            powerButton: document.getElementById('power-button'),
            mainInterface: document.getElementById('main-interface'),
            ledDisplayContainer: document.getElementById('display'), // Changed from loopDisplay
            multipleDisplay: document.getElementById('multiple-display'),
            parametersBtn: document.querySelector('[data-function="parameters"]'),
            recordBtn: document.querySelector('[data-function="record"]'),
            timingLed: document.getElementById('timing-led'),
            switchesLed: document.getElementById('switches-led'),
            midiLed: document.getElementById('midi-led'),
            loopsLed: document.getElementById('loops-led'),
            feedbackKnob: document.querySelector('[data-param="feedback"]'),
        };
        this.buildLedDisplay();
    }
    
    buildLedDisplay() {
        const display = this.elements.ledDisplayContainer;
        if (!display) return;
        display.innerHTML = ''; // Clear any previous content
        const DIGITS = 3; // three fixed digit positions
        for (let i = 0; i < DIGITS; i++) {
            const digit = document.createElement('div');
            digit.className = 'digit';
            ['a','b','c','d','e','f','g'].forEach(cls => {
                const seg = document.createElement('div');
                seg.className = `segment ${cls}`;
                digit.appendChild(seg);
            });
            const dot = document.createElement('div');
            dot.className = 'dot';
            digit.appendChild(dot);
            display.appendChild(digit);
        }
        this.elements.digitEls = Array.from(display.querySelectorAll('.digit'));
    }


    setupEventListeners() {
        this.elements.powerButton.addEventListener('click', () => this.togglePower());
        this.elements.parametersBtn.addEventListener('click', () => this.handleParameters());
        
        // RECORD BUTTON with long-press logic
        let recordPressTimer = null;
        this.elements.recordBtn.addEventListener('mousedown', () => {
            if (!this.state.power || ControllerLayer.state.loopState === 'recording') return;
            this.updateLed('record', 'orange'); // Indicate potential long press
            recordPressTimer = setTimeout(() => {
                this.resetLoop(); // Long press action
                recordPressTimer = null; // Prevent click
            }, 500); // 500ms for long press
        });
        this.elements.recordBtn.addEventListener('mouseup', () => {
            if (recordPressTimer) {
                clearTimeout(recordPressTimer);
                this.handleRecordButton(); // Short press action
            }
        });

        this.setupKnob(this.elements.feedbackKnob);
    }

    // ============================================================================
    // POWER CONTROL
    // ============================================================================
    
    togglePower() {
        this.state.power = !this.state.power;
        this.elements.powerButton.classList.toggle('powered-on', this.state.power);
        this.elements.mainInterface.classList.toggle('powered-off', !this.state.power);

        if (this.state.power) {
            console.log('🔌 POWER ON');
            this.powerOnSequence();
        } else {
            console.log('🔌 POWER OFF');
            this.powerOff();
        }
    }

    async powerOnSequence() {
        this.flashStartupLEDs();
        await this.initializeAudioSystem();
        this.showTemporaryMessage('1.0', 1000, () => {
            this.showTemporaryMessage('198', 2000, () => {
                this.renderLedDisplay('.');
            });
        });
        this.updateParameterLEDs();
    }

    powerOff() {
        const loop = BufferLayer.state.loops[0];
        if (loop && loop.playbackNode) {
            loop.playbackNode.stop();
            loop.playbackNode = null;
        }
        ControllerLayer.state.loopState = 'idle';

        this.state.parameterMode = 0;
        this.updateParameterLEDs();
        this.updateMultipleDisplay('');
        this.renderLedDisplay('');
        if (SignalChainLayer.audioContext) {
            SignalChainLayer.audioContext.close().then(() => {
                SignalChainLayer.audioContext = null;
                console.log('AudioContext closed.');
            });
        }
    }

    flashStartupLEDs() {
        const buttonFunctions = ['record', 'overdub', 'multiply', 'insert', 'mute', 'undo', 'nextloop'];
        buttonFunctions.forEach((functionName, index) => {
            const led = document.querySelector(`[data-function="${functionName}"] .status-led`);
            if (led) {
                setTimeout(() => {
                    led.setAttribute('data-hw-state', 'on');
                    setTimeout(() => led.setAttribute('data-hw-state', 'off'), 400);
                }, index * 80);
            }
        });
    }

    async initializeAudioSystem() {
        if (SignalChainLayer.audioContext) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100, latencyHint: 'interactive' });
            if (audioCtx.state === 'suspended') await audioCtx.resume();
            
            const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
            SignalChainLayer.audioNodes.microphoneSource = audioCtx.createMediaStreamSource(stream);
            
            const processorBlob = new Blob([RECORDER_PROCESSOR_CODE], { type: 'application/javascript' });
            const processorUrl = URL.createObjectURL(processorBlob);
            await audioCtx.audioWorklet.addModule(processorUrl);
            
            SignalChainLayer.audioNodes.recorderWorklet = new AudioWorkletNode(audioCtx, 'recorder-processor');
            SignalChainLayer.audioNodes.microphoneSource.connect(SignalChainLayer.audioNodes.recorderWorklet);
            
            SignalChainLayer.audioNodes.outputGain = audioCtx.createGain();
            SignalChainLayer.audioNodes.outputGain.connect(audioCtx.destination);

            SignalChainLayer.audioContext = audioCtx;
            console.log('✅ Audio system initialized');
        } catch (error) {
            console.error('❌ Audio system initialization failed:', error);
        }
    }

    // ============================================================================
    // PARAMETER BUTTON CONTROL
    // ============================================================================
    
    handleParameters() {
        this.state.parameterMode = (this.state.parameterMode + 1) % 5;
        const modeNames = ['PLAY', 'P 1', 'P 2', 'P 3', 'P 4'];
        this.showTemporaryMessage(modeNames[this.state.parameterMode], 1500);
        this.updateMultipleDisplay(this.state.parameterMode > 0 ? `P${this.state.parameterMode}` : '');
        this.updateParameterLEDs();
    }

    updateParameterLEDs() {
        const leds = [this.elements.timingLed, this.elements.switchesLed, this.elements.midiLed, this.elements.loopsLed];
        leds.forEach((led, index) => {
            if (led) {
                led.classList.toggle('orange', this.state.parameterMode === (index + 1));
            }
        });
    }

    // ============================================================================
    // FEEDBACK KNOB CONTROL
    // ============================================================================
    
    setupKnob(knob) {
        const param = knob.dataset.param;
        const knobImage = knob.querySelector('.knob-image');
        let isDragging = false, startY = 0, startValue = this.state.controlValues[param];

        const updateVisual = (value) => {
            const rotation = ((value / 127) * 270) - 135;
            if (knobImage) knobImage.style.transform = `rotate(${rotation}deg)`;
        };
        updateVisual(startValue);

        knob.addEventListener('mousedown', (e) => {
            if (!this.state.power) return;
            e.preventDefault();
            isDragging = true;
            startY = e.clientY;
            startValue = this.state.controlValues[param];
            this.showTemporaryMessage(Math.round(startValue).toString(), 1000);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaY = startY - e.clientY;
            const sensitivity = 127 / 200;
            let newValue = startValue + deltaY * sensitivity;
            newValue = Math.max(0, Math.min(127, newValue));
            this.state.controlValues[param] = newValue;
            updateVisual(newValue);
            this.showTemporaryMessage(Math.round(newValue).toString(), 600);
            this.applyKnobToAudio(param, newValue);
        });

        document.addEventListener('mouseup', () => { isDragging = false; });
    }

    applyKnobToAudio(param, value) {
        console.log(`Feedback set to ${value}`);
    }

    // ============================================================================
    // RECORD BUTTON CONTROL
    // ============================================================================

    handleRecordButton() {
        const state = ControllerLayer.state;
        if (state.loopState === 'idle' || state.loopState === 'playing') {
            this.startRecording();
        } else if (state.loopState === 'recording') {
            this.stopRecording();
        }
    }

    startRecording() {
        ControllerLayer.state.loopState = 'recording';
        
        const loop = BufferLayer.state.loops[0];
        if (loop && loop.playbackNode) {
            loop.playbackNode.stop();
            loop.playbackNode = null;
        }

        BufferLayer.state.recordedChunks = [];
        const worklet = SignalChainLayer.audioNodes.recorderWorklet;

        worklet.port.onmessage = (event) => {
            BufferLayer.state.recordedChunks.push(new Float32Array(event.data));
        };
        worklet.port.postMessage({ isRecording: true });

        this.updateLed('record', 'recording'); // Red
        this.startLoopTimer();
        console.log('🔴 Recording started');
    }

    stopRecording() {
        // Guard clause to prevent this from running multiple times
        if (ControllerLayer.state.loopState !== 'recording') return;

        ControllerLayer.state.loopState = 'playing';
        const worklet = SignalChainLayer.audioNodes.recorderWorklet;
        worklet.port.postMessage({ isRecording: false });
        worklet.port.onmessage = null;

        const totalLength = BufferLayer.state.recordedChunks.reduce((sum, chunk) => sum + chunk.length, 0);
        if (totalLength < SignalChainLayer.audioContext.sampleRate * 0.1) {
            ControllerLayer.state.loopState = 'idle';
            this.updateLed('record', 'ready'); // Green
            this.stopLoopTimer();
            this.renderLedDisplay('.');
            console.warn("Loop too short. Recording cancelled.");
            return;
        }

        const audioCtx = SignalChainLayer.audioContext;
        const combined = new Float32Array(totalLength);
        let offset = 0;
        BufferLayer.state.recordedChunks.forEach(chunk => {
            combined.set(chunk, offset);
            offset += chunk.length;
        });

        const audioBuffer = audioCtx.createBuffer(1, totalLength, audioCtx.sampleRate);
        audioBuffer.copyToChannel(combined, 0);

        BufferLayer.state.loops[0].buffer = audioBuffer;
        this.playLoop();
        
        this.updateLed('record', 'ready'); // Green
        this.stopLoopTimer();
        console.log(`🟢 Recording stopped, playback started. Length: ${audioBuffer.duration.toFixed(2)}s`);
    }

    playLoop() {
        const loop = BufferLayer.state.loops[0];
        if (!loop.buffer) return;

        const audioCtx = SignalChainLayer.audioContext;
        const player = audioCtx.createBufferSource();
        player.buffer = loop.buffer;
        player.loop = true;
        player.connect(SignalChainLayer.audioNodes.outputGain);
        player.start();
        loop.playbackNode = player;
    }

    resetLoop() {
        console.log('🔄 Resetting Loop...');
        ControllerLayer.state.loopState = 'idle';

        const loop = BufferLayer.state.loops[0];
        if (loop && loop.playbackNode) {
            loop.playbackNode.stop();
            loop.playbackNode = null;
        }
        loop.buffer = null;
        BufferLayer.state.recordedChunks = [];

        this.stopLoopTimer();
        this.renderLedDisplay('.');
        this.updateLed('record', 'ready'); // Green
    }

    // ============================================================================
    // SHARED FEEDBACK & DISPLAY METHODS
    // ============================================================================
    
    updateLed(buttonName, state) {
        const led = document.querySelector(`[data-function="${buttonName}"] .status-led`);
        if (led) {
            led.setAttribute('data-hw-state', state);
        }
    }
    
    formatLoopTime(duration) {
        if (duration < 10) return duration.toFixed(2);
        if (duration < 100) return duration.toFixed(1);
        return Math.floor(duration).toString();
    }

    renderLedDisplay(str) {
        if (!this.elements.digitEls) return;
        this.elements.digitEls.forEach(d => {
            d.querySelectorAll('.segment').forEach(s => s.classList.remove('on'));
            d.querySelector('.dot').classList.remove('on');
        });
        let pos = this.elements.digitEls.length - 1;
        for (let i = str.length - 1; i >= 0 && pos >= 0; i--) {
            const ch = str[i];
            if (ch === '.') {
                if (pos < this.elements.digitEls.length - 1) {
                   this.elements.digitEls[pos + 1].querySelector('.dot').classList.add('on');
                }
            } else {
                const segs = SEGMENT_MAP[ch];
                if (segs) {
                    segs.forEach(segCls => {
                        this.elements.digitEls[pos].querySelector('.' + segCls).classList.add('on');
                    });
                }
                pos--;
            }
        }
    }

    startLoopTimer() {
        FeedbackLayer.state.timerStartTime = Date.now();
        this.renderLedDisplay(this.formatLoopTime(0));
        FeedbackLayer.state.timerInterval = setInterval(() => {
            const elapsed = (Date.now() - FeedbackLayer.state.timerStartTime) / 1000;
            
            // NEW: Check for max loop duration
            if (elapsed >= this.MAX_LOOP_SECONDS) {
                console.warn(`Max loop time of ${this.MAX_LOOP_SECONDS}s reached. Stopping recording.`);
                this.stopRecording();
                return;
            }

            this.renderLedDisplay(this.formatLoopTime(elapsed));
        }, 50);
    }
    
    stopLoopTimer() {
        clearInterval(FeedbackLayer.state.timerInterval);
        FeedbackLayer.state.timerInterval = null;
        const loop = BufferLayer.state.loops[0];
        if (loop && loop.buffer) {
            this.renderLedDisplay(this.formatLoopTime(loop.buffer.duration));
        }
    }

    showTemporaryMessage(message, duration = 2000, callback = null) {
        console.log(`DISPLAY MSG: ${message}`);
        if (this.displayTimeout) clearTimeout(this.displayTimeout);
        // A real implementation would map letters to 7-segment displays.
        // For now, we just show the first few chars or a placeholder.
        this.renderLedDisplay(message.substring(0, 3));
        this.displayTimeout = setTimeout(() => {
            this.displayTimeout = null;
            if (callback) {
                callback();
            } else {
                this.renderLedDisplay(this.getDefaultDisplay());
            }
        }, duration);
    }

    getDefaultDisplay() {
        const loop = BufferLayer.state.loops[0];
        return (loop && loop.buffer) ? this.formatLoopTime(loop.buffer.duration) : '.';
    }

    updateMultipleDisplay(text) {
        this.elements.multipleDisplay.textContent = text;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

let echoplexMinimal;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        echoplexMinimal = new EchoplexMinimal();
        echoplexMinimal.init();
        window.echoplexMinimal = echoplexMinimal;
    });
} else {
    echoplexMinimal = new EchoplexMinimal();
    echoplexMinimal.init();
    window.echoplexMinimal = echoplexMinimal;
}
