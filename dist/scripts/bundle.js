/**
 * Digital Echo Plex - Complete Bundle
 * All functionality bundled into a single file for reliable loading
 */

// Global variables
let echoplexEngine = null;
let presetManager = null;
let timerInterval = null;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Digital Echo Plex: DOM loaded, initializing UI");
  
  // Initialize UI components that don"t require audio context
  initializeUIComponents();
  
  // Set up power button event listener
  setupPowerButton();
});

// =============================================
// AUDIO ENGINE IMPLEMENTATION
// =============================================

// Echo Plex Audio Engine class
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
      recordMode: "SWITCH", // SWITCH or TOGGLE
      micMonitoringMode: "RECORDING_ONLY", // RECORDING_ONLY or ALWAYS_ON
      loops: [],
      settings: {
        quantize: "OFF",
        switchQuant: "OFF",
        insertMode: "INS",
        overdubMode: "TOGGLE", // Default to TOGGLE for overdub as requested
        interfaceMode: "LOOP",
        samplerStyle: "PLAY",
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
    this.inputGainNode = null; // Renamed from inputGain for clarity
    this.outputGainNode = null; // Renamed from outputGain for clarity
    
    // Timer for checking recording duration
    this.recordingTimer = null;
    
    console.log("EchoplexAudioEngine initialized");
  }
  
  // Initialize audio context
  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();
      console.log("Audio context initialized");
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
    }
  }
  
  // Initialize microphone input
  async initMicrophone() {
    if (!this.context) {
      throw new Error("Audio context not initialized");
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
      this.inputGainNode = this.context.createGain();
      this.outputGainNode = this.context.createGain();
      
      // Set initial gain values
      this.inputGainNode.gain.value = this.state.settings.inputGain;
      this.outputGainNode.gain.value = this.state.settings.outputGain;
      
      // Connect input node to input gain
      this.inputNode.connect(this.inputGainNode);
      
      // Connect output gain to destination
      this.outputGainNode.connect(this.context.destination);
      
      // Connect input gain to output gain ONLY if mic monitoring is ALWAYS_ON
      if (this.state.micMonitoringMode === "ALWAYS_ON") {
        this.inputGainNode.connect(this.outputGainNode);
        console.log("Mic monitoring: ALWAYS_ON - Input connected to output");
      }
      
      // Create recorder
      this.recorder = new MediaRecorder(stream);
      this.recordedChunks = [];
      
      // Set up recorder events
      this.recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      
      console.log("Microphone initialized");
      return true;
      
    } catch (error) {
      console.error("Error initializing microphone:", error);
      throw new Error("Failed to access microphone. Please check permissions.");
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
    if (this.inputGainNode && newSettings.inputGain !== undefined) {
      this.inputGainNode.gain.value = newSettings.inputGain;
    }
    
    if (this.outputGainNode && newSettings.outputGain !== undefined) {
      this.outputGainNode.gain.value = newSettings.outputGain;
    }
    
    console.log("Settings updated:", newSettings);
  }
  
  // Set record mode (SWITCH or TOGGLE)
  setRecordMode(mode) {
    if (mode !== "SWITCH" && mode !== "TOGGLE") {
      console.error("Invalid record mode:", mode);
      return;
    }
    
    this.state.recordMode = mode;
    console.log(`Record mode set to ${mode}`);
  }
  
  // Set microphone monitoring mode
  setMicMonitoringMode(mode) {
    if (mode !== "RECORDING_ONLY" && mode !== "ALWAYS_ON") {
      console.error("Invalid mic monitoring mode:", mode);
      return;
    }
    
    this.state.micMonitoringMode = mode;
    console.log(`Mic monitoring mode set to ${mode}`);
    
    // Connect/disconnect input based on mode and current state
    if (this.inputGainNode && this.outputGainNode) {
      if (mode === "ALWAYS_ON") {
        this.inputGainNode.connect(this.outputGainNode);
        console.log("Mic monitoring: ALWAYS_ON - Input connected to output");
      } else { // RECORDING_ONLY
        // Disconnect unless currently recording/overdubbing/inserting
        if (!this.state.isRecording && !this.state.isOverdubbing && !this.state.isReplacing) {
          try {
            this.inputGainNode.disconnect(this.outputGainNode);
            console.log("Mic monitoring: RECORDING_ONLY - Input disconnected from output");
          } catch (e) {
            // Ignore errors if already disconnected
          }
        }
      }
    }
  }
  
  // Toggle function mode
  toggleFunctionMode() {
    this.state.isFunctionActive = !this.state.isFunctionActive;
    console.log(`Function mode ${this.state.isFunctionActive ? "activated" : "deactivated"}`);
    return this.state.isFunctionActive;
  }
  
  // Connect input for recording
  connectInputForRecording() {
    if (this.state.micMonitoringMode === "RECORDING_ONLY" && this.inputGainNode && this.outputGainNode) {
      try {
        this.inputGainNode.connect(this.outputGainNode);
        console.log("Mic monitoring: RECORDING_ONLY - Input connected for recording");
      } catch (e) {
        console.error("Error connecting input for recording:", e);
      }
    }
  }
  
  // Disconnect input after recording
  disconnectInputAfterRecording() {
    if (this.state.micMonitoringMode === "RECORDING_ONLY" && this.inputGainNode && this.outputGainNode) {
      // Only disconnect if not currently recording/overdubbing/inserting
      if (!this.state.isRecording && !this.state.isOverdubbing && !this.state.isReplacing) {
        try {
          this.inputGainNode.disconnect(this.outputGainNode);
          console.log("Mic monitoring: RECORDING_ONLY - Input disconnected after recording");
        } catch (e) {
          // Ignore errors if already disconnected
        }
      }
    }
  }
  
  // Start recording
  async startRecording() {
    if (!this.recorder) {
      throw new Error("Recorder not initialized");
    }
    
    if (this.state.isRecording) {
      return;
    }
    
    // Connect input if needed
    this.connectInputForRecording();
    
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
      
      // If we"ve reached the maximum recording time, stop recording
      if (currentDuration >= this.MAX_RECORDING_TIME) {
        console.log("Maximum recording time reached, stopping recording");
        this.stopRecording();
      }
    }, 100); // Check every 100ms
    
    console.log("Recording started");
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
        // Set recording state to false before disconnecting input
        this.state.isRecording = false;
        
        // Disconnect input if needed
        this.disconnectInputAfterRecording();
        
        // Calculate loop duration
        this.state.loopDuration = this.context.currentTime - this.state.recordStartTime;
        
        // Create blob from recorded chunks
        const blob = new Blob(this.recordedChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        
        try {
          // Create audio buffer from blob
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
          
          // Save previous state for undo
          this.addUndoAction({
            type: "RECORD",
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
          
          console.log("Recording stopped and saved");
          resolve(true);
          
        } catch (error) {
          console.error("Error processing recording:", error);
          resolve(false);
        }
      };
      
      // Stop recording
      this.recorder.stop();
    });
  }
  
  // Get current recording time
  getCurrentRecordingTime() {
    if (!this.state.isRecording && !this.state.isOverdubbing && !this.state.isReplacing) {
      return 0;
    }
    
    if (this.state.recordStartTime === null) {
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
    
    if (loopDuration <= 0) {
      return 0;
    }
    
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
      console.log("No loop to play");
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
      // Don"t connect if muted
    } else {
      this.player.connect(this.outputGainNode);
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
    
    console.log("Playback started");
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
    
    console.log("Playback stopped");
  }
  
  // Start overdub
  async startOverdub() {
    if (!this.recorder || !this.state.isPlaying) {
      return;
    }
    
    if (this.state.isOverdubbing) {
      return;
    }
    
    // Connect input if needed
    this.connectInputForRecording();
    
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
      
      // If we"ve reached the maximum recording time, stop recording
      if (currentDuration >= this.MAX_RECORDING_TIME) {
        console.log("Maximum recording time reached, stopping overdub");
        this.stopOverdub();
      }
    }, 100); // Check every 100ms
    
    console.log("Overdub started");
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
        // Set overdub state to false before disconnecting input
        this.state.isOverdubbing = false;
        
        // Disconnect input if needed
        this.disconnectInputAfterRecording();
        
        // Create blob from recorded chunks
        const blob = new Blob(this.recordedChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        
        try {
          // Create audio buffer from blob
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const overdubBuffer = await this.context.decodeAudioData(arrayBuffer);
          
          // Get current loop
          const currentLoop = this.state.loops[this.state.currentLoopIndex];
          
          if (!currentLoop.buffer) {
            console.log("No loop to overdub");
            resolve(false);
            return;
          }
          
          // Save previous state for undo
          this.addUndoAction({
            type: "OVERDUB",
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
          
          console.log("Overdub stopped and mixed");
          resolve(true);
          
        } catch (error) {
          console.error("Error processing overdub:", error);
          resolve(false);
        }
      };
      
      // Stop recording
      this.recorder.stop();
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
    
    // Connect input if needed
    this.connectInputForRecording();
    
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
      
      // If we"ve reached the maximum recording time, stop recording
      if (currentDuration >= this.MAX_RECORDING_TIME) {
        console.log("Maximum recording time reached, stopping insert");
        this.stopInsert();
      }
    }, 100); // Check every 100ms
    
    console.log("Insert started");
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
        // Set replacing state to false before disconnecting input
        this.state.isReplacing = false;
        
        // Disconnect input if needed
        this.disconnectInputAfterRecording();
        
        // Create blob from recorded chunks
        const blob = new Blob(this.recordedChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        
        try {
          // Create audio buffer from blob
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const insertBuffer = await this.context.decodeAudioData(arrayBuffer);
          
          // Get current loop
          const currentLoop = this.state.loops[this.state.currentLoopIndex];
          
          if (!currentLoop.buffer) {
            console.log("No loop to insert into");
            resolve(false);
            return;
          }
          
          // Save previous state for undo
          this.addUndoAction({
            type: "INSERT",
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
          
          console.log("Insert stopped and replaced section");
          resolve(true);
          
        } catch (error) {
          console.error("Error processing insert:", error);
          resolve(false);
        }
      };
      
      // Stop recording
      this.recorder.stop();
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
    
    console.log("Multiply started");
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
      console.log("No loop to multiply");
      this.state.isMultiplying = false;
      return;
    }
    
    // Save previous state for undo
    this.addUndoAction({
      type: "MULTIPLY",
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
    
    // Ensure we don"t exceed the maximum recording time
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
    
    console.log(`Loop ${currentLoop.isReversed ? "reversed" : "normal"}`);
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
    
    console.log(`Loop ${currentLoop.isHalfSpeed ? "half-speed" : "normal speed"}`);
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
        this.player.connect(this.outputGainNode);
      }
    }
    
    console.log(`Loop ${currentLoop.isMuted ? "muted" : "unmuted"}`);
  }
  
  // Reset loop
  resetLoop() {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save previous state for undo
    if (currentLoop.buffer) {
      this.addUndoAction({
        type: "RESET",
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
    
    console.log("Loop reset");
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
      type: "WINDOW",
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
      console.log("Nothing to undo");
      return;
    }
    
    const action = this.state.undoStack.pop();
    
    // Find the loop
    const loopIndex = this.state.loops.findIndex(loop => loop.id === action.loopId);
    
    if (loopIndex === -1) {
      console.log("Loop not found for undo");
      return;
    }
    
    // Stop playback if playing
    const wasPlaying = this.state.isPlaying;
    if (wasPlaying) {
      this.stopLoopPlayback();
    }
    
    // Restore previous state
    switch (action.type) {
      case "RECORD":
      case "RESET":
        this.state.loops[loopIndex] = {
          ...this.state.loops[loopIndex],
          ...action.previousState
        };
        break;
        
      case "OVERDUB":
      case "MULTIPLY":
      case "INSERT":
        this.state.loops[loopIndex].buffer = action.previousState.buffer;
        if (action.previousState.endPoint !== undefined) {
          this.state.loops[loopIndex].endPoint = action.previousState.endPoint;
        }
        break;
        
      case "WINDOW":
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
    
    if (this.inputGainNode) {
      this.inputGainNode.disconnect();
    }
    
    if (this.outputGainNode) {
      this.outputGainNode.disconnect();
    }
    
    // Close audio context
    if (this.context && this.context.state !== "closed") {
      this.context.close();
    }
    
    console.log("EchoplexAudioEngine disposed");
  }
}

// =============================================
// PRESET MANAGER IMPLEMENTATION
// =============================================

// Preset Manager class
class PresetManager {
  constructor(echoplexEngine) {
    this.echoplexEngine = echoplexEngine;
    this.presets = [];
    this.currentPresetIndex = -1; // -1 means no preset selected
    
    // Load presets from local storage
    this.loadPresetsFromStorage();
    
    console.log("PresetManager initialized");
  }
  
  // Load presets from local storage
  loadPresetsFromStorage() {
    try {
      const savedPresets = localStorage.getItem("echoplex_presets");
      if (savedPresets) {
        this.presets = JSON.parse(savedPresets);
        console.log(`Loaded ${this.presets.length} presets from storage`);
      } else {
        // Create default presets if none exist
        this.createDefaultPresets();
        console.log("Created default presets");
      }
    } catch (error) {
      console.error("Error loading presets from storage:", error);
      // Create default presets as fallback
      this.createDefaultPresets();
    }
  }
  
  // Create default presets
  createDefaultPresets() {
    this.presets = [
      {
        name: "Default",
        description: "Default Echo Plex settings",
        settings: {
          quantize: "OFF",
          switchQuant: "OFF",
          insertMode: "INS",
          overdubMode: "TOGGLE",
          interfaceMode: "LOOP",
          samplerStyle: "PLAY",
          tempo: 120,
          cycleBeats: 8,
          feedback: 1.0,
          inputGain: 0.8,
          outputGain: 0.8,
          mix: 0.5
        }
      },
      {
        name: "Ambient",
        description: "Long decay, subtle mix",
        settings: {
          quantize: "OFF",
          switchQuant: "OFF",
          insertMode: "INS",
          overdubMode: "TOGGLE",
          interfaceMode: "LOOP",
          samplerStyle: "PLAY",
          tempo: 80,
          cycleBeats: 16,
          feedback: 0.9,
          inputGain: 0.7,
          outputGain: 0.8,
          mix: 0.6
        }
      },
      {
        name: "Rhythmic",
        description: "Quantized for rhythmic loops",
        settings: {
          quantize: "LOOP",
          switchQuant: "CYCLE",
          insertMode: "INS",
          overdubMode: "TOGGLE",
          interfaceMode: "LOOP",
          samplerStyle: "PLAY",
          tempo: 120,
          cycleBeats: 8,
          feedback: 1.0,
          inputGain: 0.8,
          outputGain: 0.8,
          mix: 0.5
        }
      }
    ];
    
    // Save default presets to storage
    this.savePresetsToStorage();
  }
  
  // Save presets to local storage
  savePresetsToStorage() {
    try {
      localStorage.setItem("echoplex_presets", JSON.stringify(this.presets));
      console.log(`Saved ${this.presets.length} presets to storage`);
    } catch (error) {
      console.error("Error saving presets to storage:", error);
    }
  }
  
  // Get all presets
  getPresets() {
    return this.presets;
  }
  
  // Get current preset
  getCurrentPreset() {
    if (this.currentPresetIndex >= 0 && this.currentPresetIndex < this.presets.length) {
      return this.presets[this.currentPresetIndex];
    }
    return null;
  }
  
  // Save current settings as a new preset
  savePreset(name, description) {
    if (!this.echoplexEngine) {
      console.error("Echo Plex engine not available");
      return false;
    }
    
    const state = this.echoplexEngine.getState();
    
    const newPreset = {
      name: name || `Preset ${this.presets.length + 1}`,
      description: description || "Custom preset",
      settings: { ...state.settings }
    };
    
    this.presets.push(newPreset);
    this.currentPresetIndex = this.presets.length - 1;
    
    // Save to storage
    this.savePresetsToStorage();
    
    console.log(`Saved new preset: ${newPreset.name}`);
    return true;
  }
  
  // Update existing preset with current settings
  updatePreset(index) {
    if (!this.echoplexEngine) {
      console.error("Echo Plex engine not available");
      return false;
    }
    
    if (index < 0 || index >= this.presets.length) {
      console.error("Invalid preset index:", index);
      return false;
    }
    
    const state = this.echoplexEngine.getState();
    
    // Update preset settings while keeping name and description
    this.presets[index] = {
      ...this.presets[index],
      settings: { ...state.settings }
    };
    
    // Save to storage
    this.savePresetsToStorage();
    
    console.log(`Updated preset: ${this.presets[index].name}`);
    return true;
  }
  
  // Load preset by index
  loadPreset(index) {
    if (!this.echoplexEngine) {
      console.error("Echo Plex engine not available");
      return false;
    }
    
    if (index < 0 || index >= this.presets.length) {
      console.error("Invalid preset index:", index);
      return false;
    }
    
    const preset = this.presets[index];
    
    // Apply preset settings to engine
    this.echoplexEngine.updateSettings(preset.settings);
    
    // Update current preset index
    this.currentPresetIndex = index;
    
    console.log(`Loaded preset: ${preset.name}`);
    return true;
  }
  
  // Delete preset by index
  deletePreset(index) {
    if (index < 0 || index >= this.presets.length) {
      console.error("Invalid preset index:", index);
      return false;
    }
    
    // Remove preset
    const deletedPreset = this.presets.splice(index, 1)[0];
    
    // Update current preset index if needed
    if (this.currentPresetIndex === index) {
      this.currentPresetIndex = -1;
    } else if (this.currentPresetIndex > index) {
      this.currentPresetIndex--;
    }
    
    // Save to storage
    this.savePresetsToStorage();
    
    console.log(`Deleted preset: ${deletedPreset.name}`);
    return true;
  }
  
  // Save loop state to local storage
  saveLoopState() {
    if (!this.echoplexEngine) {
      console.error("Echo Plex engine not available");
      return false;
    }
    
    try {
      const state = this.echoplexEngine.getState();
      
      // We can"t directly serialize AudioBuffer objects, so we"ll save metadata only
      const loopMetadata = state.loops.map(loop => ({
        id: loop.id,
        hasContent: !!loop.buffer,
        startPoint: loop.startPoint,
        endPoint: loop.endPoint,
        windowStart: loop.windowStart,
        windowEnd: loop.windowEnd,
        isReversed: loop.isReversed,
        isHalfSpeed: loop.isHalfSpeed,
        isMuted: loop.isMuted
      }));
      
      const stateToSave = {
        currentLoopIndex: state.currentLoopIndex,
        loops: loopMetadata,
        settings: state.settings,
        recordMode: state.recordMode,
        micMonitoringMode: state.micMonitoringMode // Save mic monitoring mode
      };
      
      localStorage.setItem("echoplex_state", JSON.stringify(stateToSave));
      console.log("Saved loop state to storage");
      return true;
    } catch (error) {
      console.error("Error saving loop state to storage:", error);
      return false;
    }
  }
  
  // Load loop state from local storage
  loadLoopState() {
    if (!this.echoplexEngine) {
      console.error("Echo Plex engine not available");
      return false;
    }
    
    try {
      const savedState = localStorage.getItem("echoplex_state");
      if (!savedState) {
        console.log("No saved state found");
        return false;
      }
      
      const parsedState = JSON.parse(savedState);
      
      // Apply settings
      this.echoplexEngine.updateSettings(parsedState.settings);
      
      // Set record mode
      this.echoplexEngine.setRecordMode(parsedState.recordMode);
      
      // Set mic monitoring mode
      if (parsedState.micMonitoringMode) {
        this.echoplexEngine.setMicMonitoringMode(parsedState.micMonitoringMode);
      }
      
      // Note: We can"t restore actual audio buffers from local storage
      // But we can restore other loop properties and settings
      
      console.log("Loaded loop state from storage");
      return true;
    } catch (error) {
      console.error("Error loading loop state from storage:", error);
      return false;
    }
  }
}

// =============================================
// UI IMPLEMENTATION
// =============================================

// Initialize UI components that don"t require audio context
function initializeUIComponents() {
  // Make sure all required script dependencies are loaded
  if (typeof EchoplexAudioEngine === "undefined") {
    console.error("Error: EchoplexAudioEngine not defined. Check script dependencies.");
    showErrorMessage("Script loading error. Please refresh the page and try again.");
    return;
  }
  
  console.log("Digital Echo Plex: UI components initialized");
}

// Set up power button event listener
function setupPowerButton() {
  const powerButton = document.getElementById("power-button");
  const powerStatus = document.getElementById("power-status");
  
  if (!powerButton || !powerStatus) {
    console.error("Error: Power button or status element not found");
    return;
  }
  
  powerButton.addEventListener("click", handlePowerButtonClick);
  console.log("Digital Echo Plex: Power button initialized");
}

// Handle power button click
async function handlePowerButtonClick() {
  const powerButton = document.getElementById("power-button");
  const powerStatus = document.getElementById("power-status");
  const mainInterface = document.getElementById("main-interface");
  
  if (!powerButton || !powerStatus || !mainInterface) {
    console.error("Error: Required UI elements not found");
    return;
  }
  
  // Check if already powered on
  if (powerButton.classList.contains("powered-on")) {
    // Power off
    powerOff();
    return;
  }
  
  // Start power on sequence
  powerButton.classList.add("powering");
  powerButton.textContent = "Starting...";
  powerStatus.textContent = "Initializing system...";
  
  try {
    // Run system checks
    await runSystemChecks(powerStatus);
    
    // Initialize audio context
    await initializeAudioContext(powerStatus);
    
    // Request microphone permissions
    await requestMicrophonePermissions(powerStatus);
    
    // Initialize Echo Plex engine
    await initializeEchoPlex(powerStatus);
    
    // Power on successful
    powerOnComplete(powerButton, powerStatus, mainInterface);
    
  } catch (error) {
    // Handle initialization errors
    handlePowerOnError(error, powerButton, powerStatus);
  }
}

// Run system checks
async function runSystemChecks(statusElement) {
  statusElement.textContent = "Running system checks...";
  
  // Check browser compatibility
  const isCompatible = checkBrowserCompatibility();
  if (!isCompatible) {
    throw new Error("Browser not compatible with Web Audio API. Please use Chrome, Firefox, or Edge.");
  }
  
  // Simulate 1 second of system checks
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log("Digital Echo Plex: System checks passed");
  return true;
}

// Check browser compatibility
function checkBrowserCompatibility() {
  // Check for Web Audio API support
  if (!window.AudioContext && !window.webkitAudioContext) {
    console.error("Web Audio API not supported");
    return false;
  }
  
  // Check for getUserMedia support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("getUserMedia not supported");
    return false;
  }
  
  return true;
}

// Initialize audio context
async function initializeAudioContext(statusElement) {
  statusElement.textContent = "Initializing audio system...";
  
  try {
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Resume audio context (needed for some browsers)
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    
    // Simulate 1 second of audio initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Digital Echo Plex: Audio context initialized");
    return audioContext;
    
  } catch (error) {
    console.error("Error initializing audio context:", error);
    throw new Error("Failed to initialize audio system. Please check your browser settings.");
  }
}

// Request microphone permissions
async function requestMicrophonePermissions(statusElement) {
  statusElement.textContent = "Requesting microphone access...";
  
  try {
    // Request microphone access with explicit user feedback
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0.01
      }
    });
    
    // Simulate 1 second of permission processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Digital Echo Plex: Microphone access granted");
    return stream;
    
  } catch (error) {
    console.error("Error requesting microphone access:", error);
    throw new Error("Microphone access denied. Please allow microphone access and try again.");
  }
}

// Initialize Echo Plex engine
async function initializeEchoPlex(statusElement) {
  statusElement.textContent = "Initializing Echo Plex engine...";
  
  try {
    // Create Echo Plex engine instance
    echoplexEngine = new EchoplexAudioEngine();
    
    // Initialize microphone
    await echoplexEngine.initMicrophone();
    
    // Initialize preset manager
    presetManager = new PresetManager(echoplexEngine);
    
    // Load previous state if available
    presetManager.loadLoopState();
    
    // Simulate 1 second of engine initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Digital Echo Plex: Engine initialized");
    return echoplexEngine;
    
  } catch (error) {
    console.error("Error initializing Echo Plex engine:", error);
    throw new Error("Failed to initialize Echo Plex engine. Please refresh and try again.");
  }
}

// Power on complete
function powerOnComplete(powerButton, statusElement, mainInterface) {
  powerButton.textContent = "Power Off";
  powerButton.classList.remove("powering");
  powerButton.classList.add("powered-on");
  statusElement.textContent = "Unit is powered on and ready";
  mainInterface.classList.remove("powered-off");
  
  // Initialize UI controls
  initializeControls();
  
  // Start waveform visualization
  startWaveformVisualization();
  
  // Start timer updates
  startTimerUpdates();
  
  // Initialize preset selector
  initializePresetSelector();
  
  // Update UI based on loaded state
  updateUIState();
  
  console.log("Digital Echo Plex: Power on sequence complete");
}

// Handle power on error
function handlePowerOnError(error, powerButton, statusElement) {
  powerButton.textContent = "Power On";
  powerButton.classList.remove("powering");
  
  // Display error message
  statusElement.textContent = `Error: ${error.message}`;
  statusElement.classList.add("error");
  
  console.error("Digital Echo Plex: Power on failed:", error);
}

// Power off
function powerOff() {
  const powerButton = document.getElementById("power-button");
  const powerStatus = document.getElementById("power-status");
  const mainInterface = document.getElementById("main-interface");
  
  if (!powerButton || !powerStatus || !mainInterface) return;
  
  // Save state before powering off
  if (presetManager) {
    presetManager.saveLoopState();
  }
  
  // Update UI
  powerButton.textContent = "Power On";
  powerButton.classList.remove("powered-on");
  powerStatus.textContent = "Unit is powered off";
  powerStatus.classList.remove("error");
  mainInterface.classList.add("powered-off");
  
  // Stop timer updates
  stopTimerUpdates();
  
  // Dispose of audio resources
  if (echoplexEngine) {
    echoplexEngine.dispose();
    echoplexEngine = null;
  }
  
  console.log("Digital Echo Plex: Powered off");
}

// Show error message
function showErrorMessage(message) {
  const powerStatus = document.getElementById("power-status");
  if (powerStatus) {
    powerStatus.textContent = `Error: ${message}`;
    powerStatus.classList.add("error");
  }
}

// Initialize UI controls
function initializeControls() {
  if (!echoplexEngine) return;
  
  // Set up transport controls
  setupTransportControls();
  
  // Set up loop controls
  setupLoopControls();
  
  // Set up parameter controls
  setupParameterControls();
  
  // Set up function button
  setupFunctionButton();
  
  // Set up record mode selector
  setupRecordModeSelector();
  
  // Set up mic monitoring selector
  setupMicMonitoringSelector();
  
  console.log("Digital Echo Plex: Controls initialized");
}

// Set up transport controls
function setupTransportControls() {
  // Record button
  const recordButton = document.getElementById("record-button");
  if (recordButton) {
    // For SWITCH mode
    recordButton.addEventListener("click", async () => {
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.recordMode === "SWITCH") {
        if (state.isRecording) {
          await echoplexEngine.stopRecording();
        } else {
          await echoplexEngine.startRecording();
        }
      }
      
      updateUIState();
    });
    
    // For TOGGLE mode
    recordButton.addEventListener("mousedown", async () => {
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.recordMode === "TOGGLE" && !state.isRecording) {
        await echoplexEngine.startRecording();
        updateUIState();
      }
    });
    
    recordButton.addEventListener("mouseup", async () => {
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.recordMode === "TOGGLE" && state.isRecording) {
        await echoplexEngine.stopRecording();
        updateUIState();
      }
    });
    
    // Handle touch events for mobile
    recordButton.addEventListener("touchstart", async (e) => {
      e.preventDefault(); // Prevent default touch behavior
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.recordMode === "TOGGLE" && !state.isRecording) {
        await echoplexEngine.startRecording();
        updateUIState();
      }
    });
    
    recordButton.addEventListener("touchend", async (e) => {
      e.preventDefault(); // Prevent default touch behavior
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.recordMode === "TOGGLE" && state.isRecording) {
        await echoplexEngine.stopRecording();
        updateUIState();
      }
    });
  }
  
  // Play/Stop button
  const playButton = document.getElementById("play-button");
  if (playButton) {
    playButton.addEventListener("click", () => {
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.isPlaying) {
        echoplexEngine.stopLoopPlayback();
      } else {
        echoplexEngine.startLoopPlayback();
      }
      
      updateUIState();
    });
  }
  
  // Overdub button (defaults to TOGGLE mode)
  const overdubButton = document.getElementById("overdub-button");
  if (overdubButton) {
    // For SWITCH mode
    overdubButton.addEventListener("click", async () => {
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.settings.overdubMode === "SWITCH") {
        if (state.isOverdubbing) {
          await echoplexEngine.stopOverdub();
        } else {
          await echoplexEngine.startOverdub();
        }
        
        updateUIState();
      }
    });
    
    // For TOGGLE mode (default)
    overdubButton.addEventListener("mousedown", async () => {
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.settings.overdubMode === "TOGGLE" && !state.isOverdubbing) {
        await echoplexEngine.startOverdub();
        updateUIState();
      }
    });
    
    overdubButton.addEventListener("mouseup", async () => {
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.settings.overdubMode === "TOGGLE" && state.isOverdubbing) {
        await echoplexEngine.stopOverdub();
        updateUIState();
      }
    });
    
    // Handle touch events for mobile
    overdubButton.addEventListener("touchstart", async (e) => {
      e.preventDefault();
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.settings.overdubMode === "TOGGLE" && !state.isOverdubbing) {
        await echoplexEngine.startOverdub();
        updateUIState();
      }
    });
    
    overdubButton.addEventListener("touchend", async (e) => {
      e.preventDefault();
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      
      if (state.settings.overdubMode === "TOGGLE" && state.isOverdubbing) {
        await echoplexEngine.stopOverdub();
        updateUIState();
      }
    });
  }
  
  // Multiply button
  const multiplyButton = document.getElementById("multiply-button");
  if (multiplyButton) {
    multiplyButton.addEventListener("mousedown", () => {
      if (!echoplexEngine) return;
      
      echoplexEngine.startMultiply();
      updateUIState();
    });
    
    multiplyButton.addEventListener("mouseup", async () => {
      if (!echoplexEngine) return;
      
      await echoplexEngine.stopMultiply();
      updateUIState();
    });
    
    // Handle touch events for mobile
    multiplyButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (!echoplexEngine) return;
      
      echoplexEngine.startMultiply();
      updateUIState();
    });
    
    multiplyButton.addEventListener("touchend", async (e) => {
      e.preventDefault();
      if (!echoplexEngine) return;
      
      await echoplexEngine.stopMultiply();
      updateUIState();
    });
  }
  
  // Undo button
  const undoButton = document.getElementById("undo-button");
  if (undoButton) {
    undoButton.addEventListener("click", () => {
      if (!echoplexEngine) return;
      
      echoplexEngine.undo();
      updateUIState();
    });
  }
}

// Set up loop controls
function setupLoopControls() {
  // Next Loop button
  const nextLoopButton = document.getElementById("next-loop-button");
  if (nextLoopButton) {
    nextLoopButton.addEventListener("click", () => {
      if (!echoplexEngine) return;
      
      echoplexEngine.nextLoop();
      updateUIState();
    });
  }
  
  // Previous Loop button
  const prevLoopButton = document.getElementById("prev-loop-button");
  if (prevLoopButton) {
    prevLoopButton.addEventListener("click", () => {
      if (!echoplexEngine) return;
      
      echoplexEngine.previousLoop();
      updateUIState();
    });
  }
  
  // Reset button
  const resetButton = document.getElementById("reset-button");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      if (!echoplexEngine) return;
      
      echoplexEngine.resetLoop();
      updateUIState();
    });
  }
  
  // Reverse button
  const reverseButton = document.getElementById("reverse-button");
  if (reverseButton) {
    reverseButton.addEventListener("click", () => {
      if (!echoplexEngine) return;
      
      // Check if function mode is active
      const state = echoplexEngine.getState();
      if (!state.isFunctionActive) {
        echoplexEngine.reverseLoop();
        updateUIState();
      }
    });
  }
  
  // Half-Speed button
  const halfSpeedButton = document.getElementById("half-speed-button");
  if (halfSpeedButton) {
    halfSpeedButton.addEventListener("click", () => {
      if (!echoplexEngine) return;
      
      echoplexEngine.toggleHalfSpeed();
      updateUIState();
    });
  }
  
  // Mute button
  const muteButton = document.getElementById("mute-button");
  if (muteButton) {
    muteButton.addEventListener("click", () => {
      if (!echoplexEngine) return;
      
      echoplexEngine.toggleMute();
      updateUIState();
    });
  }
  
  // Insert button
  const insertButton = document.getElementById("insert-button");
  if (insertButton) {
    insertButton.addEventListener("mousedown", async () => {
      if (!echoplexEngine) return;
      
      await echoplexEngine.startInsert();
      updateUIState();
    });
    
    insertButton.addEventListener("mouseup", async () => {
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      if (state.isReplacing) {
        await echoplexEngine.stopInsert();
        updateUIState();
      }
    });
    
    // Handle touch events for mobile
    insertButton.addEventListener("touchstart", async (e) => {
      e.preventDefault();
      if (!echoplexEngine) return;
      
      await echoplexEngine.startInsert();
      updateUIState();
    });
    
    insertButton.addEventListener("touchend", async (e) => {
      e.preventDefault();
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      if (state.isReplacing) {
        await echoplexEngine.stopInsert();
        updateUIState();
      }
    });
  }
  
  // Window button
  const windowButton = document.getElementById("window-button");
  if (windowButton) {
    let windowStartPosition = null;
    
    windowButton.addEventListener("mousedown", () => {
      if (!echoplexEngine) return;
      
      const state = echoplexEngine.getState();
      if (state.isPlaying) {
        windowStartPosition = echoplexEngine.getCurrentPlaybackPosition();
        windowButton.classList.add("active");
      }
    });
    
    windowButton.addEventListener("mouseup", () => {
      if (!echoplexEngine || windowStartPosition === null) return;
      
      const state = echoplexEngine.getState();
      if (state.isPlaying) {
        const windowEndPosition = echoplexEngine.getCurrentPlaybackPosition();
        echoplexEngine.setLoopWindow(windowStartPosition, windowEndPosition);
        windowStartPosition = null;
        windowButton.classList.remove("active");
        updateUIState();
      }
    });
  }
}

// Set up parameter controls
function setupParameterControls() {
  // Feedback control
  const feedbackControl = document.getElementById("feedback-control");
  if (feedbackControl) {
    feedbackControl.addEventListener("input", (e) => {
      if (!echoplexEngine) return;
      
      const value = parseFloat(e.target.value);
      echoplexEngine.updateSettings({ feedback: value });
    });
  }
  
  // Input gain control
  const inputGainControl = document.getElementById("input-gain-control");
  if (inputGainControl) {
    inputGainControl.addEventListener("input", (e) => {
      if (!echoplexEngine) return;
      
      const value = parseFloat(e.target.value);
      echoplexEngine.updateSettings({ inputGain: value });
    });
  }
  
  // Output gain control
  const outputGainControl = document.getElementById("output-gain-control");
  if (outputGainControl) {
    outputGainControl.addEventListener("input", (e) => {
      if (!echoplexEngine) return;
      
      const value = parseFloat(e.target.value);
      echoplexEngine.updateSettings({ outputGain: value });
    });
  }
  
  // Mix control
  const mixControl = document.getElementById("mix-control");
  if (mixControl) {
    mixControl.addEventListener("input", (e) => {
      if (!echoplexEngine) return;
      
      const value = parseFloat(e.target.value);
      echoplexEngine.updateSettings({ mix: value });
    });
  }
  
  // Quantize select
  const quantizeSelect = document.getElementById("quantize-select");
  if (quantizeSelect) {
    quantizeSelect.addEventListener("change", (e) => {
      if (!echoplexEngine) return;
      
      const value = e.target.value;
      echoplexEngine.updateSettings({ quantize: value });
    });
  }
  
  // Interface mode select
  const interfaceModeSelect = document.getElementById("interface-mode-select");
  if (interfaceModeSelect) {
    interfaceModeSelect.addEventListener("change", (e) => {
      if (!echoplexEngine) return;
      
      const value = e.target.value;
      echoplexEngine.updateSettings({ interfaceMode: value });
    });
  }
  
  // Overdub mode select
  const overdubModeSelect = document.getElementById("overdub-mode-select");
  if (overdubModeSelect) {
    overdubModeSelect.addEventListener("change", (e) => {
      if (!echoplexEngine) return;
      
      const value = e.target.value;
      echoplexEngine.updateSettings({ overdubMode: value });
    });
  }
}

// Set up function button
function setupFunctionButton() {
  // Function button
  const functionButton = document.getElementById("function-button");
  if (functionButton) {
    functionButton.addEventListener("click", () => {
      if (!echoplexEngine) return;
      
      const isFunctionActive = echoplexEngine.toggleFunctionMode();
      functionButton.classList.toggle("active", isFunctionActive);
      
      // Update UI to show function mode is active
      document.body.classList.toggle("function-active", isFunctionActive);
    });
  }
}

// Set up record mode selector
function setupRecordModeSelector() {
  const recordModeRadios = document.querySelectorAll("input[name=\"record-mode\"]");
  if (recordModeRadios.length > 0) {
    recordModeRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        if (!echoplexEngine) return;
        
        echoplexEngine.setRecordMode(e.target.value);
      });
    });
  }
}

// Set up mic monitoring selector
function setupMicMonitoringSelector() {
  const micMonitoringRadios = document.querySelectorAll("input[name=\"mic-monitoring-mode\"]");
  if (micMonitoringRadios.length > 0) {
    micMonitoringRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        if (!echoplexEngine) return;
        
        echoplexEngine.setMicMonitoringMode(e.target.value);
      });
    });
  }
}

// Initialize preset selector
function initializePresetSelector() {
  if (!presetManager) return;
  
  const presetSelect = document.getElementById("preset-select");
  const presetDescription = document.getElementById("preset-description");
  const loadPresetButton = document.getElementById("load-preset-button");
  const savePresetButton = document.getElementById("save-preset-button");
  const deletePresetButton = document.getElementById("delete-preset-button");
  
  if (!presetSelect) return;
  
  // Clear existing options
  presetSelect.innerHTML = "<option value=\"-1\">Select Preset...</option>";
  
  // Add presets to select
  const presets = presetManager.getPresets();
  presets.forEach((preset, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = preset.name;
    presetSelect.appendChild(option);
  });
  
  // Handle preset selection
  presetSelect.addEventListener("change", () => {
    const index = parseInt(presetSelect.value, 10);
    if (index >= 0 && index < presets.length) {
      const preset = presets[index];
      if (presetDescription) {
        presetDescription.textContent = preset.description;
      }
    } else {
      if (presetDescription) {
        presetDescription.textContent = "";
      }
    }
  });
  
  // Handle load preset button
  if (loadPresetButton) {
    loadPresetButton.addEventListener("click", () => {
      const index = parseInt(presetSelect.value, 10);
      if (index >= 0 && index < presets.length) {
        presetManager.loadPreset(index);
        updateUIState();
      }
    });
  }
  
  // Handle save preset button
  if (savePresetButton) {
    savePresetButton.addEventListener("click", () => {
      const saveDialog = document.getElementById("save-preset-dialog");
      if (saveDialog) {
        saveDialog.style.display = "block";
      }
    });
  }
  
  // Handle delete preset button
  if (deletePresetButton) {
    deletePresetButton.addEventListener("click", () => {
      const index = parseInt(presetSelect.value, 10);
      if (index >= 0 && index < presets.length) {
        if (confirm(`Delete preset \"${presets[index].name}\"?`)) {
          presetManager.deletePreset(index);
          
          // Refresh preset select
          initializePresetSelector();
        }
      }
    });
  }
  
  // Handle save preset dialog
  const savePresetConfirm = document.getElementById("save-preset-confirm");
  const savePresetCancel = document.getElementById("save-preset-cancel");
  const savePresetDialog = document.getElementById("save-preset-dialog");
  
  if (savePresetConfirm && savePresetCancel && savePresetDialog) {
    savePresetConfirm.addEventListener("click", () => {
      const nameInput = document.getElementById("preset-name-input");
      const descriptionInput = document.getElementById("preset-description-input");
      
      if (nameInput && descriptionInput) {
        const name = nameInput.value.trim() || `Preset ${presets.length + 1}`;
        const description = descriptionInput.value.trim() || "Custom preset";
        
        presetManager.savePreset(name, description);
        
        // Refresh preset select
        initializePresetSelector();
        
        // Clear inputs
        nameInput.value = "";
        descriptionInput.value = "";
        
        // Hide dialog
        savePresetDialog.style.display = "none";
      }
    });
    
    savePresetCancel.addEventListener("click", () => {
      savePresetDialog.style.display = "none";
    });
  }
}

// Start waveform visualization
function startWaveformVisualization() {
  if (!echoplexEngine) return;
  
  const canvas = document.getElementById("waveform-canvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  // Resize canvas to match container
  function resizeCanvas() {
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
  }
  
  // Initial resize
  resizeCanvas();
  
  // Resize on window resize
  window.addEventListener("resize", resizeCanvas);
  
  // Animation loop for waveform visualization
  function drawWaveform() {
    if (!ctx || !echoplexEngine) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get waveform data
    const waveformData = echoplexEngine.getWaveformData();
    
    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    
    const sliceWidth = canvas.width / waveformData.length;
    let x = 0;
    
    for (let i = 0; i < waveformData.length; i++) {
      const y = (waveformData[i] * canvas.height / 2) + canvas.height / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.stroke();
    
    // Draw playhead if playing
    const state = echoplexEngine.getState();
    if (state.isPlaying) {
      const currentLoop = state.loops[state.currentLoopIndex];
      const loopStart = currentLoop.windowStart !== null ? currentLoop.windowStart : currentLoop.startPoint;
      const loopEnd = currentLoop.windowEnd !== null ? currentLoop.windowEnd : currentLoop.endPoint;
      const loopDuration = loopEnd - loopStart;
      
      if (loopDuration > 0) {
        const playbackPosition = echoplexEngine.getCurrentPlaybackPosition();
        const relativePosition = (playbackPosition - loopStart) / loopDuration;
        const playheadX = relativePosition * canvas.width;
        
        // Draw playhead
        ctx.beginPath();
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, canvas.height);
        ctx.stroke();
      }
    }
    
    // Continue animation loop
    requestAnimationFrame(drawWaveform);
  }
  
  // Start animation loop
  drawWaveform();
}

// Start timer updates
function startTimerUpdates() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  const recordingTimeElement = document.getElementById("recording-time");
  const loopLengthElement = document.getElementById("loop-length");
  
  if (!recordingTimeElement || !loopLengthElement || !echoplexEngine) return;
  
  // Update timer immediately
  updateTimerDisplay();
  
  // Update timer every 100ms
  timerInterval = setInterval(updateTimerDisplay, 100);
  
  function updateTimerDisplay() {
    if (!echoplexEngine) return;
    
    const state = echoplexEngine.getState();
    
    // Update recording time
    if (state.isRecording || state.isOverdubbing || state.isReplacing) {
      const recordingTime = echoplexEngine.getCurrentRecordingTime();
      recordingTimeElement.textContent = recordingTime.toFixed(1);
      
      // Add warning class when approaching max recording time
      const maxTime = echoplexEngine.MAX_RECORDING_TIME;
      if (recordingTime > maxTime * 0.9) {
        recordingTimeElement.classList.add("warning");
      } else {
        recordingTimeElement.classList.remove("warning");
      }
      
      // Add recording-active class to container
      document.body.classList.add("recording-active");
    } else {
      recordingTimeElement.textContent = "0.0";
      recordingTimeElement.classList.remove("warning");
      document.body.classList.remove("recording-active");
    }
    
    // Update loop length
    const loopDuration = echoplexEngine.getLoopDuration();
    loopLengthElement.textContent = loopDuration.toFixed(1);
  }
}

// Stop timer updates
function stopTimerUpdates() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Update UI state based on engine state
function updateUIState() {
  if (!echoplexEngine) return;
  
  const state = echoplexEngine.getState();
  
  // Update transport controls
  const recordButton = document.getElementById("record-button");
  if (recordButton) {
    recordButton.classList.toggle("active", state.isRecording);
    recordButton.textContent = state.isRecording ? "Stop Recording" : "Record";
  }
  
  const playButton = document.getElementById("play-button");
  if (playButton) {
    playButton.classList.toggle("active", state.isPlaying);
    playButton.textContent = state.isPlaying ? "Stop" : "Play";
  }
  
  const overdubButton = document.getElementById("overdub-button");
  if (overdubButton) {
    overdubButton.classList.toggle("active", state.isOverdubbing);
    overdubButton.textContent = state.isOverdubbing ? "Stop Overdub" : "Overdub";
  }
  
  const multiplyButton = document.getElementById("multiply-button");
  if (multiplyButton) {
    multiplyButton.classList.toggle("active", state.isMultiplying);
  }
  
  // Update loop controls
  const reverseButton = document.getElementById("reverse-button");
  if (reverseButton) {
    const currentLoop = state.loops[state.currentLoopIndex];
    reverseButton.classList.toggle("active", currentLoop.isReversed);
  }
  
  const halfSpeedButton = document.getElementById("half-speed-button");
  if (halfSpeedButton) {
    const currentLoop = state.loops[state.currentLoopIndex];
    halfSpeedButton.classList.toggle("active", currentLoop.isHalfSpeed);
  }
  
  const muteButton = document.getElementById("mute-button");
  if (muteButton) {
    const currentLoop = state.loops[state.currentLoopIndex];
    muteButton.classList.toggle("active", currentLoop.isMuted);
  }
  
  // Update loop selector
  const loopDisplay = document.getElementById("current-loop-display");
  if (loopDisplay) {
    loopDisplay.textContent = `Loop ${state.currentLoopIndex + 1}`;
  }
  
  // Update function button
  const functionButton = document.getElementById("function-button");
  if (functionButton) {
    functionButton.classList.toggle("active", state.isFunctionActive);
  }
  
  // Update record mode selector
  const recordModeRadios = document.querySelectorAll("input[name=\"record-mode\"]");
  if (recordModeRadios.length > 0) {
    recordModeRadios.forEach(radio => {
      radio.checked = radio.value === state.recordMode;
    });
  }
  
  // Update mic monitoring selector
  const micMonitoringRadios = document.querySelectorAll("input[name=\"mic-monitoring-mode\"]");
  if (micMonitoringRadios.length > 0) {
    micMonitoringRadios.forEach(radio => {
      radio.checked = radio.value === state.micMonitoringMode;
    });
  }
  
  // Update parameter controls
  const feedbackControl = document.getElementById("feedback-control");
  if (feedbackControl) {
    feedbackControl.value = state.settings.feedback;
  }
  
  const inputGainControl = document.getElementById("input-gain-control");
  if (inputGainControl) {
    inputGainControl.value = state.settings.inputGain;
  }
  
  const outputGainControl = document.getElementById("output-gain-control");
  if (outputGainControl) {
    outputGainControl.value = state.settings.outputGain;
  }
  
  const mixControl = document.getElementById("mix-control");
  if (mixControl) {
    mixControl.value = state.settings.mix;
  }
  
  // Update select controls
  const quantizeSelect = document.getElementById("quantize-select");
  if (quantizeSelect) {
    quantizeSelect.value = state.settings.quantize;
  }
  
  const interfaceModeSelect = document.getElementById("interface-mode-select");
  if (interfaceModeSelect) {
    interfaceModeSelect.value = state.settings.interfaceMode;
  }
  
  const overdubModeSelect = document.getElementById("overdub-mode-select");
  if (overdubModeSelect) {
    overdubModeSelect.value = state.settings.overdubMode;
  }
  
  // Save state to local storage
  if (presetManager) {
    presetManager.saveLoopState();
  }
}
