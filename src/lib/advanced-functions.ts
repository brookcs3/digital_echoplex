import * as Tone from 'tone';
import { EchoplexState, Loop, LoopFunction, LoopSettings, UndoAction } from './types';
import { MidiController } from './midi-controller';

/**
 * Advanced looper functions for the Digital Echo Plex
 * Implements specialized features from the Echo Plex manual
 */
export class AdvancedLooperFunctions {
  private audioEngine: any; // Reference to the main audio engine

  constructor(audioEngine: any) {
    this.audioEngine = audioEngine;
  }

  /**
   * Implement Loop Windowing functionality
   * Creates a subsection of the loop to play
   */
  setLoopWindow(start: number, end: number): void {
    const state = this.audioEngine.getState();
    const currentLoop = state.loops[state.currentLoopIndex];
    
    if (!currentLoop.buffer) return;
    
    // Validate window boundaries
    const validStart = Math.max(0, Math.min(start, currentLoop.endPoint));
    const validEnd = Math.max(validStart, Math.min(end, currentLoop.endPoint));
    
    this.audioEngine.setLoopWindow(validStart, validEnd);
  }

  /**
   * Move the loop window forward or backward
   */
  moveLoopWindow(direction: 'forward' | 'backward', amount: number): void {
    const state = this.audioEngine.getState();
    const currentLoop = state.loops[state.currentLoopIndex];
    
    if (!currentLoop.buffer || currentLoop.windowStart === null || currentLoop.windowEnd === null) return;
    
    const windowSize = currentLoop.windowEnd - currentLoop.windowStart;
    let newStart, newEnd;
    
    if (direction === 'forward') {
      newStart = Math.min(currentLoop.windowStart + amount, currentLoop.endPoint - windowSize);
      newEnd = newStart + windowSize;
    } else {
      newStart = Math.max(currentLoop.windowStart - amount, 0);
      newEnd = newStart + windowSize;
    }
    
    this.audioEngine.setLoopWindow(newStart, newEnd);
  }

  /**
   * Implement Substitute functionality
   * Replaces a section of the loop with new audio
   */
  async startSubstitute(): Promise<void> {
    const state = this.audioEngine.getState();
    if (!state.isPlaying) return;
    
    // Start recording for substitution
    this.audioEngine.recorder.start();
    
    // Update state
    state.isReplacing = true;
  }

  /**
   * Stop substitute and replace the section
   */
  async stopSubstitute(): Promise<void> {
    const state = this.audioEngine.getState();
    if (!state.isReplacing) return;
    
    // Stop the recorder and get the recorded audio
    const recording = await this.audioEngine.recorder.stop();
    
    // Create a blob from the recording
    const url = URL.createObjectURL(recording);
    
    // Load the recording into a buffer
    const substituteBuffer = await Tone.Buffer.fromUrl(url);
    
    // Get the current loop
    const currentLoop = state.loops[state.currentLoopIndex];
    
    if (!currentLoop.buffer) return;
    
    // Save the previous state for undo
    this.audioEngine.addUndoAction({
      type: 'SUBSTITUTE',
      loopId: currentLoop.id,
      previousState: { buffer: currentLoop.buffer }
    });
    
    // Determine the section to replace
    // In a real implementation, this would be based on the current playback position
    // and the length of the substitute recording
    const startPos = currentLoop.windowStart !== null ? 
      currentLoop.windowStart : 
      (currentLoop.startPoint || 0);
    
    const endPos = Math.min(
      startPos + substituteBuffer.duration,
      currentLoop.windowEnd !== null ? 
        currentLoop.windowEnd : 
        currentLoop.endPoint
    );
    
    // Create offline context for mixing
    const offlineCtx = new OfflineAudioContext(
      currentLoop.buffer.numberOfChannels,
      currentLoop.buffer.length,
      currentLoop.buffer.sampleRate
    );
    
    // Create source for original buffer
    const originalSource = offlineCtx.createBufferSource();
    originalSource.buffer = currentLoop.buffer;
    
    // Create source for substitute buffer
    const substituteSource = offlineCtx.createBufferSource();
    substituteSource.buffer = substituteBuffer.get();
    
    // Create gain nodes
    const originalGain = offlineCtx.createGain();
    const substituteGain = offlineCtx.createGain();
    
    // Connect nodes
    originalSource.connect(originalGain);
    substituteSource.connect(substituteGain);
    originalGain.connect(offlineCtx.destination);
    substituteGain.connect(offlineCtx.destination);
    
    // Calculate sample positions
    const startSample = Math.floor(startPos * currentLoop.buffer.sampleRate);
    const endSample = Math.floor(endPos * currentLoop.buffer.sampleRate);
    
    // Mute original during substitution
    originalGain.gain.setValueAtTime(1, 0);
    originalGain.gain.setValueAtTime(0, startPos);
    originalGain.gain.setValueAtTime(1, endPos);
    
    // Start sources
    originalSource.start();
    substituteSource.start(startPos);
    
    // Render the mix
    const renderedBuffer = await offlineCtx.startRendering();
    
    // Update the loop buffer
    currentLoop.buffer = renderedBuffer;
    
    // Update the player with the new buffer
    if (this.audioEngine.player) {
      this.audioEngine.player.buffer.set(currentLoop.buffer);
    }
    
    // Update state
    state.isReplacing = false;
    
    console.log('Substitute completed');
  }

  /**
   * Implement SUS (Sustain) Commands for real-time granular processing
   */
  startSUSCommand(): void {
    const state = this.audioEngine.getState();
    if (!state.isPlaying) return;
    
    state.isSUSActive = true;
    
    // In a real implementation, this would capture the current playback position
    // and set up granular processing based on that position
    console.log('SUS command activated');
  }

  /**
   * Stop SUS command
   */
  stopSUSCommand(): void {
    const state = this.audioEngine.getState();
    if (!state.isSUSActive) return;
    
    state.isSUSActive = false;
    
    console.log('SUS command deactivated');
  }

  /**
   * Implement MultiIncrease functionality
   * Increases the loop length by a specified factor
   */
  multiIncrease(factor: number): void {
    const state = this.audioEngine.getState();
    const currentLoop = state.loops[state.currentLoopIndex];
    
    if (!currentLoop.buffer) return;
    
    // Save the previous state for undo
    this.audioEngine.addUndoAction({
      type: 'MULTI_INCREASE',
      loopId: currentLoop.id,
      previousState: { 
        buffer: currentLoop.buffer,
        endPoint: currentLoop.endPoint
      }
    });
    
    // Calculate the new loop length
    const originalDuration = currentLoop.endPoint - currentLoop.startPoint;
    const newDuration = originalDuration * factor;
    
    // Create a new buffer with the increased length
    const newBuffer = this.audioEngine.context.createBuffer(
      currentLoop.buffer.numberOfChannels,
      currentLoop.buffer.length * factor,
      currentLoop.buffer.sampleRate
    );
    
    // Copy the original buffer data
    for (let channel = 0; channel < currentLoop.buffer.numberOfChannels; channel++) {
      const originalData = currentLoop.buffer.getChannelData(channel);
      const newData = newBuffer.getChannelData(channel);
      
      // Copy original data multiple times
      for (let i = 0; i < factor; i++) {
        newData.set(originalData, i * originalData.length);
      }
    }
    
    // Update the loop
    currentLoop.buffer = newBuffer;
    currentLoop.endPoint = newDuration;
    
    // Update the player
    if (this.audioEngine.player) {
      this.audioEngine.player.buffer.set(newBuffer);
    }
    
    console.log(`MultiIncrease by factor ${factor} completed`);
    
    // Restart loop playback with the new extended loop
    this.audioEngine.stopLoopPlayback();
    this.audioEngine.startLoopPlayback();
  }

  /**
   * Implement LoopDivide functionality
   * Divides the loop into equal segments
   */
  loopDivide(divisions: number): void {
    const state = this.audioEngine.getState();
    const currentLoop = state.loops[state.currentLoopIndex];
    
    if (!currentLoop.buffer) return;
    
    // Calculate the segment size
    const loopDuration = currentLoop.endPoint - currentLoop.startPoint;
    const segmentDuration = loopDuration / divisions;
    
    // Set the loop window to the first segment
    this.audioEngine.setLoopWindow(currentLoop.startPoint, currentLoop.startPoint + segmentDuration);
    
    console.log(`Loop divided into ${divisions} segments`);
  }

  /**
   * Implement Tempo Select functionality
   * Sets the tempo for synchronization
   */
  setTempo(bpm: number): void {
    // Update the tempo setting
    this.audioEngine.updateSettings({ tempo: bpm });
    
    // Set Tone.js transport tempo
    Tone.Transport.bpm.value = bpm;
    
    console.log(`Tempo set to ${bpm} BPM`);
  }

  /**
   * Implement synchronization with external clock
   */
  syncToExternalClock(enabled: boolean, midi?: MidiController): void {
    if (enabled) {
      Tone.Transport.syncSource = 'midi';

      if (midi) {
        midi.onStart = () => this.audioEngine.startLoopPlayback();
        midi.onStop = () => this.audioEngine.stopLoopPlayback();
        midi.onTempo = (bpm: number) => this.setTempo(Math.round(bpm));
      }

      console.log('Synced to external MIDI clock');
    } else {
      Tone.Transport.syncSource = 'transport';
      if (midi) {
        midi.onStart = undefined;
        midi.onStop = undefined;
        midi.onTempo = undefined;
      }
      console.log('Using internal clock');
    }
  }

  /**
   * Implement ReAlign functionality
   * Aligns the loop with the current beat/bar position
   */
  reAlign(): void {
    const state = this.audioEngine.getState();
    if (!state.isPlaying) return;
    
    // In a real implementation, this would calculate the current beat position
    // and adjust the loop playback to align with it
    
    // For now, we'll just restart playback on the next beat
    const currentTime = Tone.Transport.seconds;
    const nextBeatTime = Tone.Transport.nextSubdivision('4n');
    
    this.audioEngine.stopLoopPlayback();
    
    // Schedule restart at the next beat
    Tone.Transport.scheduleOnce(() => {
      this.audioEngine.startLoopPlayback();
    }, nextBeatTime);
    
    console.log('ReAlign executed');
  }

  /**
   * Implement quantized recording
   * Starts/stops recording aligned with beats
   */
  async startQuantizedRecording(): Promise<void> {
    const settings = this.audioEngine.getState().settings;
    
    if (settings.quantize === 'OFF') {
      // If quantize is off, just start recording immediately
      await this.audioEngine.startRecording();
      return;
    }
    
    // Otherwise, schedule recording to start on the next appropriate boundary
    let quantizeTime;
    
    switch (settings.quantize) {
      case 'LOOP':
        // Start on loop boundary (not implemented in this example)
        quantizeTime = Tone.Transport.nextSubdivision('1m');
        break;
      case '8TH':
        // Start on eighth note boundary
        quantizeTime = Tone.Transport.nextSubdivision('8n');
        break;
      case 'CYC':
        // Start on cycle boundary (using measure as approximation)
        quantizeTime = Tone.Transport.nextSubdivision('1m');
        break;
      default:
        quantizeTime = 0;
    }
    
    if (quantizeTime > 0) {
      Tone.Transport.scheduleOnce(() => {
        this.audioEngine.startRecording();
      }, quantizeTime);
      
      console.log('Recording scheduled to start at next quantize boundary');
    } else {
      await this.audioEngine.startRecording();
    }
  }

  /**
   * Stop quantized recording
   */
  async stopQuantizedRecording(): Promise<void> {
    const settings = this.audioEngine.getState().settings;
    
    if (settings.quantize === 'OFF') {
      // If quantize is off, just stop recording immediately
      await this.audioEngine.stopRecording();
      return;
    }
    
    // Otherwise, schedule recording to stop on the next appropriate boundary
    let quantizeTime;
    
    switch (settings.quantize) {
      case 'LOOP':
        // Stop on loop boundary (not implemented in this example)
        quantizeTime = Tone.Transport.nextSubdivision('1m');
        break;
      case '8TH':
        // Stop on eighth note boundary
        quantizeTime = Tone.Transport.nextSubdivision('8n');
        break;
      case 'CYC':
        // Stop on cycle boundary (using measure as approximation)
        quantizeTime = Tone.Transport.nextSubdivision('1m');
        break;
      default:
        quantizeTime = 0;
    }
    
    if (quantizeTime > 0) {
      Tone.Transport.scheduleOnce(() => {
        this.audioEngine.stopRecording();
      }, quantizeTime);
      
      console.log('Recording scheduled to stop at next quantize boundary');
    } else {
      await this.audioEngine.stopRecording();
    }
  }
}
