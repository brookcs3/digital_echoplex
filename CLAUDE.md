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
- **Current Function:** RECORD button (Function 1/35)
- **Exit Tests Passed:** 0/6 for RECORD
- **Overall Progress:** 0/35 functions complete

### Key Architecture
- Central action bus with `dispatch()` for all state changes
- Layer-based system: SystemLayer, BLKLayer, ParameterLayer, etc.
- AudioWorklet processor for real-time audio (<10ms latency)
- Sample-accurate timing for all loop boundaries

## LED Implementation

### LED State Management
- LEDs use `data-hw-state` attributes for styling (not CSS classes)
- SCSS selectors target: `[data-hw-state="on"]`, `[data-hw-state="off"]`, etc.

### Startup LED Flash (echoplex-minimal.js:152)
- `flashStartupLEDs()` function flashes 7 action button LEDs on power-on
- Uses `led.setAttribute('data-hw-state', 'on')` to turn on
- Uses `led.setAttribute('data-hw-state', 'off')` to turn off
- 400ms flash duration with 80ms stagger between LEDs
- Targets buttons: record, overdub, multiply, insert, mute, undo, nextloop