# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Digital Echo Plex is a web-based implementation of the Echo Plex hardware looper using the Web Audio API and Tone.js. The project faithfully recreates the functionality of the original hardware while adding visual feedback and browser-based accessibility.

## Development Commands

### Core Development
- **Start development server**: `npm run dev` or `npm start`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Run tests**: `npm test`
- **Format code**: `npm run format`
- **Check formatting**: `npm run format:check`

### Testing
- Tests use Jest with jsdom environment for browser API simulation
- Test setup includes Tone.js mocking in `__mocks__/tone.ts`
- TypeScript support via ts-jest with ESM preset

## Architecture

### Core Components

**Audio Engine** (`src/lib/audio-engine.ts`)
- Main `EchoplexAudioEngine` class handles all audio processing
- Built on Tone.js for Web Audio API abstraction
- Manages recording, playback, overdubbing, and loop manipulation
- Handles microphone input, gain controls, and effects chain

**Type System** (`src/lib/types.ts`)
- `EchoplexState`: Current engine state (recording, playing, overdubbing, etc.)
- `Loop`: Individual loop properties (buffer, points, effects)
- `LoopSettings`: User preferences and audio parameters
- `LoopFunction`: Enumeration of all available loop operations

### Audio Processing Chain
1. Microphone input → Input Gain
2. Input Gain → Recorder, Analyser, and Mixer
3. Mixer combines input and loop playback
4. Feedback Delay for echo effects
5. Output Gain → Destination

### Interface Modes
- **LOOP**: Standard looping behavior
- **STUTTER**: Rapid retrigger using stutterLength
- **DELAY**: Adds delay with configurable delayTime
- **EXPERT**: Enables both stutter and delay
- Additional modes: INPUT, OUTPUT, REPLACE, FLIP

### Loop Functions
Core operations include: RECORD, OVERDUB, MULTIPLY, INSERT, REPLACE, UNDO, MUTE, REVERSE, HALF_SPEED, NEXT_LOOP, PREVIOUS_LOOP, RESET, RETRIGGER, START_POINT, LOOP_WINDOW, SUBSTITUTE, SUS_COMMAND, MULTI_INCREASE, LOOP_DIVIDE

## File Structure

### Source Code (`src/`)
- `lib/`: Core TypeScript libraries (audio-engine.ts, types.ts)
- `pages/`: Astro pages (index.astro is main interface)
- `scripts/`: JavaScript files for browser execution
- `styles/`: SCSS and CSS styling
- `components/`: Astro components (if present)

### Build Output (`dist/`)
- Contains production-ready files
- JavaScript bundled into `scripts/` directory
- CSS compiled to `styles/`

### Public Assets (`public/`)
- Static files served directly
- Mirror of `src/scripts/` and `src/styles/` for development

## Technical Considerations

### Browser Compatibility
- Requires modern browsers with Web Audio API support
- Audio context initialization requires user interaction
- Mobile browsers have stricter audio policies

### Audio Processing
- Maximum 120-second recording time
- Waveform visualization via Tone.Analyser
- Microphone monitoring modes: "RECORDING_ONLY" (default) vs "ALWAYS_ON"

### State Management
- Settings persisted to localStorage
- Preset system for saving/loading configurations
- Real-time visual feedback for recording status

## Development Notes

### Astro Configuration
- TypeScript support with strict mode
- SCSS preprocessing with global imports
- Custom build output naming for scripts and assets
- Path aliases: `@` resolves to `src/`

### Audio Context Management
- Explicit power-on sequence required for audio initialization
- Error handling for unsupported browsers
- Microphone permission handling

### Loop Behavior
- SWITCH vs TOGGLE modes for record button
- Quantization options: OFF, LOOP, 8TH, CYC
- Advanced features: loop windowing, multiply, insert modes

### Testing Strategy
- Jest configured for TypeScript and ESM modules
- Tone.js mocked for test environments
- jsdom for browser API simulation