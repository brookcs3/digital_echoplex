/**
 * Digital Echo Plex - Advanced Features
 * Plain JavaScript implementation for browser compatibility
 */

// Advanced looper functions for the Digital Echo Plex
class AdvancedLooperFunctions {
  constructor(echoplexEngine) {
    this.echoplexEngine = echoplexEngine;
  }
  
  /**
   * Implement Loop Windowing functionality
   * Creates a subsection of the loop to play
   */
  setLoopWindow(start, end) {
    const state = this.echoplexEngine.getState();
    const currentLoop = state.loops[state.currentLoopIndex];
    
    if (!currentLoop.buffer) return;
    
    // Validate window boundaries
    const validStart = Math.max(0, Math.min(start, currentLoop.endPoint));
    const validEnd = Math.max(validStart, Math.min(end, currentLoop.endPoint));
    
    this.echoplexEngine.setLoopWindow(validStart, validEnd);
  }

  /**
   * Move the loop window forward or backward
   */
  moveLoopWindow(direction, amount) {
    const state = this.echoplexEngine.getState();
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
    
    this.echoplexEngine.setLoopWindow(newStart, newEnd);
  }

  /**
   * Implement Substitute functionality
   * Replaces a section of the loop with new audio
   */
  async startSubstitute() {
    const state = this.echoplexEngine.getState();
    if (!state.isPlaying) return;
    
    // Start recording for substitution
    this.echoplexEngine.startRecording();
    
    // Update state
    state.isReplacing = true;
  }

  /**
   * Stop substitute and replace the section
   */
  async stopSubstitute() {
    const state = this.echoplexEngine.getState();
    if (!state.isReplacing) return;
    
    // Stop the recorder and get the recorded audio
    await this.echoplexEngine.stopRecording();
    
    // Get the current loop
    const currentLoop = state.loops[state.currentLoopIndex];
    
    if (!currentLoop.buffer) return;
    
    // Update state
    state.isReplacing = false;
    
    console.log('Substitute completed');
  }

  /**
   * Implement SUS (Sustain) Commands for real-time granular processing
   */
  startSUSCommand() {
    const state = this.echoplexEngine.getState();
    if (!state.isPlaying) return;
    
    state.isSUSActive = true;
    
    // In a real implementation, this would capture the current playback position
    // and set up granular processing based on that position
    console.log('SUS command activated');
  }

  /**
   * Stop SUS command
   */
  stopSUSCommand() {
    const state = this.echoplexEngine.getState();
    if (!state.isSUSActive) return;
    
    state.isSUSActive = false;
    
    console.log('SUS command deactivated');
  }

  /**
   * Implement MultiIncrease functionality
   * Increases the loop length by a specified factor
   */
  multiIncrease(factor) {
    const state = this.echoplexEngine.getState();
    const currentLoop = state.loops[state.currentLoopIndex];
    
    if (!currentLoop.buffer) return;
    
    // Save the previous state for undo
    this.echoplexEngine.addUndoAction({
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
    const newBuffer = this.echoplexEngine.context.createBuffer(
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
    
    // Restart loop playback with the new extended loop
    this.echoplexEngine.stopLoopPlayback();
    this.echoplexEngine.startLoopPlayback();
    
    console.log(`MultiIncrease by factor ${factor} completed`);
  }

  /**
   * Implement LoopDivide functionality
   * Divides the loop into equal segments
   */
  loopDivide(divisions) {
    const state = this.echoplexEngine.getState();
    const currentLoop = state.loops[state.currentLoopIndex];
    
    if (!currentLoop.buffer) return;
    
    // Calculate the segment size
    const loopDuration = currentLoop.endPoint - currentLoop.startPoint;
    const segmentDuration = loopDuration / divisions;
    
    // Set the loop window to the first segment
    this.echoplexEngine.setLoopWindow(currentLoop.startPoint, currentLoop.startPoint + segmentDuration);
    
    console.log(`Loop divided into ${divisions} segments`);
  }

  /**
   * Implement Tempo Select functionality
   * Sets the tempo for synchronization
   */
  setTempo(bpm) {
    // Update the tempo setting
    this.echoplexEngine.updateSettings({ tempo: bpm });
    
    console.log(`Tempo set to ${bpm} BPM`);
  }

  /**
   * Implement ReAlign functionality
   * Aligns the loop with the current beat/bar position
   */
  reAlign() {
    const state = this.echoplexEngine.getState();
    if (!state.isPlaying) return;
    
    // In a real implementation, this would calculate the current beat position
    // and adjust the loop playback to align with it
    
    // For now, we'll just restart playback
    this.echoplexEngine.stopLoopPlayback();
    this.echoplexEngine.startLoopPlayback();
    
    console.log('ReAlign executed');
  }

  /**
   * Implement quantized recording
   * Starts/stops recording aligned with beats
   */
  async startQuantizedRecording() {
    const settings = this.echoplexEngine.getState().settings;
    
    if (settings.quantize === 'OFF') {
      // If quantize is off, just start recording immediately
      await this.echoplexEngine.startRecording();
      return;
    }
    
    // Otherwise, simulate quantized recording start
    // In a real implementation, this would use precise timing
    setTimeout(() => {
      this.echoplexEngine.startRecording();
    }, 500); // Simulate waiting for next beat
    
    console.log('Recording scheduled to start at next quantize boundary');
  }

  /**
   * Stop quantized recording
   */
  async stopQuantizedRecording() {
    const settings = this.echoplexEngine.getState().settings;
    
    if (settings.quantize === 'OFF') {
      // If quantize is off, just stop recording immediately
      await this.echoplexEngine.stopRecording();
      return;
    }
    
    // Otherwise, simulate quantized recording stop
    // In a real implementation, this would use precise timing
    setTimeout(() => {
      this.echoplexEngine.stopRecording();
    }, 500); // Simulate waiting for next beat
    
    console.log('Recording scheduled to stop at next quantize boundary');
  }
}

// Make available globally
window.AdvancedLooperFunctions = AdvancedLooperFunctions;
