# Echoplex Digital Pro Plus - Timing and Synchronization Specification

## Table of Contents

1. [Core Timing Concepts](#core-timing-concepts)
2. [MIDI Synchronization](#midi-synchronization)
3. [Quantization Behavior](#quantization-behavior)
4. [Timing-Dependent Functions](#timing-dependent-functions)
5. [External Sync Requirements](#external-sync-requirements)
6. [Real-Time Constraints](#real-time-constraints)
7. [Performance Timing](#performance-timing)
8. [WebAudioAPI Implementation Guidelines](#webaudioapi-implementation-guidelines)

---

## Core Timing Concepts

### Loop Time Hierarchy

The Echoplex operates on a hierarchical timing system:

```
Loop (complete loop cycle)
├── Cycle (subdivision of loop, typically 1 cycle = 1 loop initially)
│   └── Sub-Cycle (8th note subdivisions)
│       └── Sample (audio sample level)
```

### StartPoint Definition

- **Loop StartPoint**: The beginning of the complete loop sequence
- **Cycle StartPoint**: The beginning of each cycle within the loop
- **Global MIDI StartPoint**: Beat 1 of external sequencer (when Sync=In)
- **Sub-Cycle StartPoint**: 8th note boundaries within each cycle

### 8ths/Cycle Parameter

Controls subdivision of cycles for quantization:

- **Values**: 1-96, 128, 256
- **Default**: 8 (eighth note subdivisions)
- **Priority order**: 8,4,2,6,12,16,32,64,128,256, then 1,2,3...96
- **Calculation**: Sub-cycle length = Cycle length / 8ths/Cycle
- **Example**: 2-second cycle with 8ths/Cycle=8 = 250ms per 8th note
- **MIDI Clock Exception**: When Sync=In, uses MIDI clock 8th note timing instead of calculated subdivision
- **DataWheel Support**: Feedback knob becomes DataWheel for quick editing (values 1-54)
- **Long Press Reset**: Returns to default value of 8
- **Live Changes**: Only activated at Loop StartPoint when exiting Parameter Edit mode

### Tempo and BPM Handling

- **Range**: 26-278 BPM (in TempoSelect mode)
- **Default**: 120 BPM when no preset tempo
- **Calculation**: Assumes quarter note = 1 beat
- **Relationship**: Loop time = (8ths/Cycle / 2) * (60 / BPM)
- **MIDI Clock Limit**: ~400 BPM effective tempo maximum
- **Visual Tempo Limit**: Above 400 BPM, Timing LED stops blinking (becomes useless as visual indicator)
- **Short Loop Warning**: Short loops + high 8ths/Cycle values can exceed tempo limits

---

## MIDI Synchronization

### Sync Parameter Values

#### OFF (Sync=Off)
- No synchronization
- Loop operates independently
- No MIDI clock input/output

#### IN (Sync=In)
- Receives MIDI clock from external device
- Tracks Global MIDI StartPoint (Beat 1)
- Uses external clock for 8th note quantization
- Accepts StartSong, StopSong, Continue messages
- Supports SongPositionPointer for precise positioning

#### OUT (Sync=Out)
- Sends MIDI clock to external devices
- Automatically sends StartSong/StopSong
- BeatSync pulse output at cycle boundaries
- BrotherSync for multiple Echoplex units

#### OUS (Sync=OutUserStart)
- Sends MIDI clock but not automatic StartSong
- User controls StartSong timing via Mute-Multiply
- Useful for pre-rolling tempo to external devices

### MIDI Clock Transmission Limits

- **Maximum**: ~400 BPM effective tempo
- **Calculation**: If (8ths/Cycle * 120) / (loop_time_seconds) > 400, clock disabled
- **Example**: 0.5-second loop with 8ths/Cycle=16 = 960 BPM effective (clock disabled)

### StartSong/StopSong Timing

**StartSong sent at:**
- StopRecord (finishing a loop)
- Start SyncRecord (from TempoSelect)
- UnroundedMultiply/Insert
- UnMute, ReTrigger, ReAlign
- QuantMIDIStartSong (at next loop start)

**StopSong sent at:**
- StartRecord, Mute, Reset, GeneralReset

---

## Quantization Behavior

### Quantize Parameter Values

#### OFF (Quantize=Off)
- All functions execute immediately
- No waiting for timing boundaries
- SyncRecord available when Sync=In

#### LOOP (Quantize=Loop)
- Wait for complete loop cycle to finish
- Functions execute at Loop StartPoint
- Useful for multi-cycle loops created with Multiply/Insert

#### CYCLE (Quantize=Cycle)
- Wait for current cycle to complete
- Functions execute at next Cycle StartPoint
- Default rhythmic quantization

#### 8TH (Quantize=8th)
- Wait for next sub-cycle boundary
- Sub-cycle timing defined by 8ths/Cycle parameter
- Exception: When Sync=In, uses MIDI clock 8th note timing
- Enables LoopDivide functionality

### Quantization Wait Display

- **Display**: "ooo" during quantization wait
- **Escape**: Press same function button again for immediate execution (double-click escape)
- **Applies to**: Multiply, Insert, Reverse, Mute, Substitute, HalfSpeed, Replace
- **Threshold parameter**: Also shows "ooo" when waiting for audio threshold trigger
- **SyncRecord**: Shows "ooo" when waiting for external StartPoint (Sync=In + Quantize=On)

---

## Timing-Dependent Functions

### SyncRecord Behavior

**When**: Sync=In and Quantize=Off
- Starts immediately when Record pressed
- Counts cycles during recording
- Automatically rounds to match external clock timing
- Allows flexible start time while maintaining sync

**When**: Sync=In and Quantize=Loop/Cycle/8th
- Waits for quantization point before starting
- Shows "ooo" during wait
- Starts at external StartPoint (Global MIDI StartPoint)
- Ensures perfect alignment with external clock from start

**TempoSelect Mode** (Sync=Out):
- Available during Reset state
- Undo LED turns red indicating tempo selection mode
- Press Record to set tempo and start recording simultaneously
- Sends MIDI StartSong at tempo setting moment
- Rounds recording to match preset tempo

### Multiply Timing

**Quantized behavior:**
- Waits for quantization point to begin
- Automatically rounds to integer number of cycles
- RoundMode affects incomplete cycles

**Timing constraints:**
- Must complete at cycle boundary for rhythmic integrity
- UnroundedMultiply available via Record alternate ending

### Insert Timing

**Quantized behavior:**
- Waits for quantization point to begin insertion
- Inserts exact number of cycles
- RoundMode affects incomplete cycles

**Timing precision:**
- Insertion point must align with cycle boundaries
- UnroundedInsert available via Record alternate ending

### Mute Timing

**MuteMode settings affect timing:**
- **StA**: Mute starts at next quantization point
- **Cnt**: Mute continues from current position
- **Triggers**: Various StartSong/StopSong timing

### Undo Timing Constraints

- Cannot undo past certain timing boundaries
- Reverse creates timing boundary (forward/backward transition)
- Memory management affects undo depth

---

## External Sync Requirements

### Clock Input Handling

**MIDI Clock (24 PPQ):**
- Receives 24 clock pulses per quarter note
- Automatically detects tempo changes
- Handles tempo drift within tolerance

**BeatSync Input:**
- Pulse at cycle boundaries
- Used for triggering external devices
- Can be used as metronome reference

### Tempo Detection and Adaptation

**Sync correction indicators:**
- Visual feedback via Multiple Left Dot LED
- **Bright**: External clock early (jumps back)
- **Dim**: External clock late (jumps forward)
- **Off**: Perfect sync

### Sync Loss Recovery

**When sync is lost:**
- Continue with internal timing
- Attempt to reacquire sync
- Visual indication of sync status

### StartPoint Synchronization

**ReAlign function:**
- **Trigger**: Mute-Multiply combination
- **Behavior**: Waits for Global StartPoint, then retriggers loop in sync
- **Display**: Shows "AL" during wait
- **Sync=In**: Waits for Global MIDI StartPoint (Beat 1 of sequencer)
- **Sync=Out**: Waits for BrotherSync pulse from other Echoplex
- **Sync=OuS**: Waits for BrotherSync pulse from other Echoplex

**QuantStartPoint:**
- **Purpose**: Redefines internal StartPoint to match external timing
- **Available**: When Sync=In
- **Effect**: Doesn't change audio content, only timing reference
- **Use case**: Align with external clock without retriggering audio

**AutoStartPoint:**
- **Function**: Automatically aligns StartPoint with external clock
- **Timing**: Occurs at loop boundaries when sync is established
- **Maintains**: Audio continuity while correcting timing reference

---

## Real-Time Constraints

### Maximum Allowable Latency

**Audio path latency:**
- Input to output: < 10ms recommended
- Quantization accuracy: ±1 sample
- MIDI response time: < 5ms

### Jitter Tolerance

**Timing stability:**
- MIDI clock jitter: ±2ms acceptable
- Audio sample jitter: ±1 sample
- Quantization jitter: ±10ms at 8th note level

### Sample-Accurate Timing

**Critical timing points:**
- Loop boundaries: Sample-accurate
- Cycle boundaries: Sample-accurate
- Sub-cycle boundaries: Sample-accurate
- Function execution: Sample-accurate

### Buffer Size Implications

**Recommended buffer sizes:**
- **Low latency**: 128-256 samples
- **Stable performance**: 512-1024 samples
- **Trade-off**: Lower latency = higher CPU usage

---

## Performance Timing

### Loop Transition Timing

**Seamless transitions:**
- Zero-gap loop playback
- Smooth overdub transitions
- Synchronized function execution

### Crossfade Timing

**Smooth transitions:**
- Mute/Unmute: 10-50ms crossfade
- Loop switching: Instant or quantized
- Function transitions: Minimize clicks

### LED Update Timing

**Visual feedback timing:**
- **Timing LED**: Blinks at sub-cycle points (8th notes)
- **Switches LED**: Blinks at cycle StartPoints
- **MIDI LED**: Blinks at loop StartPoints (only shown if multiples established)
- **Multiple Right Dot**: Blinks at Global MIDI StartPoints (only shown if local loop is not aligned)
- **Multiple Left Dot**: Blinks when sync correction happens:
  - **Bright**: Sync came early, Echoplex jumps back almost whole loop (external sequencer was fast)
  - **Faint**: Sync came late, Echoplex jumps a little (external sequencer was slow)
- **Loop Display Dot**: AutoUndo executed (loop was not changed in last pass)

### Display Refresh Timing

**LoopTime Display:**
- Updates at 10Hz refresh rate
- Shows "ooo" during quantization wait
- Shows "AL" during ReAlign wait
- Shows "St.S" during MuteQuantMIDIStartSong wait
- Shows "H.SP" briefly during HalfSpeed switch
- Shows "F.SP" briefly during FullSpeed switch
- Shows "L 1", "L 2", etc. during SwitchQuantize wait
- Time resolution: 100ms minimum

---

## WebAudioAPI Implementation Guidelines

### Core Architecture

```javascript
class EchoplexTiming {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.currentTime = () => audioContext.currentTime;
        this.sampleRate = audioContext.sampleRate;
        
        // Timing state
        this.loopStartTime = 0;
        this.loopDuration = 0;
        this.cycleDuration = 0;
        this.subCycleDuration = 0;
        
        // Quantization state
        this.quantizeMode = 'off'; // 'off', 'loop', 'cycle', '8th'
        this.quantizationQueue = [];
        
        // Sync state
        this.syncMode = 'off'; // 'off', 'in', 'out', 'ous'
        this.externalClock = null;
        this.globalStartPoint = 0;
    }
}
```

### Timing Calculations

```javascript
// Calculate current position in loop
getCurrentLoopPosition() {
    if (this.loopDuration === 0) return 0;
    const elapsed = this.currentTime() - this.loopStartTime;
    return elapsed % this.loopDuration;
}

// Calculate next quantization point
getNextQuantizationPoint(mode = this.quantizeMode) {
    const currentPos = this.getCurrentLoopPosition();
    const currentTime = this.currentTime();
    
    switch (mode) {
        case 'loop':
            const nextLoopStart = this.loopStartTime + 
                Math.ceil((currentTime - this.loopStartTime) / this.loopDuration) * this.loopDuration;
            return nextLoopStart;
            
        case 'cycle':
            const cyclesSinceStart = Math.floor(currentPos / this.cycleDuration);
            const nextCycleStart = this.loopStartTime + (cyclesSinceStart + 1) * this.cycleDuration;
            return nextCycleStart;
            
        case '8th':
            const subCyclesSinceStart = Math.floor(currentPos / this.subCycleDuration);
            const nextSubCycleStart = this.loopStartTime + (subCyclesSinceStart + 1) * this.subCycleDuration;
            return nextSubCycleStart;
            
        default:
            return currentTime; // immediate
    }
}
```

### Quantization Implementation

```javascript
// Queue a quantized function
scheduleQuantizedFunction(func, params = {}) {
    const executeTime = this.getNextQuantizationPoint();
    const functionId = Date.now() + Math.random();
    
    const queueItem = {
        func,
        params,
        executeTime,
        id: functionId,
        functionName: func.name // For double-click escape detection
    };
    
    // Check for double-click escape (same function pressed while quantizing)
    const existingItem = this.quantizationQueue.find(item => 
        item.functionName === func.name && item.executeTime > this.currentTime()
    );
    
    if (existingItem) {
        // Double-click escape - execute immediately
        this.quantizationQueue = this.quantizationQueue.filter(item => item.id !== existingItem.id);
        this.executeQuantizedFunction(func, params);
        this.displayMessage(""); // Clear "ooo" display
        return;
    }
    
    this.quantizationQueue.push(queueItem);
    this.displayMessage("ooo"); // Show quantization wait
    
    // Schedule execution
    setTimeout(() => {
        this.executeQuantizedFunction(func, params);
        this.displayMessage(""); // Clear "ooo" display
    }, (executeTime - this.currentTime()) * 1000);
}

// Execute quantized function at precise time
executeQuantizedFunction(func, params) {
    const scheduleTime = this.getNextQuantizationPoint();
    
    // Use AudioContext's scheduling for sample-accurate timing
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(1, scheduleTime);
    gainNode.gain.setValueAtTime(0, scheduleTime + 0.001);
    
    // Execute function at scheduled time
    this.audioContext.suspend(scheduleTime).then(() => {
        func(params);
        this.audioContext.resume();
    });
}
```

### MIDI Sync Implementation

```javascript
// Handle incoming MIDI clock
handleMIDIClock(clockMessage) {
    if (this.syncMode !== 'in') return;
    
    const clockTime = this.currentTime();
    const expectedInterval = 60 / (this.bpm * 24); // 24 PPQ
    
    if (this.lastClockTime) {
        const actualInterval = clockTime - this.lastClockTime;
        const jitter = Math.abs(actualInterval - expectedInterval);
        
        if (jitter > 0.002) { // 2ms jitter threshold
            this.syncCorrection = expectedInterval - actualInterval;
            this.applySyncCorrection();
        }
    }
    
    this.lastClockTime = clockTime;
    
    // Update 8th note timing based on MIDI clock when Quantize=8th
    if (this.quantizeMode === '8th') {
        this.subCycleDuration = expectedInterval * 3; // 3 MIDI clocks = 1 8th note
    }
}

// Apply sync correction
applySyncCorrection() {
    // Adjust internal timing to match external clock
    this.loopStartTime += this.syncCorrection;
    this.globalStartPoint += this.syncCorrection;
    
    // Visual feedback
    this.updateSyncLED(this.syncCorrection > 0 ? 'early' : 'late');
}
```

### Visual Timing Indicators

```javascript
// Update LED states based on timing - Visual Tempo Guide
updateTimingLEDs() {
    const currentPos = this.getCurrentLoopPosition();
    const cyclePos = currentPos % this.cycleDuration;
    const subCyclePos = currentPos % this.subCycleDuration;
    
    // Don't update visual tempo guide if tempo > 400 BPM
    const effectiveBPM = (this.eighthsPerCycle * 120) / (this.loopDuration);
    if (effectiveBPM > 400) return;
    
    // Timing LED (8th notes) - blinks at sub-cycle points
    if (subCyclePos < 0.05) { // 50ms flash
        this.setLEDState('timing', 'on');
    } else {
        this.setLEDState('timing', 'off');
    }
    
    // Switches LED (cycle boundaries) - blinks at local cycle StartPoints
    if (cyclePos < 0.05) {
        this.setLEDState('switches', 'on');
    } else {
        this.setLEDState('switches', 'off');
    }
    
    // MIDI LED (loop boundaries) - only shown if multiples established
    if (this.hasMultipleCycles && currentPos < 0.05) {
        this.setLEDState('midi', 'on');
    } else {
        this.setLEDState('midi', 'off');
    }
    
    // Multiple Right Dot - Global MIDI StartPoint (only if not aligned)
    if (this.syncMode === 'in' && !this.isAlignedWithGlobalClock) {
        const globalPos = this.getGlobalClockPosition();
        if (globalPos < 0.05) {
            this.setLEDState('multiple-right-dot', 'on');
        } else {
            this.setLEDState('multiple-right-dot', 'off');
        }
    }
    
    // Multiple Left Dot - Sync correction indicator
    if (this.syncCorrection !== 0) {
        const intensity = this.syncCorrection > 0 ? 'bright' : 'faint';
        this.setLEDState('multiple-left-dot', intensity);
        // Reset after short display period
        setTimeout(() => {
            this.setLEDState('multiple-left-dot', 'off');
            this.syncCorrection = 0;
        }, 100);
    }
}
```

### Performance Optimization

```javascript
// Efficient timing calculations using requestAnimationFrame
startTimingLoop() {
    const update = () => {
        this.processQuantizationQueue();
        this.updateTimingLEDs();
        this.updateTimeDisplay();
        
        requestAnimationFrame(update);
    };
    
    requestAnimationFrame(update);
}

// Process quantization queue efficiently
processQuantizationQueue() {
    const currentTime = this.currentTime();
    
    this.quantizationQueue = this.quantizationQueue.filter(item => {
        if (currentTime >= item.executeTime) {
            this.executeQuantizedFunction(item.func, item.params);
            return false; // Remove from queue
        }
        return true; // Keep in queue
    });
}
```

---

## Timing Hierarchy and Dependencies

The Echoplex timing system operates on multiple interconnected levels:

### Global Timing References
1. **External MIDI Clock** (when Sync=In): 24 PPQ timing from sequencer
2. **Internal Master Clock**: Generated from loop timing when Sync=Out
3. **Global StartPoint**: Beat 1 reference for external synchronization

### Local Timing References
1. **Loop StartPoint**: Beginning of complete loop sequence
2. **Cycle StartPoint**: Beginning of each cycle within loop
3. **Sub-Cycle StartPoint**: 8th note divisions within cycles
4. **Sample-Level Timing**: Individual audio samples for precise execution

### Timing Dependencies
- **Sub-cycles depend on**: 8ths/Cycle parameter OR external MIDI clock (when Sync=In + Quantize=8th)
- **Cycles depend on**: Original recording length OR Multiply/Insert operations
- **Loops depend on**: Number of cycles created through Multiply/Insert
- **Global alignment depends on**: External clock presence and sync mode

---

## Summary

This specification provides the complete timing and synchronization framework for implementing the Echoplex Digital Pro Plus in WebAudioAPI. Key implementation points:

1. **Sample-accurate timing** is critical for all loop boundaries and function execution
2. **Quantization system** must support OFF, LOOP, CYCLE, and 8TH modes with precise timing and double-click escape
3. **MIDI synchronization** requires robust clock handling, sync correction, and visual feedback
4. **Visual Tempo Guide** provides comprehensive timing feedback through multiple LEDs with tempo-dependent behavior
5. **Real-time constraints** demand efficient scheduling and minimal latency
6. **Timing hierarchy** must maintain relationships between global, local, and sub-cycle timing references
7. **StartPoint management** enables flexible alignment with external timing sources

The WebAudioAPI implementation should prioritize timing accuracy over feature completeness, ensuring that all loop operations maintain perfect synchronization and rhythmic integrity. The Visual Tempo Guide and quantization escape mechanisms are essential for musical usability.