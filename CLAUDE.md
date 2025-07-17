# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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