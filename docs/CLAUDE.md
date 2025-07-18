# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Implementation Strategy

### Sequential Function Development
- Follow the **IMPLEMENTATION_RUBRIC.md** strictly
- Implement functions in order: RECORD → OVERDUB → MULTIPLY → ... → Presets
- **Cannot proceed to next function until ALL exit tests pass**
- No skipping, no regressions allowed

### Exit Test Requirements
- Each function has 6+ specific exit tests that must pass
- Performance standards: <10ms latency, sample-accurate timing
- Hardware-faithful behavior required
- Visual feedback (LEDs/displays) must be correct

### Current Implementation Status
# Echoplex Digital Pro Plus - Implementation Rubric

## Overview

This document serves as our **implementation rubric** - a systematic checklist for building the Echoplex Digital Pro Plus emulation. We implement one function at a time, and **cannot proceed to the next function until all exit tests are passed**.

### Implementation Order

**Core Loop Functions** → **Loop Management** → **Parameter Matrix** → **Advanced Features**

---

## 🎯 Core Loop Functions

### 1. RECORD Button

**Scope:** Basic loop recording functionality

**Implementation Requirements:**
- [ ] Record button toggles recording state
- [ ] Audio input captured to loop buffer
- [ ] Loop length determined by second button press
- [ ] Sample-accurate start/stop timing

**Exit Tests (All Must Pass):**
- [ ] ✅ Can record a simple 1-bar loop and hear it play back
- [ ] ✅ LoopTime display updates correctly during recording
- [ ] ✅ Record LED shows red during recording, green when stopped
- [ ] ✅ Loop playback starts immediately after recording stops
- [ ] ✅ No audio artifacts or clicks at loop boundaries
- [ ] ✅ Can record loops from 0.1 seconds to 198 seconds

**WebAudio Components Needed:**
- Basic AudioWorklet for loop recording
- Loop buffer management (single loop)
- Input level monitoring
- LED state management

---

### 2. OVERDUB Button

**Scope:** Audio layering on existing loops

**Implementation Requirements:**
- [ ] Overdub adds audio to existing loop content
- [ ] Feedback knob controls loop decay
- [ ] Can overdub multiple layers
- [ ] Maintains loop timing integrity

**Exit Tests (All Must Pass):**
- [ ] ✅ Overdub layers are clearly audible over original loop
- [ ] ✅ Feedback knob (0-127) adjusts loop decay correctly
- [ ] ✅ Can add multiple overdub layers without timing drift
- [ ] ✅ Overdub LED shows red during overdubbing
- [ ] ✅ Original loop content preserved when feedback = 127
- [ ] ✅ Loop fades out completely when feedback = 0

**WebAudio Components Needed:**
- Overdub mixing in AudioWorklet
- Feedback gain control
- Multi-layer audio mixing

---

### 3. MULTIPLY Button

**Scope:** Loop length extension

**Implementation Requirements:**
- [ ] Multiply extends loop by integer multiples
- [ ] Seamless playback during multiplication
- [ ] RoundMode parameter affects incomplete cycles
- [ ] Can multiply up to 127 times

**Exit Tests (All Must Pass):**
- [ ] ✅ Loop doubles cleanly with Multiply (2x, 3x, 4x tested)
- [ ] ✅ Playback remains seamless during multiplication
- [ ] ✅ RoundMode affects how incomplete multiplies are handled
- [ ] ✅ Multiply LED shows orange during rounding period
- [ ] ✅ Can multiply existing overdubs without loss
- [ ] ✅ Maximum multiply limit (127x) enforced correctly

**WebAudio Components Needed:**
- Loop buffer expansion
- Seamless playback during buffer changes
- RoundMode logic implementation

---

### 4. INSERT Button

**Scope:** Section replacement and special effects

**Implementation Requirements:**
- [ ] Insert replaces loop sections
- [ ] InsertMode parameter controls behavior
- [ ] Reverse, HalfSpeed, Substitute modes
- [ ] Maintains overall loop length

**Exit Tests (All Must Pass):**
- [ ] ✅ Insert replaces section of loop audibly
- [ ] ✅ Reverse toggles playback direction correctly
- [ ] ✅ HalfSpeed plays back at half speed during insert
- [ ] ✅ Substitute mode replaces audio content
- [ ] ✅ Insert LED shows red during active insert
- [ ] ✅ Overall loop length preserved during insert

**WebAudio Components Needed:**
- Section replacement logic
- Playback direction control
- Speed modulation for HalfSpeed
- InsertMode parameter implementation

---

### 5. MUTE Button

**Scope:** Audio muting with continuous feedback

**Implementation Requirements:**
- [ ] MuteMode parameter (Continuous/Start)
- [ ] Feedback continues during mute
- [ ] Seamless mute/unmute transitions
- [ ] Loop position maintained during mute

**Exit Tests (All Must Pass):**
- [ ] ✅ Mute toggles audio output correctly
- [ ] ✅ Playback resumes without glitches after unmute
- [ ] ✅ Loop position maintained during mute period
- [ ] ✅ Feedback continues processing during mute
- [ ] ✅ Mute LED shows orange when muted
- [ ] ✅ MuteMode parameter affects mute behavior

**WebAudio Components Needed:**
- Output muting without stopping playback
- Continuous feedback processing
- MuteMode logic implementation

---

### 6. UNDO Button

**Scope:** Layer removal and restoration

**Implementation Requirements:**
- [ ] Undo removes last overdub layer
- [ ] Redo restores removed layer
- [ ] Multiple undo levels supported
- [ ] AutoUndo for empty loops

**Exit Tests (All Must Pass):**
- [ ] ✅ Undo/Redo toggles between overdub layers correctly
- [ ] ✅ No audio artifacts during undo operations
- [ ] ✅ Multiple undo levels work (at least 8 levels)
- [ ] ✅ AutoUndo triggers for silent loops
- [ ] ✅ Undo LED blinks during operations
- [ ] ✅ Cannot undo past original recording

**WebAudio Components Needed:**
- Undo stack management
- Layer restoration without artifacts
- AutoUndo detection logic
- Multiple undo level storage

---

### 7. NEXTLOOP Button

**Scope:** Multiple loop switching

**Implementation Requirements:**
- [ ] Switch between multiple loops
- [ ] Seamless transitions
- [ ] Loop-specific state preservation
- [ ] Visual indication of current loop

**Exit Tests (All Must Pass):**
- [ ] ✅ Can create and switch between 2 loops minimum
- [ ] ✅ Transitions are smooth with preserved timing
- [ ] ✅ Each loop maintains independent state
- [ ] ✅ NextLoop LED indicates current loop
- [ ] ✅ Loop switching doesn't affect audio quality
- [ ] ✅ Can switch during playback without clicks

**WebAudio Components Needed:**
- Multiple loop buffer management
- Seamless buffer switching
- Per-loop state preservation
- Loop transition logic

---

## 🔄 Loop Management Functions

### 8. MoreLoops Parameter

**Scope:** Multi-loop system configuration

**Implementation Requirements:**
- [ ] Configure total number of loops (2-16)
- [ ] Memory allocation for multiple loops
- [ ] Loop persistence across sessions

**Exit Tests (All Must Pass):**
- [ ] ✅ Can create and manage up to 16 loops
- [ ] ✅ Memory allocation works for all loop configurations
- [ ] ✅ Loop settings persist across power cycles
- [ ] ✅ Display shows available memory correctly
- [ ] ✅ No memory leaks with multiple loops
- [ ] ✅ Performance remains stable with 16 loops

---

### 9. AutoRecord Parameter

**Scope:** Automatic recording in empty loops

**Implementation Requirements:**
- [ ] Automatically starts recording in empty loops
- [ ] Threshold-based recording trigger
- [ ] Dynamic loop time updates

**Exit Tests (All Must Pass):**
- [ ] ✅ AutoRecord starts recording in empty loops automatically
- [ ] ✅ LoopTime updates dynamically during AutoRecord
- [ ] ✅ Threshold parameter affects AutoRecord sensitivity
- [ ] ✅ Works correctly with NextLoop switching
- [ ] ✅ Display shows "ooo" during threshold wait
- [ ] ✅ Can disable AutoRecord when not needed

---

### 10. LoopCopy Parameter

**Scope:** Loop duplication functionality

**Implementation Requirements:**
- [ ] Copy audio content between loops
- [ ] Preserve timing and overdub layers
- [ ] Copy to empty or occupied loops

**Exit Tests (All Must Pass):**
- [ ] ✅ Copies audio and timing to new loop correctly
- [ ] ✅ Playback remains seamless after copy
- [ ] ✅ All overdub layers copied faithfully
- [ ] ✅ Can copy to both empty and occupied loops
- [ ] ✅ Copy operation doesn't affect source loop
- [ ] ✅ Display shows copy operation status

---

### 11. SwitchQuant Parameter

**Scope:** Quantized loop switching

**Implementation Requirements:**
- [ ] Loop switches align to quantization points
- [ ] Display shows quantization wait
- [ ] Multiple quantization modes supported

**Exit Tests (All Must Pass):**
- [ ] ✅ Loop switches align to quantize points correctly
- [ ] ✅ Display shows "ooo" during quantization wait
- [ ] ✅ Can escape quantization with double-press
- [ ] ✅ Works with Loop, Cycle, and 8th quantization
- [ ] ✅ Maintains musical timing during switches
- [ ] ✅ Visual feedback for quantization status

---

## 🎵 Timing and Synchronization

### 12. Quantize Parameter

**Scope:** Function timing alignment

**Implementation Requirements:**
- [ ] OFF, Loop, Cycle, 8th quantization modes
- [ ] Sample-accurate quantization points
- [ ] Double-press escape mechanism

**Exit Tests (All Must Pass):**
- [ ] ✅ Functions align to Loop, Cycle, or 8th quantization points
- [ ] ✅ Sample-accurate timing for all quantization modes
- [ ] ✅ Double-press escape works for all functions
- [ ] ✅ Display shows "ooo" during quantization wait
- [ ] ✅ Quantization respects loop boundaries
- [ ] ✅ Works correctly with MIDI sync

---

### 13. 8ths/Cycle Parameter

**Scope:** Sub-cycle divisions for quantization

**Implementation Requirements:**
- [ ] Configurable subdivisions (1-256)
- [ ] Priority order for common values
- [ ] Integration with quantization system

**Exit Tests (All Must Pass):**
- [ ] ✅ Functions align to 8th note subdivisions correctly
- [ ] ✅ Display shows current 8ths/Cycle value
- [ ] ✅ Priority order works (8,4,2,6,12,16,32,64...)
- [ ] ✅ Changes activate at Loop StartPoint
- [ ] ✅ Works with both internal and MIDI clock
- [ ] ✅ Visual tempo guide respects 8ths/Cycle

---

### 14. Sync Parameter

**Scope:** MIDI clock synchronization

**Implementation Requirements:**
- [ ] OFF, In, Out, OuS sync modes
- [ ] MIDI clock input/output
- [ ] StartSong/StopSong handling

**Exit Tests (All Must Pass):**
- [ ] ✅ Loops sync to external MIDI clock correctly
- [ ] ✅ Display shows sync status accurately
- [ ] ✅ MIDI clock output works (Out/OuS modes)
- [ ] ✅ StartSong/StopSong messages handled
- [ ] ✅ Sync correction for tempo drift
- [ ] ✅ Visual sync status indicators work

---

### 15. Threshold Parameter

**Scope:** Input sensitivity control

**Implementation Requirements:**
- [ ] Configurable input threshold (0-127)
- [ ] Recording start based on threshold
- [ ] Visual threshold wait indication

**Exit Tests (All Must Pass):**
- [ ] ✅ Recording starts only when input exceeds threshold
- [ ] ✅ Display shows "ooo" during threshold wait
- [ ] ✅ Threshold range (0-127) works correctly
- [ ] ✅ Works with AutoRecord functionality
- [ ] ✅ Threshold affects SyncRecord behavior
- [ ] ✅ Visual feedback for threshold status

---

### 16. StartPoint Parameter

**Scope:** Loop start alignment

**Implementation Requirements:**
- [ ] Reset, Align, AutoStartPoint, Quantize modes
- [ ] MIDI clock alignment
- [ ] Manual StartPoint adjustment

**Exit Tests (All Must Pass):**
- [ ] ✅ StartPoint aligns to MIDI clock correctly
- [ ] ✅ Display shows StartPoint status ("S.Pt")
- [ ] ✅ Manual StartPoint adjustment works
- [ ] ✅ AutoStartPoint maintains sync
- [ ] ✅ QuantStartPoint preserves audio
- [ ] ✅ ReAlign function works correctly

---

## 🎛️ Audio Controls

### 17. RecordMode Parameter

**Scope:** Recording behavior modes

**Implementation Requirements:**
- [ ] Overdub, Substitute, Replace modes
- [ ] Mode-specific recording behavior
- [ ] Feedback interaction in Safe mode

**Exit Tests (All Must Pass):**
- [ ] ✅ Record button behavior matches selected mode
- [ ] ✅ Feedback adjusts correctly in Safe mode
- [ ] ✅ Substitute mode replaces content
- [ ] ✅ Replace mode works as expected
- [ ] ✅ Mode changes take effect immediately
- [ ] ✅ Visual indication of current mode

---

### 18. OverdubMode Parameter

**Scope:** Overdub behavior configuration

**Implementation Requirements:**
- [ ] Overdub, Substitute, Replace modes
- [ ] Simultaneous vs Sequential overdubbing
- [ ] Mode-specific audio mixing

**Exit Tests (All Must Pass):**
- [ ] ✅ Overdub toggles between Simultaneous and Sequential modes
- [ ] ✅ Substitute mode during overdub works
- [ ] ✅ Replace mode during overdub works
- [ ] ✅ Audio mixing respects selected mode
- [ ] ✅ Mode changes take effect immediately
- [ ] ✅ Works correctly with feedback control

---

### 19. RoundMode Parameter

**Scope:** Multiply/Insert rounding behavior

**Implementation Requirements:**
- [ ] Round, Off modes for incomplete cycles
- [ ] Clean rounding for musical timing
- [ ] Visual rounding indication

**Exit Tests (All Must Pass):**
- [ ] ✅ Multiply rounds off loops cleanly
- [ ] ✅ Display shows rounding status
- [ ] ✅ Round mode creates musical boundaries
- [ ] ✅ Off mode preserves exact timing
- [ ] ✅ Works with both Multiply and Insert
- [ ] ✅ No audio artifacts during rounding

---

### 20. InsertMode Parameter

**Scope:** Insert function behavior

**Implementation Requirements:**
- [ ] Reverse, HalfSpeed, Substitute modes
- [ ] Section replacement logic
- [ ] Special effect processing

**Exit Tests (All Must Pass):**
- [ ] ✅ Insert toggles between Reverse, HalfSpeed, Substitute modes
- [ ] ✅ Reverse mode works during insert
- [ ] ✅ HalfSpeed plays at half speed
- [ ] ✅ Substitute replaces audio content
- [ ] ✅ Section length preserved correctly
- [ ] ✅ Visual indication of insert mode

---

### 21. MuteMode Parameter

**Scope:** Mute behavior configuration

**Implementation Requirements:**
- [ ] Continuous, Start mute modes
- [ ] Mode-specific muting behavior
- [ ] Feedback continuation during mute

**Exit Tests (All Must Pass):**
- [ ] ✅ Mute toggles between Continuous and Start modes
- [ ] ✅ Continuous mode mutes immediately
- [ ] ✅ Start mode mutes at cycle start
- [ ] ✅ Feedback continues during all mute modes
- [ ] ✅ Visual indication of mute mode
- [ ] ✅ Seamless transitions in both modes

---

## 🎹 MIDI Integration

### 22. Channel Parameter

**Scope:** MIDI channel configuration

**Implementation Requirements:**
- [ ] MIDI channel selection (1-16)
- [ ] Channel-specific message filtering
- [ ] Multi-channel support

**Exit Tests (All Must Pass):**
- [ ] ✅ MIDI commands sent/received on correct channel
- [ ] ✅ Display shows current MIDI channel
- [ ] ✅ Channel filtering works correctly
- [ ] ✅ Can change channels during operation
- [ ] ✅ Multi-channel operation supported
- [ ] ✅ Channel parameter persists

---

### 23. ControlSource Parameter

**Scope:** MIDI control mapping

**Implementation Requirements:**
- [ ] MIDI note/controller assignment
- [ ] Function triggering via MIDI
- [ ] Source offset calculation

**Exit Tests (All Must Pass):**
- [ ] ✅ MIDI controllers trigger functions correctly
- [ ] ✅ Display shows current Source# value
- [ ] ✅ Note/controller offsets work
- [ ] ✅ Can assign multiple control sources
- [ ] ✅ Real-time MIDI control response
- [ ] ✅ Control source mapping persists

---

### 24. Source# Parameter

**Scope:** MIDI note/controller offsets

**Implementation Requirements:**
- [ ] Offset calculation for MIDI messages
- [ ] Note number and controller number offsets
- [ ] Dynamic offset adjustment

**Exit Tests (All Must Pass):**
- [ ] ✅ MIDI commands offset correctly based on Source#
- [ ] ✅ Both note and controller offsets work
- [ ] ✅ Offset range (0-127) supported
- [ ] ✅ Real-time offset changes work
- [ ] ✅ Display shows offset values
- [ ] ✅ Offsets apply to all MIDI functions

---

### 25. VolumeCont Parameter

**Scope:** MIDI volume control

**Implementation Requirements:**
- [ ] MIDI controller to volume mapping
- [ ] Real-time volume adjustment
- [ ] Volume range mapping (0-127)

**Exit Tests (All Must Pass):**
- [ ] ✅ MIDI volume adjusts loop playback correctly
- [ ] ✅ Display shows volume changes (0-127)
- [ ] ✅ Real-time volume control response
- [ ] ✅ Volume controller assignment works
- [ ] ✅ Full volume range supported
- [ ] ✅ Volume control affects output correctly

---

### 26. FeedBkCont Parameter

**Scope:** MIDI feedback control

**Implementation Requirements:**
- [ ] MIDI controller to feedback mapping
- [ ] Real-time feedback adjustment
- [ ] Feedback range mapping (0-127)

**Exit Tests (All Must Pass):**
- [ ] ✅ Feedback adjusts via MIDI correctly
- [ ] ✅ Display shows feedback values (0-127)
- [ ] ✅ Real-time feedback control response
- [ ] ✅ Feedback controller assignment works
- [ ] ✅ Full feedback range supported
- [ ] ✅ MIDI feedback matches knob behavior

---

### 27. LoopTrig Parameter

**Scope:** MIDI-triggered loop functions

**Implementation Requirements:**
- [ ] MIDI note triggering of loops
- [ ] Note-to-function mapping
- [ ] Velocity sensitivity

**Exit Tests (All Must Pass):**
- [ ] ✅ Loops trigger correctly via MIDI notes
- [ ] ✅ Display shows MIDI note offsets
- [ ] ✅ Note-to-loop mapping works
- [ ] ✅ Velocity affects triggering
- [ ] ✅ Multiple simultaneous triggers
- [ ] ✅ MIDI trigger timing is accurate

---

### 28. Velocity Parameter

**Scope:** MIDI velocity control

**Implementation Requirements:**
- [ ] Velocity-sensitive triggering
- [ ] Velocity range mapping
- [ ] Velocity-to-parameter mapping

**Exit Tests (All Must Pass):**
- [ ] ✅ Velocity settings affect loop triggering
- [ ] ✅ Display shows MIDI velocity values
- [ ] ✅ Velocity range (0-127) supported
- [ ] ✅ Velocity sensitivity adjustable
- [ ] ✅ Velocity affects function parameters
- [ ] ✅ Real-time velocity response

---

### 29. SamplerStyle Parameter

**Scope:** Loop playback behavior

**Implementation Requirements:**
- [ ] Once, Attack, Continuous playback modes
- [ ] Mode-specific playback behavior
- [ ] MIDI trigger integration

**Exit Tests (All Must Pass):**
- [ ] ✅ Loops play once, attack, or continuously based on SamplerStyle
- [ ] ✅ Once mode plays through once only
- [ ] ✅ Attack mode responds to note-on/off
- [ ] ✅ Continuous mode loops normally
- [ ] ✅ Mode changes affect playback immediately
- [ ] ✅ Works with MIDI triggering

---

## 🔄 Advanced Functions

### 30. Loop/Delay Parameter

**Scope:** Loop vs delay mode operation

**Implementation Requirements:**
- [ ] Loop, Delay, Expert modes
- [ ] Mode-specific behavior
- [ ] Stutter, Replace, Flip functions

**Exit Tests (All Must Pass):**
- [ ] ✅ Loop/Delay modes behave as specified
- [ ] ✅ Stutter mode creates rhythmic effects
- [ ] ✅ Replace mode works in delay
- [ ] ✅ Flip mode reverses delay buffer
- [ ] ✅ Expert mode enables advanced features
- [ ] ✅ Mode transitions work smoothly

---

### 31. Reverse Parameter

**Scope:** Playback direction control

**Implementation Requirements:**
- [ ] Forward/reverse playback toggle
- [ ] Smooth direction transitions
- [ ] Reverse state persistence

**Exit Tests (All Must Pass):**
- [ ] ✅ Reverse toggles playback direction correctly
- [ ] ✅ Display shows "rEV" during reverse
- [ ] ✅ Direction changes are smooth
- [ ] ✅ Reverse state persists across functions
- [ ] ✅ Works with all loop functions
- [ ] ✅ No audio artifacts during transitions

---

### 32. Overflow Parameter

**Scope:** Memory overflow behavior

**Implementation Requirements:**
- [ ] Play, Reset overflow modes
- [ ] Memory monitoring
- [ ] Overflow warning system

**Exit Tests (All Must Pass):**
- [ ] ✅ Overflow triggers Play or Reset modes correctly
- [ ] ✅ Display shows memory status
- [ ] ✅ Memory monitoring works accurately
- [ ] ✅ Overflow warnings appear before limit
- [ ] ✅ Play mode continues with available memory
- [ ] ✅ Reset mode clears oldest loops

---

## 💾 Data Management

### 33. Dump Parameter

**Scope:** Sample dump functionality

**Implementation Requirements:**
- [ ] MIDI sample dump transmission
- [ ] Sample dump reception
- [ ] Dump progress indication

**Exit Tests (All Must Pass):**
- [ ] ✅ Sample dump sends audio data correctly
- [ ] ✅ Sample dump receives audio correctly
- [ ] ✅ Display shows dump status/progress
- [ ] ✅ Dump integrity verification works
- [ ] ✅ Can dump/load multiple loops
- [ ] ✅ Dump format is standard compliant

---

### 34. Load Parameter

**Scope:** Preset and sample loading

**Implementation Requirements:**
- [ ] Preset loading from memory
- [ ] Sample loading via MIDI
- [ ] Load progress indication

**Exit Tests (All Must Pass):**
- [ ] ✅ Presets load correctly from memory
- [ ] ✅ Display shows "LOA" during loading
- [ ] ✅ Loading preserves all parameters
- [ ] ✅ Can load samples via MIDI
- [ ] ✅ Load operation can be cancelled
- [ ] ✅ Error handling for corrupt data

---

### 35. Presets Parameter

**Scope:** Parameter preset system

**Implementation Requirements:**
- [ ] Preset save/load functionality
- [ ] Parameter preservation
- [ ] Preset management system

**Exit Tests (All Must Pass):**
- [ ] ✅ Presets save all parameters correctly
- [ ] ✅ Presets load correctly without artifacts
- [ ] ✅ Display shows preset numbers
- [ ] ✅ Can manage multiple presets
- [ ] ✅ Preset changes take effect immediately
- [ ] ✅ Factory presets work correctly

---

## 📊 Performance Requirements

### System Performance Standards

**All functions must meet these performance criteria:**

- [ ] ✅ **Latency:** <10ms total input-to-output latency
- [ ] ✅ **Timing:** Sample-accurate loop boundaries and function execution
- [ ] ✅ **Audio Quality:** No artifacts, clicks, or dropouts during operation
- [ ] ✅ **Memory:** Efficient memory usage with no leaks
- [ ] ✅ **CPU:** <50% CPU usage during normal operation
- [ ] ✅ **Stability:** No crashes or audio glitches during extended use

### Display and LED Standards

**All functions must provide correct visual feedback:**

- [ ] ✅ **LED Response:** <50ms LED update response time
- [ ] ✅ **Display Accuracy:** All parameter values displayed correctly
- [ ] ✅ **Status Indication:** Clear indication of function states
- [ ] ✅ **Timing Display:** Accurate LoopTime and status displays
- [ ] ✅ **Error Feedback:** Clear error states and recovery

---

## 🎓 Implementation Rules

### **Rule 1: Sequential Implementation**
Functions must be implemented in the order listed. No skipping ahead.

### **Rule 2: Complete Exit Testing**
ALL exit tests must pass before proceeding to the next function.

### **Rule 3: Performance First**
If any function fails performance requirements, implementation stops until fixed.

### **Rule 4: Hardware Fidelity**
All functions must behave identically to the original hardware.

### **Rule 5: No Regression**
New functions cannot break previously working functions.

---

## 📈 Progress Tracking

**Current Status:** Ready to begin with RECORD button implementation

**Functions Completed:** 0/35
**Exit Tests Passed:** 0/35
**Performance Standards Met:** 0/35

---

## 🚨 Failure Protocol

If any exit test fails:

1. **Stop implementation** of new features
2. **Debug and fix** the failing test
3. **Re-test all exit criteria** for the current function
4. **Verify no regression** in previously completed functions
5. **Document the fix** and lessons learned
6. **Proceed only when ALL tests pass**

---

*This rubric ensures systematic, thorough implementation that maintains the musical integrity and performance characteristics of the original Echoplex Digital Pro Plus hardware.*