# Echoplex Digital Pro Plus - WebAudioAPI Architecture Synthesis

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Architecture](#core-architecture)
3. [Audio Graph Design](#audio-graph-design)
4. [Loop Buffer System](#loop-buffer-system)
5. [Timing & Synchronization Engine](#timing--synchronization-engine)
6. [Parameter Processing](#parameter-processing)
7. [MIDI Integration](#midi-integration)
8. [State Management](#state-management)
9. [Performance Optimization](#performance-optimization)
10. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

Based on comprehensive analysis of the Echoplex Digital Pro Plus hardware specifications, timing documents, and existing skeleton implementation, this document synthesizes a complete WebAudioAPI architecture that preserves the musical integrity and real-time performance characteristics of the original hardware.

### Key Design Principles

1. **Sample-Accurate Timing**: All loop boundaries, quantization points, and function execution must be sample-accurate
2. **Zero-Latency Loop Playback**: Seamless loop transitions without gaps or clicks
3. **Hardware-Faithful Parameter Behavior**: Exact replication of parameter matrix functionality and value ranges
4. **Real-Time Performance**: <10ms total latency for live performance use
5. **Musical Synchronization**: Robust MIDI clock sync with visual tempo guidance

---

## Core Architecture

### Layer-Based System

```
┌─────────────────────────────────────────────────────────────────┐
│                     ACTION BUS (Central Dispatch)              │
├─────────────────────────────────────────────────────────────────┤
│ SystemLayer     │ BLKLayer        │ ParameterLayer              │
│ • Power         │ • Button LEDs   │ • 7×4 Matrix               │
│ • Parameter     │ • Knobs         │ • Timing/Switches          │
│ • MIDI Sync     │ • Immediate FB  │ • MIDI/Loop Config         │
├─────────────────────────────────────────────────────────────────┤
│ ControllerLayer │ BufferLayer     │ FeedbackLayer              │
│ • Record/Play   │ • Loop Memory   │ • Display Updates          │
│ • State Machine │ • Undo Stack    │ • LED Management           │
│ • Quantization  │ • Multiple      │ • Visual Feedback          │
├─────────────────────────────────────────────────────────────────┤
│ SignalChainLayer                  │ AudioWorkletProcessor      │
│ • Input/Output Levels             │ • Real-time Audio          │
│ • Mix/Feedback Control            │ • Sample-accurate Timing   │
│ • Audio Graph Management          │ • Loop Buffer Access       │
└─────────────────────────────────────────────────────────────────┘
```

### Audio Processing Flow

```
Input → Limiter → Loop Buffer ↴
                               ↓
Output ← Mix ← Feedback ← Delay Buffer
```

---

## Audio Graph Design

### Primary Audio Chain

```javascript
// Core WebAudioAPI Node Graph
const audioGraph = {
  // Input Chain
  inputNode: context.createGain(),           // Input level control
  inputLimiter: context.createDynamicsCompressor(), // Prevent clipping
  
  // Loop Processing (AudioWorklet)
  loopProcessor: new AudioWorkletNode(context, 'echoplex-processor'),
  
  // Feedback Chain  
  feedbackGain: context.createGain(),        // Feedback level
  feedbackDelay: context.createDelay(10.0),  // Max 10s delay
  feedbackFilter: context.createBiquadFilter(), // Tone shaping
  
  // Output Chain
  mixGain: context.createGain(),             // Wet/dry mix
  outputGain: context.createGain(),          // Master output
  
  // Monitoring
  analyser: context.createAnalyser(),        // Level monitoring
  
  // Connections
  connect() {
    // Input → Loop Processing
    inputNode.connect(inputLimiter);
    inputLimiter.connect(loopProcessor);
    
    // Feedback Loop
    loopProcessor.connect(feedbackGain);
    feedbackGain.connect(feedbackDelay);
    feedbackDelay.connect(feedbackFilter);
    feedbackFilter.connect(loopProcessor, 0, 1); // Feedback input
    
    // Output Mix
    inputNode.connect(mixGain);               // Dry signal
    loopProcessor.connect(mixGain);           // Wet signal
    mixGain.connect(outputGain);
    outputGain.connect(context.destination);
    
    // Monitoring
    outputGain.connect(analyser);
  }
};
```

### AudioWorklet Processor

```javascript
// echoplex-processor.js
class EchoplexProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.loopBuffers = new Array(8).fill(null).map(() => new Float32Array(0));
    this.currentLoop = 0;
    this.playPosition = 0;
    this.recordPosition = 0;
    this.isRecording = false;
    this.isOverdubbing = false;
    this.loopLength = 0;
    
    // Timing state
    this.quantizeMode = 'off';
    this.nextQuantizePoint = 0;
    this.pendingFunctions = [];
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0][0];
    const output = outputs[0][0];
    const feedbackInput = inputs[1] ? inputs[1][0] : null;
    
    if (!input || !output) return true;
    
    const currentTime = this.currentFrame / sampleRate;
    this.processPendingFunctions(currentTime);
    
    for (let i = 0; i < output.length; i++) {
      let sample = 0;
      
      // Record input
      if (this.isRecording && this.recordPosition < this.loopBuffers[this.currentLoop].length) {
        this.loopBuffers[this.currentLoop][this.recordPosition] = input[i];
        this.recordPosition++;
      }
      
      // Overdub (mix with existing)
      if (this.isOverdubbing && this.recordPosition < this.loopBuffers[this.currentLoop].length) {
        this.loopBuffers[this.currentLoop][this.recordPosition] = 
          (this.loopBuffers[this.currentLoop][this.recordPosition] * 0.5) + (input[i] * 0.5);
        this.recordPosition++;
      }
      
      // Play loop
      if (this.loopLength > 0) {
        sample = this.loopBuffers[this.currentLoop][this.playPosition];
        this.playPosition = (this.playPosition + 1) % this.loopLength;
      }
      
      // Add feedback
      if (feedbackInput && feedbackInput[i]) {
        sample += feedbackInput[i];
      }
      
      output[i] = sample;
      this.currentFrame++;
    }
    
    return true;
  }
  
  processPendingFunctions(currentTime) {
    this.pendingFunctions = this.pendingFunctions.filter(func => {
      if (currentTime >= func.executeTime) {
        this.executeFunction(func);
        return false;
      }
      return true;
    });
  }
}
```

---

## Loop Buffer System

### Memory Architecture

```javascript
class LoopBufferSystem {
  constructor(sampleRate, maxLoopTime = 198) {
    this.sampleRate = sampleRate;
    this.maxSamples = Math.floor(maxLoopTime * sampleRate);
    
    // Multiple loop buffers (8 total)
    this.loops = new Array(8).fill(null).map(() => ({
      buffer: new Float32Array(this.maxSamples),
      length: 0,
      cycles: 1,
      startPoint: 0,
      isActive: false
    }));
    
    this.currentLoop = 0;
    this.playPosition = 0;
    this.recordPosition = 0;
    
    // Undo system
    this.undoStack = [];
    this.maxUndoDepth = 8;
    
    // Timing references
    this.loopStartTime = 0;
    this.cycleDuration = 0;
    this.subCycleDuration = 0;
  }
  
  // Critical: Sample-accurate loop boundaries
  getLoopPosition(sampleTime) {
    if (this.loops[this.currentLoop].length === 0) return 0;
    return sampleTime % this.loops[this.currentLoop].length;
  }
  
  // Memory management for long sessions
  compressUndoStack() {
    if (this.undoStack.length > this.maxUndoDepth) {
      this.undoStack = this.undoStack.slice(-this.maxUndoDepth);
    }
  }
  
  // AutoUndo detection
  detectAutoUndo(loopIndex) {
    const loop = this.loops[loopIndex];
    const silenceThreshold = 0.001;
    let silentSamples = 0;
    
    for (let i = 0; i < loop.length; i++) {
      if (Math.abs(loop.buffer[i]) < silenceThreshold) {
        silentSamples++;
      }
    }
    
    // If >95% silence, trigger AutoUndo
    return (silentSamples / loop.length) > 0.95;
  }
}
```

### Loop State Transitions

```javascript
const LoopStateMachine = {
  states: {
    EMPTY: 'empty',
    RECORDING: 'recording', 
    PLAYING: 'playing',
    OVERDUBBING: 'overdubbing',
    MULTIPLYING: 'multiplying',
    INSERTING: 'inserting',
    MUTED: 'muted',
    REVERSE: 'reverse'
  },
  
  transitions: {
    [EMPTY]: {
      record: RECORDING
    },
    [RECORDING]: {
      record: PLAYING,        // Stop recording
      overdub: OVERDUBBING,   // Switch to overdub
      multiply: MULTIPLYING,  // Multiply while recording
      undo: EMPTY            // Cancel recording
    },
    [PLAYING]: {
      record: RECORDING,      // New overdub or replace
      overdub: OVERDUBBING,   // Start overdubbing
      multiply: MULTIPLYING,  // Multiply current loop
      insert: INSERTING,      // Insert silence/content
      mute: MUTED,           // Mute playback
      reverse: REVERSE       // Reverse playback
    }
    // ... complete state machine
  },
  
  validateTransition(from, to) {
    return this.transitions[from] && this.transitions[from][to];
  }
};
```

---

## Timing & Synchronization Engine

### Quantization System

```javascript
class QuantizationEngine {
  constructor(audioContext) {
    this.context = audioContext;
    this.quantizeMode = 'off'; // 'off', 'loop', 'cycle', '8th'
    this.pendingFunctions = [];
    this.loopStartTime = 0;
    this.cycleDuration = 0;
    this.eighthsPerCycle = 8;
  }
  
  // Core quantization calculator
  getNextQuantizationPoint(mode = this.quantizeMode) {
    const currentTime = this.context.currentTime;
    const currentPos = this.getCurrentLoopPosition();
    
    switch (mode) {
      case 'loop':
        const nextLoopStart = this.loopStartTime + 
          Math.ceil((currentTime - this.loopStartTime) / this.getLoopDuration()) * this.getLoopDuration();
        return nextLoopStart;
        
      case 'cycle':
        const cyclesSinceStart = Math.floor(currentPos / this.cycleDuration);
        return this.loopStartTime + (cyclesSinceStart + 1) * this.cycleDuration;
        
      case '8th':
        const subCycleDuration = this.cycleDuration / this.eighthsPerCycle;
        const subCyclesSinceStart = Math.floor(currentPos / subCycleDuration);
        return this.loopStartTime + (subCyclesSinceStart + 1) * subCycleDuration;
        
      default:
        return currentTime; // immediate
    }
  }
  
  // Schedule quantized function with escape mechanism
  scheduleQuantizedFunction(func, params = {}) {
    const executeTime = this.getNextQuantizationPoint();
    const functionId = Date.now() + Math.random();
    
    // Check for double-click escape
    const existingItem = this.pendingFunctions.find(item => 
      item.functionName === func.name && item.executeTime > this.context.currentTime
    );
    
    if (existingItem) {
      // Execute immediately (escape)
      this.pendingFunctions = this.pendingFunctions.filter(item => item.id !== existingItem.id);
      this.executeFunction(func, params);
      dispatch({ type: 'DISPLAY_UPDATE', payload: { type: 'temporary', content: '' }});
      return;
    }
    
    this.pendingFunctions.push({
      func, params, executeTime, id: functionId, functionName: func.name
    });
    
    // Show "ooo" during wait
    dispatch({ type: 'DISPLAY_UPDATE', payload: { type: 'temporary', content: 'ooo' }});
  }
}
```

### MIDI Synchronization

```javascript
class MIDISync {
  constructor(audioContext) {
    this.context = audioContext;
    this.mode = 'off'; // 'off', 'in', 'out', 'ous'
    this.clockPPQ = 24; // MIDI clock pulses per quarter note
    this.lastClockTime = 0;
    this.bpm = 120;
    this.globalStartPoint = 0;
    this.syncCorrection = 0;
  }
  
  // Handle incoming MIDI clock
  handleMIDIClock(timestamp) {
    if (this.mode !== 'in') return;
    
    const clockTime = timestamp / 1000; // Convert to seconds
    const expectedInterval = 60 / (this.bpm * this.clockPPQ);
    
    if (this.lastClockTime) {
      const actualInterval = clockTime - this.lastClockTime;
      const jitter = Math.abs(actualInterval - expectedInterval);
      
      // Sync correction for tempo drift
      if (jitter > 0.002) { // 2ms tolerance
        this.syncCorrection = expectedInterval - actualInterval;
        this.applySyncCorrection();
      }
    }
    
    this.lastClockTime = clockTime;
    this.updateTempoFromClock(actualInterval);
  }
  
  // Visual tempo guide LEDs
  updateTempoLEDs() {
    const currentPos = this.getCurrentLoopPosition();
    const cyclePos = currentPos % this.cycleDuration;
    const subCyclePos = currentPos % (this.cycleDuration / this.eighthsPerCycle);
    
    // Don't show visual guide if tempo > 400 BPM
    const effectiveBPM = (this.eighthsPerCycle * 120) / this.getLoopDuration();
    if (effectiveBPM > 400) return;
    
    // Timing LED (8th notes)
    dispatch({ 
      type: 'LED_UPDATE', 
      payload: { 
        ledName: 'timing', 
        state: subCyclePos < 0.05 ? 'on' : 'off' 
      }
    });
    
    // Switches LED (cycle boundaries)
    dispatch({ 
      type: 'LED_UPDATE', 
      payload: { 
        ledName: 'switches', 
        state: cyclePos < 0.05 ? 'on' : 'off' 
      }
    });
  }
}
```

---

## Parameter Processing

### 7×4 Parameter Matrix Implementation

```javascript
const ParameterMatrix = {
  // Hardware-accurate parameter definitions
  timing: {
    'Loop/Delay': {
      values: ['LOP', 'dEL', 'EXP', 'Stu', 'Out', 'In', 'rPL', 'FLI'],
      default: 'LOP',
      apply: (value) => { /* Set loop/delay mode */ }
    },
    'Quantize': {
      values: ['OFF', 'CYC', '8th', 'LOP'],
      default: 'CYC',
      apply: (value) => QuantizationEngine.setMode(value.toLowerCase())
    },
    '8ths/Cycle': {
      values: [1,2,3,4,5,6,7,8,9,10,11,12,16,32,64,128,256],
      priorityOrder: [8,4,2,6,12,16,32,64,128,256,1,2,3,5,7,9,10,11],
      default: 8,
      apply: (value) => { 
        EchoplexTiming.setEighthsPerCycle(value);
        // Only activated at loop StartPoint when exiting Parameter mode
      }
    },
    'Sync': {
      values: ['OFF', 'In', 'Out', 'OuS'],
      default: 'OFF',
      apply: (value) => MIDISync.setMode(value)
    },
    'Threshold': {
      values: Array.from({length: 128}, (_, i) => i), // 0-127
      default: 8,
      apply: (value) => { /* Set threshold level */ }
    },
    'Reverse': {
      values: ['OFF', 'On'],
      default: 'OFF',
      apply: (value) => { /* Toggle reverse playback */ }
    },
    'StartPoint': {
      values: ['rSt', 'AL', 'AU', 'qu'],
      default: 'rSt',
      apply: (value) => { /* Set StartPoint mode */ }
    }
  },
  
  switches: {
    'RecordMode': {
      values: ['Ove', 'Sub', 'rPL'],
      default: 'Ove',
      apply: (value) => ControllerLayer.setRecordMode(value)
    },
    'OverdubMode': {
      values: ['Ove', 'Sub', 'rPL'],
      default: 'Ove',  
      apply: (value) => ControllerLayer.setOverdubMode(value)
    },
    // ... complete matrix
  },
  
  // Table-driven parameter incrementer
  incrementParameter(row, col) {
    const paramName = this.getParameterName(row, col);
    const paramDef = this.getParameterDefinition(row, paramName);
    const currentValue = this.getCurrentValue(row, paramName);
    
    let nextValue;
    if (Array.isArray(paramDef.values)) {
      const currentIndex = paramDef.values.indexOf(currentValue);
      const nextIndex = (currentIndex + 1) % paramDef.values.length;
      nextValue = paramDef.values[nextIndex];
    } else {
      // Handle numeric ranges
      nextValue = this.incrementNumeric(currentValue, paramDef);
    }
    
    // Apply the parameter change
    paramDef.apply(nextValue);
    this.setValue(row, paramName, nextValue);
    
    return nextValue;
  }
};
```

---

## MIDI Integration

### MIDI Message Handling

```javascript
class MIDIHandler {
  constructor() {
    this.midiAccess = null;
    this.activeInputs = new Map();
    this.activeOutputs = new Map();
  }
  
  async initialize() {
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      this.setupInputs();
      this.setupOutputs();
    } catch (error) {
      console.warn('MIDI not available:', error);
    }
  }
  
  handleMIDIMessage(message) {
    const [status, data1, data2] = message.data;
    const command = status & 0xF0;
    
    switch (command) {
      case 0xF8: // MIDI Clock
        MIDISync.handleMIDIClock(message.timeStamp);
        break;
        
      case 0xFA: // Start
        dispatch({ type: 'MIDI_START' });
        break;
        
      case 0xFB: // Continue  
        dispatch({ type: 'MIDI_CONTINUE' });
        break;
        
      case 0xFC: // Stop
        dispatch({ type: 'MIDI_STOP' });
        break;
        
      case 0xF2: // Song Position Pointer
        const position = (data2 << 7) | data1;
        dispatch({ type: 'MIDI_POSITION', payload: { position } });
        break;
        
      case 0xB0: // Control Change
        this.handleControlChange(data1, data2);
        break;
    }
  }
  
  // Send MIDI clock when Sync=Out
  sendMIDIClock() {
    if (MIDISync.mode === 'out' || MIDISync.mode === 'ous') {
      const clockMessage = [0xF8]; // MIDI Clock
      this.sendToAllOutputs(clockMessage);
    }
  }
}
```

---

## State Management

### Complete State Tree

```javascript
const EchoplexState = {
  system: {
    power: false,
    parameterMode: false,
    currentParameterRow: null,
    midiSync: {
      mode: 'off',
      tempo: 120,
      externalClock: false,
      globalStartPoint: 0
    }
  },
  
  timing: {
    loopStartTime: 0,
    cycleDuration: 0,
    eighthsPerCycle: 8,
    quantizeMode: 'cycle',
    syncCorrection: 0,
    pendingFunctions: []
  },
  
  loops: {
    currentLoop: 0,
    totalLoops: 1,
    buffers: [], // Float32Array buffers
    lengths: [0],
    playPosition: 0,
    recordPosition: 0,
    states: ['empty'] // per-loop state
  },
  
  controller: {
    recording: false,
    overdubbing: false,
    multiplying: false,
    inserting: false,
    muted: false,
    recordMode: 'Ove',
    overdubMode: 'Ove'
  },
  
  parameters: {
    timing: { /* 7 parameters */ },
    switches: { /* 7 parameters */ },
    midi: { /* 7 parameters */ },
    loop: { /* 7 parameters */ }
  },
  
  audio: {
    inputLevel: 0.5,
    outputLevel: 0.5,
    mixLevel: 0.5,
    feedbackLevel: 0.75,
    inputPeak: 0,
    outputPeak: 0
  },
  
  ui: {
    buttons: {
      record: { pressed: false, led: 'green' },
      overdub: { pressed: false, led: 'green' },
      // ... all buttons
    },
    knobs: {
      input: 64,
      output: 64,
      mix: 64,
      feedback: 95
    },
    displays: {
      loop: '.',
      multiple: '',
      tempoDots: { left: false, right: false }
    }
  }
};
```

---

## Performance Optimization

### Real-Time Optimizations

```javascript
class PerformanceOptimizer {
  constructor() {
    this.bufferSize = 512; // Balance latency vs stability
    this.updateInterval = 1000 / 60; // 60 FPS for UI updates
    this.lastDisplayUpdate = 0;
  }
  
  // Efficient loop buffer management
  optimizeLoopBuffers() {
    // Use SharedArrayBuffer for cross-thread access
    // Pre-allocate maximum buffer size
    // Implement circular buffer for continuous recording
  }
  
  // Minimize garbage collection
  avoidAllocations() {
    // Reuse objects where possible
    // Pre-allocate temporary arrays
    // Use object pooling for frequent operations
  }
  
  // Throttle UI updates
  shouldUpdateDisplay(currentTime) {
    if (currentTime - this.lastDisplayUpdate >= this.updateInterval) {
      this.lastDisplayUpdate = currentTime;
      return true;
    }
    return false;
  }
}
```

### Memory Management

```javascript
// Efficient undo system
class UndoManager {
  constructor(maxDepth = 8) {
    this.maxDepth = maxDepth;
    this.snapshots = [];
  }
  
  // Store only diff, not full buffer
  saveSnapshot(loopIndex, changes) {
    const snapshot = {
      loopIndex,
      timestamp: Date.now(),
      changes: this.compressChanges(changes)
    };
    
    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.maxDepth) {
      this.snapshots.shift();
    }
  }
  
  compressChanges(changes) {
    // Store only changed samples, not entire buffer
    // Use run-length encoding for silent regions
    // Implement delta compression
  }
}
```

---

## Implementation Roadmap

### Phase 1: Core Audio Engine (Weeks 1-2)
- [ ] AudioWorklet processor implementation
- [ ] Basic loop recording/playback
- [ ] Sample-accurate timing foundation
- [ ] Input/output level controls

### Phase 2: Loop Functions (Weeks 3-4)  
- [ ] Overdub functionality
- [ ] Multiply/Insert operations
- [ ] Undo system
- [ ] Multiple loop support

### Phase 3: Timing System (Weeks 5-6)
- [ ] Quantization engine
- [ ] MIDI clock synchronization  
- [ ] Visual tempo guide LEDs
- [ ] StartPoint management

### Phase 4: Parameter Matrix (Weeks 7-8)
- [ ] Complete 7×4 parameter implementation
- [ ] Parameter mode navigation
- [ ] Hardware-accurate value ranges
- [ ] Parameter persistence

### Phase 5: Advanced Features (Weeks 9-10)
- [ ] Preset system
- [ ] MIDI control integration
- [ ] Performance optimizations
- [ ] Comprehensive testing

### Phase 6: Polish & Testing (Weeks 11-12)
- [ ] Edge case handling
- [ ] Memory optimization
- [ ] Cross-browser compatibility
- [ ] Performance benchmarking

---

## Conclusion

This architecture synthesis provides a complete roadmap for implementing the Echoplex Digital Pro Plus in WebAudioAPI while maintaining hardware-faithful behavior and real-time performance. The layered approach with central action bus enables systematic development and testing of each component.

**Key Success Metrics:**
- ✅ <10ms total latency
- ✅ Sample-accurate loop boundaries  
- ✅ Zero-gap loop playback
- ✅ Hardware-faithful parameter behavior
- ✅ Robust MIDI synchronization
- ✅ Visual tempo guide accuracy
- ✅ Memory efficiency for long sessions

The implementation should prioritize timing accuracy and musical usability over feature completeness, ensuring that the core loop recording and playback functionality works flawlessly before adding advanced features.