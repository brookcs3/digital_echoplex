/*
====================================================
ECHOPLEX DIGITAL PRO PLUS - MINIMAL STARTING POINT
====================================================
Basic functionality: Power, Display, Feedback Knob, Parameter Button
*/

class EchoplexMinimal {
    constructor() {
        this.state = {
            power: false,
            parameterMode: 0, // 0=PLAY, 1=P1, 2=P2, 3=P3, 4=P4
            controlValues: {
                input: 64,
                output: 64,
                mix: 64,
                feedback: 127
            }
        };

        this.elements = {};
        this.audioSystem = null;
        this.displayTimeout = null;
        this.defaultDisplayState = '.'; // What display should show when not showing temporary messages
        this.isLoopRecorded = false;
    }

    async init() {
        console.log('🎛️ Initializing Echoplex Digital Pro Plus - Minimal Version');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }

        this.setupElements();
        this.setupEventListeners();
        
        console.log('✅ Echoplex Minimal ready');
    }

    setupElements() {
        // Get all required elements
        this.elements = {
            powerButton: document.getElementById('power-button'),
            mainInterface: document.getElementById('main-interface'),
            loopDisplay: document.getElementById('loop-display'),
            multipleDisplay: document.getElementById('multiple-display'),
            
            // Parameter button and LEDs
            parametersBtn: document.querySelector('[data-function="parameters"]'),
            timingLed: document.getElementById('timing-led'),
            switchesLed: document.getElementById('switches-led'),
            midiLed: document.getElementById('midi-led'),
            loopsLed: document.getElementById('loops-led'),
            
            // Feedback knob
            feedbackKnob: document.querySelector('[data-param="feedback"]'),
            feedbackLevel: document.getElementById('feedback-level')
        };

        // Verify critical elements exist
        const missing = [];
        Object.entries(this.elements).forEach(([name, element]) => {
            if (!element) {
                missing.push(name);
            }
        });

        if (missing.length > 0) {
            console.error('❌ Missing elements:', missing);
        } else {
            console.log('✅ All elements found');
        }
    }

    setupEventListeners() {
        // POWER BUTTON
        if (this.elements.powerButton) {
            this.elements.powerButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePower();
            });
            console.log('🔌 Power button connected');
        }

        // PARAMETER BUTTON
        if (this.elements.parametersBtn) {
            this.elements.parametersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleParameters();
            });
            console.log('📊 Parameters button connected');
        }

        // FEEDBACK KNOB
        if (this.elements.feedbackKnob) {
            this.setupKnob(this.elements.feedbackKnob);
            console.log('🎛️ Feedback knob connected');
        }
    }

    // ============================================================================
    // POWER CONTROL
    // ============================================================================
    
    togglePower() {
        this.state.power = !this.state.power;
        
        // Update power button visual
        this.elements.powerButton.classList.toggle('powered-on', this.state.power);
        
        // Update main interface
        if (this.elements.mainInterface) {
            if (this.state.power) {
                this.elements.mainInterface.classList.remove('powered-off');
            } else {
                this.elements.mainInterface.classList.add('powered-off');
            }
        }

        if (this.state.power) {
            console.log('🔌 Echoplex Digital Pro Plus: POWER ON');
            this.powerOnSequence();
        } else {
            console.log('🔌 Echoplex Digital Pro Plus: POWER OFF');
            this.powerOff();
        }
    }

    async powerOnSequence() {
        // Flash all button LEDs green briefly on startup
        this.flashStartupLEDs();
        
        // Initialize audio system
        await this.initializeAudioSystem();
        
        // Startup display sequence (like real hardware) - these are temporary messages
        this.showTemporaryMessage('1.0', 1000);  // Software version
        setTimeout(() => {
            this.showTemporaryMessage('198', 2000); // Total memory available
            setTimeout(() => {
                // Set default state to blank (ready state) and show it
                this.updateDefaultDisplayState('.');
            }, 2000);
        }, 1000);

        // Initialize parameter LEDs to off state
        this.updateParameterLEDs();
    }

    flashStartupLEDs() {
        // Flash the 7 button LEDs green briefly on startup
        const buttonFunctions = ['record', 'overdub', 'multiply', 'insert', 'mute', 'undo', 'nextloop'];
        
        console.log('💡 Starting LED flash sequence...');
        
        buttonFunctions.forEach((functionName, index) => {
            const button = document.querySelector(`[data-function="${functionName}"]`);
            const led = button?.querySelector('.status-led');
            
            if (led) {
                // Stagger the flash timing
                setTimeout(() => {
                    console.log(`Flashing ${functionName} LED`);
                    
                    // Make sure LED is visible (override powered-off state temporarily)
                    led.style.display = 'block';
                    led.classList.add('on');
                    
                    setTimeout(() => {
                        led.classList.remove('on');
                        led.style.display = ''; // Remove inline style to let CSS take over
                    }, 400); // Flash for 400ms
                }, index * 80); // 80ms stagger between LEDs
            } else {
                console.warn(`❌ LED not found for ${functionName}`);
            }
        });
        
        console.log('💡 Startup LED flash sequence initiated');
    }

    powerOff() {
        // Reset parameter mode
        this.state.parameterMode = 0;
        this.updateParameterLEDs();
        this.updateMultipleDisplay('');
        
        // Clear displays
        this.updateLoopDisplay('');
    }

    async initializeAudioSystem() {
        try {
            if (this.audioSystem) return true;

            // Create Web Audio Context
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                throw new Error('Web Audio API not supported');
            }

            const context = new AudioContextClass({
                sampleRate: 44100,
                latencyHint: 'interactive'
            });

            // Resume context if suspended
            if (context.state === 'suspended') {
                await context.resume();
            }

            // Create basic audio nodes
            this.audioSystem = {
                context: context,
                inputGain: context.createGain(),
                outputGain: context.createGain(),
                feedbackGain: context.createGain(),
                isReady: true
            };

            // Set initial values
            this.audioSystem.inputGain.gain.value = this.state.controlValues.input / 127;
            this.audioSystem.outputGain.gain.value = this.state.controlValues.output / 127;
            this.audioSystem.feedbackGain.gain.value = this.state.controlValues.feedback / 127;

            console.log('✅ Audio system initialized');
            return true;

        } catch (error) {
            console.error('❌ Audio system failed:', error);
            return false;
        }
    }

    // ============================================================================
    // PARAMETER CONTROL
    // ============================================================================
    
    handleParameters() {
        // Cycle through parameter modes: 0 → 1 → 2 → 3 → 4 → 0
        this.state.parameterMode = (this.state.parameterMode + 1) % 5;
        
        const modeNames = ['PLAY', 'P 1', 'P 2', 'P 3', 'P 4'];
        const currentMode = modeNames[this.state.parameterMode];
        
        // Show temporary message for parameter mode
        this.showTemporaryMessage(currentMode, 1500);
        
        // Update multiple display
        if (this.state.parameterMode > 0) {
            this.updateMultipleDisplay(`P${this.state.parameterMode}`);
        } else {
            this.updateMultipleDisplay('');
        }
        
        // Update parameter row LEDs
        this.updateParameterLEDs();
        
        console.log(`Parameters: Switched to ${currentMode} mode`);
    }

    updateParameterLEDs() {
        // Clear all LEDs first
        const leds = [
            { element: this.elements.timingLed, mode: 1 },
            { element: this.elements.switchesLed, mode: 2 },
            { element: this.elements.midiLed, mode: 3 },
            { element: this.elements.loopsLed, mode: 4 }
        ];

        leds.forEach(({ element, mode }) => {
            if (element) {
                // Remove all state classes
                element.className = 'row-indicator status-led';
                
                // Add active class if this is the current mode
                if (this.state.parameterMode === mode) {
                    element.classList.add('orange');
                }
            }
        });
    }

    // ============================================================================
    // FEEDBACK KNOB CONTROL
    // ============================================================================
    
    setupKnob(knob) {
        const param = knob.dataset.param;
        const min = parseFloat(knob.dataset.min) || 0;
        const max = parseFloat(knob.dataset.max) || 127;
        const knobImage = knob.querySelector('.knob-image');
        
        if (!knobImage) return;
        
        let isDragging = false;
        let startY = 0;
        let startValue = this.state.controlValues[param];
        const totalRotationRange = 270; // Knob rotation range

        // Set initial rotation
        this.updateKnobVisual(param, knobImage);

        // Mouse down - start dragging
        knob.addEventListener('mousedown', (e) => {
            if (!this.state.power) return;
            
            e.preventDefault();
            isDragging = true;
            startY = e.clientY;
            startValue = this.state.controlValues[param];
            
            // Show current value
            if (param === 'feedback') {
                this.showTemporaryMessage(Math.round(startValue).toString(), 1000);
            }
        });

        // Mouse move - update value
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaY = startY - e.clientY;
            // Better sensitivity that allows full range
            const pixelsForFullRange = 200; // 200px mouse movement = full 0-127 range
            const sensitivity = (max - min) / pixelsForFullRange;
            const deltaValue = deltaY * sensitivity;
            
            let newValue = startValue + deltaValue;
            newValue = Math.max(min, Math.min(max, newValue));
            
            // Update state
            this.state.controlValues[param] = newValue;
            
            // Update visuals
            this.updateKnobVisual(param, knobImage);
            
            // Show feedback value with throttling for smoother display
            if (param === 'feedback') {
                // Throttle display updates but show actual value
                const displayValue = Math.round(newValue);
                this.showTemporaryMessage(displayValue.toString(), 600);
            }
            
            // Update audio
            this.applyKnobToAudio(param, newValue);
        });

        // Mouse up - stop dragging
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // No need for manual display restoration - showTemporaryMessage handles it automatically
            }
        });

        // Mouse wheel support for even smoother control
        knob.addEventListener('wheel', (e) => {
            if (!this.state.power) return;
            
            e.preventDefault();
            
            const currentValue = this.state.controlValues[param];
            const wheelSensitivity = 2; // How much each wheel step changes the value
            const deltaValue = -e.deltaY > 0 ? wheelSensitivity : -wheelSensitivity;
            
            let newValue = currentValue + deltaValue;
            newValue = Math.max(min, Math.min(max, newValue));
            
            // Update state
            this.state.controlValues[param] = newValue;
            
            // Update visuals
            this.updateKnobVisual(param, knobImage);
            
            // Show value
            if (param === 'feedback') {
                this.showTemporaryMessage(Math.round(newValue).toString(), 1000);
            }
            
            // Update audio
            this.applyKnobToAudio(param, newValue);
        });
    }

    updateKnobVisual(param, knobImage) {
        const min = 0;
        const max = 127;
        const value = this.state.controlValues[param];
        
        const percentage = (value - min) / (max - min);
        const rotation = (percentage * 270) - 135; // -135° to +135°
        
        if (knobImage) {
            knobImage.style.transform = `rotate(${rotation}deg)`;
        }
    }

    applyKnobToAudio(param, value) {
        if (!this.audioSystem || !this.audioSystem.isReady) return;
        
        try {
            const normalizedValue = value / 127;
            
            switch(param) {
                case 'feedback':
                    if (this.audioSystem.feedbackGain) {
                        this.audioSystem.feedbackGain.gain.value = normalizedValue;
                    }
                    console.log(`🔄 Feedback: ${Math.round(normalizedValue * 100)}% (${normalizedValue === 1 ? 'INFINITE' : normalizedValue === 0 ? 'NONE' : 'CONTROLLED'})`);
                    break;
            }
        } catch (error) {
            console.error(`Error applying ${param}:`, error);
        }
    }

    // ============================================================================
    // DISPLAY MANAGEMENT
    // ============================================================================
    
    // ============================================================================
    // PROPER DISPLAY STATE MANAGEMENT
    // ============================================================================
    
    getDefaultDisplay() {
        // Return what the display should show when not showing temporary messages
        if (this.isLoopRecorded) {
            // If there's a loop, show the loop time (for now just return a placeholder)
            return "5.2"; // This would be actual loop time in real implementation
        } else {
            // No loop recorded - display should be blank (just decimal point)
            return ".";
        }
    }

    updateDefaultDisplayState(newState) {
        // Update what the default display should show
        this.defaultDisplayState = newState;
        
        // If not currently showing a temporary message, update display immediately
        if (!this.displayTimeout) {
            this.renderDisplay();
        }
    }

    renderDisplay() {
        // Actually update the DOM element
        if (this.elements.loopDisplay) {
            this.elements.loopDisplay.textContent = this.defaultDisplayState;
        }
    }

    showTemporaryMessage(message, duration = 2000) {
        // Clear any existing timeout
        if (this.displayTimeout) {
            clearTimeout(this.displayTimeout);
        }

        // Show temporary message
        if (this.elements.loopDisplay) {
            this.elements.loopDisplay.textContent = message;
        }

        // Set timeout to revert to default display
        this.displayTimeout = setTimeout(() => {
            this.revertToDefaultDisplay();
        }, duration);
    }

    revertToDefaultDisplay() {
        // Get current default state and display it
        this.defaultDisplayState = this.getDefaultDisplay();
        this.renderDisplay();
        this.displayTimeout = null;
    }

    updateMultipleDisplay(text) {
        if (this.elements.multipleDisplay) {
            // Clear any existing content except tempo dots
            const tempoDotLeft = this.elements.multipleDisplay.querySelector('.tempo-dot-left');
            const tempoDotRight = this.elements.multipleDisplay.querySelector('.tempo-dot-right');
            
            this.elements.multipleDisplay.textContent = text;
            
            // Restore tempo dots
            if (tempoDotLeft) this.elements.multipleDisplay.appendChild(tempoDotLeft);
            if (tempoDotRight) this.elements.multipleDisplay.appendChild(tempoDotRight);
        }
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize when page loads
let echoplexMinimal;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEchoplex);
} else {
    initializeEchoplex();
}

async function initializeEchoplex() {
    try {
        echoplexMinimal = new EchoplexMinimal();
        await echoplexMinimal.init();
        
        // Make globally available for debugging
        window.echoplexMinimal = echoplexMinimal;
        
        console.log('✅ Echoplex Minimal loaded successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Echoplex:', error);
    }
}