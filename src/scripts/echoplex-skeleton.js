/**
 * ECHOPLEX DIGITAL PRO PLUS - COMPLETE SYSTEM SKELETON
 * Single file implementation with proper layer hierarchy
 * Each layer contains its specific logic and state management
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CENTRAL ACTION BUS - All state changes flow through dispatch()
// ═══════════════════════════════════════════════════════════════════════════════

const ActionBus = {
  listeners: [],
  
  // Central dispatch function - all actions flow through here
  dispatch(action) {
    console.log('🚌 ACTION:', action.type, action);
    
    // Route action to appropriate reducer
    switch (action.type) {
      case 'POWER_TOGGLE':
        SystemLayer.reducer.powerToggle(action);
        break;
      case 'PARAMETER_TOGGLE':
        SystemLayer.reducer.parameterToggle(action);
        break;
      case 'BUTTON_PRESS':
        BLKLayer.reducer.buttonPress(action);
        break;
      case 'BUTTON_RELEASE':
        BLKLayer.reducer.buttonRelease(action);
        break;
      case 'KNOB_TURN':
        BLKLayer.reducer.knobTurn(action);
        break;
      case 'PARAMETER_CHANGE':
        ParameterLayer.reducer.parameterChange(action);
        break;
      case 'START_RECORDING':
        ControllerLayer.reducer.startRecording(action);
        break;
      case 'STOP_RECORDING':
        ControllerLayer.reducer.stopRecording(action);
        break;
      case 'START_OVERDUB':
        ControllerLayer.reducer.startOverdub(action);
        break;
      case 'STOP_OVERDUB':
        ControllerLayer.reducer.stopOverdub(action);
        break;
      case 'MIDI_SYNC':
        SystemLayer.reducer.midiSync(action);
        break;
      case 'LED_UPDATE':
        BLKLayer.reducer.ledUpdate(action);
        break;
      case 'DISPLAY_UPDATE':
        FeedbackLayer.reducer.displayUpdate(action);
        break;
      default:
        console.warn('🚌 Unknown action type:', action.type);
    }
    
    // Notify listeners (useful for debugging/logging)
    this.listeners.forEach(listener => listener(action));
  },
  
  // Subscribe to all actions (for debugging, testing, etc.)
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
};

// Global dispatch function - available everywhere
const dispatch = ActionBus.dispatch.bind(ActionBus);

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM LAYER - Power, Parameter Mode, Global MIDI Sync
// ═══════════════════════════════════════════════════════════════════════════════

const SystemLayer = {
  state: {
    power: false,
    parameterMode: false,
    currentParameterRow: null, // 0=Timing, 1=Switches, 2=MIDI, 3=Loop
    midiSync: {
      mode: 'OFF', // OFF, IN, OUT, OuS
      tempo: 120,
      externalClock: false,
      syncLED: false
    }
  },

  // Power Control - THE MASTER SWITCH
  power: {
    toggle() {
      SystemLayer.state.power = !SystemLayer.state.power;
      if (!SystemLayer.state.power) {
        SystemLayer.power.shutdown();
      } else {
        SystemLayer.power.startup();
      }
      BLKLayer.updatePowerState();
    },

    async startup() {
      console.log('🔌 System Power ON');
      
      // Update power button visual
      if (BLKLayer.elements.powerButton) {
        BLKLayer.elements.powerButton.classList.add('powered-on');
      }
      
      // Update main interface
      if (BLKLayer.elements.mainInterface) {
        BLKLayer.elements.mainInterface.classList.remove('powered-off');
      }
      
      // Flash startup LEDs
      BLKLayer.flashStartupLEDs();
      
      // Initialize audio system
      await SignalChainLayer.initializeAudioSystem();
      
      // Initialize all layers
      BLKLayer.initialize();
      ParameterLayer.initialize();
      SignalChainLayer.initialize();
      ControllerLayer.initialize();
      BufferLayer.initialize();
      FeedbackLayer.initialize();
      
      // Startup display sequence (like real hardware)
      FeedbackLayer.showTemporaryMessage('1.0', 1000);  // Software version
      setTimeout(() => {
        FeedbackLayer.showTemporaryMessage('198', 2000); // Total memory available
        setTimeout(() => {
          // Set default state to blank (ready state) and show it
          FeedbackLayer.updateDefaultDisplayState('.');
        }, 2000);
      }, 1000);
    },

    shutdown() {
      console.log('🔌 System Power OFF');
      
      // Update power button visual
      if (BLKLayer.elements.powerButton) {
        BLKLayer.elements.powerButton.classList.remove('powered-on');
      }
      
      // Update main interface
      if (BLKLayer.elements.mainInterface) {
        BLKLayer.elements.mainInterface.classList.add('powered-off');
      }
      
      // Reset parameter mode
      SystemLayer.state.parameterMode = false;
      SystemLayer.state.currentParameterRow = null;
      
      // Reset all states
      ControllerLayer.reset();
      SignalChainLayer.reset();
      BLKLayer.reset();
      FeedbackLayer.reset();
      
      // Clear displays
      if (BLKLayer.elements.loopDisplay) {
        BLKLayer.elements.loopDisplay.textContent = '';
      }
      if (BLKLayer.elements.multipleDisplay) {
        // Save tempo dots and AutoUndo LED before clearing
        const tempoDotLeft = BLKLayer.elements.multipleDisplay.querySelector('.tempo-dot-left');
        const tempoDotRight = BLKLayer.elements.multipleDisplay.querySelector('.tempo-dot-right');
        const autoUndoLED = BLKLayer.elements.multipleDisplay.querySelector('.auto-undo-led');
        
        BLKLayer.elements.multipleDisplay.textContent = '';
        
        // Restore tempo dots and AutoUndo LED
        if (tempoDotLeft) BLKLayer.elements.multipleDisplay.appendChild(tempoDotLeft);
        if (tempoDotRight) BLKLayer.elements.multipleDisplay.appendChild(tempoDotRight);
        if (autoUndoLED) BLKLayer.elements.multipleDisplay.appendChild(autoUndoLED);
      }
    }
  },

  // Parameter Mode Management
  parameterMode: {
    toggle() {
      console.log('🔥 PARAMETER MODE TOGGLE CALLED - parameterMode:', SystemLayer.state.parameterMode);
      if (!SystemLayer.state.parameterMode) {
        console.log('🔥 CALLING ENTER');
        SystemLayer.parameterMode.enter();
      } else {
        console.log('🔥 CALLING NEXTROW');
        SystemLayer.parameterMode.nextRow();
      }
    },

    enter() {
      SystemLayer.state.parameterMode = true;
      SystemLayer.state.currentParameterRow = 0; // Start at 0 to show P1 immediately
      console.log('📝 Parameter Mode ENTER - Row: Timing');
      BLKLayer.updateParameterRowLEDs();
      FeedbackLayer.updateParameterDisplay();
      
      // Update multiple display
      const rowNames = ['P1', 'P2', 'P3', 'P4'];
      FeedbackLayer.updateMultipleDisplay(rowNames[SystemLayer.state.currentParameterRow]);
    },

    nextRow() {
      SystemLayer.state.currentParameterRow++;
      if (SystemLayer.state.currentParameterRow >= 4) {
        SystemLayer.parameterMode.exit();
      } else {
        const rows = ['Timing', 'Switches', 'MIDI', 'Loop'];
        const rowNames = ['P1', 'P2', 'P3', 'P4'];
        console.log(`📝 Parameter Mode - Row: ${rows[SystemLayer.state.currentParameterRow]}`);
        BLKLayer.updateParameterRowLEDs();
        FeedbackLayer.updateParameterDisplay();
        
        // Update multiple display and show temporary message
        FeedbackLayer.updateMultipleDisplay(rowNames[SystemLayer.state.currentParameterRow]);
        FeedbackLayer.showTemporaryMessage(rowNames[SystemLayer.state.currentParameterRow], 1500);
      }
    },

    exit() {
      SystemLayer.state.parameterMode = false;
      SystemLayer.state.currentParameterRow = null;
      console.log('📝 Parameter Mode EXIT');
      BLKLayer.updateParameterRowLEDs();
      FeedbackLayer.updatePlayDisplay();
      
      // Clear multiple display
      FeedbackLayer.updateMultipleDisplay('');
    }
  },

  // MIDI Sync Management
  midiSync: {
    setMode(mode) {
      SystemLayer.state.midiSync.mode = mode;
      console.log(`🎵 MIDI Sync: ${mode}`);
    },

    tick() {
      if (SystemLayer.state.midiSync.mode === 'IN') {
        SystemLayer.state.midiSync.externalClock = true;
        SystemLayer.state.midiSync.syncLED = true;
        setTimeout(() => SystemLayer.state.midiSync.syncLED = false, 50);
      }
    },

    sendClock() {
      if (SystemLayer.state.midiSync.mode === 'OUT') {
        // Send MIDI clock tick
        console.log('🎵 MIDI Clock OUT');
      }
    }
  },

  // Pure reducer functions for action bus
  reducer: {
    powerToggle(action) {
      SystemLayer.state.power = !SystemLayer.state.power;
      if (!SystemLayer.state.power) {
        SystemLayer.power.shutdown();
      } else {
        SystemLayer.power.startup();
      }
    },

    midiSync(action) {
      const { mode, tempo, externalClock } = action.payload;
      if (mode !== undefined) SystemLayer.state.midiSync.mode = mode;
      if (tempo !== undefined) SystemLayer.state.midiSync.tempo = tempo;
      if (externalClock !== undefined) SystemLayer.state.midiSync.externalClock = externalClock;
      console.log('🎵 MIDI Sync updated:', SystemLayer.state.midiSync);
    },

    parameterToggle(action) {
      SystemLayer.parameterMode.toggle();
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// BLK LAYER - Button LEDs, Knobs, Immediate Feedback
// ═══════════════════════════════════════════════════════════════════════════════

const BLKLayer = {
  state: {
    buttons: {
      power: { pressed: false },
      parameter: { pressed: false },
      record: { pressed: false, led: 'off' },
      overdub: { pressed: false, led: 'off' },
      multiply: { pressed: false, led: 'off' },
      insert: { pressed: false, led: 'off' },
      mute: { pressed: false, led: 'off' },
      undo: { pressed: false, led: 'off' },
      nextloop: { pressed: false, led: 'off' }
    },
    knobs: {
      input: 0.8,
      output: 0.8,
      mix: 0.5,
      feedback: 1.0
    },
    rowLEDs: [false, false, false, false] // Timing, Switches, MIDI, Loop
  },

  // DOM Elements (integrated from echoplex-minimal.js)
  elements: {},

  initialize() {
    console.log('🔘 BLK Layer initialized');
    BLKLayer.setupDOMElements();
    BLKLayer.setupEventListeners();
    BLKLayer.resetAllLEDs();
  },

  setupDOMElements() {
    // Get all required DOM elements (matching index.astro structure)
    BLKLayer.elements = {
      powerButton: document.getElementById('power-button'),
      mainInterface: document.getElementById('main-interface'),
      loopDisplay: document.getElementById('loop-display'),
      multipleDisplay: document.getElementById('multiple-display'),
      leftDisplay: document.getElementById('left-display'),
      
      // Parameter button and LEDs
      parametersBtn: document.querySelector('[data-function="parameters"]'),
      timingLed: document.getElementById('timing-led'),
      switchesLed: document.getElementById('switches-led'),
      midiLed: document.getElementById('midi-led'),
      loopsLed: document.getElementById('loops-led'),
    
          
      // Knobs (all knobs from index.astro)
      inputKnob: document.querySelector('[data-param="input"]'),
      outputKnob: document.querySelector('[data-param="output"]'),
      mixKnob: document.querySelector('[data-param="mix"]'),
      feedbackKnob: document.querySelector('[data-param="feedback"]'),
      
      // Level indicators
      inputLevel: document.getElementById('input-level'),
      feedbackLevel: document.getElementById('feedback-level'),
      
      // Special LEDs
      autoUndoLED: document.getElementById('autoUndoLED'),
      tempoDotLeft: document.getElementById('tempoDotLeft'),
      tempoDotRight: document.getElementById('tempoDotRight')
    };

    // Verify critical elements exist
    const missing = [];
    Object.entries(BLKLayer.elements).forEach(([name, element]) => {
      if (!element) {
        missing.push(name);
      }
    });

    if (missing.length > 0) {
      console.error('❌ Missing DOM elements:', missing);
    } else {
      console.log('✅ All DOM elements found');
    }
  },

  setupEventListeners() {
    // POWER BUTTON
    if (BLKLayer.elements.powerButton) {
      BLKLayer.elements.powerButton.addEventListener('click', (e) => {
        e.preventDefault();
        dispatch({ type: 'POWER_TOGGLE' });
      });
      console.log('🔌 Power button connected');
    }

    // PARAMETER BUTTON
    if (BLKLayer.elements.parametersBtn) {
      // Remove any existing event listeners first
      BLKLayer.elements.parametersBtn.removeEventListener('click', BLKLayer.parameterButtonHandler);
      BLKLayer.elements.parametersBtn.removeEventListener('mousedown', BLKLayer.parameterButtonMouseDown);
      BLKLayer.elements.parametersBtn.removeEventListener('mouseup', BLKLayer.parameterButtonMouseUp);
      
      let longPressTimer = null;
      let isLongPress = false;
      
      // Mouse down handler for long press detection
      BLKLayer.parameterButtonMouseDown = (e) => {
        e.preventDefault();
        isLongPress = false;
        longPressTimer = setTimeout(() => {
          isLongPress = true;
          console.log('🔥 PARAMETER BUTTON LONG PRESS - Exiting parameter mode');
          if (SystemLayer.state.parameterMode) {
            SystemLayer.parameterMode.exit();
          }
        }, 800); // 800ms for long press
      };
      
      // Mouse up handler
      BLKLayer.parameterButtonMouseUp = (e) => {
        e.preventDefault();
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
        
        if (!isLongPress) {
          // Short press - normal toggle behavior
          console.log('🔥 PARAMETER BUTTON SHORT PRESS - Toggle');
          dispatch({ type: 'PARAMETER_TOGGLE' });
        }
      };
      
      BLKLayer.elements.parametersBtn.addEventListener('mousedown', BLKLayer.parameterButtonMouseDown);
      BLKLayer.elements.parametersBtn.addEventListener('mouseup', BLKLayer.parameterButtonMouseUp);
      console.log('📊 Parameters button connected with long press support');
    }

    // ALL KNOBS
    const knobs = [
      { element: BLKLayer.elements.inputKnob, param: 'input' },
      { element: BLKLayer.elements.outputKnob, param: 'output' },
      { element: BLKLayer.elements.mixKnob, param: 'mix' },
      { element: BLKLayer.elements.feedbackKnob, param: 'feedback' }
    ];
    
    knobs.forEach(({ element, param }) => {
      if (element) {
        BLKLayer.setupKnob(element, param);
        console.log(`🎛️ ${param} knob connected`);
      }
    });

    // Function buttons
    const functionButtons = ['record', 'overdub', 'multiply', 'insert', 'mute', 'undo', 'nextloop'];
    functionButtons.forEach(functionName => {
      const button = document.querySelector(`[data-function="${functionName}"]`);
      if (button) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          BLKLayer.handleButtonPress(functionName);
        });
        
        // Also add mousedown/mouseup for potential long press support
        button.addEventListener('mousedown', (e) => {
          e.preventDefault();
          BLKLayer.handleButtonDown(functionName);
        });
        
        button.addEventListener('mouseup', (e) => {
          e.preventDefault();
          BLKLayer.handleButtonUp(functionName);
        });
        
        console.log(`🔘 ${functionName} button connected`);
      }
    });
  },

  reset() {
    BLKLayer.resetAllLEDs();
    Object.keys(BLKLayer.state.buttons).forEach(btn => {
      BLKLayer.state.buttons[btn].pressed = false;
      if (BLKLayer.state.buttons[btn].led) {
        BLKLayer.state.buttons[btn].led = 'off';
      }
    });
  },

  // Button Press Handler - THE MAIN INPUT ROUTER
  handleButtonPress(buttonName) {
    if (!SystemLayer.state.power && buttonName !== 'power') {
      return; // Ignore all buttons except power when system is off
    }

    BLKLayer.state.buttons[buttonName].pressed = true;

    // Route button press based on current mode
    if (buttonName === 'power') {
      SystemLayer.power.toggle();
    } else if (buttonName === 'parameter') {
      // Parameter button is handled by its own direct event listener
      console.log('🔥 PARAMETER BUTTON HIT handleButtonPress - RETURNING EARLY');
      return;
    } else if (SystemLayer.state.parameterMode) {
      // Parameter editing mode
      ParameterLayer.handleParameterButton(buttonName);
    } else {
      // Play mode - route to controller
      ControllerLayer.handlePlayButton(buttonName);
    }
  },

  handleButtonRelease(buttonName) {
    if (BLKLayer.state.buttons[buttonName]) {
      BLKLayer.state.buttons[buttonName].pressed = false;
    }
  },

  // Knob Handler
  handleKnobChange(knobName, value) {
    if (!SystemLayer.state.power) return;
    
    BLKLayer.state.knobs[knobName] = value;
    
    // Route knob changes to signal chain
    switch (knobName) {
      case 'input':
        SignalChainLayer.setInputLevel(value);
        break;
      case 'output':
        SignalChainLayer.setOutputLevel(value);
        break;
      case 'mix':
        SignalChainLayer.setMixLevel(value);
        break;
      case 'feedback':
        SignalChainLayer.setFeedbackLevel(value);
        break;
    }
  },

  // LED Management
  updatePowerState() {
    if (SystemLayer.state.power) {
      console.log('💡 Power LED ON');
    } else {
      console.log('💡 Power LED OFF');
      BLKLayer.resetAllLEDs();
    }
  },

  updateParameterRowLEDs() {
    // Turn off all row LEDs
    BLKLayer.state.rowLEDs.fill(false);
    
    // Clear all row LED classes (using SCSS classes from echoplex.scss)
    const leds = [
      { element: BLKLayer.elements.timingLed, row: 0 },
      { element: BLKLayer.elements.switchesLed, row: 1 },
      { element: BLKLayer.elements.midiLed, row: 2 },
      { element: BLKLayer.elements.loopsLed, row: 3 }
    ];

    leds.forEach(({ element, row }) => {
      if (element) {
        // Remove active and orange classes (as defined in echoplex.scss)
        element.classList.remove('active', 'orange');
        
        // Add orange class if this is the current mode
        if (SystemLayer.state.parameterMode && SystemLayer.state.currentParameterRow === row) {
          element.classList.add('orange'); // Orange for active parameter mode
          BLKLayer.state.rowLEDs[row] = true;
        }
      }
    });
    
    console.log('💡 Row LEDs:', BLKLayer.state.rowLEDs);
  },
  
  // Button press handlers
  handleButtonDown(buttonName) {
    // For potential long press support
    console.log(`Button down: ${buttonName}`);
  },
  
  handleButtonUp(buttonName) {
    // For potential long press support
    console.log(`Button up: ${buttonName}`);
  },

  setButtonLED(buttonName, state) {
    if (BLKLayer.state.buttons[buttonName]) {
      // Only update if the state actually changed
      if (BLKLayer.state.buttons[buttonName].led !== state) {
        BLKLayer.state.buttons[buttonName].led = state;
        
        // Update DOM using data-hw-state attribute (as per CLAUDE.md)
        const button = document.querySelector(`[data-function="${buttonName}"]`);
        const led = button?.querySelector('.status-led');
        
        if (led) {
          led.setAttribute('data-hw-state', state);
          console.log(`💡 ${buttonName} LED: ${state}`);
        }
      }
    }
  },

  resetAllLEDs() {
    Object.keys(BLKLayer.state.buttons).forEach(btn => {
      if (BLKLayer.state.buttons[btn].led) {
        BLKLayer.state.buttons[btn].led = 'off';
        
        // Update DOM
        const button = document.querySelector(`[data-function="${btn}"]`);
        const led = button?.querySelector('.status-led');
        if (led) {
          led.setAttribute('data-hw-state', 'off');
        }
      }
    });
    BLKLayer.state.rowLEDs.fill(false);
    BLKLayer.updateParameterRowLEDs();
  },

  flashStartupLEDs() {
    // Flash the 7 button LEDs green briefly on startup (from echoplex-minimal.js)
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
          led.setAttribute('data-hw-state', 'on');
          
          setTimeout(() => {
            led.setAttribute('data-hw-state', 'off');
            led.style.display = ''; // Remove inline style to let CSS take over
          }, 400); // Flash for 400ms
        }, index * 80); // 80ms stagger between LEDs
      } else {
        console.warn(`❌ LED not found for ${functionName}`);
      }
    });
    
    console.log('💡 Startup LED flash sequence initiated');
  },

  // Knob control implementation (from echoplex-minimal.js)
  setupKnob(knob, paramName) {
    const min = parseFloat(knob.dataset.min) || 0;
    const max = parseFloat(knob.dataset.max) || 127;
    const knobImage = knob.querySelector('.knob-image');
    
    if (!knobImage) return;
    
    let isDragging = false;
    let startY = 0;
    let startValue = BLKLayer.state.knobs[paramName] * 127; // Convert to 0-127 range
    const totalRotationRange = 270; // Knob rotation range

    // Set initial rotation
    BLKLayer.updateKnobVisual(paramName, knobImage);

    // Mouse down - start dragging
    knob.addEventListener('mousedown', (e) => {
      if (!SystemLayer.state.power) return;
      
      e.preventDefault();
      isDragging = true;
      startY = e.clientY;
      startValue = BLKLayer.state.knobs[paramName] * 127;
      
      // Show current value
      if (paramName === 'feedback') {
        FeedbackLayer.showTemporaryMessage(Math.round(startValue).toString(), 1000);
      }
    });

    // Mouse move - update value
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaY = startY - e.clientY;
      const pixelsForFullRange = 200;
      const sensitivity = (max - min) / pixelsForFullRange;
      const deltaValue = deltaY * sensitivity;
      
      let newValue = startValue + deltaValue;
      newValue = Math.max(min, Math.min(max, newValue));
      
      // Update state (normalize to 0-1 range)
      BLKLayer.state.knobs[paramName] = newValue / 127;
      
      // Update visuals
      BLKLayer.updateKnobVisual(paramName, knobImage);
      
      // Show feedback value
      if (paramName === 'feedback') {
        const displayValue = Math.round(newValue);
        FeedbackLayer.showTemporaryMessage(displayValue.toString(), 600);
      }
      
      // Apply to audio and signal chain
      BLKLayer.applyKnobToAudio(paramName, newValue);
    });

    // Mouse up - stop dragging
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Mouse wheel support
    knob.addEventListener('wheel', (e) => {
      if (!SystemLayer.state.power) return;
      
      e.preventDefault();
      
      const currentValue = BLKLayer.state.knobs[paramName] * 127;
      const wheelSensitivity = 2;
      const deltaValue = -e.deltaY > 0 ? wheelSensitivity : -wheelSensitivity;
      
      let newValue = currentValue + deltaValue;
      newValue = Math.max(min, Math.min(max, newValue));
      
      // Update state
      BLKLayer.state.knobs[paramName] = newValue / 127;
      
      // Update visuals
      BLKLayer.updateKnobVisual(paramName, knobImage);
      
      // Show value
      if (paramName === 'feedback') {
        FeedbackLayer.showTemporaryMessage(Math.round(newValue).toString(), 1000);
      }
      
      // Apply to audio
      BLKLayer.applyKnobToAudio(paramName, newValue);
    });
  },

  updateKnobVisual(paramName, knobImage) {
    const value = BLKLayer.state.knobs[paramName] * 127; // Convert to 0-127 range
    const percentage = value / 127;
    const rotation = (percentage * 270) - 135; // -135° to +135°
    
    if (knobImage) {
      knobImage.style.transform = `rotate(${rotation}deg)`;
    }
  },

  applyKnobToAudio(paramName, value) {
    const normalizedValue = value / 127;
    
    switch(paramName) {
      case 'input':
        SignalChainLayer.setInputLevel(normalizedValue);
        break;
      case 'output':
        SignalChainLayer.setOutputLevel(normalizedValue);
        break;
      case 'mix':
        SignalChainLayer.setMixLevel(normalizedValue);
        break;
      case 'feedback':
        SignalChainLayer.setFeedbackLevel(normalizedValue);
        break;
    }
  },

  // Pure reducer functions for action bus
  reducer: {
    buttonPress(action) {
      const { buttonName } = action.payload;
      BLKLayer.state.buttons[buttonName].pressed = true;
      console.log(`🔘 Button ${buttonName} pressed`);
      
      // Trigger button-specific logic
      switch (buttonName) {
        case 'record':
          dispatch({ type: 'START_RECORDING', button: buttonName });
          break;
        case 'overdub':
          dispatch({ type: 'START_OVERDUB', button: buttonName });
          break;
        // Add other button logic
      }
    },

    buttonRelease(action) {
      const { buttonName } = action.payload;
      if (BLKLayer.state.buttons[buttonName]) {
        BLKLayer.state.buttons[buttonName].pressed = false;
        console.log(`🔘 Button ${buttonName} released`);
      }
    },

    knobTurn(action) {
      const { knobName, value } = action.payload;
      BLKLayer.state.knobs[knobName] = value;
      console.log(`🎛️ Knob ${knobName}: ${value}`);
      
      // Update audio chain
      const normalizedValue = value / 127;
      BLKLayer.handleKnobChange(knobName, normalizedValue);
    },

    ledUpdate(action) {
      const { buttonName, state } = action.payload;
      if (BLKLayer.state.buttons[buttonName].led !== state) {
        BLKLayer.state.buttons[buttonName].led = state;
        BLKLayer.updateButtonLED(buttonName, state);
      }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PARAMETER LAYER - Timing, Switches, MIDI, Loop Settings
// ═══════════════════════════════════════════════════════════════════════════════

const ParameterLayer = {
  state: {
    // The 7×4 Parameter Matrix
    timing: {
      'Loop/Delay': 'LOP',
      'Quantize': 'OFF',
      '8ths/Cycle': 8,
      'Sync': 'OFF',
      'Threshold': 0,
      'Reverse': 'FWD',
      'StartPoint': 0
    },
    switches: {
      'RecordMode': 'TOG',
      'OverdubMode': 'TOG',
      'RoundMode': 'OFF',
      'InsertMode': 'rPL',
      'MuteMode': 'CON',
      'Overflow': 'PLY',
      'Presets': 1
    },
    midi: {
      'Channel': 1,
      'ControlSource': 'NOT',
      'Source #': 64,
      'VolumeCont': 7,
      'FeedBkCont': 11,
      'Dump': 'OFF',
      'Load': 'OFF'
    },
    loop: {
      'MoreLoops': 1,
      'AutoRecord': 'OFF',
      'LoopCopy': 'OFF',
      'SwitchQuant': 'OFF',
      'LoopTrig': 'OFF',
      'Velocity': 'OFF',
      'SamplerStyle': 'RUN'
    }
  },

  // Parameter Matrix Mapping - Button to Parameter
  matrix: {
    0: { // Timing Row
      'record': 'Loop/Delay',
      'overdub': 'Quantize',
      'multiply': '8ths/Cycle',
      'insert': 'Sync',
      'mute': 'Threshold',
      'undo': 'Reverse',
      'nextloop': 'StartPoint'
    },
    1: { // Switches Row
      'record': 'RecordMode',
      'overdub': 'OverdubMode',
      'multiply': 'RoundMode',
      'insert': 'InsertMode',
      'mute': 'MuteMode',
      'undo': 'Overflow',
      'nextloop': 'Presets'
    },
    2: { // MIDI Row
      'record': 'Channel',
      'overdub': 'ControlSource',
      'multiply': 'Source #',
      'insert': 'VolumeCont',
      'mute': 'FeedBkCont',
      'undo': 'Dump',
      'nextloop': 'Load'
    },
    3: { // Loop Row
      'record': 'MoreLoops',
      'overdub': 'AutoRecord',
      'multiply': 'LoopCopy',
      'insert': 'SwitchQuant',
      'mute': 'LoopTrig',
      'undo': 'Velocity',
      'nextloop': 'SamplerStyle'
    }
  },

  initialize() {
    console.log('⚙️  Parameter Layer initialized');
  },

  // Handle parameter button press
  handleParameterButton(buttonName) {
    const row = SystemLayer.state.currentParameterRow;
    const rowNames = ['timing', 'switches', 'midi', 'loop'];
    const paramName = ParameterLayer.matrix[row][buttonName];
    
    if (paramName) {
      ParameterLayer.incrementParameter(rowNames[row], paramName);
    }
  },

  // Increment parameter value
  incrementParameter(category, paramName) {
    const current = ParameterLayer.state[category][paramName];
    let newValue = current;

    // Parameter-specific increment logic
    switch (paramName) {
      case 'Loop/Delay':
        const loopDelayValues = ['LOP', 'dEL', 'EXP', 'Stu', 'Out', 'In', 'rPL', 'FLI'];
        newValue = loopDelayValues[(loopDelayValues.indexOf(current) + 1) % loopDelayValues.length];
        break;
      case 'Quantize':
        const quantizeValues = ['OFF', 'CYC', '8th', 'LOP'];
        newValue = quantizeValues[(quantizeValues.indexOf(current) + 1) % quantizeValues.length];
        break;
      case '8ths/Cycle':
        newValue = current >= 96 ? 1 : current + 1;
        break;
      case 'Sync':
        const syncValues = ['OFF', 'IN', 'OUT', 'OuS'];
        newValue = syncValues[(syncValues.indexOf(current) + 1) % syncValues.length];
        break;
      case 'MoreLoops':
        newValue = current >= 16 ? 1 : current + 1;
        break;
      case 'RecordMode':
        const recordModeValues = ['TOG', 'SUS', 'SAF'];
        newValue = recordModeValues[(recordModeValues.indexOf(current) + 1) % recordModeValues.length];
        break;
      // Add more parameter increment logic as needed
      default:
        if (typeof current === 'string') {
          newValue = current === 'OFF' ? 'ON' : 'OFF';
        } else {
          newValue = current + 1;
        }
    }

    ParameterLayer.state[category][paramName] = newValue;
    console.log(`⚙️  ${paramName}: ${current} → ${newValue}`);
    
    // Apply parameter changes to other layers
    ParameterLayer.applyParameterChange(category, paramName, newValue);
    
    // Update display
    FeedbackLayer.updateParameterDisplay();
  },

  // Apply parameter changes to other layers
  applyParameterChange(category, paramName, value) {
    switch (paramName) {
      case 'MoreLoops':
        BufferLayer.setLoopCount(value);
        break;
      case 'Sync':
        SystemLayer.midiSync.setMode(value);
        break;
      case 'RecordMode':
        ControllerLayer.setRecordMode(value);
        break;
      case 'OverdubMode':
        ControllerLayer.setOverdubMode(value);
        break;
      // Add more parameter applications as needed
    }
  },

  // Get current parameter value for display
  getCurrentParameter() {
    if (!SystemLayer.state.parameterMode) return null;
    
    const row = SystemLayer.state.currentParameterRow;
    const rowNames = ['timing', 'switches', 'midi', 'loop'];
    return ParameterLayer.state[rowNames[row]];
  },

  // Pure reducer functions for action bus
  reducer: {
    parameterChange(action) {
      const { parameter, value } = action.payload;
      console.log(`⚙️ Parameter change: ${parameter} = ${value}`);
      
      // Apply the parameter change
      ParameterLayer.setParameter(parameter, value);
      
      // Update any displays that depend on this parameter
      if (SystemLayer.state.parameterMode) {
        FeedbackLayer.updateParameterDisplay();
      }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET LAYER - Load/Save Configurations
// ═══════════════════════════════════════════════════════════════════════════════

const PresetLayer = {
  state: {
    presets: Array(16).fill(null), // 16 preset slots
    currentPreset: null
  },

  initialize() {
    console.log('💾 Preset Layer initialized');
  },

  savePreset(slot) {
    const preset = {
      timing: { ...ParameterLayer.state.timing },
      switches: { ...ParameterLayer.state.switches },
      midi: { ...ParameterLayer.state.midi },
      loop: { ...ParameterLayer.state.loop }
    };
    
    PresetLayer.state.presets[slot] = preset;
    PresetLayer.state.currentPreset = slot;
    console.log(`💾 Preset ${slot + 1} saved`);
  },

  loadPreset(slot) {
    const preset = PresetLayer.state.presets[slot];
    if (preset) {
      ParameterLayer.state.timing = { ...preset.timing };
      ParameterLayer.state.switches = { ...preset.switches };
      ParameterLayer.state.midi = { ...preset.midi };
      ParameterLayer.state.loop = { ...preset.loop };
      
      PresetLayer.state.currentPreset = slot;
      console.log(`💾 Preset ${slot + 1} loaded`);
      
      // Apply all parameter changes
      Object.keys(preset).forEach(category => {
        Object.keys(preset[category]).forEach(param => {
          ParameterLayer.applyParameterChange(category, param, preset[category][param]);
        });
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL CHAIN LAYER - Mute, Volume, Feedback
// ═══════════════════════════════════════════════════════════════════════════════

const SignalChainLayer = {
  state: {
    inputLevel: 0.8,
    outputLevel: 0.8,
    mixLevel: 0.5,
    feedbackLevel: 1.0,
    muted: false
  },

  // Audio processing components (from echoplex-minimal.js)
  audioSystem: null,
  audioNodes: {},
  audioBuffers: [],
  currentBuffer: null,
  recordingPosition: 0,
  playbackPosition: 0,
  fadeInTime: 0.01,
  fadeOutTime: 0.01,

  initialize() {
    console.log('🔊 Signal Chain Layer initialized');
  },

  reset() {
    SignalChainLayer.state.muted = false;
  },

  async initializeAudioSystem() {
    try {
      if (SignalChainLayer.audioSystem) return true;

      // Create Web Audio Context with optimal settings
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API not supported');
      }

      const context = new AudioContextClass({
        sampleRate: 44100, // Echoplex standard sample rate
        latencyHint: 'interactive' // Low latency for real-time performance
      });

      // Resume context if suspended
      if (context.state === 'suspended') {
        await context.resume();
      }

      // Create comprehensive audio processing chain
      SignalChainLayer.audioNodes = {
        // Input chain
        inputGain: context.createGain(),
        inputLimiter: context.createDynamicsCompressor(),
        inputMeter: context.createAnalyser(),
        
        // Loop processing
        loopGain: context.createGain(),
        feedbackGain: context.createGain(),
        mixGain: context.createGain(),
        
        // Effects
        reverseBuffer: null, // Created when needed
        halfSpeedBuffer: null, // Created when needed
        
        // Output chain
        outputGain: context.createGain(),
        outputMeter: context.createAnalyser(),
        
        // Utility
        merger: context.createChannelMerger(2),
        splitter: context.createChannelSplitter(2)
      };

      // Configure input limiter (prevents digital distortion)
      const limiter = SignalChainLayer.audioNodes.inputLimiter;
      limiter.threshold.value = -6; // -6dB threshold
      limiter.knee.value = 2; // 2dB knee
      limiter.ratio.value = 12; // 12:1 ratio
      limiter.attack.value = 0.003; // 3ms attack
      limiter.release.value = 0.25; // 250ms release

      // Configure analyzers for metering
      SignalChainLayer.audioNodes.inputMeter.fftSize = 256;
      SignalChainLayer.audioNodes.inputMeter.smoothingTimeConstant = 0.8;
      SignalChainLayer.audioNodes.outputMeter.fftSize = 256;
      SignalChainLayer.audioNodes.outputMeter.smoothingTimeConstant = 0.8;

      // Set initial gain values
      SignalChainLayer.audioNodes.inputGain.gain.value = SignalChainLayer.state.inputLevel;
      SignalChainLayer.audioNodes.outputGain.gain.value = SignalChainLayer.state.outputLevel;
      SignalChainLayer.audioNodes.feedbackGain.gain.value = SignalChainLayer.state.feedbackLevel;
      SignalChainLayer.audioNodes.mixGain.gain.value = SignalChainLayer.state.mixLevel;

      // Connect input chain
      SignalChainLayer.audioNodes.inputGain.connect(SignalChainLayer.audioNodes.inputLimiter);
      SignalChainLayer.audioNodes.inputLimiter.connect(SignalChainLayer.audioNodes.inputMeter);
      
      // Connect output chain
      SignalChainLayer.audioNodes.outputGain.connect(SignalChainLayer.audioNodes.outputMeter);
      SignalChainLayer.audioNodes.outputMeter.connect(context.destination);

      SignalChainLayer.audioSystem = {
        context: context,
        nodes: SignalChainLayer.audioNodes,
        isReady: true,
        sampleRate: 44100,
        bufferSize: 4096,
        maxLatency: 0.1
      };

      // Initialize audio buffers for loops
      BufferLayer.initializeLoopBuffers();
      
      console.log('✅ Enhanced audio system initialized');
      console.log(`📊 Sample Rate: ${context.sampleRate}Hz`);
      console.log(`🎚️ Buffer Size: ${SignalChainLayer.audioSystem.bufferSize} samples`);
      console.log(`⏱️ Base Latency: ${(SignalChainLayer.audioSystem.bufferSize / context.sampleRate * 1000).toFixed(1)}ms`);
      
      return true;

    } catch (error) {
      console.error('❌ Audio system failed:', error);
      return false;
    }
  },

  setInputLevel(level) {
    SignalChainLayer.state.inputLevel = level;
    
    // Apply to audio node with smooth transitions
    if (SignalChainLayer.audioSystem && SignalChainLayer.audioNodes.inputGain) {
      const currentTime = SignalChainLayer.audioSystem.context.currentTime;
      SignalChainLayer.audioNodes.inputGain.gain.linearRampToValueAtTime(
        level, currentTime + 0.01
      );
    }
    
    console.log(`🎙️ Input Level: ${Math.round(level * 100)}%`);
  },

  setOutputLevel(level) {
    SignalChainLayer.state.outputLevel = level;
    
    // Apply to audio node with smooth transitions
    if (SignalChainLayer.audioSystem && SignalChainLayer.audioNodes.outputGain) {
      const currentTime = SignalChainLayer.audioSystem.context.currentTime;
      SignalChainLayer.audioNodes.outputGain.gain.linearRampToValueAtTime(
        level, currentTime + 0.01
      );
    }
    
    console.log(`🔊 Output Level: ${Math.round(level * 100)}%`);
  },

  setMixLevel(level) {
    SignalChainLayer.state.mixLevel = level;
    
    // Apply to audio node with smooth transitions
    if (SignalChainLayer.audioSystem && SignalChainLayer.audioNodes.mixGain) {
      const currentTime = SignalChainLayer.audioSystem.context.currentTime;
      SignalChainLayer.audioNodes.mixGain.gain.linearRampToValueAtTime(
        level, currentTime + 0.01
      );
    }
    
    console.log(`🎛️ Mix Level: ${Math.round(level * 100)}% (${level === 0 ? 'ALL INPUT' : level === 1 ? 'ALL LOOP' : 'MIXED'})`);
  },

  setFeedbackLevel(level) {
    SignalChainLayer.state.feedbackLevel = level;
    
    // Apply to audio node with smooth transitions
    if (SignalChainLayer.audioSystem && SignalChainLayer.audioNodes.feedbackGain) {
      const currentTime = SignalChainLayer.audioSystem.context.currentTime;
      SignalChainLayer.audioNodes.feedbackGain.gain.linearRampToValueAtTime(
        level, currentTime + 0.01
      );
    }
    
    console.log(`🔄 Feedback Level: ${Math.round(level * 100)}% (${level === 1 ? 'INFINITE' : level === 0 ? 'NONE' : 'CONTROLLED'})`);
  },

  toggleMute() {
    SignalChainLayer.state.muted = !SignalChainLayer.state.muted;
    console.log(`🔊 Mute: ${SignalChainLayer.state.muted ? 'ON' : 'OFF'}`);
    BLKLayer.setButtonLED('mute', SignalChainLayer.state.muted ? 'red' : 'green');
  },

  // Audio processing stub
  processAudio(inputSample) {
    if (SignalChainLayer.state.muted) return 0;
    
    // Apply input level
    let signal = inputSample * SignalChainLayer.state.inputLevel;
    
    // Get loop playback sample
    const loopSample = BufferLayer.getPlaybackSample();
    
    // Mix dry and wet signals
    const dryLevel = 1 - SignalChainLayer.state.mixLevel;
    const wetLevel = SignalChainLayer.state.mixLevel;
    
    signal = (signal * dryLevel) + (loopSample * wetLevel);
    
    // Apply output level
    return signal * SignalChainLayer.state.outputLevel;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER LAYER - Record, Overdub, Insert, Multiply, Undo, NextLoop
// ═══════════════════════════════════════════════════════════════════════════════

const ControllerLayer = {
  state: {
    currentLoop: 0,
    totalLoops: 1,
    recording: false,
    overdubbing: false,
    multiplying: false,
    inserting: false,
    recordMode: 'TOG', // TOG, SUS, SAF
    overdubMode: 'TOG' // TOG, SUS, CON
  },

  initialize() {
    console.log('🎛️  Controller Layer initialized');
  },

  reset() {
    ControllerLayer.state.recording = false;
    ControllerLayer.state.overdubbing = false;
    ControllerLayer.state.multiplying = false;
    ControllerLayer.state.inserting = false;
    ControllerLayer.updateAllLEDs();
  },

  // Handle play mode button presses
  handlePlayButton(buttonName) {
    switch (buttonName) {
      case 'record':
        ControllerLayer.handleRecord();
        break;
      case 'overdub':
        ControllerLayer.handleOverdub();
        break;
      case 'multiply':
        ControllerLayer.handleMultiply();
        break;
      case 'insert':
        ControllerLayer.handleInsert();
        break;
      case 'mute':
        ControllerLayer.handleMute();
        break;
      case 'undo':
        ControllerLayer.handleUndo();
        break;
      case 'nextloop':
        ControllerLayer.handleNextLoop();
        break;
    }
  },

  // Record function
  handleRecord() {
    if (!ControllerLayer.state.recording) {
      ControllerLayer.state.recording = true;
      BufferLayer.startRecording();
      BLKLayer.setButtonLED('record', 'red');
      console.log('🔴 Recording started');
    } else {
      ControllerLayer.state.recording = false;
      BufferLayer.stopRecording();
      BLKLayer.setButtonLED('record', 'green');
      console.log('🟢 Recording stopped');
    }
  },

  // Overdub function
  handleOverdub() {
    if (!ControllerLayer.state.overdubbing) {
      ControllerLayer.state.overdubbing = true;
      BufferLayer.startOverdub();
      BLKLayer.setButtonLED('overdub', 'red');
      console.log('🔴 Overdub started');
    } else {
      ControllerLayer.state.overdubbing = false;
      BufferLayer.stopOverdub();
      BLKLayer.setButtonLED('overdub', 'green');
      console.log('🟢 Overdub stopped');
    }
  },

  // Multiply function
  handleMultiply() {
    if (!ControllerLayer.state.multiplying) {
      ControllerLayer.state.multiplying = true;
      BufferLayer.startMultiply();
      BLKLayer.setButtonLED('multiply', 'red');
      console.log('🔴 Multiply started');
    } else {
      ControllerLayer.state.multiplying = false;
      BufferLayer.stopMultiply();
      BLKLayer.setButtonLED('multiply', 'green');
      console.log('🟢 Multiply stopped');
    }
  },

  // Insert function
  handleInsert() {
    if (!ControllerLayer.state.inserting) {
      ControllerLayer.state.inserting = true;
      BufferLayer.startInsert();
      BLKLayer.setButtonLED('insert', 'red');
      console.log('🔴 Insert started');
    } else {
      ControllerLayer.state.inserting = false;
      BufferLayer.stopInsert();
      BLKLayer.setButtonLED('insert', 'green');
      console.log('🟢 Insert stopped');
    }
  },

  // Mute function
  handleMute() {
    SignalChainLayer.toggleMute();
  },

  // Undo function
  handleUndo() {
    BufferLayer.undo();
    console.log('↩️  Undo');
  },

  // NextLoop function
  handleNextLoop() {
    if (ControllerLayer.state.totalLoops > 1) {
      ControllerLayer.state.currentLoop = (ControllerLayer.state.currentLoop + 1) % ControllerLayer.state.totalLoops;
      BufferLayer.switchToLoop(ControllerLayer.state.currentLoop);
      console.log(`🔄 Switched to loop ${ControllerLayer.state.currentLoop + 1}`);
    }
  },

  // Mode setters
  setRecordMode(mode) {
    ControllerLayer.state.recordMode = mode;
    console.log(`🎛️  Record Mode: ${mode}`);
  },

  setOverdubMode(mode) {
    ControllerLayer.state.overdubMode = mode;
    console.log(`🎛️  Overdub Mode: ${mode}`);
  },

  // Update all status LEDs
  updateAllLEDs() {
    BLKLayer.setButtonLED('record', ControllerLayer.state.recording ? 'red' : 'green');
    BLKLayer.setButtonLED('overdub', ControllerLayer.state.overdubbing ? 'red' : 'green');
    BLKLayer.setButtonLED('multiply', ControllerLayer.state.multiplying ? 'red' : 'green');
    BLKLayer.setButtonLED('insert', ControllerLayer.state.inserting ? 'red' : 'green');
    BLKLayer.setButtonLED('mute', SignalChainLayer.state.muted ? 'red' : 'green');
    BLKLayer.setButtonLED('undo', BufferLayer.canUndo() ? 'green' : 'off');
    BLKLayer.setButtonLED('nextloop', ControllerLayer.state.totalLoops > 1 ? 'green' : 'off');
  },

  // Pure reducer functions for action bus
  reducer: {
    startRecording(action) {
      ControllerLayer.state.recording = true;
      BufferLayer.saveUndoState();
      dispatch({ type: 'LED_UPDATE', payload: { buttonName: 'record', state: 'red' } });
      console.log('🔴 Recording started');
    },

    stopRecording(action) {
      ControllerLayer.state.recording = false;
      dispatch({ type: 'LED_UPDATE', payload: { buttonName: 'record', state: 'green' } });
      console.log('🟢 Recording stopped');
    },

    startOverdub(action) {
      ControllerLayer.state.overdubbing = true;
      BufferLayer.saveUndoState();
      dispatch({ type: 'LED_UPDATE', payload: { buttonName: 'overdub', state: 'red' } });
      console.log('🔴 Overdub started');
    },

    stopOverdub(action) {
      ControllerLayer.state.overdubbing = false;
      dispatch({ type: 'LED_UPDATE', payload: { buttonName: 'overdub', state: 'green' } });
      console.log('🟢 Overdub stopped');
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUFFER LAYER - Loop Buffer, Cycles, Memory
// ═══════════════════════════════════════════════════════════════════════════════

const BufferLayer = {
  state: {
    loops: [],
    currentLoop: 0,
    totalLoops: 1,
    loopLengths: [0],
    playPosition: 0,
    recordPosition: 0,
    undoBuffer: null,
    sampleRate: 44100
  },

  initialize() {
    console.log('💾 Buffer Layer initialized');
    BufferLayer.setLoopCount(1);
  },

  setLoopCount(count) {
    BufferLayer.state.totalLoops = count;
    BufferLayer.state.loops = Array(count).fill(null).map(() => []);
    BufferLayer.state.loopLengths = Array(count).fill(0);
    console.log(`💾 Loop count set to ${count}`);
  },

  startRecording() {
    BufferLayer.state.recordPosition = 0;
    console.log('💾 Recording started');
  },

  stopRecording() {
    const currentLoop = BufferLayer.state.currentLoop;
    BufferLayer.state.loopLengths[currentLoop] = BufferLayer.state.recordPosition;
    BufferLayer.state.playPosition = 0;
    console.log(`💾 Recording stopped - Loop length: ${BufferLayer.state.recordPosition} samples`);
  },

  startOverdub() {
    // Save current state for undo
    BufferLayer.saveUndoState();
    console.log('💾 Overdub started');
  },

  stopOverdub() {
    console.log('💾 Overdub stopped');
  },

  startMultiply() {
    BufferLayer.saveUndoState();
    console.log('💾 Multiply started');
  },

  stopMultiply() {
    // Double the loop length and duplicate content
    const currentLoop = BufferLayer.state.currentLoop;
    const originalLength = BufferLayer.state.loopLengths[currentLoop];
    BufferLayer.state.loopLengths[currentLoop] = originalLength * 2;
    console.log('💾 Multiply stopped - Loop length doubled');
  },

  startInsert() {
    BufferLayer.saveUndoState();
    console.log('💾 Insert started');
  },

  stopInsert() {
    console.log('💾 Insert stopped');
  },

  switchToLoop(loopIndex) {
    if (loopIndex < BufferLayer.state.totalLoops) {
      BufferLayer.state.currentLoop = loopIndex;
      BufferLayer.state.playPosition = 0;
      console.log(`💾 Switched to loop ${loopIndex + 1}`);
    }
  },

  getPlaybackSample() {
    const currentLoop = BufferLayer.state.currentLoop;
    const loop = BufferLayer.state.loops[currentLoop];
    const length = BufferLayer.state.loopLengths[currentLoop];
    
    if (length === 0) return 0;
    
    const sample = loop[BufferLayer.state.playPosition] || 0;
    BufferLayer.state.playPosition = (BufferLayer.state.playPosition + 1) % length;
    
    return sample;
  },

  recordSample(sample) {
    const currentLoop = BufferLayer.state.currentLoop;
    const loop = BufferLayer.state.loops[currentLoop];
    
    if (ControllerLayer.state.recording) {
      loop[BufferLayer.state.recordPosition] = sample;
      BufferLayer.state.recordPosition++;
    }
    
    if (ControllerLayer.state.overdubbing) {
      const pos = BufferLayer.state.playPosition;
      const feedback = SignalChainLayer.state.feedbackLevel;
      loop[pos] = (loop[pos] || 0) * feedback + sample;
    }
  },

  saveUndoState() {
    const currentLoop = BufferLayer.state.currentLoop;
    BufferLayer.state.undoBuffer = {
      loop: [...BufferLayer.state.loops[currentLoop]],
      length: BufferLayer.state.loopLengths[currentLoop]
    };
  },

  undo() {
    if (BufferLayer.state.undoBuffer) {
      const currentLoop = BufferLayer.state.currentLoop;
      BufferLayer.state.loops[currentLoop] = [...BufferLayer.state.undoBuffer.loop];
      BufferLayer.state.loopLengths[currentLoop] = BufferLayer.state.undoBuffer.length;
      BufferLayer.state.undoBuffer = null;
      console.log('💾 Undo applied');
    }
  },

  canUndo() {
    return BufferLayer.state.undoBuffer !== null;
  },

  initializeLoopBuffers() {
    // Initialize audio buffers for the current loop count
    BufferLayer.state.loops = Array(BufferLayer.state.totalLoops).fill(null).map(() => []);
    BufferLayer.state.loopLengths = Array(BufferLayer.state.totalLoops).fill(0);
    console.log(`💾 Loop buffers initialized for ${BufferLayer.state.totalLoops} loops`);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FEEDBACK LAYER - LEDs, Loop Display
// ═══════════════════════════════════════════════════════════════════════════════

const FeedbackLayer = {
  state: {
    displayMode: 'play', // 'play' or 'parameter'
    displayText: '',
    loopTime: 0
  },

  // Display management (from echoplex-minimal.js)
  displayTimeout: null,
  defaultDisplayState: '.', // What display should show when not showing temporary messages
  isLoopRecorded: false,

  initialize() {
    console.log('💡 Feedback Layer initialized');
    FeedbackLayer.updatePlayDisplay();
    
    // Initialize AutoUndo LED (ensure it's used so build process keeps it)
    FeedbackLayer.setAutoUndoLED(false);
  },

  reset() {
    FeedbackLayer.state.displayMode = 'play';
    FeedbackLayer.updatePlayDisplay();
  },

  updatePlayDisplay() {
    if (SystemLayer.state.parameterMode) return;
    
    const currentLoop = ControllerLayer.state.currentLoop + 1;
    const totalLoops = ControllerLayer.state.totalLoops;
    const loopLength = BufferLayer.state.loopLengths[ControllerLayer.state.currentLoop];
    const timeSeconds = (loopLength / BufferLayer.state.sampleRate).toFixed(1);
    
    let status = '';
    if (ControllerLayer.state.recording) status = ' REC';
    else if (ControllerLayer.state.overdubbing) status = ' OVR';
    else if (ControllerLayer.state.multiplying) status = ' MUL';
    else if (ControllerLayer.state.inserting) status = ' INS';
    
    const newDisplayText = `Loop ${currentLoop}/${totalLoops} ${timeSeconds}s${status}`;
    
    // Only update if the display content actually changed
    if (FeedbackLayer.state.displayText !== newDisplayText) {
      FeedbackLayer.state.displayText = newDisplayText;
      FeedbackLayer.state.displayMode = 'play';
      console.log(`💡 Display: ${FeedbackLayer.state.displayText}`);
    }
  },

  updateParameterDisplay() {
    if (!SystemLayer.state.parameterMode) return;
    
    const rows = ['Timing', 'Switches', 'MIDI', 'Loop'];
    const currentRow = rows[SystemLayer.state.currentParameterRow];
    const params = ParameterLayer.getCurrentParameter();
    
    if (params) {
      const paramList = Object.entries(params).map(([key, value]) => `${key}:${value}`).join(' ');
      FeedbackLayer.state.displayText = `${currentRow} | ${paramList}`;
    } else {
      FeedbackLayer.state.displayText = currentRow;
    }
    
    FeedbackLayer.state.displayMode = 'parameter';
    console.log(`💡 Display: ${FeedbackLayer.state.displayText}`);
  },

  updateLoopTime() {
    if (!SystemLayer.state.parameterMode) {
      FeedbackLayer.updatePlayDisplay();
    }
  },

  // Display management methods (from echoplex-minimal.js)
  getDefaultDisplay() {
    // Return what the display should show when not showing temporary messages
    if (FeedbackLayer.isLoopRecorded) {
      // If there's a loop, show the loop time
      const currentLoop = ControllerLayer.state.currentLoop;
      const loopLength = BufferLayer.state.loopLengths[currentLoop];
      const timeSeconds = (loopLength / BufferLayer.state.sampleRate).toFixed(1);
      return timeSeconds;
    } else {
      // No loop recorded - display should be blank (just decimal point)
      return '.';
    }
  },

  updateDefaultDisplayState(newState) {
    // Update what the default display should show
    FeedbackLayer.defaultDisplayState = newState;
    
    // If not currently showing a temporary message, update display immediately
    if (!FeedbackLayer.displayTimeout) {
      FeedbackLayer.renderDisplay();
    }
  },

  renderDisplay() {
    // Actually update the DOM element
    if (BLKLayer.elements.loopDisplay) {
      BLKLayer.elements.loopDisplay.textContent = FeedbackLayer.defaultDisplayState;
    }
  },

  showTemporaryMessage(message, duration = 2000) {
    // Clear any existing timeout
    if (FeedbackLayer.displayTimeout) {
      clearTimeout(FeedbackLayer.displayTimeout);
    }

    // Show temporary message
    if (BLKLayer.elements.loopDisplay) {
      BLKLayer.elements.loopDisplay.textContent = message;
    }

    // Set timeout to revert to default display
    FeedbackLayer.displayTimeout = setTimeout(() => {
      FeedbackLayer.revertToDefaultDisplay();
    }, duration);
  },

  revertToDefaultDisplay() {
    // Get current default state and display it
    FeedbackLayer.defaultDisplayState = FeedbackLayer.getDefaultDisplay();
    FeedbackLayer.renderDisplay();
    FeedbackLayer.displayTimeout = null;
  },

  updateMultipleDisplay(text) {
    if (BLKLayer.elements.multipleDisplay) {
      // Clear any existing content except tempo dots and AutoUndo LED
      const tempoDotLeft = BLKLayer.elements.multipleDisplay.querySelector('.tempo-dot-left');
      const tempoDotRight = BLKLayer.elements.multipleDisplay.querySelector('.tempo-dot-right');
      const autoUndoLED = BLKLayer.elements.multipleDisplay.querySelector('.auto-undo-led');
      
      BLKLayer.elements.multipleDisplay.textContent = text;
      
      // Restore tempo dots and AutoUndo LED
      if (tempoDotLeft) BLKLayer.elements.multipleDisplay.appendChild(tempoDotLeft);
      if (tempoDotRight) BLKLayer.elements.multipleDisplay.appendChild(tempoDotRight);
      if (autoUndoLED) BLKLayer.elements.multipleDisplay.appendChild(autoUndoLED);
    }
  },

  setAutoUndoLED(active) {
    // Set AutoUndo LED state (ensures it's used by build process)
    const autoUndoLED = BLKLayer.elements.autoUndoLED;
    if (autoUndoLED) {
      if (active) {
        autoUndoLED.classList.add('active');
      } else {
        autoUndoLED.classList.remove('active');
      }
      console.log(`💡 AutoUndo LED: ${active ? 'ON' : 'OFF'}`);
    }
  },

  // Pure reducer functions for action bus
  reducer: {
    displayUpdate(action) {
      const { type, content, duration } = action.payload;
      
      switch (type) {
        case 'temporary':
          FeedbackLayer.showTemporaryMessage(content, duration);
          break;
        case 'multiple':
          FeedbackLayer.updateMultipleDisplay(content);
          break;
        case 'parameter':
          FeedbackLayer.updateParameterDisplay();
          break;
        default:
          FeedbackLayer.updatePlayDisplay();
      }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM INTEGRATION - Main Event Loop and Initialization
// ═══════════════════════════════════════════════════════════════════════════════

const EchoplexSystem = {
  async initialize() {
    console.log('🎛️  ECHOPLEX DIGITAL PRO PLUS STARTING UP');
    console.log('='.repeat(50));
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
    }
    
    // Initialize all layers in order
    await SystemLayer.power.startup();
    
    // Set up audio processing loop (stub)
    EchoplexSystem.startAudioLoop();
    
    // Set up display update loop
    setInterval(() => {
      FeedbackLayer.updateLoopTime();
      ControllerLayer.updateAllLEDs();
    }, 100);
  },

  startAudioLoop() {
    // Audio processing with WebAudio implementation
    console.log('🎵 Audio processing started');
    
    // Use ScriptProcessorNode for real-time audio processing
    if (SignalChainLayer.audioSystem && SignalChainLayer.audioSystem.context) {
      const bufferSize = 4096;
      const processor = SignalChainLayer.audioSystem.context.createScriptProcessor(bufferSize, 1, 1);
      
      processor.onaudioprocess = (event) => {
        if (SystemLayer.state.power) {
          const inputBuffer = event.inputBuffer.getChannelData(0);
          const outputBuffer = event.outputBuffer.getChannelData(0);
          
          for (let i = 0; i < bufferSize; i++) {
            const inputSample = inputBuffer[i];
            const outputSample = SignalChainLayer.processAudio(inputSample);
            BufferLayer.recordSample(inputSample);
            outputBuffer[i] = outputSample;
          }
        }
      };
      
      // Connect processor to enable processing
      processor.connect(SignalChainLayer.audioSystem.context.destination);
      
      console.log('🎵 Real-time audio processing enabled');
    } else {
      console.warn('⚠️ Audio system not ready, using fallback timer');
      
      // Fallback to timer-based processing
      setInterval(() => {
        if (SystemLayer.state.power) {
          const inputSample = 0; // Get from audio input
          const outputSample = SignalChainLayer.processAudio(inputSample);
          BufferLayer.recordSample(inputSample);
          // Send outputSample to audio output
        }
      }, 1000 / 44100); // 44.1kHz sample rate
    }
  },

  // Public API for external control
  pressButton(buttonName) {
    BLKLayer.handleButtonPress(buttonName);
  },

  releaseButton(buttonName) {
    BLKLayer.handleButtonRelease(buttonName);
  },

  turnKnob(knobName, value) {
    BLKLayer.handleKnobChange(knobName, value);
  },

  getState() {
    return {
      system: SystemLayer.state,
      blk: BLKLayer.state,
      parameters: ParameterLayer.state,
      controller: ControllerLayer.state,
      buffer: BufferLayer.state,
      feedback: FeedbackLayer.state
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT AND INITIALIZE
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION AND STARTUP
// ═══════════════════════════════════════════════════════════════════════════════

// Initialize when page loads
let echoplexSystem;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEchoplex);
} else {
  initializeEchoplex();
}

async function initializeEchoplex() {
  try {
    console.log('🎛️ Initializing Echoplex Digital Pro Plus - Full System');
    
    // Initialize the system
    await EchoplexSystem.initialize();
    
    // Make globally available
    window.EchoplexSystem = EchoplexSystem;
    echoplexSystem = EchoplexSystem;
    
    console.log('✅ Echoplex System loaded successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Echoplex:', error);
  }
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EchoplexSystem;
} else if (typeof window !== 'undefined') {
  window.EchoplexSystem = EchoplexSystem;
}

// Development testing functions
if (typeof window !== 'undefined') {
  window.testEchoplex = {
    powerOn: () => EchoplexSystem.pressButton('power'),
    enterParamMode: () => EchoplexSystem.pressButton('parameter'),
    startRecording: () => EchoplexSystem.pressButton('record'),
    startOverdub: () => EchoplexSystem.pressButton('overdub'),
    setFeedback: (level) => EchoplexSystem.turnKnob('feedback', level),
    getState: () => EchoplexSystem.getState()
  };
}

console.log('🎛️  Echoplex System Ready');
console.log('📋 Use window.testEchoplex for testing functions');