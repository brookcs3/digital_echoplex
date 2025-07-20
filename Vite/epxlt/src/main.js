import './index.css';
     /*
        ====================================================
        ECHOPLEX DIGITAL PRO PLUS - MINIMAL STARTING POINT
        ====================================================
        This file is organized linearly by hardware control.
        It contains the core class and the logic for each function.
        VERSION: RECORD button final fixes applied.
        */

        // ============================================================================
        // ENGINE DEFINITIONS (Catch-all for Layers & Processors)
        // ============================================================================

        // AudioWorklet Processor Code (as string to load as module)
        const RECORDER_PROCESSOR_CODE = `
        class RecorderProcessor extends AudioWorkletProcessor {
            constructor() {
                super();
                this.isRecording = false;
                this.isOverdubbing = false;
                this.isMultiplying = false; // New state for Multiply
                this.feedbackLevel = 1.0;
                this.port.onmessage = (event) => {
                    if (event.data.isRecording !== undefined) {
                        this.isRecording = event.data.isRecording;
                        console.log('🎙️ Worklet recording:', this.isRecording);
                    }
                    if (event.data.isOverdubbing !== undefined) {
                        this.isOverdubbing = event.data.isOverdubbing;
                        console.log('🔄 Worklet overdubbing:', this.isOverdubbing);
                    }
                    if (event.data.isMultiplying !== undefined) { // Handle Multiply state
                        this.isMultiplying = event.data.isMultiplying;
                        console.log('✖️ Worklet multiplying:', this.isMultiplying);
                    }
                    if (event.data.feedbackLevel !== undefined) {
                        this.feedbackLevel = event.data.feedbackLevel;
                        console.log('🎚️ Worklet feedback level:', this.feedbackLevel);
                    }
                };
            }
            
            process(inputs, outputs, parameters) {
                const micInput = inputs[0]; // Microphone input
                const loopInput = inputs[1]; // Loop feedback input
                
                if (micInput && micInput.length > 0 && micInput[0].length > 0) {
                    if (this.isRecording) {
                        // Send a copy of the microphone audio data to the main thread
                        this.port.postMessage({
                            type: 'recording',
                            data: micInput[0].slice() // Use slice to create a copy
                        });
                    }
                    
                    if (this.isOverdubbing || this.isMultiplying) { // Apply mixing for both overdub and multiply
                        const frameSize = micInput[0].length;
                        const mixedAudio = new Float32Array(frameSize);
                        
                        // Start with microphone input
                        for (let i = 0; i < frameSize; i++) {
                            mixedAudio[i] = micInput[0][i];
                        }
                        
                        // Add loop feedback with decay (95% scaling during overdub/multiply)
                        if (loopInput && loopInput.length > 0 && loopInput[0].length > 0) {
                            // Feedback for overdub/multiply is automatically scaled to ~95%
                            // to prevent overloading, as per Echoplex manual.
                            const feedbackGain = this.feedbackLevel * 0.95;  
                            for (let i = 0; i < frameSize; i++) {
                                mixedAudio[i] += loopInput[0][i] * feedbackGain;
                            }
                            // Changed template literal to string concatenation to avoid SyntaxError
                            console.log('Mixing: mic + feedback, frameSize: ' + frameSize + ', state: ' + (this.isOverdubbing ? 'Overdub' : 'Multiply'));
                        } else {
                            // Changed template literal to string concatenation to avoid SyntaxError
                            console.log('Processing: mic only, frameSize: ' + frameSize + ', state: ' + (this.isOverdubbing ? 'Overdub' : 'Multiply'));
                        }
                        
                        // Send mixed data to main thread
                        this.port.postMessage({
                            type: this.isOverdubbing ? 'overdub' : 'multiply', // Differentiate type
                            data: mixedAudio.slice() // Use slice to create a copy
                        });
                    }
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
            '9':['a','b','c','d','f','g'], '.':['dot'],
            'P':['a','b','e','f','g'], 'L':['d','e','f'], 'A':['a','b','c','e','f','g'], // For PLAY, P1, P2 etc.
            'Y':['b','c','d','f','g'], 'S':['a','f','g','c','d'], 'R':['a','e','f','g'], // For SAF, rEV
            'E':['a','d','e','f','g'], 'V':['b','c','d','e','f'], // For rEV
            'I':['e','f'], 'N':['a','b','c','e','f'], 'U':['b','c','d','e','f'], // For INS, UNDO, UNK
            'K':['e','f','g'], 'O':['a','b','c','d','e','f'], 'T':['a','b','c','d','e','f','g'], // For MUTE, NO LP
            'D':['b','c','d','e','g'], 'F':['a','e','f','g'], 'H':['b','c','e','f','g'], // For Fd, rhr, h.SP
            'r':['e','g'], 'h':['c','e','f','g'],
            // New mappings for parameter display names
            'd':['a','b','c','d','e','f','g'], // For dEL
            'C':['a','d','e','f'], // For CYC, Cnt, Ctr
            '8':['a','b','c','d','e','f','g'], // For 8th (already exists)
            't':['d','e','f','g'], // For toG, ti
            'o':['c','d','e','g'], // For not (o from nOt)
            's':['a','c','d','f','g'], // For SUS, StA
            'p':['a','b','e','f','g'], // For SP, StP
            'f':['a','e','f','g'], // For f (from Fd)
            'n':['c','e','g'], // For CnF
            'l':['d','e','f'], // For CLP
            'm':['a','c','e','g'], // For dUMP
            'L':['d','e','f'], // For LOAD (already exists)
            'b':['c','d','e','f','g'], // For Sub
            'z':['a','b','d','e','g'], // For Pr.E (P is already there, r is there, E is there)
            'W':['b','c','e','f','g'], // For SWI (Switches)
            'M':['a','c','e','g'], // For MID (MIDI)
            'X':['b','c','e','f','g'], // For EXP (ExpertMode)
            'U':['b','c','d','e','f'], // For Stu (StutterMode)
            'G':['a','b','c','d','e','f'], // For toG (Toggle)
        };

        // ============================================================================
        // PARAMETER MATRIX DATA
        // This structure defines all parameters, their display names, options, and default values.
        // It's organized by parameter mode (P1-P4) and the button function that accesses them.
        // ============================================================================
        const PARAMETER_MATRIX_DATA = {
            // P1: Timing Row
            P1_Timing: {
                ledId: 'timing-led',
                displayName: 'TIM', // Display name for the row itself
                params: {
                    'record': { displayName: 'LOP', options: ['LOP', 'dEL', 'EXP', 'Stu', 'Out', 'In', 'rPL', 'FLI'], default: 'LOP', fullName: 'Loop/Delay', description: 'Determines the routing of the pedal in the Feedback Jack.' },
                    'overdub': { displayName: 'OFF', options: ['OFF', 'CYC', '8th', 'LOP'], default: 'OFF', fullName: 'Quantize', description: 'Synchronizes actions to rhythmic points.' },
                    'multiply': { displayName: '8', options: [8, 4, 2, 6, 12, 16, 32, 64, 128, 256, 1, 2, 3, 5, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96], isDataWheel: true, default: 8, fullName: '8ths/Cycle', description: 'Number of 8th notes per cycle for synchronization.' },
                    'insert': { displayName: 'Out', options: ['Off', 'Ous', 'In', 'Out'], default: 'Out', fullName: 'SyncMode', description: 'Configures synchronization with external MIDI clocks.' },
                    'mute': { displayName: '0', options: [0, 1, 2, 3, 4, 5, 6, 7, 8], isDataWheel: true, default: 0, fullName: 'TrigThreshold', description: 'Audio level required to trigger recording.' },
                    'undo': { displayName: 'rEV', options: ['rEV', 'Fd'], default: 'rEV', fullName: 'Reverse', description: 'Reverses the playback direction of the loop.' }, // Note: This is specifically for the Reverse function under Timing row
                    'nextloop': { displayName: 'S.Pt', options: ['S.Pt'], default: 'S.Pt', fullName: 'StartPoint', description: 'Sets the loop\'s start point.' }
                }
            },
            // P2: Switches Row
            P2_Switches: {
                ledId: 'switches-led',
                displayName: 'SWI', // Display name for the row itself
                params: {
                    'record': { displayName: 'toG', options: ['toG', 'SUS', 'SAF'], default: 'toG', fullName: 'RecordMode', description: 'Determines how the Record button behaves.' },
                    'overdub': { displayName: 'toG', options: ['toG', 'SUS'], default: 'toG', fullName: 'OverdubMode', description: 'Configures the Overdub button behavior.' },
                    'multiply': { displayName: 'OFF', options: ['OFF', 'RND'], default: 'OFF', fullName: 'RoundMode', description: 'Determines whether actions round off to the nearest cycle.' },
                    'insert': { displayName: 'InS', options: ['InS', 'rhr', 'rPL', 'Sub', 'rEV', 'h.SP', 'SUS'], default: 'InS', fullName: 'InsertMode', description: 'Configures the Insert button functionality.' },
                    'mute': { displayName: 'Cnt', options: ['Cnt', 'StA'], default: 'Cnt', fullName: 'MuteMode', description: 'Determines how sound is restarted after it is muted.' },
                    'undo': { displayName: 'StP', options: ['StP', 'PLY'], default: 'StP', fullName: 'Overflow', description: 'Configures how the unit handles memory overflow.' },
                    'nextloop': { displayName: 'Pr.E', options: ['Pr.E'], default: 'Pr.E', fullName: 'Presets', description: 'Accesses the Preset Editor.' }
                }
            },
            // P3: MIDI Row
            P3_MIDI: {
                ledId: 'midi-led',
                displayName: 'MID', // Display name for the row itself
                params: {
                    'record': { displayName: '1', options: Array.from({length:16}, (_,i)=>i+1), isDataWheel: true, default: 1, fullName: 'Channel', description: 'Sets the MIDI channel for all MIDI functions.' },
                    'overdub': { displayName: 'not', options: ['not', 'Ctr', 'OFF'], default: 'not', fullName: 'ControlSource', description: 'Sets up MIDI control of Echoplex operations.' },
                    'multiply': { displayName: '36', options: Array.from({length:100}, (_,i)=>i), isDataWheel: true, default: 36, fullName: 'Source #', description: 'Sets the starting MIDI note/controller number for commands.' },
                    'insert': { displayName: '7', options: Array.from({length:99}, (_,i)=>i+1), isDataWheel: true, default: 7, fullName: 'VolumeCont', description: 'Assigns a MIDI controller for volume control.' },
                    'mute': { displayName: '1', options: Array.from({length:99}, (_,i)=>i+1), isDataWheel: true, default: 1, fullName: 'FeedBkCont', description: 'Assigns a MIDI controller for feedback control.' },
                    'undo': { displayName: 'dUMP', options: ['dUMP'], default: 'dUMP', fullName: 'Dump', description: 'Sends a MIDI dump of the current loop.' },
                    'nextloop': { displayName: 'LOAD', options: ['LOAD'], default: 'LOAD', fullName: 'Load', description: 'Receives a MIDI dump to load a loop.' }
                }
            },
            // P4: Loops Row
            P4_Loops: {
                ledId: 'loops-led',
                displayName: 'LOO', // Display name for the row itself
                params: {
                    'record': { displayName: '1', options: Array.from({length:16}, (_,i)=>i+1), isDataWheel: true, default: 1, fullName: 'MoreLoops', description: 'Sets the number of loops available in memory.' },
                    'overdub': { displayName: 'OFF', options: ['OFF', 'On'], default: 'OFF', fullName: 'AutoRecord', description: 'Automatically starts recording when entering an empty loop.' },
                    'multiply': { displayName: 'OFF', options: ['OFF', 'ti', 'Snd'], default: 'OFF', fullName: 'LoopCopy', description: 'Enables copying of loops between memory locations.' },
                    'insert': { displayName: 'OFF', options: ['OFF', 'CnF', 'CYC', 'CCY', 'LOP', 'CLP'], default: 'OFF', fullName: 'SwitchQuant', description: 'Quantizes loop switching to rhythmic points.' },
                    'mute': { displayName: 'OFF', options: ['OFF', 'On'], default: 'OFF', fullName: 'Velocity', description: 'Enables velocity sensitivity for MIDI control.', currentValue: 'OFF' },
                    'undo': { displayName: 'run', options: ['run', 'OnE', 'StA', 'Att'], default: 'run', fullName: 'SamplerStyle', description: 'Configures the unit for sampler-style playback.' },
                    'nextloop': { displayName: '120', options: Array.from({length:278}, (_,i)=>i+1), isDataWheel: true, default: 120, fullName: 'Tempo', description: 'Sets the tempo for synchronization.' } // Tempo range 1-278 for DataWheel
                }
            }
        };


        // Conceptual Layers (State and low-level logic will live here)
        const SignalChainLayer = {
            audioContext: null,
            audioNodes: {
                inputGain: null,
                outputGain: null,
                feedbackGain: null,
                microphoneSource: null,
                recorderWorklet: null,
                mixGain: null, // New node for mixing input and loop output
                inputAnalyser: null, // New AnalyserNode for input level
                feedbackAnalyser: null, // New AnalyserNode for feedback/loop level
            }
        };

        const ControllerLayer = {
            state: {
                loopState: 'idle', // 'idle', 'recording', 'playing', 'overdubbing', 'multiplying'
                insertMode: 'InS', // 'Insert', 'Reverse', 'Rehearse', etc. (Initialized from PARAMETER_MATRIX_DATA)
                isMuted: false, // New state for Mute
                isReversed: false, // New state for Reverse
                activeParameter: null, // Stores the currently selected parameter object
                activeParameterRow: null, // Stores the current parameter row object
            }
        };

        const BufferLayer = {
            state: {
                loops: [
                    { buffer: null, playbackNode: null, undoStack: [] }
                ],
                recordedChunks: [],
                overdubChunks: [],
                multiplyChunks: [], // New for Multiply
            }
        };

        const FeedbackLayer = {
            state: {
                timerInterval: null,
                timerStartTime: null,
            }
        };

// ============================================================================
// CORE UNIT FUNCTIONS (CONTROLLER LAYER IMPLEMENTATION)
// ============================================================================
//
// From this point forward, the code primarily defines the operational
// commands and state machines of the Echoplex's Controller Layer.
//
// These functions are designed to be cohesive and will integrate directly
// with other conceptual layers (BufferLayer, SignalChainLayer, FeedbackLayer)
// as needed, reflecting the integrated behavior described in schema.md.
// Each function acts as an entry point for unit actions triggered by user input.
//
// === DESIGN PRINCIPLES FOR THIS SECTION ===
//
// 1.  INTEGRATED LOGIC: Each command (e.g., Record, Overdub) will contain
//     all necessary logic pertaining directly to its execution across downstream
//     layers (Buffer, Signal Chain, Feedback).
//
// 2.  NO UPSTREAM POLLUTION: Logic that rightfully belongs in higher
//     hierarchy layers (e.g., System Hardware/BLK Layer for raw input events,
//     or Parameter Layer for parameter definitions/updates) MUST NOT be
//     interspersed within these command implementations.
//
// 3.  UPSTREAM ADDITIONS: If new logic affecting these commands arises that
//     belongs upstream (e.g., a new parameter affecting Record behavior,
//     or a new way of interpreting button presses), it should be:
//     a.  Defined and implemented in its respective, earlier section of the code
//         (e.g., within PARAMETER_MATRIX_DATA, or a dedicated input handler).
//     b.  Clearly separated from this Controller Layer implementation block.
//
// 4. PRIMARY EVENT LISTENER PLACEMENT:
//  All top-level event listeners (e.g., addEventListener calls for buttons and knobs that act
//  as direct entry points for unit commands) should be defined within this Controller Layer's
//  setupEventListeners() method. This ensures that the primary translation of user input
//  from the BLK Layer to Controller Layer commands is centralized here.
//  Listeners that are transient or deeply integrated within a specific, complex function's
//  internal logic may reside within that functio
// 5. NOT ALL EVENT LISTENERS SHOULD NECESSARILY BE IN setupEventListeners():
// Listeners that are:
// Transient:
//  Only active for a short period (e.g., during a drag operation, like the mousemove and
//  mouseup listeners for knobs, which are added and removed dynamically).
//. Deeply Integrated within a Specific, Complex Function's Internal Logic:
//  If a listener is part of a very specific, isolated state machine within a function
//  (e.g., a listener that only exists while a dialog is open, or during a multi-step
//  process), it makes sense for that listener to be defined and managed directly within
//. that function's scope.


//
// ============================================================================

        // ============================================================================
        // MAIN ECHOPLEX CLASS
        // ============================================================================

        class EchoplexMinimal {
            constructor() {
                this.state = {
                    power: false,
                    parameterMode: 0, // 0=PLAY, 1=P1 (Timing), 2=P2 (Switches), 3=P3 (MIDI), 4=P4 (Loops)
                    controlValues: {
                        input: 100,
                        output: 100,
                        mix: 64, // Halfway point for mix
                        feedback: 127 // Default feedback as per manual
                    },
                    parameters: {}, // Holds current values of all parameters
                };
                this.elements = {};
                this.displayTimeout = null;
                this.MAX_LOOP_SECONDS = 198;
                this.animationFrameId = null; // For level monitoring

                this.initializeParameters(); // Initialize all parameters from the matrix
            }

            initializeParameters() {
                for (const rowKey in PARAMETER_MATRIX_DATA) {
                    const row = PARAMETER_MATRIX_DATA[rowKey];
                    for (const paramKey in row.params) {
                        const param = row.params[paramKey];
                        // Use a unique key for each parameter, e.g., 'P1_Timing_Loop/Delay'
                        const uniqueParamKey = `${rowKey}_${paramKey}`;
                        // Set current value from default if not already set
                        this.state.parameters[uniqueParamKey] = {
                            ...param, // Copy all properties
                            currentValue: param.default // Ensure current value is set from default
                        };
                    }
                }
                // Initialize InsertMode from the parameters state
                const insertModeParam = this.state.parameters['P2_Switches_insert'];
                if (insertModeParam) {
                    ControllerLayer.state.insertMode = insertModeParam.currentValue;
                }
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
                    powerButton: document.getElementById('power-button'), // Still 'power-button'
                    mainInterface: document.getElementById('main-interface'), // Still 'main-interface'
                    echoplexContainer: document.getElementById('echoplex-container'), // New main visual container
                    waveformCanvas: document.getElementById('waveform-canvas'), // New
                    inputLevelLED: document.getElementById('input-level'), // New
                    feedbackLevelLED: document.getElementById('feedback-level'), // New

                    ledDisplayContainer: document.getElementById('display'), // Still 'display' (inner flex row)
                    leftDisplay: document.getElementById('left-display'), // New
                    multipleDisplay: document.getElementById('multiple-display'), // Still 'multiple-display'
                    autoUndoLED: document.getElementById('autoUndoLED'), // New
                    tempoDotLeft: document.getElementById('tempoDotLeft'), // New
                    tempoDotRight: document.getElementById('tempoDotRight'), // New

                    // Knobs - now have data-param
                    inputKnob: document.querySelector('.knob[data-param="input"]'),
                    outputKnob: document.querySelector('.knob[data-param="output"]'),
                    mixKnob: document.querySelector('.knob[data-param="mix"]'),
                    feedbackKnob: document.querySelector('.knob[data-param="feedback"]'),

                    // Buttons - now have data-function on the parent .control.button, but LED is inside
                    parametersBtn: document.querySelector('.button[data-function="parameters"]'),
                    recordBtn: document.querySelector('.button[data-function="record"]'),
                    overdubBtn: document.querySelector('.button[data-function="overdub"]'),
                    multiplyBtn: document.querySelector('.button[data-function="multiply"]'),
                    insertBtn: document.querySelector('.button[data-function="insert"]'),
                    muteBtn: document.querySelector('.button[data-function="mute"]'),
                    undoBtn: document.querySelector('.button[data-function="undo"]'),
                    nextloopBtn: document.querySelector('.button[data-function="nextloop"]'),

                    // Row Indicator LEDs - now have specific IDs
                    timingLed: document.getElementById('timing-led'),
                    switchesLed: document.getElementById('switches-led'),
                    midiLed: document.getElementById('midi-led'),
                    loopsLed: document.getElementById('loops-led'),
                };
                this.buildLedDisplay();
                this.buildLeftAndMultipleDisplays(); // Build the new 7-segment displays
            }

            buildLeftAndMultipleDisplays() {
                const createDigitElements = (container) => {
                    container.innerHTML = ''; // Clear any previous content
                    const DIGITS = container.id === 'left-display' ? 1 : 2; // 1 digit for left, 2 for multiple
                    for (let i = 0; i < DIGITS; i++) {
                        const digit = document.createElement('div');
                        digit.className = 'digit';
                        ['a','b','c','d','e','f','g'].forEach(cls => {
                            const seg = document.createElement('div');
                            seg.className = `segment ${cls}`;
                            digit.appendChild(seg);
                        });
                        if (container.id !== 'left-display') { // Only multiple display has dots
                            const dot = document.createElement('div');
                            dot.className = 'dot';
                            digit.appendChild(dot);
                        }
                        container.appendChild(digit);
                    }
                    return Array.from(container.querySelectorAll('.digit'));
                };

                this.elements.leftDisplayDigits = createDigitElements(this.elements.leftDisplay);
                this.elements.multipleDisplayDigits = createDigitElements(this.elements.multipleDisplay);
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
                    dot.classList.add('hidden'); // Initially hidden, only shown if needed
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
                this.elements.recordBtn.addEventListener('mousedown', (e) => {
                    if (!this.state.power) return;
                    // If in parameter mode, handle as parameter selection
                    if (this.state.parameterMode > 0) {
                        this.handleParameterButtonPress('record', e); // Pass event for long press detection
                        return;
                    }
                /* Prevent immediate recording if already recording
                    if (ControllerLayer.state.loopState === 'recording') {
                        this.handleRecordButton(); // Short press to stop recording
                        return;
                    }
                   */

                    this.updateLed('record', 'orange'); // Indicate potential long press
                    recordPressTimer = setTimeout(() => {
                        this.resetLoop(); // Long press action: reset loop
                        recordPressTimer = null; // Prevent click
                        // After reset, ensure record LED is ready
                        this.updateLed('record', 'ready');
                    }, 500); // 500ms for long press
                });
                this.elements.recordBtn.addEventListener('mouseup', () => {
                    if (recordPressTimer) {
                        clearTimeout(recordPressTimer);
                        // Only handle as short press if not in parameter mode and timer was active
                        if (this.state.parameterMode === 0) {
                            this.handleRecordButton(); // Short press action: start recording
                        }
                    }
                    // Ensure LED state is reset if long press didn't trigger resetLoop or if it was just a quick tap
                    if (this.state.parameterMode === 0 && ControllerLayer.state.loopState !== 'recording' && ControllerLayer.state.loopState !== 'playing') {
                        this.updateLed('record', 'ready');
                    }
                });
                // Add mouseleave to clear timer if mouseup doesn't happen on the button
                this.elements.recordBtn.addEventListener('mouseleave', () => {
                    if (recordPressTimer) {
                        clearTimeout(recordPressTimer);
                        recordPressTimer = null;
                        // Reset LED if not recording/playing
                        if (this.state.parameterMode === 0 && ControllerLayer.state.loopState !== 'recording' && ControllerLayer.state.loopState !== 'playing') {
                            this.updateLed('record', 'ready');
                        }
                    }
                });


                // OVERDUB BUTTON
                this.elements.overdubBtn.addEventListener('click', (e) => {
                    if (!this.state.power) return;
                    if (this.state.parameterMode > 0) {
                        this.handleParameterButtonPress('overdub', e);
                        return;
                    }
                    this.handleOverdubButton();
                });


                // MULTIPLY BUTTON
                this.elements.multiplyBtn.addEventListener('click', (e) => {
                    if (!this.state.power) return;
                    if (this.state.parameterMode > 0) {
                        this.handleParameterButtonPress('multiply', e);
                        return;
                    }
                    this.handleMultiplyButton();
                });


                // INSERT BUTTON (handles InsertMode logic)
                this.elements.insertBtn.addEventListener('click', (e) => {
                    if (!this.state.power) return;
                    if (this.state.parameterMode > 0) {
                        this.handleParameterButtonPress('insert', e);
                        return;
                    }
                    this.handleInsertButton();
                });


                // MUTE BUTTON
                this.elements.muteBtn.addEventListener('click', (e) => {
                    if (!this.state.power) return;
                    if (this.state.parameterMode > 0) {
                        this.handleParameterButtonPress('mute', e);
                        return;
                    }
                    this.handleMuteButton();
                });


                // UNDO BUTTON
                this.elements.undoBtn.addEventListener('click', (e) => {
                    if (!this.state.power) return;
                    if (this.state.parameterMode > 0) {
                        this.handleParameterButtonPress('undo', e);
                        return;
                    }
                    this.handleUndoButton();
                });


                // NEXTLOOP BUTTON (placeholder for future multiple loops)
                this.elements.nextloopBtn.addEventListener('click', (e) => {
                    if (!this.state.power) return;
                    if (this.state.parameterMode > 0) {
                        this.handleParameterButtonPress('nextloop', e);
                        return;
                    }
                    this.showTemporaryMessage('NXT L', 1000); // Placeholder
                    this.updateLed('nextloop', 'on');
                    setTimeout(() => this.updateLed('nextloop', 'off'), 500);
                });

                // Setup all knobs
                this.setupKnob(this.elements.inputKnob);
                this.setupKnob(this.elements.outputKnob);
                this.setupKnob(this.elements.mixKnob);
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
                // Set initial LED states for buttons
                this.updateLed('record', 'ready');
                this.updateLed('overdub', 'ready');
                this.updateLed('multiply', 'ready');
                this.updateLed('insert', 'ready');
                this.updateLed('mute', 'ready');
                this.updateLed('undo', 'off'); // Undo starts off as there's no history
                this.updateLed('nextloop', 'ready');

                // Apply initial knob values to audio system
                this.applyKnobToAudio('input', this.state.controlValues.input);
                this.applyKnobToAudio('output', this.state.controlValues.output);
                this.applyKnobToAudio('mix', this.state.controlValues.mix);
                this.applyKnobToAudio('feedback', this.state.controlValues.feedback);

                // Start level monitoring
                this.startLevelMonitoring();

                // Set initial loop number display
                this.renderLeftDisplay(1); // Default to loop 1
            }

            powerOff() {
                const loop = BufferLayer.state.loops[0];
                if (loop && loop.playbackNode) {
                    loop.playbackNode.stop();
                    loop.playbackNode.disconnect(); // Disconnect on power off
                    loop.playbackNode = null;
                }
                ControllerLayer.state.loopState = 'idle';
                ControllerLayer.state.isMuted = false; // Reset mute state
                ControllerLayer.state.isReversed = false; // Reset reverse state
                ControllerLayer.state.activeParameter = null; // Clear active parameter
                ControllerLayer.state.activeParameterRow = null; // Clear active parameter row

                this.state.parameterMode = 0;
                this.updateParameterLEDs(); // Ensure row LEDs are off
                this.updateMultipleDisplay(''); // Clear P display
                this.renderLedDisplay(''); // Clear LoopTime display
                this.renderLeftDisplay(''); // Clear Left display
                this.renderMultipleDisplay(''); // Clear Multiple display

                // Turn off all status LEDs
                const buttonFunctions = ['record', 'overdub', 'multiply', 'insert', 'mute', 'undo', 'nextloop']; // Include new button
                buttonFunctions.forEach(name => this.updateLed(name, 'off'));
                // Turn off all parameter LEDs
                this.updateLed('loops-led', 'off');  
                this.updateLed('midi-led', 'off');
                this.updateLed('switches-led', 'off');
                this.updateLed('timing-led', 'off');

                // Turn off level LEDs
                this.updateLed('input-level', 'off');
                this.updateLed('feedback-level', 'off');


                // Stop level monitoring
                this.stopLevelMonitoring();

                if (SignalChainLayer.audioContext) {
                    SignalChainLayer.audioContext.close().then(() => {
                        SignalChainLayer.audioContext = null;
                        SignalChainLayer.audioNodes = {}; // Clear all audio nodes
                        console.log('AudioContext closed.');
                    });
                }
            }

            flashStartupLEDs() {
                const buttonFunctions = ['record', 'overdub', 'multiply', 'insert', 'mute', 'undo', 'nextloop']; // Include new button
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
                    
                    // Create recorder worklet with 2 inputs (microphone + feedback)
                    SignalChainLayer.audioNodes.recorderWorklet = new AudioWorkletNode(audioCtx, 'recorder-processor', {
                        numberOfInputs: 2, // Input 0 for mic, Input 1 for loop feedback
                        numberOfOutputs: 1
                    });
                    
                    // Create gain nodes for input, output, mix, and feedback
                    SignalChainLayer.audioNodes.inputGain = audioCtx.createGain();
                    SignalChainLayer.audioNodes.outputGain = audioCtx.createGain();
                    SignalChainLayer.audioNodes.mixGain = audioCtx.createGain(); // For mixing live input and loop output
                    SignalChainLayer.audioNodes.feedbackGain = audioCtx.createGain();

                    // Create AnalyserNodes for level monitoring
                    SignalChainLayer.audioNodes.inputAnalyser = audioCtx.createAnalyser();
                    SignalChainLayer.audioNodes.inputAnalyser.fftSize = 256; // Smaller FFT for faster response
                    SignalChainLayer.audioNodes.inputAnalyser.smoothingTimeConstant = 0.1; // Less smoothing for responsiveness

                    SignalChainLayer.audioNodes.feedbackAnalyser = audioCtx.createAnalyser();
                    SignalChainLayer.audioNodes.feedbackAnalyser.fftSize = 256;
                    SignalChainLayer.audioNodes.feedbackAnalyser.smoothingTimeConstant = 0.1;

                    
                    // Connect microphone source -> inputGain -> recorderWorklet (input 0)
                    SignalChainLayer.audioNodes.microphoneSource.connect(SignalChainLayer.audioNodes.inputGain);
                    SignalChainLayer.audioNodes.inputGain.connect(SignalChainLayer.audioNodes.recorderWorklet, 0, 0);

                    // Connect inputGain to inputAnalyser for monitoring
                    SignalChainLayer.audioNodes.inputGain.connect(SignalChainLayer.audioNodes.inputAnalyser);


                    // Connect recorderWorklet output -> mixGain
                    SignalChainLayer.audioNodes.recorderWorklet.connect(SignalChainLayer.audioNodes.mixGain);

                    // Connect mixGain to feedbackAnalyser for monitoring the loop output
                    SignalChainLayer.audioNodes.mixGain.connect(SignalChainLayer.audioNodes.feedbackAnalyser);

                    // Connect mixGain -> outputGain -> destination
                    SignalChainLayer.audioNodes.mixGain.connect(SignalChainLayer.audioNodes.outputGain);
                    SignalChainLayer.audioNodes.outputGain.connect(audioCtx.destination);

                    // Initialize gain values from state
                    SignalChainLayer.audioNodes.inputGain.gain.value = this.state.controlValues.input / 127;
                    SignalChainLayer.audioNodes.outputGain.gain.value = this.state.controlValues.output / 127;
                    // Mix knob controls the balance. 0 = loop only, 127 = input only, 64 = even mix.
                    // This will be handled in applyKnobToAudio for 'mix'
                    SignalChainLayer.audioNodes.feedbackGain.gain.value = this.state.controlValues.feedback / 127;


                    SignalChainLayer.audioContext = audioCtx;
                    console.log('✅ Audio system initialized');
                } catch (error) {
                    console.error('❌ Audio system initialization failed:', error);
                    // Provide user feedback if audio fails
                    this.showTemporaryMessage('ERR', 2000);
                }
            }

            // ============================================================================
            // PARAMETER BUTTON CONTROL
            // ============================================================================
            
            handleParameters() {
                if (!this.state.power) return;
                
                // Cycle through parameter modes: PLAY, P1 (Timing), P2 (Switches), P3 (MIDI), P4 (Loops)
                this.state.parameterMode = (this.state.parameterMode + 1) % 5;
                const rowNamesForMainDisplay = ['PLAY', 'TIM', 'SWI', 'MID', 'LOO']; // Shorter names for main display
                const pDisplayNamesForMultiple = ['', 'P 1', 'P 2', 'P 3', 'P 4']; // For multiple display

                // Update row indicator LEDs
                this.updateParameterLEDs();

                if (this.state.parameterMode > 0) { // Entering/cycling parameter mode
                    // Set the active parameter row for later button presses
                    const rowKeys = ['P1_Timing', 'P2_Switches', 'P3_MIDI', 'P4_Loops'];
                    ControllerLayer.state.activeParameterRow = PARAMETER_MATRIX_DATA[rowKeys[this.state.parameterMode - 1]];
                    ControllerLayer.state.activeParameter = null; // Clear active parameter when changing rows
                    this.updateParameterButtonLEDs(); // Update function button LEDs for the new row

                    // Update main LoopTime display with row name (e.g., "TIM")
                    this.showTemporaryMessage(rowNamesForMainDisplay[this.state.parameterMode], 1500);  
                    
                    // Update left display (loop number) to blank
                    this.renderLeftDisplay('');

                    // Update multiple display with "P1", "P2", etc.
                    this.renderMultipleDisplay(pDisplayNamesForMultiple[this.state.parameterMode]);

                } else { // Returning to Play Mode
                    this.resetParameterButtonLEDs(); // Reset all parameter button LEDs to 'ready' or 'off'
                    ControllerLayer.state.activeParameter = null; // Clear active parameter
                    ControllerLayer.state.activeParameterRow = null; // Clear active parameter row

                    // Restore main LoopTime display to default (loop time or '.')
                    this.renderLedDisplay(this.getDefaultDisplay());

                    // Restore left display to loop number
                    this.renderLeftDisplay(1); // Assuming current loop is 1

                    // Clear multiple display
                    this.renderMultipleDisplay('');
                }
            }

            updateParameterLEDs() {
                const leds = ['timing-led', 'switches-led', 'midi-led', 'loops-led'];
                // The manual states: "Pressing the Parameter button several times selects each row in turn, lighting the corresponding indicator light."
                // So, only one should be orange at a time.
                leds.forEach((id, index) => {
                    if (this.state.parameterMode === (index + 1)) { // P1 is index 0 (Timing), P2 is index 1 (Switches) etc.
                        this.updateLed(id, 'orange'); // Set the active one to orange
                    } else {
                        this.updateLed(id, 'off'); // Turn others off
                    }
                });
                // When parameterMode is 0 (PLAY), all row LEDs should be off.
                // This is handled by resetParameterButtonLEDs when returning to Play mode.
            }

            updateParameterButtonLEDs() {
                // Turn off all function button LEDs first
                const allFunctionButtons = ['record', 'overdub', 'multiply', 'insert', 'mute', 'undo', 'nextloop'];
                allFunctionButtons.forEach(btnName => this.updateLed(btnName, 'off'));

                // Turn on LEDs for buttons that have parameters in the current mode
                if (ControllerLayer.state.activeParameterRow) {
                    for (const buttonFunction in ControllerLayer.state.activeParameterRow.params) {
                        this.updateLed(buttonFunction, 'on'); // Light up buttons that have parameters in this row
                    }
                }
            }

            resetParameterButtonLEDs() {
                // Restore normal LED states for Play Mode
                this.updateLed('record', ControllerLayer.state.loopState === 'recording' ? 'recording' : 'ready');
                this.updateLed('overdub', ControllerLayer.state.loopState === 'overdubbing' ? 'recording' : 'ready');
                this.updateLed('multiply', ControllerLayer.state.loopState === 'multiplying' ? 'recording' : 'ready');
                this.updateLed('insert', ControllerLayer.state.isReversed ? 'recording' : 'ready'); // Red if reversed, green if not
                this.updateLed('mute', ControllerLayer.state.isMuted ? 'recording' : 'ready'); // Red if muted, green if not
                this.updateLed('undo', BufferLayer.state.loops[0].undoStack.length > 0 ? 'ready' : 'off'); // Green if undoable
                this.updateLed('nextloop', 'ready');
                // Ensure row indicator LEDs are off in Play mode
                this.updateLed('loops-led', 'off');
                this.updateLed('midi-led', 'off');
                this.updateLed('switches-led', 'off');
                this.updateLed('timing-led', 'off');
            }

            // ============================================================================
            // PARAMETER EDITING (via Play Buttons)
            // ============================================================================
            handleParameterButtonPress(buttonFunction, event) {
                if (!this.state.power || this.state.parameterMode === 0) return; // Only in parameter mode

                const currentRowKey = ['P1_Timing', 'P2_Switches', 'P3_MIDI', 'P4_Loops'][this.state.parameterMode - 1];
                const currentRowData = PARAMETER_MATRIX_DATA[currentRowKey];

                if (!currentRowData || !currentRowData.params[buttonFunction]) {
                    console.warn(`No parameter found for button ${buttonFunction} in mode P${this.state.parameterMode}`);
                    this.showTemporaryMessage('ERR', 500);
                    return;
                }

                const paramInfo = currentRowData.params[buttonFunction];
                const uniqueParamKey = `${currentRowKey}_${buttonFunction}`;
                let currentParamState = this.state.parameters[uniqueParamKey];

                // Long press detection for parameter reset
                let longPressTimer = null;
                const resetButton = event.currentTarget; // The actual button element

                const startLongPressTimer = () => {
                    longPressTimer = setTimeout(() => {
                        // Long press action: Reset to default
                        currentParamState.currentValue = paramInfo.default;
                        this.showTemporaryMessage(String(currentParamState.currentValue), 1000);
                        console.log(`Parameter ${currentParamState.fullName} reset to default: ${currentParamState.currentValue}`);
                        // Special handling for InsertMode if it's reset
                        if (uniqueParamKey === 'P2_Switches_insert') {
                            ControllerLayer.state.insertMode = currentParamState.currentValue;
                        }
                        // Special handling for Reverse if it's reset
                        if (currentRowKey === 'P1_Timing' && buttonFunction === 'undo' && currentParamState.fullName === 'Reverse') {
                            ControllerLayer.state.isReversed = (currentParamState.currentValue === 'rEV'); // Update state based on default
                            this.updateLed('insert', ControllerLayer.state.isReversed ? 'recording' : 'ready'); // Update LED
                            if (BufferLayer.state.loops[0].buffer) { // Only play if there's a loop
                                this.playLoop(); // Restart loop to apply reverse change if playing
                            }
                        }
                        longPressTimer = null; // Clear timer to prevent short press action
                    }, 500); // 0.5 seconds for long press
                };

                const clearLongPressTimer = () => {
                    if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }
                };

                // Attach listeners for long press
                const onMouseUp = () => {
                    clearLongPressTimer();
                    if (longPressTimer === null) { // If timer was cleared by long press action, do nothing
                        // Short press action: Cycle through options or show value
                        if (ControllerLayer.state.activeParameter !== currentParamState) {
                            ControllerLayer.state.activeParameter = currentParamState;
                            this.showTemporaryMessage(currentParamState.displayName, 1000); // Show display name first
                            console.log(`Selected parameter: ${currentParamState.fullName}. Current value: ${currentParamState.currentValue}`);
                        } else {
                            if (!currentParamState.isDataWheel) {
                                const currentIndex = currentParamState.options.indexOf(currentParamState.currentValue);
                                const nextIndex = (currentIndex + 1) % currentParamState.options.length;
                                currentParamState.currentValue = currentParamState.options[nextIndex];
                                this.showTemporaryMessage(String(currentParamState.currentValue), 600);
                                console.log(`Parameter ${currentParamState.fullName} cycled to: ${currentParamState.currentValue}`);
                            } else {
                                this.showTemporaryMessage(String(currentParamState.currentValue), 600);
                                console.log(`Parameter ${currentParamState.fullName} is a DataWheel. Current value: ${currentParamState.currentValue}`);
                            }
                        }
                        // Special handling for InsertMode
                        if (uniqueParamKey === 'P2_Switches_insert') {
                            ControllerLayer.state.insertMode = currentParamState.currentValue;
                        }
                        // Handle P1 Timing -> Undo (Reverse)
                        if (currentRowKey === 'P1_Timing' && buttonFunction === 'undo' && currentParamState.fullName === 'Reverse') {
                            this.toggleReverse(); // Call the actual reverse function
                        }
                    }
                    // Remove temporary event listeners
                    resetButton.removeEventListener('mouseup', onMouseUp);
                    resetButton.removeEventListener('mouseleave', onMouseLeave);
                };

                const onMouseLeave = () => {
                    clearLongPressTimer();
                    // If mouse leaves before long press, treat as short press (if no action already taken)
                    if (longPressTimer !== null) { // If timer was still running
                        onMouseUp(); // Simulate a short press release
                    }
                    resetButton.removeEventListener('mouseup', onMouseUp);
                    resetButton.removeEventListener('mouseleave', onMouseLeave);
                };

                // Start the long press timer on mousedown
                startLongPressTimer();
                resetButton.addEventListener('mouseup', onMouseUp);
                resetButton.addEventListener('mouseleave', onMouseLeave);
            }


            // ============================================================================
            // KNOB CONTROL (Input, Output, Mix, Feedback)
            // ============================================================================
            
            setupKnob(knob) {
                const param = knob.dataset.param;
                const knobImage = knob.querySelector('.knob-image');
                let isDragging = false, startY = 0, startValue;

                const updateVisual = (value) => {
                    // Knobs rotate from -135deg (0) to +135deg (127)
                    const rotation = ((value / 127) * 270) - 135;  
                    if (knobImage) knobImage.style.transform = `rotate(${rotation}deg)`;
                };
                
                // Set initial visual position based on stored value or default
                if (param === 'feedback' && this.state.parameterMode > 0 && ControllerLayer.state.activeParameter && ControllerLayer.state.activeParameter.isDataWheel) {
                    updateVisual(this.convertDataWheelValueToKnobPosition(ControllerLayer.state.activeParameter));
                } else {
                    updateVisual(this.state.controlValues[param]);
                }


                knob.addEventListener('mousedown', (e) => {
                    if (!this.state.power) return;
                    e.preventDefault();
                    isDragging = true;
                    startY = e.clientY;
                    if (param === 'feedback' && this.state.parameterMode > 0 && ControllerLayer.state.activeParameter && ControllerLayer.state.activeParameter.isDataWheel) {
                        startValue = ControllerLayer.state.activeParameter.currentValue;
                    } else {
                        startValue = this.state.controlValues[param];
                    }
                    this.showTemporaryMessage(Math.round(startValue).toString(), 1000);
                });

                const onMouseMove = (e) => {
                    if (!isDragging) return;
                    const deltaY = startY - e.clientY;
                    const sensitivity = 127 / 200; // Adjust sensitivity as needed
                    let newValue = startValue + deltaY * sensitivity;
                    
                    // Clamp value based on 0-127 range for knobs
                    newValue = Math.max(0, Math.min(127, newValue));

                    if (param === 'feedback' && this.state.parameterMode > 0 && ControllerLayer.state.activeParameter && ControllerLayer.state.activeParameter.isDataWheel) {
                        // Feedback knob acts as DataWheel
                        const activeParam = ControllerLayer.state.activeParameter;
                        const options = activeParam.options;
                        // Ensure options array has at least two elements for range calculation
                        if (options.length > 1 && typeof options[0] === 'number') {
                            const minVal = Math.min(...options);
                            const maxVal = Math.max(...options);
                            const range = maxVal - minVal;
                            
                            // Map 0-127 knob range to parameter's option range
                            let paramValue = Math.round((newValue / 127) * range) + minVal;
                            paramValue = Math.max(minVal, Math.min(maxVal, paramValue)); // Clamp to param's range
                            activeParam.currentValue = paramValue;
                            this.showTemporaryMessage(String(paramValue), 600);
                            console.log(`DataWheel for ${activeParam.fullName}: ${paramValue}`);
                        } else {
                             // Handle non-numeric options for DataWheel (shouldn't happen based on matrix)
                             this.showTemporaryMessage(String(newValue), 600);
                             console.warn(`DataWheel for non-numeric options: ${activeParam.fullName}`);
                        }
                    } else {
                        // Normal knob control for audio gains
                        this.state.controlValues[param] = newValue;
                        this.showTemporaryMessage(Math.round(newValue).toString(), 600);
                        this.applyKnobToAudio(param, newValue);
                    }
                    updateVisual(newValue); // Update knob visual regardless
                };

                const onMouseUp = () => {  
                    isDragging = false;  
                    // Clear temporary message after drag ends
                    if (!this.displayTimeout) { // Only if no other message is pending
                        // If in parameter mode and a parameter is active, show its value
                        if (this.state.parameterMode > 0 && ControllerLayer.state.activeParameter) {
                            this.renderLedDisplay(String(ControllerLayer.state.activeParameter.currentValue));
                        } else {
                            this.renderLedDisplay(this.getDefaultDisplay());
                        }
                    }
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);

                // Add touch support for knobs
                knob.addEventListener('touchstart', (e) => {
                    if (!this.state.power) return;
                    e.preventDefault();
                    isDragging = true;
                    startY = e.touches[0].clientY;
                    if (param === 'feedback' && this.state.parameterMode > 0 && ControllerLayer.state.activeParameter && ControllerLayer.state.activeParameter.isDataWheel) {
                        startValue = ControllerLayer.state.activeParameter.currentValue;
                    } else {
                        startValue = this.state.controlValues[param];
                    }
                    this.showTemporaryMessage(Math.round(startValue).toString(), 1000);
                });

                const onTouchMove = (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    const deltaY = startY - e.touches[0].clientY;
                    const sensitivity = 127 / 200;
                    let newValue = startValue + deltaY * sensitivity;
                    
                    newValue = Math.max(0, Math.min(127, newValue)); // Clamp to 0-127 for touch visual

                    if (param === 'feedback' && this.state.parameterMode > 0 && ControllerLayer.state.activeParameter && ControllerLayer.state.activeParameter.isDataWheel) {
                        const activeParam = ControllerLayer.state.activeParameter;
                        const options = activeParam.options;
                        if (options.length > 1 && typeof options[0] === 'number') {
                            const minVal = Math.min(...options);
                            const maxVal = Math.max(...options);
                            const range = maxVal - minVal;
                            let paramValue = Math.round((newValue / 127) * range) + minVal;
                            paramValue = Math.max(minVal, Math.min(maxVal, paramValue));
                            activeParam.currentValue = paramValue;
                            this.showTemporaryMessage(String(paramValue), 600);
                            console.log(`DataWheel for ${activeParam.fullName}: ${paramValue}`);
                        } else {
                            this.showTemporaryMessage(String(newValue), 600);
                            console.warn(`DataWheel for non-numeric options (touch): ${activeParam.fullName}`);
                        }
                    } else {
                        this.state.controlValues[param] = newValue;
                        this.showTemporaryMessage(Math.round(newValue).toString(), 600);
                        this.applyKnobToAudio(param, newValue);
                    }
                    updateVisual(newValue);
                };

                const onTouchEnd = () => {
                    isDragging = false;
                    if (!this.displayTimeout) {
                        if (this.state.parameterMode > 0 && ControllerLayer.state.activeParameter) {
                            this.renderLedDisplay(String(ControllerLayer.state.activeParameter.currentValue));
                        } else {
                            this.renderLedDisplay(this.getDefaultDisplay());
                        }
                    }
                };

                document.addEventListener('touchmove', onTouchMove, { passive: false });
                document.addEventListener('touchend', onTouchEnd);
            }

            // Converts a parameter's current value (from its options range) back to a 0-127 knob position
            convertDataWheelValueToKnobPosition(param) {
                const options = param.options;
                if (options.length > 1 && typeof options[0] === 'number') {
                    const minVal = Math.min(...options);
                    const maxVal = Math.max(...options);
                    const range = maxVal - minVal;
                    if (range === 0) return 0; // Avoid division by zero
                    return ((param.currentValue - minVal) / range) * 127;
                }
                return 0; // Default to 0 if not a numeric data wheel
            }

            applyKnobToAudio(param, value) {
                const audioCtx = SignalChainLayer.audioContext;
                if (!audioCtx) return;

                const gainValue = value / 127; // Convert 0-127 to 0-1 for most gains

                switch (param) {
                    case 'input':
                        if (SignalChainLayer.audioNodes.inputGain) {
                            SignalChainLayer.audioNodes.inputGain.gain.value = gainValue;
                            console.log(`Input gain set to ${value} (${(gainValue * 100).toFixed(1)}%)`);
                        }
                        break;
                    case 'output':
                        if (SignalChainLayer.audioNodes.outputGain) {
                            SignalChainLayer.audioNodes.outputGain.gain.value = gainValue;
                            console.log(`Output gain set to ${value} (${(gainValue * 100).toFixed(1)}%)`);
                        }
                        // If muted, keep output at 0 regardless of knob
                        this.applyMuteState(); // Re-apply mute state if output knob changes while muted
                        break;
                    case 'mix':
                        // The mix knob on the Echoplex balances the direct input signal with the loop signal.
                        // To implement this, we need to adjust the gain of the live input path and the loop output path.
                        // Currently, the worklet output (which includes live input during record/overdub)
                        // is connected to mixGain. The loop playback node is also connected to mixGain.
                        // This means mixGain acts as a master volume for everything coming out of the worklet and loop.
                        // For now, let's keep it as a master volume for the combined signal.
                        if (SignalChainLayer.audioNodes.mixGain) {
                            SignalChainLayer.audioNodes.mixGain.gain.value = gainValue;
                            console.log(`Mix gain set to ${value} (${(gainValue * 100).toFixed(1)}%)`);
                        }
                        break;
                    case 'feedback':
                        if (SignalChainLayer.audioNodes.feedbackGain) {
                            SignalChainLayer.audioNodes.feedbackGain.gain.value = gainValue;
                            
                            // Also update worklet if overdubbing or recording (worklet uses feedback for overdub mixing)
                            if (ControllerLayer.state.loopState === 'overdubbing' || ControllerLayer.state.loopState === 'multiplying') {
                                const worklet = SignalChainLayer.audioNodes.recorderWorklet;
                                if (worklet) { // Check if worklet exists before posting message
                                    worklet.port.postMessage({ feedbackLevel: gainValue });
                                }
                            }
                            console.log(`Feedback set to ${value} (${(gainValue * 100).toFixed(1)}%)`);
                        }
                        break;
                }
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
                // Ensure audio context is resumed before starting
                if (SignalChainLayer.audioContext && SignalChainLayer.audioContext.state === 'suspended') {
                    SignalChainLayer.audioContext.resume().then(() => {
                        this._startRecordingLogic();
                    });
                } else {
                    this._startRecordingLogic();
                }
            }

            _startRecordingLogic() {
                ControllerLayer.state.loopState = 'recording';
                
                const loop = BufferLayer.state.loops[0];
                if (loop && loop.playbackNode) {
                    loop.playbackNode.stop();
                    loop.playbackNode.disconnect(); // Disconnect existing playback node
                    loop.playbackNode = null;
                }
                // Save current loop to undo stack before recording a new one
                if (loop.buffer) {
                    const audioCtx = SignalChainLayer.audioContext;
                    const undoBuffer = audioCtx.createBuffer(
                        loop.buffer.numberOfChannels,
                        loop.buffer.length,
                        loop.buffer.sampleRate
                    );
                    for (let channel = 0; channel < loop.buffer.numberOfChannels; channel++) {
                        undoBuffer.copyToChannel(loop.buffer.getChannelData(channel), channel);
                    }
                    loop.undoStack.push(undoBuffer);
                    this.updateLed('undo', 'ready'); // Indicate undo is possible
                    console.log(`📚 Saved undo layer ${loop.undoStack.length} before new record`);
                }


                const worklet = SignalChainLayer.audioNodes.recorderWorklet;
                if (!worklet) { // Add null check for worklet
                    console.error("Recorder Worklet not initialized. Cannot start recording.");
                    this.showTemporaryMessage('ERR', 1000);
                    ControllerLayer.state.loopState = 'idle'; // Revert state
                    return;
                }

                BufferLayer.state.recordedChunks = [];
                
                // Set up message handler for recording data from worklet
                worklet.port.onmessage = (event) => {
                    if (event.data.type === 'recording') {
                        BufferLayer.state.recordedChunks.push(new Float32Array(event.data.data));
                    }
                };
                // Tell worklet to start recording
                worklet.port.postMessage({ isRecording: true, isOverdubbing: false, isMultiplying: false }); // Ensure other states are off

                this.updateLed('record', 'recording'); // Red
                this.updateLed('overdub', 'ready'); // Ensure overdub LED is off
                this.updateLed('multiply', 'ready'); // Ensure multiply LED is off
                this.updateLed('insert', ControllerLayer.state.isReversed ? 'recording' : 'ready'); // Keep insert LED state for reverse
                this.updateLed('mute', ControllerLayer.state.isMuted ? 'recording' : 'ready'); // Keep mute LED state
                this.startLoopTimer();
                console.log('🔴 Recording started');
            }


            stopRecording() {
                // Guard clause to prevent this from running multiple times
                if (ControllerLayer.state.loopState !== 'recording') return;

                ControllerLayer.state.loopState = 'playing';
                const worklet = SignalChainLayer.audioNodes.recorderWorklet;
                if (!worklet) { // Add null check for worklet
                    console.error("Recorder Worklet not initialized. Cannot stop recording.");
                    // Attempt to clean up state even if worklet is null
                    ControllerLayer.state.loopState = 'idle';
                    this.updateLed('record', 'ready');
                    this.stopLoopTimer();
                    this.renderLedDisplay('.');
                    return;
                }

                worklet.port.postMessage({ isRecording: false });
                worklet.port.onmessage = null; // Clear the message handler

                const totalLength = BufferLayer.state.recordedChunks.reduce((sum, chunk) => sum + chunk.length, 0);
                if (totalLength < SignalChainLayer.audioContext.sampleRate * 0.1) { // Minimum 0.1 seconds
                    ControllerLayer.state.loopState = 'idle';
                    this.updateLed('record', 'ready'); // Green
                    this.stopLoopTimer();
                    this.renderLedDisplay('.');
                    console.warn("Loop too short. Recording cancelled.");
                    BufferLayer.state.recordedChunks = []; // Clear chunks if cancelled
                    // If recording was cancelled, pop the undo state that was just pushed
                    if (BufferLayer.state.loops[0].undoStack.length > 0) {
                        BufferLayer.state.loops[0].undoStack.pop();
                        this.updateLed('undo', BufferLayer.state.loops[0].undoStack.length > 0 ? 'ready' : 'off');
                    }
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
                // Stop any existing playback node before creating a new one
                if (loop.playbackNode) {
                    loop.playbackNode.stop();
                    loop.playbackNode.disconnect();
                    loop.playbackNode = null;
                }

                const player = audioCtx.createBufferSource();
                player.buffer = loop.buffer;
                player.loop = true;
                
                // Apply reverse if enabled
                player.playbackRate.value = ControllerLayer.state.isReversed ? -1 : 1;

                // Connect loop playback to mixGain for proper dry/wet mixing
                player.connect(SignalChainLayer.audioNodes.mixGain);
                
                // Connect to feedback path for overdubbing/multiplying (worklet input 1)
                // player -> feedbackGain -> recorderWorklet input 1
                player.connect(SignalChainLayer.audioNodes.feedbackGain);
                const worklet = SignalChainLayer.audioNodes.recorderWorklet;
                if (worklet) { // Check if worklet exists before connecting
                    SignalChainLayer.audioNodes.feedbackGain.connect(worklet, 0, 1);
                } else {
                    console.warn("Recorder Worklet not available for feedback routing.");
                }
                
                // When reversing, start from the end of the loop and play backward
                // When going forward, start from the beginning
                const startOffset = ControllerLayer.state.isReversed ? loop.buffer.duration : 0;
                player.start(0, startOffset); // Start at 0, with an offset for reverse

                loop.playbackNode = player;
                
                console.log('🔊 Loop playback started with feedback routing');
                // Ensure mute state is applied if active
                this.applyMuteState();
            }

            resetLoop() {
                console.log('🔄 Resetting Loop...');
                ControllerLayer.state.loopState = 'idle';
                ControllerLayer.state.isMuted = false; // Reset mute state
                ControllerLayer.state.isReversed = false; // Reset reverse state

                const loop = BufferLayer.state.loops[0];
                if (loop && loop.playbackNode) {
                    loop.playbackNode.stop();
                    loop.playbackNode.disconnect(); // Disconnect on reset
                    loop.playbackNode = null;
                }
                loop.buffer = null;
                BufferLayer.state.recordedChunks = [];
                BufferLayer.state.overdubChunks = []; // Clear overdub chunks too
                BufferLayer.state.multiplyChunks = []; // Clear multiply chunks too
                loop.undoStack = []; // Clear undo stack

                // Ensure worklet is not recording/overdubbing/multiplying
                const worklet = SignalChainLayer.audioNodes.recorderWorklet;
                if (worklet) { // Check if worklet exists before posting message
                    worklet.port.postMessage({ isRecording: false, isOverdubbing: false, isMultiplying: false });
                    worklet.port.onmessage = null;
                } else {
                    console.warn("Recorder Worklet not available for state reset.");
                }

                this.stopLoopTimer();
                this.renderLedDisplay('.');
                this.updateLed('record', 'ready'); // Green
                this.updateLed('overdub', 'ready'); // Green
                this.updateLed('multiply', 'ready'); // Green
                this.updateLed('insert', 'ready'); // Green
                this.updateLed('mute', 'ready'); // Green
                this.updateLed('undo', 'off'); // Off if no undo history
                this.updateLed('loops-led', 'off'); // Ensure row indicator LEDs are off
                this.updateLed('midi-led', 'off');
                this.updateLed('switches-led', 'off');
                this.updateLed('timing-led', 'off');
            }

            // ============================================================================
            // OVERDUB BUTTON CONTROL
            // ============================================================================

            handleOverdubButton() {
                const state = ControllerLayer.state;
                if (state.loopState === 'playing') {
                    this.startOverdub();
                } else if (state.loopState === 'overdubbing') {
                    this.stopOverdub();
                } else {
                    console.warn("Cannot overdub when not playing a loop.");
                    this.showTemporaryMessage('NO LP', 1000); // Display "No Loop"
                }
            }

            startOverdub() {
                // Ensure there's a loop to overdub onto
                if (!BufferLayer.state.loops[0].buffer) {
                    console.warn("No loop to overdub onto.");
                    this.showTemporaryMessage('NO LP', 1000);
                    return;
                }

                ControllerLayer.state.loopState = 'overdubbing';
                
                // Save current buffer to undo stack BEFORE overdubbing
                const loop = BufferLayer.state.loops[0];
                if (loop && loop.buffer) {
                    const audioCtx = SignalChainLayer.audioContext;
                    const undoBuffer = audioCtx.createBuffer(
                        loop.buffer.numberOfChannels,
                        loop.buffer.length,
                        loop.buffer.sampleRate
                    );
                    // Clone the current buffer data
                    for (let channel = 0; channel < loop.buffer.numberOfChannels; channel++) {
                        undoBuffer.copyToChannel(loop.buffer.getChannelData(channel), channel);
                    }
                    loop.undoStack.push(undoBuffer);
                    this.updateLed('undo', 'ready'); // Indicate undo is possible
                    console.log(`📚 Saved undo layer ${loop.undoStack.length} before overdub`);
                }
                
                BufferLayer.state.overdubChunks = [];
                const worklet = SignalChainLayer.audioNodes.recorderWorklet;
                if (!worklet) { // Add null check for worklet
                    console.error("Recorder Worklet not initialized. Cannot start overdub.");
                    this.showTemporaryMessage('ERR', 1000);
                    ControllerLayer.state.loopState = 'playing'; // Revert state
                    return;
                }

                // Set up message handler for overdub data from worklet
                worklet.port.onmessage = (event) => {
                    if (event.data.type === 'overdub') {
                        BufferLayer.state.overdubChunks.push(new Float32Array(event.data.data));
                    } else {
                        console.log('📥 Unknown message type:', event.data.type);
                    }
                };
                
                // Send feedback level and start overdubbing in the worklet
                const feedbackLevel = this.state.controlValues.feedback / 127;
                worklet.port.postMessage({ 
                    isRecording: false, // Ensure recording is off
                    isOverdubbing: true,
                    isMultiplying: false, // Ensure multiplying is off
                    feedbackLevel: feedbackLevel
                });

                this.updateLed('overdub', 'recording'); // Red
                this.updateLed('record', 'ready'); // Ensure record LED is off
                this.updateLed('multiply', 'ready'); // Ensure multiply LED is off
                this.updateLed('insert', ControllerLayer.state.isReversed ? 'recording' : 'ready'); // Keep insert LED state for reverse
                this.updateLed('mute', ControllerLayer.state.isMuted ? 'recording' : 'ready'); // Keep mute LED state
                console.log('🔴 Overdub started');
            }

            stopOverdub() {
                // Guard clause to prevent this from running multiple times
                if (ControllerLayer.state.loopState !== 'overdubbing') return;

                ControllerLayer.state.loopState = 'playing';
                const worklet = SignalChainLayer.audioNodes.recorderWorklet;
                if (!worklet) { // Add null check for worklet
                    console.error("Recorder Worklet not initialized. Cannot stop overdub.");
                    // Attempt to clean up state even if worklet is null
                    ControllerLayer.state.loopState = 'playing';
                    this.updateLed('overdub', 'ready');
                    return;
                }

                worklet.port.postMessage({ isOverdubbing: false });
                worklet.port.onmessage = null; // Clear the message handler

                console.log('🔄 Stopping overdub and finalizing audio...');
                
                const totalLength = BufferLayer.state.overdubChunks.reduce((sum, chunk) => sum + chunk.length, 0);
                console.log(`📊 Total overdub samples captured from worklet: ${totalLength}, chunks: ${BufferLayer.state.overdubChunks.length}`);
                
                if (totalLength === 0) {
                    this.updateLed('overdub', 'ready'); // Green
                    console.warn("No overdub audio captured. Overdub cancelled.");
                    // If no audio was captured, revert to previous loop state if possible (from undo stack)
                    const loop = BufferLayer.state.loops[0];
                    if (loop.undoStack.length > 0) {
                        loop.buffer = loop.undoStack.pop(); // Revert to the buffer before overdub
                        this.updateLed('undo', loop.undoStack.length > 0 ? 'ready' : 'off');
                        console.log("Reverted to previous loop state due to no overdub audio.");
                        this.playLoop(); // Restart playback of the reverted loop
                    }
                    return;
                }

                const loop = BufferLayer.state.loops[0];
                const audioCtx = SignalChainLayer.audioContext;
                
                // Combine all captured overdub chunks into a single Float32Array.
                // This 'combinedOverdub' already contains the mix of mic input and loop feedback
                // as processed by the AudioWorklet (mic + existing loop with decay).
                const combinedOverdub = new Float32Array(totalLength);
                let offset = 0;
                BufferLayer.state.overdubChunks.forEach(chunk => {
                    combinedOverdub.set(chunk, offset);
                    offset += chunk.length;
                });

                // Create a new AudioBuffer from the combined overdub data.
                // We ensure it has the same length as the original loop to maintain loop timing.
                // If the captured overdub is shorter, it will be padded with zeros.
                // If it's longer, it will be truncated.
                const newOverdubBuffer = audioCtx.createBuffer(
                    1, // mono
                    loop.buffer ? loop.buffer.length : totalLength, // Use original loop length or captured length
                    audioCtx.sampleRate
                );

                // Copy the combined overdub data to the new buffer.
                // This handles cases where the captured overdub is shorter than the original loop.
                newOverdubBuffer.copyToChannel(combinedOverdub, 0, 0);

                // Stop current playback and replace with the new overdubbed buffer
                if (loop.playbackNode) {
                    loop.playbackNode.stop();
                    // Disconnect the previous loop playback node from all its connections
                    loop.playbackNode.disconnect();
                    loop.playbackNode = null;
                }

                loop.buffer = newOverdubBuffer; // Replace the loop buffer with the new overdubbed audio
                this.playLoop(); // Start playing the new loop
                
                this.updateLed('overdub', 'ready'); // Green
                console.log(`🟢 Overdub applied successfully! Final loop length: ${loop.buffer.duration.toFixed(2)}s`);
            }

            // ============================================================================
            // MULTIPLY BUTTON CONTROL
            // ============================================================================
            handleMultiplyButton() {
                const state = ControllerLayer.state;
                if (state.loopState === 'playing') {
                    this.startMultiply();
                } else if (state.loopState === 'multiplying') {
                    this.stopMultiply();
                } else {
                    console.warn("Cannot multiply when not playing a loop.");
                    this.showTemporaryMessage('NO LP', 1000);
                }
            }

            startMultiply() {
                if (!BufferLayer.state.loops[0].buffer) {
                    console.warn("No loop to multiply onto.");
                    this.showTemporaryMessage('NO LP', 1000);
                    return;
                }

                ControllerLayer.state.loopState = 'multiplying';
                
                // Save current buffer to undo stack BEFORE multiplying
                const loop = BufferLayer.state.loops[0];
                if (loop && loop.buffer) {
                    const audioCtx = SignalChainLayer.audioContext;
                    const undoBuffer = audioCtx.createBuffer(
                        loop.buffer.numberOfChannels,
                        loop.buffer.length,
                        loop.buffer.sampleRate
                    );
                    for (let channel = 0; channel < loop.buffer.numberOfChannels; channel++) {
                        undoBuffer.copyToChannel(loop.buffer.getChannelData(channel), channel);
                    }
                    loop.undoStack.push(undoBuffer);
                    this.updateLed('undo', 'ready'); // Indicate undo is possible
                    console.log(`📚 Saved undo layer ${loop.undoStack.length} before multiply`);
                }

                BufferLayer.state.multiplyChunks = [];
                const worklet = SignalChainLayer.audioNodes.recorderWorklet;
                if (!worklet) { // Add null check for worklet
                    console.error("Recorder Worklet not initialized. Cannot start multiply.");
                    this.showTemporaryMessage('ERR', 1000);
                    ControllerLayer.state.loopState = 'playing'; // Revert state
                    return;
                }

                worklet.port.onmessage = (event) => {
                    if (event.data.type === 'multiply') {
                        BufferLayer.state.multiplyChunks.push(new Float32Array(event.data.data));
                    } else {
                        console.log('📥 Unknown message type during multiply:', event.data.type);
                    }
                };

                const feedbackLevel = this.state.controlValues.feedback / 127;
                worklet.port.postMessage({
                    isRecording: false,
                    isOverdubbing: false,
                    isMultiplying: true,
                    feedbackLevel: feedbackLevel
                });

                this.updateLed('multiply', 'recording'); // Red
                this.updateLed('record', 'ready');
                this.updateLed('overdub', 'ready');
                this.updateLed('insert', ControllerLayer.state.isReversed ? 'recording' : 'ready');
                this.updateLed('mute', ControllerLayer.state.isMuted ? 'recording' : 'ready');
                console.log('🔴 Multiply started');
            }

            stopMultiply() {
                if (ControllerLayer.state.loopState !== 'multiplying') return;

                ControllerLayer.state.loopState = 'playing';
                const worklet = SignalChainLayer.audioNodes.recorderWorklet;
                if (!worklet) { // Add null check for worklet
                    console.error("Recorder Worklet not initialized. Cannot stop multiply.");
                    // Attempt to clean up state even if worklet is null
                    ControllerLayer.state.loopState = 'playing';
                    this.updateLed('multiply', 'ready');
                    return;
                }

                worklet.port.postMessage({ isMultiplying: false });
                worklet.port.onmessage = null;

                console.log('🔄 Stopping multiply and finalizing audio...');

                const loop = BufferLayer.state.loops[0];
                const audioCtx = SignalChainLayer.audioContext;
                const originalLoopDuration = loop.buffer.duration;
                const originalLoopLength = loop.buffer.length;
                const sampleRate = audioCtx.sampleRate;

                const totalNewInputLength = BufferLayer.state.multiplyChunks.reduce((sum, chunk) => sum + chunk.length, 0);
                if (totalNewInputLength === 0) {
                    this.updateLed('multiply', 'ready');
                    console.warn("No new audio captured during multiply. Multiply cancelled.");
                    if (loop.undoStack.length > 0) {
                        loop.buffer = loop.undoStack.pop();
                        this.updateLed('undo', loop.undoStack.length > 0 ? 'ready' : 'off');
                        this.playLoop();
                    }
                    return;
                }

                const combinedNewInput = new Float32Array(totalNewInputLength);
                let offset = 0;
                BufferLayer.state.multiplyChunks.forEach(chunk => {
                    combinedNewInput.set(chunk, offset);
                    offset += chunk.length;
                });

                // Calculate how many times the original loop cycled during the multiply operation
                // This is a simplified approach; a real Echoplex rounds to nearest cycle.
                const multipliedCycles = Math.ceil(totalNewInputLength / originalLoopLength);
                const newLoopLengthSamples = multipliedCycles * originalLoopLength;

                const newMultiplyBuffer = audioCtx.createBuffer(1, newLoopLengthSamples, sampleRate);
                const newMultiplyData = newMultiplyBuffer.getChannelData(0);

                // Mix original loop (repeated) with new input
                const originalLoopData = loop.buffer.getChannelData(0);
                const feedbackLevel = this.state.controlValues.feedback / 127; // Use current feedback knob value

                for (let i = 0; i < newLoopLengthSamples; i++) {
                    const originalSample = originalLoopData[i % originalLoopLength] * feedbackLevel; // Loop original
                    const newSample = (i < totalNewInputLength) ? combinedNewInput[i] * (1 - feedbackLevel) : 0; // New input
                    newMultiplyData[i] = originalSample + newSample;
                }

                if (loop.playbackNode) {
                    loop.playbackNode.stop();
                    loop.playbackNode.disconnect();
                    loop.playbackNode = null;
                }

                loop.buffer = newMultiplyBuffer;
                this.playLoop();

                this.updateLed('multiply', 'ready');
                console.log(`🟢 Multiply applied successfully! New loop length: ${loop.buffer.duration.toFixed(2)}s (${multipliedCycles} cycles)`);
            }


            // ============================================================================
            // INSERT BUTTON CONTROL (and InsertMode parameter)
            // ============================================================================
            handleInsertButton() {
                if (!this.state.power) return;

                if (this.state.parameterMode > 0) { // If in parameter mode, handle as parameter selection
                    this.handleParameterButtonPress('insert');
                    return;
                }

                // Play Mode logic for Insert button (depends on InsertMode)
                if (ControllerLayer.state.loopState !== 'playing' && ControllerLayer.state.loopState !== 'overdubbing' && ControllerLayer.state.loopState !== 'multiplying') {
                    this.showTemporaryMessage('NO LP', 1000);
                    return;
                }

                switch (ControllerLayer.state.insertMode) { // Use ControllerLayer.state.insertMode
                    case 'InS': // Insert
                        this.showTemporaryMessage('INS', 1000); // Placeholder for actual Insert logic
                        this.updateLed('insert', 'on');
                        setTimeout(() => this.updateLed('insert', 'ready'), 500);
                        console.log('📝 Insert function (placeholder)');
                        break;
                    case 'rEV': // Reverse
                        this.toggleReverse();
                        break;
                    case 'rhr': // Rehearse
                        this.showTemporaryMessage('rhr', 1000);
                        this.updateLed('insert', 'on');
                        setTimeout(() => this.updateLed('insert', 'ready'), 500);
                        console.log('🎤 Rehearse function (placeholder)');
                        break;
                    case 'rPL': // Replace
                        this.showTemporaryMessage('rPL', 1000);
                        this.updateLed('insert', 'on');
                        setTimeout(() => this.updateLed('insert', 'ready'), 500);
                        console.log('✂️ Replace function (placeholder)');
                        break;
                    case 'Sub': // Substitute
                        this.showTemporaryMessage('Sub', 1000);
                        this.updateLed('insert', 'on');
                        setTimeout(() => this.updateLed('insert', 'ready'), 500);
                        console.log('🔄 Substitute function (placeholder)');
                        break;
                    case 'h.SP': // HalfSpeed
                        this.showTemporaryMessage('h.SP', 1000);
                        this.updateLed('insert', 'on');
                        setTimeout(() => this.updateLed('insert', 'ready'), 500);
                        console.log('🐢 HalfSpeed function (placeholder)');
                        break;
                    case 'SUS': // Sustain
                        this.showTemporaryMessage('SUS', 1000);
                        this.updateLed('insert', 'on');
                        setTimeout(() => this.updateLed('insert', 'ready'), 500);
                        console.log('🎶 Sustain function (placeholder)');
                        break;
                    default:
                        this.showTemporaryMessage('UNK', 1000); // Unknown mode
                        console.warn(`Unknown InsertMode: ${ControllerLayer.state.insertMode}`);
                }
            }

            toggleReverse() {
                if (!BufferLayer.state.loops[0].buffer) {
                    this.showTemporaryMessage('NO LP', 1000);
                    return;
                }

                ControllerLayer.state.isReversed = !ControllerLayer.state.isReversed;
                this.showTemporaryMessage(ControllerLayer.state.isReversed ? 'rEV' : 'Fd', 1000); // rEV for reverse, Fd for forward
                this.updateLed('insert', ControllerLayer.state.isReversed ? 'recording' : 'ready'); // Red if reversed, green if forward

                const loop = BufferLayer.state.loops[0];
                if (loop.playbackNode) {
                    // Changing playbackRate on an active node can cause glitches.
                    // It's safer to stop and restart the node with the new rate.
                    
                    loop.playbackNode.stop();
                    loop.playbackNode.disconnect();
                    loop.playbackNode = null;

                    const audioCtx = SignalChainLayer.audioContext;
                    const player = audioCtx.createBufferSource();
                    player.buffer = loop.buffer;
                    player.loop = true;
                    player.playbackRate.value = ControllerLayer.state.isReversed ? -1 : 1;

                    // When reversing, start from the end of the loop and play backward
                    // When going forward, start from the beginning
                    const startOffset = ControllerLayer.state.isReversed ? loop.buffer.duration : 0;
                    player.start(0, startOffset); // Start at 0, with an offset for reverse

                    // Reconnect nodes
                    player.connect(SignalChainLayer.audioNodes.mixGain);
                    player.connect(SignalChainLayer.audioNodes.feedbackGain);
                    const worklet = SignalChainLayer.audioNodes.recorderWorklet;
                    if (worklet) { // Check if worklet exists before connecting
                        SignalChainLayer.audioNodes.feedbackGain.connect(worklet, 0, 1);
                    } else {
                        console.warn("Recorder Worklet not available for feedback routing during reverse.");
                    }

                    loop.playbackNode = player;
                    console.log(`🔄 Loop playback ${ControllerLayer.state.isReversed ? 'reversed' : 'forward'}`);
                }
            }

            // ============================================================================
            // MUTE BUTTON CONTROL
            // ============================================================================
            handleMuteButton() {
                if (!this.state.power) return;
                
                ControllerLayer.state.isMuted = !ControllerLayer.state.isMuted;
                this.applyMuteState();
                this.showTemporaryMessage(ControllerLayer.state.isMuted ? 'MUTE' : 'PLAY', 1000);
                this.updateLed('mute', ControllerLayer.state.isMuted ? 'recording' : 'ready'); // Red if muted, green if playing
            }

            applyMuteState() {
                if (SignalChainLayer.audioNodes.outputGain) {
                    // Mute by setting output gain to 0, unmute to original output knob value
                    SignalChainLayer.audioNodes.outputGain.gain.value = ControllerLayer.state.isMuted ? 0 : (this.state.controlValues.output / 127);
                    console.log(`Loop ${ControllerLayer.state.isMuted ? 'muted' : 'unmuted'}`);
                }
            }

            // ============================================================================
            // UNDO BUTTON CONTROL
            // ============================================================================
            handleUndoButton() {
                if (!this.state.power) return;

                const loop = BufferLayer.state.loops[0];
                if (loop.undoStack.length > 0) {
                    // If currently reversed, undoing should revert to the state BEFORE the last overdub/multiply in reverse.
                    // It CANNOT undo past the point where Reverse was engaged.
                    // For simplicity now, we'll just pop the last state. More complex logic needed for full Echoplex behavior.
                    loop.buffer = loop.undoStack.pop(); // Revert to previous buffer
                    this.playLoop(); // Play the reverted loop
                    this.showTemporaryMessage('UNDO', 1000);
                    this.updateLed('undo', loop.undoStack.length > 0 ? 'ready' : 'off'); // Update LED based on stack size
                    console.log(`↩️ Undo successful. Undo stack size: ${loop.undoStack.length}`);
                } else {
                    this.showTemporaryMessage('NO UD', 1000); // No Undo available
                    this.updateLed('undo', 'off');
                    console.warn('No undo history available.');
                }
            }

            // ============================================================================
            // SHARED FEEDBACK & DISPLAY METHODS
            // ============================================================================
            
            updateLed(elementIdOrFunctionName, state) {
                let element;
                // Check if it's a function button LED (status-led inside a button)
                const functionLed = document.querySelector(`[data-function="${elementIdOrFunctionName}"] .status-led`);
                if (functionLed) {
                    element = functionLed;
                } else {
                    // Otherwise, assume it's a direct ID for row indicators or level lights
                    element = document.getElementById(elementIdOrFunctionName);
                }

                if (element) {
                    element.setAttribute('data-hw-state', state);
                    // For level lights, directly toggle color classes based on state
                    if (element.classList.contains('level-light')) {
                        element.classList.remove('green', 'yellow', 'red', 'off');
                        if (state === 'green') element.classList.add('green');
                        else if (state === 'yellow') element.classList.add('yellow');
                        else if (state === 'red') element.classList.add('red');
                        else element.classList.add('off'); // Default off state
                    }
                    // No special class toggling needed for row-indicator here, as CSS will use data-hw-state
                } else {
                    console.warn(`LED element not found for: ${elementIdOrFunctionName}`);
                }
            }
            
            formatLoopTime(duration) {
                if (duration < 10) return duration.toFixed(2);
                if (duration < 100) return duration.toFixed(1);
                return Math.floor(duration).toString();
            }

            renderLedDisplay(str) {
                if (!this.elements.digitEls) return;

                // Clear all segments and dots first
                this.elements.digitEls.forEach(d => {
                    d.querySelectorAll('.segment').forEach(s => s.classList.remove('on'));
                    d.querySelector('.dot').classList.remove('on');
                });

                // Process string from right to left for display
                let displayStr = String(str);
                let pos = this.elements.digitEls.length - 1; // Start from rightmost digit

                for (let i = displayStr.length - 1; i >= 0 && pos >= 0; i--) {
                    const ch = displayStr[i];
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

            // New function to render the left display (loop number)
            renderLeftDisplay(str) {
                if (!this.elements.leftDisplayDigits) return;

                this.elements.leftDisplayDigits.forEach(d => {
                    d.querySelectorAll('.segment').forEach(s => s.classList.remove('on'));
                });

                let displayChar = String(str);
                if (displayChar.length > 1) { // Ensure only one character is displayed for loop number
                    displayChar = displayChar[0];
                }
                
                const digitEl = this.elements.leftDisplayDigits[0]; // Always one digit
                if (digitEl) {
                    const segs = SEGMENT_MAP[displayChar];
                    if (segs) {
                        segs.forEach(segCls => {
                            digitEl.querySelector('.' + segCls).classList.add('on');
                        });
                    }
                }
            }

            // New function to render the multiple display (P1, P2, etc. or cycle count)
            renderMultipleDisplay(str) {
                if (!this.elements.multipleDisplayDigits) return;

                this.elements.multipleDisplayDigits.forEach(d => {
                    d.querySelectorAll('.segment').forEach(s => s.classList.remove('on'));
                    d.querySelector('.dot').classList.remove('on'); // Ensure dot is off unless explicitly used
                });

                let displayStr = String(str);
                
                // Handle "P 1", "P 2", "P 3", "P 4" specifically
                if (displayStr.startsWith('P ') && displayStr.length === 3) {
                    const pChar = 'P';
                    const numChar = displayStr[2]; // '1', '2', '3', '4'

                    // Render 'P' in the first digit
                    const pSegs = SEGMENT_MAP[pChar];
                    if (pSegs && this.elements.multipleDisplayDigits[0]) {
                        pSegs.forEach(segCls => {
                            this.elements.multipleDisplayDigits[0].querySelector('.' + segCls).classList.add('on');
                        });
                    }

                    // Render number in the second digit
                    const numSegs = SEGMENT_MAP[numChar];
                    if (numSegs && this.elements.multipleDisplayDigits[1]) {
                        numSegs.forEach(segCls => {
                            this.elements.multipleDisplayDigits[1].querySelector('.' + segCls).classList.add('on');
                        });
                    }
                } else {
                    // Generic string rendering (e.g., cycle count like "1.", "16")
                    // Process string from right to left for display
                    let pos = this.elements.multipleDisplayDigits.length - 1; // Start from rightmost digit

                    for (let i = displayStr.length - 1; i >= 0 && pos >= 0; i--) {
                        const ch = displayStr[i];
                        if (ch === '.') {
                            if (pos < this.elements.multipleDisplayDigits.length - 1) {
                               this.elements.multipleDisplayDigits[pos + 1].querySelector('.dot').classList.add('on');
                            }
                        } else {
                            const segs = SEGMENT_MAP[ch];
                            if (segs) {
                                segs.forEach(segCls => {
                                    this.elements.multipleDisplayDigits[pos].querySelector('.' + segCls).classList.add('on');
                                });
                            }
                            pos--;
                        }
                    }
                }
            }


            startLoopTimer() {
                FeedbackLayer.state.timerStartTime = Date.now();
                this.renderLedDisplay(this.formatLoopTime(0));
                // Ensure left display shows loop 1 during recording
                this.renderLeftDisplay(1);
                this.renderMultipleDisplay(''); // Clear multiple display during recording

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
                    this.renderLeftDisplay(1); // Show loop 1 after recording stops
                    this.renderMultipleDisplay(''); // Clear multiple display after recording stops
                }
            }

            showTemporaryMessage(message, duration = 2000, callback = null) {
                console.log(`DISPLAY MSG: ${message}`);
                if (this.displayTimeout) clearTimeout(this.displayTimeout);
                
                // Display the message. For 7-segment, truncate or map as needed.
                // We'll try to show the first 3 characters that can be mapped to segments.
                let displayableMessage = '';
                for (let i = 0; i < message.length && displayableMessage.length < 3; i++) {
                    const char = message[i];
                    if (SEGMENT_MAP[char]) {
                        displayableMessage += char;
                    } else if (char === ' ') { // Allow spaces to skip a digit
                        displayableMessage += ' ';
                    }
                }
                this.renderLedDisplay(displayableMessage);

                this.displayTimeout = setTimeout(() => {
                    this.displayTimeout = null;
                    if (callback) {
                        callback();
                    } else {
                        // Restore default display for LoopTime Display
                        if (this.state.parameterMode > 0 && ControllerLayer.state.activeParameter) {
                            // If in parameter mode and a parameter is active, show its value on LoopTime Display
                            this.renderLedDisplay(String(ControllerLayer.state.activeParameter.currentValue));
                        } else if (this.state.parameterMode > 0) {
                            // If in parameter mode but no specific parameter selected, show the row name
                            const rowKeys = ['P1_Timing', 'P2_Switches', 'P3_MIDI', 'P4_Loops'];
                            const currentRowData = PARAMETER_MATRIX_DATA[rowKeys[this.state.parameterMode - 1]];
                            this.renderLedDisplay(currentRowData ? currentRowData.displayName : '');
                        } else {
                            // In Play mode, show loop time
                            this.renderLedDisplay(this.getDefaultDisplay());
                        }
                    }
                }, duration);
            }

            getDefaultDisplay() {
                const loop = BufferLayer.state.loops[0];
                return (loop && loop.buffer) ? this.formatLoopTime(loop.buffer.duration) : '.';
            }

            updateMultipleDisplay(text) {
                // This function is now responsible for rendering P1, P2, etc. or cycle count
                // using the 7-segment display logic for `multipleDisplayDigits`
                this.renderMultipleDisplay(text);
            }

            // ============================================================================
            // AUDIO LEVEL MONITORING
            // ============================================================================

            startLevelMonitoring() {
                if (this.animationFrameId) return; // Already running

                const audioCtx = SignalChainLayer.audioContext;
                const inputAnalyser = SignalChainLayer.audioNodes.inputAnalyser;
                const feedbackAnalyser = SignalChainLayer.audioNodes.feedbackAnalyser;

                if (!audioCtx || !inputAnalyser || !feedbackAnalyser) {
                    console.warn("Audio analysers not available for level monitoring.");
                    return;
                }

                const inputData = new Uint8Array(inputAnalyser.frequencyBinCount);
                const feedbackData = new Uint8Array(feedbackAnalyser.frequencyBinCount);

                const getAverageVolume = (dataArray) => {
                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sum += dataArray[i];
                    }
                    return sum / dataArray.length; // Average volume (0-255)
                };

                const animateLevels = () => {
                    inputAnalyser.getByteFrequencyData(inputData);
                    feedbackAnalyser.getByteFrequencyData(feedbackData);

                    const inputVolume = getAverageVolume(inputData);
                    const feedbackVolume = getAverageVolume(feedbackData);

                    // Input LED Logic
                    if (ControllerLayer.state.loopState === 'recording' || 
                        ControllerLayer.state.loopState === 'overdubbing' ||
                        ControllerLayer.state.loopState === 'multiplying') {
                        if (inputVolume > 200) { // Red threshold (e.g., ~80% of 255)
                            this.updateLed('input-level', 'red');
                        } else if (inputVolume > 100) { // Yellow/Orange threshold (e.g., ~40% of 255)
                            this.updateLed('input-level', 'yellow');
                        } else if (inputVolume > 10) { // Green threshold
                            this.updateLed('input-level', 'green');
                        } else {
                            this.updateLed('input-level', 'off');
                        }
                    } else {
                        this.updateLed('input-level', 'off');
                    }

                    // Feedback LED Logic
                    if (ControllerLayer.state.loopState === 'playing' || 
                        ControllerLayer.state.loopState === 'overdubbing' ||
                        ControllerLayer.state.loopState === 'multiplying') {
                        if (feedbackVolume > 200) { // Red threshold
                            this.updateLed('feedback-level', 'red');
                        } else if (feedbackVolume > 100) { // Yellow/Orange threshold
                            this.updateLed('feedback-level', 'yellow');
                        } else if (feedbackVolume > 10) { // Green threshold
                            this.updateLed('feedback-level', 'green');
                        } else {
                            this.updateLed('feedback-level', 'off');
                        }
                    } else {
                        this.updateLed('feedback-level', 'off');
                    }

                    this.animationFrameId = requestAnimationFrame(animateLevels);
                };

                this.animationFrameId = requestAnimationFrame(animateLevels);
                console.log("Started audio level monitoring.");
            }

            stopLevelMonitoring() {
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                    console.log("Stopped audio level monitoring.");
                }
                // Ensure LEDs are off when monitoring stops
                this.updateLed('input-level', 'off');
                this.updateLed('feedback-level', 'off');
            }
                
        }

        // ============================================================================
        // INITIALIZATION
        // ============================================================================

        let echoplexMinimal;

        // Initialize when the DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                echoplexMinimal = new EchoplexMinimal();
                echoplexMinimal.init();
                window.echoplexMinimal = echoplexMinimal; // Expose for debugging
            });
        } else {
            echoplexMinimal = new EchoplexMinimal();
            echoplexMinimal.init();
            window.echoplexMinimal = echoplexMinimal; // Expose for debugging
        }