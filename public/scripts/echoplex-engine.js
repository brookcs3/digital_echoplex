/**
 * Digital Echo Plex - Audio Engine
 * Plain JavaScript implementation for browser compatibility
 */

// Global class for the Echo Plex Audio Engine
class EchoplexAudioEngine {
  constructor() {
    // Initialize audio context
    this.context = null;
    this.initAudioContext();
    
    // Initialize state
    this.state = {
      isRecording: false,
      isPlaying: false,
      isOverdubbing: false,
      isMultiplying: false,
      isReplacing: false,
      isSUSActive: false,
      isFunctionActive: false,
      currentLoopIndex: 0,
      recordStartTime: null,
      loopDuration: 0,
      recordMode: 'SWITCH', // SWITCH or TOGGLE
      loops: [],
      settings: {
        quantize: 'OFF',
        switchQuant: 'OFF',
        insertMode: 'INS',
        overdubMode: 'SWITCH', // Set to SWITCH initially as requested
        interfaceMode: 'LOOP',
        samplerStyle: 'PLAY',
        tempo: 120,
        cycleBeats: 8,
        feedback: 1.0, // Set to maximum by default as requested
        inputGain: 0.8,
        outputGain: 0.8,
        mix: 0.5
      },
      undoStack: []
    };
    
    // Maximum recording time in seconds (as per hardware specs)
    this.MAX_RECORDING_TIME = 120;
    
    // Create initial empty loops
    for (let i = 0; i < 8; i++) {
      this.state.loops.push({
        id: `loop-${i}`,
        buffer: null,
        startPoint: 0,
        endPoint: 0,
        windowStart: null,
        windowEnd: null,
        isReversed: false,
        isHalfSpeed: false,
        isMuted: false
      });
    }
    
    // Initialize audio nodes
    this.inputNode = null;
    this.outputNode = null;
    this.recorder = null;
    this.player = null;
    
    // Timer for checking recording duration
    this.recordingTimer = null;
    
    console.log('EchoplexAudioEngine initialized');
  }
  
  // Initialize audio context
  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();
      console.log('Audio context initialized');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }
  
  // Initialize microphone input
  async initMicrophone() {
    if (!this.context) {
      throw new Error('Audio context not initialized');
    }
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          latency: 0.01
        }
      });
      
      // Create input node
      this.inputNode = this.context.createMediaStreamSource(stream);
      
      // Create gain nodes
      this.inputGain = this.context.createGain();
      this.outputGain = this.context.createGain();
      
      // Set initial gain values
      this.inputGain.gain.value = this.state.settings.inputGain;
      this.outputGain.gain.value = this.state.settings.outputGain;
      
      // Connect nodes
      this.inputNode.connect(this.inputGain);
      this.inputGain.connect(this.outputGain);
      this.outputGain.connect(this.context.destination);
      
      // Create recorder
      this.recorder = new MediaRecorder(stream);
      this.recordedChunks = [];
      
      // Set up recorder events
      this.recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      
      console.log('Microphone initialized');
      return true;
      
    } catch (error) {
      console.error('Error initializing microphone:', error);
      throw new Error('Failed to access microphone. Please check permissions.');
    }
  }
  
  // Get current state
  getState() {
    return this.state;
  }
  
  // Update settings
  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    
    // Apply settings to audio nodes
    if (this.inputGain && newSettings.inputGain !== undefined) {
      this.inputGain.gain.value = newSettings.inputGain;
    }
    
    if (this.outputGain && newSettings.outputGain !== undefined) {
      this.outputGain.gain.value = newSettings.outputGain;
    }
    
    console.log('Settings updated:', newSettings);
  }
  
  // Set record mode (SWITCH or TOGGLE)
  setRecordMode(mode) {
    if (mode !== 'SWITCH' && mode !== 'TOGGLE') {
      console.error('Invalid record mode:', mode);
      return;
    }
    
    this.state.recordMode = mode;
    console.log(`Record mode set to ${mode}`);
  }
  
  // Toggle function mode
  toggleFunctionMode() {
    this.state.isFunctionActive = !this.state.isFunctionActive;
    console.log(`Function mode ${this.state.isFunctionActive ? 'activated' : 'deactivated'}`);
    return this.state.isFunctionActive;
  }
  
  // Start recording
  async startRecording() {
    if (!this.recorder) {
      throw new Error('Recorder not initialized');
    }
    
    if (this.state.isRecording) {
      return;
    }
    
    // Reset recorded chunks
    this.recordedChunks = [];
    
    // Start recording
    this.recorder.start();
    this.state.isRecording = true;
    
    // Store the start time for the timer
    this.state.recordStartTime = this.context.currentTime;
    
    // Set up timer to check recording duration
    this.recordingTimer = setInterval(() => {
      const currentDuration = this.getCurrentRecordingTime();
      
      // If we've reached the maximum recording time, stop recording
      if (currentDuration >= this.MAX_RECORDING_TIME) {
        console.log('Maximum recording time reached, stopping recording');
        this.stopRecording();
      }
    }, 100); // Check every 100ms
    
    console.log('Recording started');
  }
  
  // Stop recording
  async stopRecording() {
    if (!this.recorder || !this.state.isRecording) {
      return;
    }
    
    // Clear the recording timer
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
    
    return new Promise((resolve) => {
      this.recorder.onstop = async () => {
        // Calculate loop duration
        this.state.loopDuration = this.context.currentTime - this.state.recordStartTime;
        
        // Create blob from recorded chunks
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        try {
          // Create audio buffer from blob
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
          
          // Save previous state for undo
          this.addUndoAction({
            type: 'RECORD',
            loopId: this.state.loops[this.state.currentLoopIndex].id,
            previousState: { 
              buffer: this.state.loops[this.state.currentLoopIndex].buffer,
              startPoint: this.state.loops[this.state.currentLoopIndex].startPoint,
              endPoint: this.state.loops[this.state.currentLoopIndex].endPoint
            }
          });
          
          // Update loop
          this.state.loops[this.state.currentLoopIndex].buffer = audioBuffer;
          this.state.loops[this.state.currentLoopIndex].startPoint = 0;
          this.state.loops[this.state.currentLoopIndex].endPoint = audioBuffer.duration;
          
          // Start playback
          this.startLoopPlayback();
          
          console.log('Recording stopped and saved');
          resolve(true);
          
        } catch (error) {
          console.error('Error processing recording:', error);
          resolve(false);
        }
      };
      
      // Stop recording
      this.recorder.stop();
      this.state.isRecording = false;
    });
  }
  
  // Get current recording time
  getCurrentRecordingTime() {
    if (!this.state.isRecording || this.state.recordStartTime === null) {
      return 0;
    }
    
    return this.context.currentTime - this.state.recordStartTime;
  }
  
  // Get loop duration
  getLoopDuration() {
    return this.state.loopDuration;
  }
  
  // Get current playback position
  getCurrentPlaybackPosition() {
    if (!this.state.isPlaying || !this.player) {
      return 0;
    }
    
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    const loopStart = currentLoop.windowStart !== null ? currentLoop.windowStart : currentLoop.startPoint;
    const loopEnd = currentLoop.windowEnd !== null ? currentLoop.windowEnd : currentLoop.endPoint;
    const loopDuration = loopEnd - loopStart;
    
    // Calculate position based on audio context time
    const elapsed = (this.context.currentTime - this.playbackStartTime) % loopDuration;
    return loopStart + elapsed;
  }
  
  // Start loop playback
  startLoopPlayback() {
    if (this.state.isPlaying) {
      return;
    }
    
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    if (!currentLoop.buffer) {
      console.log('No loop to play');
      return;
    }
    
    // Create buffer source
    this.player = this.context.createBufferSource();
    this.player.buffer = currentLoop.buffer;
    
    // Set playback rate based on half-speed setting
    this.player.playbackRate.value = currentLoop.isHalfSpeed ? 0.5 : 1;
    
    // Set reverse playback if needed
    if (currentLoop.isReversed) {
      // Create a reversed buffer
      const reversedBuffer = this.createReversedBuffer(currentLoop.buffer);
      this.player.buffer = reversedBuffer;
    }
    
    // Connect player to output
    if (currentLoop.isMuted) {
      // Don't connect if muted
    } else {
      this.player.connect(this.outputGain);
    }
    
    // Set loop points
    const loopStart = currentLoop.windowStart !== null ? currentLoop.windowStart : currentLoop.startPoint;
    const loopEnd = currentLoop.windowEnd !== null ? currentLoop.windowEnd : currentLoop.endPoint;
    
    // Start playback with looping
    this.player.loop = true;
    this.player.loopStart = loopStart;
    this.player.loopEnd = loopEnd;
    this.player.start(0, loopStart);
    
    // Store playback start time for position tracking
    this.playbackStartTime = this.context.currentTime;
    
    this.state.isPlaying = true;
    
    console.log('Playback started');
  }
  
  // Stop loop playback
  stopLoopPlayback() {
    if (!this.state.isPlaying || !this.player) {
      return;
    }
    
    // Stop player
    this.player.stop();
    this.player.disconnect();
    this.player = null;
    
    this.state.isPlaying = false;
    
    console.log('Playback stopped');
  }
  
  // Start overdub
  async startOverdub() {
    if (!this.recorder || !this.state.isPlaying) {
      return;
    }
    
    if (this.state.isOverdubbing) {
      return;
    }
    
    // Reset recorded chunks
    this.recordedChunks = [];
    
    // Start recording
    this.recorder.start();
    this.state.isOverdubbing = true;
    
    // Store the start time for the timer
    this.state.recordStartTime = this.context.currentTime;
    
    // Set up timer to check recording duration
    this.recordingTimer = setInterval(() => {
      const currentDuration = this.getCurrentRecordingTime();
      
      // If we've reached the maximum recording time, stop recording
      if (currentDuration >= this.MAX_RECORDING_TIME) {
        console.log('Maximum recording time reached, stopping overdub');
        this.stopOverdub();
      }
    }, 100); // Check every 100ms
    
    console.log('Overdub started');
  }
  
  // Stop overdub
  async stopOverdub() {
    if (!this.recorder || !this.state.isOverdubbing) {
      return;
    }
    
    // Clear the recording timer
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
    
    return new Promise((resolve) => {
      this.recorder.onstop = async () => {
        // Create blob from recorded chunks
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        try {
          // Create audio buffer from blob
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const overdubBuffer = await this.context.decodeAudioData(arrayBuffer);
          
          // Get current loop
          const currentLoop = this.state.loops[this.state.currentLoopIndex];
          
          if (!currentLoop.buffer) {
            console.log('No loop to overdub');
            resolve(false);
            return;
          }
          
          // Save previous state for undo
          this.addUndoAction({
            type: 'OVERDUB',
            loopId: currentLoop.id,
            previousState: { buffer: currentLoop.buffer }
          });
          
          // Mix original and overdub buffers
          const mixedBuffer = this.mixBuffers(currentLoop.buffer, overdubBuffer);
          
          // Update loop
          currentLoop.buffer = mixedBuffer;
          
          // Restart playback with new buffer
          this.stopLoopPlayback();
          this.startLoopPlayback();
          
          console.log('Overdub stopped and mixed');
          resolve(true);
          
        } catch (error) {
          console.error('Error processing overdub:', error);
          resolve(false);
        }
      };
      
      // Stop recording
      this.recorder.stop();
      this.state.isOverdubbing = false;
    });
  }
  
  // Start insert (replace mode)
  async startInsert() {
    // If function mode is active, this becomes reverse instead
    if (this.state.isFunctionActive) {
      this.reverseLoop();
      this.state.isFunctionActive = false; // Deactivate function mode after use
      return;
    }
    
    if (!this.recorder || !this.state.isPlaying) {
      return;
    }
    
    if (this.state.isReplacing) {
      return;
    }
    
    // Reset recorded chunks
    this.recordedChunks = [];
    
    // Start recording
    this.recorder.start();
    this.state.isReplacing = true;
    
    // Store the start time and position for the insert
    this.state.recordStartTime = this.context.currentTime;
    this.insertStartPosition = this.getCurrentPlaybackPosition();
    
    // Set up timer to check recording duration
    this.recordingTimer = setInterval(() => {
      const currentDuration = this.getCurrentRecordingTime();
      
      // If we've reached the maximum recording time, stop recording
      if (currentDuration >= this.MAX_RECORDING_TIME) {
        console.log('Maximum recording time reached, stopping insert');
        this.stopInsert();
      }
    }, 100); // Check every 100ms
    
    console.log('Insert started');
  }
  
  // Stop insert
  async stopInsert() {
    if (!this.recorder || !this.state.isReplacing) {
      return;
    }
    
    // Clear the recording timer
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
    
    return new Promise((resolve) => {
      this.recorder.onstop = async () => {
        // Create blob from recorded chunks
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        try {
          // Create audio buffer from blob
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const insertBuffer = await this.context.decodeAudioData(arrayBuffer);
          
          // Get current loop
          const currentLoop = this.state.loops[this.state.currentLoopIndex];
          
          if (!currentLoop.buffer) {
            console.log('No loop to insert into');
            resolve(false);
            return;
          }
          
          // Save previous state for undo
          this.addUndoAction({
            type: 'INSERT',
            loopId: currentLoop.id,
            previousState: { buffer: currentLoop.buffer }
          });
          
          // Calculate insert position and duration
          const insertDuration = insertBuffer.duration;
          const insertPosition = this.insertStartPosition - currentLoop.startPoint;
          
          // Replace section of the original buffer with the insert buffer
          const replacedBuffer = this.replaceBufferSection(
            currentLoop.buffer,
            insertBuffer,
            insertPosition,
            insertDuration
          );
          
          // Update loop
          currentLoop.buffer = replacedBuffer;
          
          // Restart playback with new buffer
          this.stopLoopPlayback();
          this.startLoopPlayback();
          
          console.log('Insert stopped and replaced section');
          resolve(true);
          
        } catch (error) {
          console.error('Error processing insert:', error);
          resolve(false);
        }
      };
      
      // Stop recording
      this.recorder.stop();
      this.state.isReplacing = false;
    });
  }
  
  // Replace a section of a buffer with another buffer
  replaceBufferSection(originalBuffer, newBuffer, position, duration) {
    // Create a new buffer with the same length as the original
    const replacedBuffer = this.context.createBuffer(
      originalBuffer.numberOfChannels,
      originalBuffer.length,
      originalBuffer.sampleRate
    );
    
    // Calculate sample positions
    const positionSample = Math.floor(position * originalBuffer.sampleRate);
    const durationSamples = Math.floor(duration * originalBuffer.sampleRate);
    
    // Copy and replace data for each channel
    for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
      const originalData = originalBuffer.getChannelData(channel);
      const newData = channel < newBuffer.numberOfChannels ? 
                      newBuffer.getChannelData(channel) : 
                      new Float32Array(durationSamples).fill(0);
      const replacedData = replacedBuffer.getChannelData(channel);
      
      // Copy data before insert position
      for (let i = 0; i < positionSample; i++) {
        replacedData[i] = originalData[i];
      }
      
      // Copy new data at insert position
      for (let i = 0; i < durationSamples; i++) {
        if (positionSample + i < replacedData.length && i < newData.length) {
          replacedData[positionSample + i] = newData[i];
        }
      }
      
      // Copy data after insert
      for (let i = positionSample + durationSamples; i < originalData.length; i++) {
        if (i < replacedData.length) {
          replacedData[i] = originalData[i];
        }
      }
    }
    
    return replacedBuffer;
  }
  
  // Start multiply
  startMultiply() {
    if (!this.state.isPlaying) {
      return;
    }
    
    this.state.isMultiplying = true;
    this.multiplyStartTime = this.context.currentTime;
    
    console.log('Multiply started');
  }
  
  // Stop multiply
  async stopMultiply() {
    if (!this.state.isMultiplying) {
      return;
    }
    
    // Calculate multiply duration
    const multiplyDuration = this.context.currentTime - this.multiplyStartTime;
    
    // Get current loop
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    if (!currentLoop.buffer) {
      console.log('No loop to multiply');
      this.state.isMultiplying = false;
      return;
    }
    
    // Save previous state for undo
    this.addUndoAction({
      type: 'MULTIPLY',
      loopId: currentLoop.id,
      previousState: { 
        buffer: currentLoop.buffer,
        endPoint: currentLoop.endPoint
      }
    });
    
    // Calculate new loop length
    const originalDuration = currentLoop.endPoint - currentLoop.startPoint;
    const cycles = Math.ceil(multiplyDuration / originalDuration);
    const newDuration = originalDuration * (cycles + 1);
    
    // Ensure we don't exceed the maximum recording time
    if (newDuration > this.MAX_RECORDING_TIME) {
      console.log(`Multiply would exceed maximum recording time (${this.MAX_RECORDING_TIME}s), limiting to max`);
      const maxCycles = Math.floor(this.MAX_RECORDING_TIME / originalDuration) - 1;
      const limitedDuration = originalDuration * (maxCycles + 1);
      
      // Create a new buffer with the increased length
      const newBuffer = this.context.createBuffer(
        currentLoop.buffer.numberOfChannels,
        Math.ceil(limitedDuration * currentLoop.buffer.sampleRate),
        currentLoop.buffer.sampleRate
      );
      
      // Copy the original buffer data multiple times
      for (let channel = 0; channel < currentLoop.buffer.numberOfChannels; channel++) {
        const originalData = currentLoop.buffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        
        // Copy original data multiple times
        for (let i = 0; i <= maxCycles; i++) {
          const offset = i * originalData.length;
          for (let j = 0; j < originalData.length; j++) {
            if (offset + j < newData.length) {
              newData[offset + j] = originalData[j];
            }
          }
        }
      }
      
      // Update the loop
      currentLoop.buffer = newBuffer;
      currentLoop.endPoint = limitedDuration;
      
      console.log(`Multiply limited to ${maxCycles + 1} cycles due to maximum recording time`);
    } else {
      // Create a new buffer with the increased length
      const newBuffer = this.context.createBuffer(
        currentLoop.buffer.numberOfChannels,
        Math.ceil(newDuration * currentLoop.buffer.sampleRate),
        currentLoop.buffer.sampleRate
      );
      
      // Copy the original buffer data multiple times
      for (let channel = 0; channel < currentLoop.buffer.numberOfChannels; channel++) {
        const originalData = currentLoop.buffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        
        // Copy original data multiple times
        for (let i = 0; i <= cycles; i++) {
          const offset = i * originalData.length;
          for (let j = 0; j < originalData.length; j++) {
            if (offset + j < newData.length) {
              newData[offset + j] = originalData[j];
            }
          }
        }
      }
      
      // Update the loop
      currentLoop.buffer = newBuffer;
      currentLoop.endPoint = newDuration;
      
      console.log(`Multiply completed with ${cycles + 1} cycles`);
    }
    
    // Restart playback with new buffer
    this.stopLoopPlayback();
    this.startLoopPlayback();
    
    this.state.isMultiplying = false;
  }
  
  // Reverse loop
  reverseLoop() {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    if (!currentLoop.buffer) {
      return;
    }
    
    // Toggle reversed state
    currentLoop.isReversed = !currentLoop.isReversed;
    
    // If playing, restart with reversed buffer
    if (this.state.isPlaying) {
      this.stopLoopPlayback();
      this.startLoopPlayback();
    }
    
    console.log(`Loop ${currentLoop.isReversed ? 'reversed' : 'normal'}`);
  }
  
  // Toggle half-speed
  toggleHalfSpeed() {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    if (!currentLoop.buffer) {
      return;
    }
    
    // Toggle half-speed state
    currentLoop.isHalfSpeed = !currentLoop.isHalfSpeed;
    
    // If playing, update playback rate
    if (this.state.isPlaying && this.player) {
      this.player.playbackRate.value = currentLoop.isHalfSpeed ? 0.5 : 1;
    }
    
    console.log(`Loop ${currentLoop.isHalfSpeed ? 'half-speed' : 'normal speed'}`);
  }
  
  // Toggle mute
  toggleMute() {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    if (!currentLoop.buffer) {
      return;
    }
    
    // Toggle mute state
    currentLoop.isMuted = !currentLoop.isMuted;
    
    // If playing, update connections
    if (this.state.isPlaying && this.player) {
      if (currentLoop.isMuted) {
        this.player.disconnect();
      } else {
        this.player.connect(this.outputGain);
      }
    }
    
    console.log(`Loop ${currentLoop.isMuted ? 'muted' : 'unmuted'}`);
  }
  
  // Reset loop
  resetLoop() {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save previous state for undo
    if (currentLoop.buffer) {
      this.addUndoAction({
        type: 'RESET',
        loopId: currentLoop.id,
        previousState: { 
          buffer: currentLoop.buffer,
          startPoint: currentLoop.startPoint,
          endPoint: currentLoop.endPoint,
          windowStart: currentLoop.windowStart,
          windowEnd: currentLoop.windowEnd,
          isReversed: currentLoop.isReversed,
          isHalfSpeed: currentLoop.isHalfSpeed,
          isMuted: currentLoop.isMuted
        }
      });
    }
    
    // Stop playback if playing
    if (this.state.isPlaying) {
      this.stopLoopPlayback();
    }
    
    // Reset loop properties
    currentLoop.buffer = null;
    currentLoop.startPoint = 0;
    currentLoop.endPoint = 0;
    currentLoop.windowStart = null;
    currentLoop.windowEnd = null;
    currentLoop.isReversed = false;
    currentLoop.isHalfSpeed = false;
    currentLoop.isMuted = false;
    
    console.log('Loop reset');
  }
  
  // Next loop
  nextLoop() {
    // Stop playback if playing
    if (this.state.isPlaying) {
      this.stopLoopPlayback();
    }
    
    // Increment loop index
    this.state.currentLoopIndex = (this.state.currentLoopIndex + 1) % this.state.loops.length;
    
    // Start playback if new loop has content
    if (this.state.loops[this.state.currentLoopIndex].buffer) {
      this.startLoopPlayback();
    }
    
    console.log(`Switched to loop ${this.state.currentLoopIndex + 1}`);
  }
  
  // Previous loop
  previousLoop() {
    // Stop playback if playing
    if (this.state.isPlaying) {
      this.stopLoopPlayback();
    }
    
    // Decrement loop index
    this.state.currentLoopIndex = (this.state.currentLoopIndex - 1 + this.state.loops.length) % this.state.loops.length;
    
    // Start playback if new loop has content
    if (this.state.loops[this.state.currentLoopIndex].buffer) {
      this.startLoopPlayback();
    }
    
    console.log(`Switched to loop ${this.state.currentLoopIndex + 1}`);
  }
  
  // Set loop window
  setLoopWindow(start, end) {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    if (!currentLoop.buffer) {
      return;
    }
    
    // Save previous state for undo
    this.addUndoAction({
      type: 'WINDOW',
      loopId: currentLoop.id,
      previousState: { 
        windowStart: currentLoop.windowStart,
        windowEnd: currentLoop.windowEnd
      }
    });
    
    // Set window points
    currentLoop.windowStart = start;
    currentLoop.windowEnd = end;
    
    // If playing, update loop points
    if (this.state.isPlaying && this.player) {
      const loopStart = currentLoop.windowStart !== null ? currentLoop.windowStart : currentLoop.startPoint;
      const loopEnd = currentLoop.windowEnd !== null ? currentLoop.windowEnd : currentLoop.endPoint;
      
      this.player.loopStart = loopStart;
      this.player.loopEnd = loopEnd;
    }
    
    console.log(`Loop window set: ${start} to ${end}`);
  }
  
  // Add undo action
  addUndoAction(action) {
    this.state.undoStack.push(action);
    
    // Limit undo stack size
    if (this.state.undoStack.length > 20) {
      this.state.undoStack.shift();
    }
  }
  
  // Undo last action
  undo() {
    if (this.state.undoStack.length === 0) {
      console.log('Nothing to undo');
      return;
    }
    
    const action = this.state.undoStack.pop();
    
    // Find the loop
    const loopIndex = this.state.loops.findIndex(loop => loop.id === action.loopId);
    
    if (loopIndex === -1) {
      console.log('Loop not found for undo');
      return;
    }
    
    // Stop playback if playing
    const wasPlaying = this.state.isPlaying;
    if (wasPlaying) {
      this.stopLoopPlayback();
    }
    
    // Restore previous state
    switch (action.type) {
      case 'RECORD':
      case 'RESET':
        this.state.loops[loopIndex] = {
          ...this.state.loops[loopIndex],
          ...action.previousState
        };
        break;
        
      case 'OVERDUB':
      case 'MULTIPLY':
      case 'INSERT':
        this.state.loops[loopIndex].buffer = action.previousState.buffer;
        if (action.previousState.endPoint !== undefined) {
          this.state.loops[loopIndex].endPoint = action.previousState.endPoint;
        }
        break;
        
      case 'WINDOW':
        this.state.loops[loopIndex].windowStart = action.previousState.windowStart;
        this.state.loops[loopIndex].windowEnd = action.previousState.windowEnd;
        break;
        
      default:
        console.log(`Unknown action type: ${action.type}`);
    }
    
    // Restart playback if it was playing
    if (wasPlaying && this.state.loops[loopIndex].buffer) {
      this.startLoopPlayback();
    }
    
    console.log(`Undo ${action.type} completed`);
  }
  
  // Create reversed buffer
  createReversedBuffer(buffer) {
    const reversedBuffer = this.context.createBuffer(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const originalData = buffer.getChannelData(channel);
      const reversedData = reversedBuffer.getChannelData(channel);
      
      for (let i = 0; i < buffer.length; i++) {
        reversedData[i] = originalData[buffer.length - 1 - i];
      }
    }
    
    return reversedBuffer;
  }
  
  // Mix two buffers
  mixBuffers(buffer1, buffer2) {
    // Ensure both buffers have the same length
    const length = Math.max(buffer1.length, buffer2.length);
    const sampleRate = buffer1.sampleRate;
    const channels = Math.max(buffer1.numberOfChannels, buffer2.numberOfChannels);
    
    // Create a new buffer for the mix
    const mixedBuffer = this.context.createBuffer(channels, length, sampleRate);
    
    // Mix the channels
    for (let channel = 0; channel < channels; channel++) {
      const mixedData = mixedBuffer.getChannelData(channel);
      
      // Get channel data from both buffers
      const data1 = channel < buffer1.numberOfChannels ? buffer1.getChannelData(channel) : new Float32Array(length);
      const data2 = channel < buffer2.numberOfChannels ? buffer2.getChannelData(channel) : new Float32Array(length);
      
      // Mix with feedback
      const feedback = this.state.settings.feedback;
      
      for (let i = 0; i < length; i++) {
        // Get samples, using 0 for out-of-bounds
        const sample1 = i < data1.length ? data1[i] * feedback : 0;
        const sample2 = i < data2.length ? data2[i] : 0;
        
        // Mix samples
        mixedData[i] = sample1 + sample2;
        
        // Prevent clipping
        if (mixedData[i] > 1) mixedData[i] = 1;
        if (mixedData[i] < -1) mixedData[i] = -1;
      }
    }
    
    return mixedBuffer;
  }
  
  // Get waveform data for visualization
  getWaveformData() {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    if (!currentLoop.buffer) {
      // Return empty waveform if no buffer
      return new Float32Array(100).fill(0);
    }
    
    // Get the first channel of audio data
    const channel = currentLoop.buffer.getChannelData(0);
    
    // Downsample to 100 points for visualization
    const samples = 100;
    const blockSize = Math.floor(channel.length / samples);
    const waveform = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const start = i * blockSize;
      let sum = 0;
      
      // Average the values in this block
      for (let j = 0; j < blockSize; j++) {
        if (start + j < channel.length) {
          sum += Math.abs(channel[start + j]);
        }
      }
      
      waveform[i] = sum / blockSize;
    }
    
    return waveform;
  }
  
  // Clean up resources
  dispose() {
    // Clear the recording timer if active
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
    
    // Stop playback
    if (this.state.isPlaying) {
      this.stopLoopPlayback();
    }
    
    // Disconnect nodes
    if (this.inputNode) {
      this.inputNode.disconnect();
    }
    
    if (this.inputGain) {
      this.inputGain.disconnect();
    }
    
    if (this.outputGain) {
      this.outputGain.disconnect();
    }
    
    // Close audio context
    if (this.context && this.context.state !== 'closed') {
      this.context.close();
    }
    
    console.log('EchoplexAudioEngine disposed');
  }
}

// Make available globally
window.EchoplexAudioEngine = EchoplexAudioEngine;
