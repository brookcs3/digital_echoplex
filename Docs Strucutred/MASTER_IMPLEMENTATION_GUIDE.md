# DIGITAL ECHOPLEX - MASTER IMPLEMENTATION GUIDE

## 🎯 AGENT ONBOARDING GUIDE

**Purpose**: This guide provides incoming AI agents with complete understanding of the Digital Echoplex project's implementation details, current challenges, and technical architecture.

---

## 🚨 CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION

### Priority 1: Framework Scoping Crisis
**Issue**: Astro CSS scoping mechanism (`astro-j7pv25f6`) conflicts with hardware emulation
- **Files Affected**: `src/pages/index.astro`, `dist/index.html`, `public/scripts/echoplex-pro.js`
- **Impact**: 1000+ instances causing visual/audio state desynchronization
- **Primary Symptom**: Record button toggle failure - LED doesn't update despite state change
- **Evidence**: `this.state.isRecording` updates correctly but visual feedback fails

**Technical Root Cause**:
```javascript
// PROBLEMATIC: Hard-coded scoped class manipulation
recordLed.className = 'status-led astro-j7pv25f6 red';   // Start recording
recordLed.className = 'status-led astro-j7pv25f6 green'; // Stop recording
```

**Immediate Solutions**:
1. **CSS Variables Approach** (Fastest fix):
```css
.status-led.astro-j7pv25f6 {
    background: var(--led-color, #333);
    box-shadow: var(--led-glow, none);
}
```
```javascript
recordLed.style.setProperty('--led-color', 'red');
```

2. **Data Attribute State Management**:
```javascript
recordLed.setAttribute('data-state', 'recording');
```
```css
.status-led.astro-j7pv25f6[data-state="recording"] { background: red; }
```

### Priority 2: State Synchronization Issues
**Issue**: JavaScript state vs CSS visual state desynchronization
- **Location**: `handleToggleRecord()` function in `echoplex-pro.js`
- **Pattern**: State updates succeed but visual feedback fails
- **Impact**: Hardware emulation feels "broken" to users
- **Debug Evidence**: Console shows correct state changes but LEDs don't update

### Priority 3: Performance Bottlenecks
**Issue**: Frequent `setInterval`/`setTimeout` causing performance degradation
- **Location**: LED blinking, display updates, visual tempo guides
- **Impact**: Potential audio latency and visual stuttering
- **Solution**: Migrate to `requestAnimationFrame` for smooth 60fps updates

---

## 🏗️ ARCHITECTURE DEEP DIVE

### Core File Structure
```
Digital Echoplex/
├── src/
│   ├── lib/
│   │   ├── audio-engine.ts       # Main audio processing (Tone.js)
│   │   └── types.ts             # TypeScript definitions
│   ├── pages/
│   │   └── index.astro          # Main interface (generates scoped CSS)
│   └── styles/                  # SCSS styling
├── public/
│   └── scripts/
│       └── echoplex-pro.js      # 23,000+ line main implementation
└── dist/                        # Build output (scoped CSS applied)
```

### Key Classes and Systems

#### 1. EchoplexDigitalPro Main Class
**Location**: `public/scripts/echoplex-pro.js`
**Purpose**: Central hardware emulation controller
**Key Methods**:
- `initializeElements()` - DOM element initialization
- `setupEventListeners()` - Button/knob event binding
- `handleToggleRecord()` - Record button logic (CURRENTLY BROKEN)
- `updateLoopTimeDisplay()` - Display system management
- `processParameterEdit()` - Parameter matrix handling

#### 2. Sustain Action System
**Purpose**: Implement held-button functionality (20 features)
```javascript
this.sustainActionSystem = {
    buttonStates: {
        record: { pressed: false, startTime: 0, sustainActive: false },
        // ... other buttons
    },
    sustainThreshold: 100, // ms to activate sustain mode
    actions: {
        SUSRecord: this.handleSUSRecord.bind(this),
        // ... other sustain actions
    }
};
```

#### 3. MIDI VirtualButtons System
**Purpose**: Complete MIDI Note/Controller emulation
```javascript
this.midiVirtualButtonsSystem = {
    controlSource: 'NOTES', // or 'CONTROLLERS'
    sourceNumber: 36, // Starting note/controller
    buttonMappings: {
        36: 'Record', 37: 'Overdub', 38: 'Multiply',
        // ... complete mapping
    }
};
```

#### 4. Parameter Matrix System
**Purpose**: 32 parameters across 4 rows
```javascript
this.parameterMatrix = {
    P1_TIMING: ['LoopDelayMode', 'QuantizeMode', '8thsPerCycle', ...],
    P2_SWITCHES: ['RecordMode', 'OverdubMode', 'RoundMode', ...],
    P3_MIDI: ['MidiChannel', 'ControlSource', 'SourceNumber', ...],
    P4_LOOPS: ['MoreLoops', 'AutoRecord', 'LoopCopy', ...]
};
```

### Audio Processing Chain
```
Microphone Input → Input Gain → [Recorder/Analyser/Mixer] → Feedback Delay → Output Gain → Destination
                                        ↑
                                Loop Playback
```

**Web Audio Nodes**:
- `MediaStreamAudioSourceNode` - Microphone input
- `GainNode` - Input/Output/Feedback control
- `AnalyserNode` - Level monitoring and visualization
- `AudioBufferSourceNode` - Loop playback
- `ConvolverNode` - Reverb effects (for Reverse function)
- `AudioWorkletNode` - Real-time DSP processing

---

## 🔧 IMPLEMENTATION DETAILS

### Button Event Handling System
**Current Pattern**:
```javascript
setupEventListeners() {
    // Touch and mouse event support
    button.addEventListener('mousedown', (e) => this.handleButtonPress(buttonName, e));
    button.addEventListener('mouseup', (e) => this.handleButtonRelease(buttonName, e));
    button.addEventListener('dblclick', (e) => this.handleDoubleClick(buttonName, e));
}
```

**State Management Pattern**:
```javascript
handleToggleRecord(recordLed) {
    if (this.state.isRecording) {
        this.stopRecording();
        // PROBLEM: Visual update may fail due to scoping
        recordLed.className = 'status-led astro-j7pv25f6 green';
    } else {
        this.startRecording(recordLed);
        recordLed.className = 'status-led astro-j7pv25f6 red';
    }
}
```

### Visual Feedback Implementation
**LED Control Pattern**:
```javascript
updateStatusLED(ledElement, state, color) {
    // Current problematic approach
    ledElement.className = `status-led astro-j7pv25f6 ${color}`;
    
    // RECOMMENDED: Data attribute approach
    ledElement.setAttribute('data-hw-state', state);
    ledElement.setAttribute('data-color', color);
}
```

**Display Update System**:
```javascript
updateLoopTimeDisplay(displayText, isTemporary = false) {
    const display = this.elements.loopTimeDisplay;
    display.textContent = displayText;
    
    if (isTemporary) {
        setTimeout(() => {
            display.textContent = this.getCurrentLoopTime();
        }, 1500);
    }
}
```

### Parameter Editing System
**Navigation Pattern**:
```javascript
handleParameterButtonPress() {
    this.parameterEditingSystem.currentRow = 
        (this.parameterEditingSystem.currentRow + 1) % 4;
    this.updateParameterLEDs();
    this.showParameterRow();
}
```

**Value Cycling**:
```javascript
cycleParameterValue(row, parameter) {
    const currentValue = this.parameters[row][parameter];
    const possibleValues = this.getParameterValues(row, parameter);
    const nextIndex = (possibleValues.indexOf(currentValue) + 1) % possibleValues.length;
    this.parameters[row][parameter] = possibleValues[nextIndex];
}
```

---

## 🎨 VISUAL SYSTEM ARCHITECTURE

### CSS Architecture (Astro Scoped)
```css
/* Generated by Astro framework */
.status-led.astro-j7pv25f6 {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--led-color, #333);
    transition: all 0.1s ease;
}

.status-led.astro-j7pv25f6.red { background: #ff0000; }
.status-led.astro-j7pv25f6.green { background: #00ff00; }
.status-led.astro-j7pv25f6.orange { background: #ffa500; }
```

### LED State Definitions
- **Unlit (#333)**: Function unavailable or inactive
- **Green**: Ready state, normal operation
- **Red**: Active state, recording/processing
- **Orange**: Alternate function or warning state
- **Blinking**: Timing indicators, quantization waiting

### Display Systems
1. **LoopTime Display**: Primary 6-character display
2. **Multiple Display**: Secondary parameter/count display  
3. **Command Display**: Shows command abbreviations during operations
4. **Quantizing Display**: Shows "ooo" during quantized waiting

---

## 🎵 AUDIO SYSTEM IMPLEMENTATION

### Initialization Pattern
```javascript
async initializeAudioSystem() {
    try {
        // Audio context setup
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Microphone access
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.inputSource = this.audioContext.createMediaStreamSource(this.stream);
        
        // Audio processing chain
        this.setupAudioChain();
        
        return true;
    } catch (error) {
        console.error('Audio system initialization failed:', error);
        return false;
    }
}
```

### Loop Management
```javascript
startRecording() {
    if (!this.audioContext || this.audioContext.state !== 'running') {
        console.error('Audio context not ready');
        return false;
    }
    
    this.state.isRecording = true;
    this.recordStartTime = this.audioContext.currentTime;
    
    // Start audio recording
    this.startAudioRecording();
    
    // Update visual feedback
    this.updateRecordingUI();
    
    return true;
}
```

### Real-Time Effects
```javascript
// Reverse Implementation
toggleReverse() {
    if (this.currentLoop && this.currentLoop.buffer) {
        this.reverseHalfSpeedSystem.currentStates.isReversed = 
            !this.reverseHalfSpeedSystem.currentStates.isReversed;
            
        // Audio processing
        this.updatePlaybackDirection();
        
        // Visual feedback
        this.updateCommandDisplay('rE');
    }
}

// Half Speed Implementation  
toggleHalfSpeed() {
    this.reverseHalfSpeedSystem.currentStates.isHalfSpeed = 
        !this.reverseHalfSpeedSystem.currentStates.isHalfSpeed;
        
    const rate = this.reverseHalfSpeedSystem.currentStates.isHalfSpeed ? 0.5 : 1.0;
    this.updatePlaybackRate(rate);
    this.updateCommandDisplay('H.SP');
}
```

---

## 🎛️ MIDI IMPLEMENTATION

### Web MIDI API Integration
```javascript
async initializeMIDI() {
    try {
        this.midiAccess = await navigator.requestMIDIAccess();
        
        // Input handling
        for (let input of this.midiAccess.inputs.values()) {
            input.onmidimessage = this.handleMIDIMessage.bind(this);
        }
        
        return true;
    } catch (error) {
        console.error('MIDI initialization failed:', error);
        return false;
    }
}
```

### MIDI Command Processing
```javascript
handleMIDIMessage(message) {
    const [status, data1, data2] = message.data;
    const command = status & 0xF0;
    const channel = status & 0x0F;
    
    switch (command) {
        case 0x90: // Note On
            this.handleMIDINote(data1, data2);
            break;
        case 0xB0: // Control Change
            this.handleMIDIController(data1, data2);
            break;
        case 0xC0: // Program Change
            this.handleMIDIProgram(data1);
            break;
    }
}
```

### VirtualButtons Implementation
```javascript
handleMIDINote(note, velocity) {
    const buttonFunction = this.midiVirtualButtonsSystem.buttonMappings[note];
    
    if (buttonFunction) {
        if (velocity > 0) {
            this.handleButtonPress(buttonFunction);
        } else {
            this.handleButtonRelease(buttonFunction);
        }
    }
}
```

---

## 🐛 DEBUGGING AND DIAGNOSTIC TOOLS

### Built-in Debug System
**Location**: Automatically injected into `index.astro`
**Features**:
- Real-time debug console (top-right corner)
- Automated diagnostic suite
- Error tracking and logging
- Export functionality for bug reports

**Usage**:
```javascript
// Browser console commands
window.echoplexDebug.log('Custom message');
window.echoplexDebug.error('Error message', error);
window.echoplexDebug.runDiagnostics();
window.echoplexDebug.exportLogs();
```

### Common Debug Patterns
```javascript
// State debugging
console.log('🔄 Toggle Record: isRecording=' + this.state.isRecording);
console.log('🔴 Starting recording...');
console.log('✅ Recording started, LED red');

// Element validation
if (!this.elements.recordBtn) {
    console.error('❌ Record button element not found');
    return false;
}

// Performance monitoring
const startTime = performance.now();
// ... operation
const endTime = performance.now();
console.log(`⏱️ Operation took ${endTime - startTime} milliseconds`);
```

---

## 🚀 QUICK START FOR NEW AGENTS

### 1. Understanding Current State
**What Works**:
- Audio engine initialization and processing
- Basic button event handling
- Parameter matrix navigation
- MIDI input processing
- Visual tempo guides
- Loop recording and playback (when not affected by scoping issues)

**What's Broken**:
- Record button toggle (primary issue)
- LED state synchronization
- Some visual feedback updates
- Reliable state persistence

### 2. First Tasks for New Agents
1. **Reproduce Record Button Issue**:
   - Load the application
   - Click Record button multiple times rapidly
   - Observe LED state vs audio state desynchronization

2. **Implement CSS Variable Fix**:
   - Update CSS to use custom properties
   - Replace className manipulation with setProperty calls
   - Test Record button reliability

3. **Validate State Synchronization**:
   - Ensure `this.state.isRecording` matches visual feedback
   - Test all button state transitions
   - Verify quantized operations work correctly

### 3. Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Format code
npm run format
```

### 4. Key Files to Examine First
1. `public/scripts/echoplex-pro.js` - Main implementation (lines 1000-1200 for Record button)
2. `src/pages/index.astro` - Interface and scoped CSS generation
3. `dist/index.html` - Built output showing scoping application
4. `src/lib/audio-engine.ts` - Core audio processing

---

## 📚 REFERENCE DOCUMENTATION

### Hardware Specification Documents
- **Original Manual**: Complete Echoplex Digital Pro Plus documentation
- **MIDI Implementation**: All 45+ MIDI commands with examples
- **Parameter Matrix**: 32 parameters across 4 rows with value ranges
- **Visual Feedback**: LED colors, timing, and display behaviors

### Implementation Standards
- **Code Quality**: JSDoc comments, error handling, resource cleanup
- **Performance**: <10ms audio latency, 60fps visual updates
- **Authenticity**: 100% hardware behavior matching
- **Compatibility**: Modern browsers with graceful degradation

### Testing Requirements
- **Feature Validation**: Each feature tested against hardware specs
- **Integration Testing**: Cross-feature compatibility verification
- **Performance Testing**: Real-time audio processing validation
- **User Testing**: Musician feedback and usability validation

---

## 🎯 SUCCESS METRICS

### Immediate Success (Next Session)
- ✅ Record button toggles reliably 100 times without failure
- ✅ LED states synchronize with audio states
- ✅ No visual/audio state desynchronization

### Short-term Success (Next Week)
- ✅ All button interactions work flawlessly
- ✅ Parameter editing system fully functional
- ✅ MIDI integration working across all commands
- ✅ Performance optimized for smooth operation

### Long-term Success (Next Month)
- ✅ Complete mobile compatibility
- ✅ Audio export functionality
- ✅ Advanced MIDI features
- ✅ User testing validation from musicians

---

## 💡 IMPLEMENTATION WISDOM

### Do's
- ✅ **Always test Record button first** - it's the primary functionality indicator
- ✅ **Use systematic approach** - the project's success comes from methodical implementation
- ✅ **Preserve audio quality** - maintain <10ms latency for professional use
- ✅ **Document everything** - comprehensive docs are critical for maintenance
- ✅ **Test across browsers** - ensure compatibility with major browsers

### Don'ts
- ❌ **Don't break working audio** - visual issues are better than audio failures
- ❌ **Don't assume framework behavior** - Astro scoping can be unpredictable
- ❌ **Don't optimize prematurely** - fix functionality first, then optimize
- ❌ **Don't ignore the debug system** - use built-in diagnostics extensively
- ❌ **Don't skip validation** - test each change against hardware behavior

### Critical Patterns to Follow
1. **Hardware-First Thinking**: Always ask "How does the original hardware behave?"
2. **State Synchronization**: Visual feedback must match audio processing state  
3. **Performance Awareness**: Real-time audio requires consistent performance
4. **Systematic Implementation**: Build features completely before moving to next
5. **Comprehensive Testing**: Validate every feature against specifications

---

## 🔚 AGENT HANDOFF CHECKLIST

Before starting work, new agents should:
- [ ] Read both master documentation files completely
- [ ] Load the application and reproduce Record button issue
- [ ] Run built-in diagnostics and review debug output  
- [ ] Examine `echoplex-pro.js` lines 1000-1200 (Record button logic)
- [ ] Understand Astro scoping mechanism and its conflicts
- [ ] Review CLAUDE.md for project-specific guidelines
- [ ] Test audio initialization and basic loop recording
- [ ] Verify MIDI system functionality if available

**Success Criteria**: Agent can articulate the scoping conflict issue and propose specific technical solutions before beginning implementation work.

---

*Last Updated: 2025-07-01*  
*Implementation Guide Version: 1.0*  
*Agent Onboarding Ready: ✅*

---

## 📞 EMERGENCY CONTACTS

**If Critical Issues Arise**:
1. **Check Debug Console**: Top-right panel for real-time diagnostics
2. **Export Debug Report**: Use `window.echoplexDebug.exportLogs()`
3. **Rollback Strategy**: All major changes documented with rollback instructions
4. **Reference Documentation**: All 20+ analysis documents available in `/Docs Structured/`

**Remember**: The systematic approach that created 23,000+ lines of working code is the same approach that will solve the remaining challenges. Stay methodical, test frequently, and maintain the high quality standards that have made this project successful.