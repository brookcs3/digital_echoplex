import * as Tone from 'tone';
import { EchoplexState, Loop, LoopFunction, LoopSettings, UndoAction } from './types';

/**
 * Core audio engine for the Digital Echo Plex
 * Handles all audio processing, loop recording, and playback
 */
export class EchoplexAudioEngine {
  private context: AudioContext;
  private state: EchoplexState;
  private player: Tone.Player | null = null;
  private recorder: Tone.Recorder;
  private feedback: Tone.FeedbackDelay;
  private inputGain: Tone.Gain;
  private outputGain: Tone.Gain;
  private mixer: Tone.CrossFade;
  private analyser: Tone.Analyser;
  private microphone: Tone.UserMedia | null = null;
  private recordStartTime: number = 0;
  private scheduledEvents: number[] = [];
  private loopInterval: number | null = null;
  private playbackStartTime: number = 0;
  private insertPosition: number = 0;

  constructor() {
    // Initialize Web Audio API context
    this.context = new AudioContext();
    
    // Initialize Tone.js
    Tone.setContext(this.context);
    
    // Create audio processing nodes
    this.inputGain = new Tone.Gain(0.8).toDestination();
    this.outputGain = new Tone.Gain(0.8).toDestination();
    this.feedback = new Tone.FeedbackDelay(0.5, 0.5).connect(this.outputGain);
    this.mixer = new Tone.CrossFade(0.5).connect(this.outputGain);
    this.recorder = new Tone.Recorder();
    this.analyser = new Tone.Analyser('waveform', 1024);
    
    // Connect audio routing
    this.inputGain.connect(this.mixer.a);
    this.inputGain.connect(this.recorder);
    this.inputGain.connect(this.analyser);
    
    // Initialize state
    this.state = this.getInitialState();

    // Load persisted settings if available
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('echoplex-settings');
      if (saved) {
        try {
          const loaded = JSON.parse(saved);
          this.state.settings = { ...this.state.settings, ...loaded };
          this.applySettingsToNodes(this.state.settings);
        } catch (err) {
          console.warn('Failed to parse saved settings', err);
        }
      }
    }
  }

  /**
   * Initialize the default state for the Echo Plex
   */
  private getInitialState(): EchoplexState {
    return {
      isRecording: false,
      isPlaying: false,
      isOverdubbing: false,
      isMultiplying: false,
      isInserting: false,
      isReplacing: false,
      isSUSActive: false,
      currentLoopIndex: 0,
      loops: [this.createEmptyLoop(0)],
      settings: this.getDefaultSettings(),
      undoHistory: []
    };
  }

  /**
   * Create an empty loop with default values
   */
  private createEmptyLoop(id: number): Loop {
    return {
      id,
      buffer: null,
      startPoint: 0,
      endPoint: 0,
      windowStart: null,
      windowEnd: null,
      isReversed: false,
      isHalfSpeed: false,
      isMuted: false
    };
  }

  /**
   * Get default settings for the Echo Plex
   */
  private getDefaultSettings(): LoopSettings {
    return {
      quantize: 'OFF',
      switchQuant: 'OFF',
      insertMode: 'INS',
      overdubMode: 'OVR',
      interfaceMode: 'LOOP',
      samplerStyle: 'PLAY',
      cycleBeats: 8,
      tempo: 120,
      micMonitor: 'RECORDING_ONLY',
      feedback: 0.5,
      delayTime: 0.25,
      stutterLength: 0.1,
      inputGain: 0.8,
      outputGain: 0.8,
      mix: 0.5
    };
  }

  /**
   * Initialize audio input from microphone
   */
  async initMicrophone(): Promise<void> {
    try {
      this.microphone = new Tone.UserMedia();
      await this.microphone.open();
      this.microphone.connect(this.inputGain);
      console.log('Microphone initialized successfully');
    } catch (error) {
      console.error('Error initializing microphone:', error);
      throw error;
    }
  }

  /**
   * Start recording a new loop
   */
  async startRecording(): Promise<void> {
    if (this.state.isRecording) return;

    // Start the recorder
    this.recorder.start();
    this.recordStartTime = Tone.now();
    
    // Update state
    this.state.isRecording = true;
    
    console.log('Recording started');
  }

  /**
   * Stop recording and create a loop
   */
  async stopRecording(): Promise<void> {
    if (!this.state.isRecording) return;

    // Stop the recorder and get the recorded audio
    const recording = await this.recorder.stop();
    const recordingDuration = Tone.now() - this.recordStartTime;
    
    // Create a blob from the recording
    const url = URL.createObjectURL(recording);
    
    // Load the recording into a buffer
    const buffer = await Tone.Buffer.fromUrl(url);
    
    // Update the current loop
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save the previous state for undo
    this.addUndoAction({
      type: 'RECORD',
      loopId: currentLoop.id,
      previousState: { ...currentLoop }
    });
    
    // Update the loop with the new buffer
    currentLoop.buffer = buffer.get();
    currentLoop.endPoint = buffer.duration;
    
    // Create a player for the loop
    this.player = new Tone.Player(buffer);
    this.player.connect(this.mixer.b);
    if (this.state.settings.interfaceMode === 'DELAY' ||
        this.state.settings.interfaceMode === 'EXPERT') {
      this.player.connect(this.feedback);
    }
    
    // Update state
    this.state.isRecording = false;
    this.state.isPlaying = true;
    
    // Start loop playback
    this.startLoopPlayback();
    
    console.log('Recording stopped, loop created');
  }

  /**
   * Start loop playback
   */
  startLoopPlayback(): void {
    if (!this.state.loops[this.state.currentLoopIndex].buffer) return;

    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    const { interfaceMode, stutterLength } = this.state.settings;

    // Clear any existing scheduled events
    this.clearScheduledEvents();
    
    // Set up the player with the current loop settings
    if (this.player) {
      this.player.reverse = currentLoop.isReversed;
      this.player.playbackRate = currentLoop.isHalfSpeed ? 0.5 : 1;
      
      // If we have a loop window, use it
      const start = currentLoop.windowStart !== null ? currentLoop.windowStart : currentLoop.startPoint;
      const end = currentLoop.windowEnd !== null ? currentLoop.windowEnd : currentLoop.endPoint;
      
      // Schedule the loop to play repeatedly
      this.player.start('+0.1', start);

      // Calculate loop duration
      let loopDuration = end - start;
      if (interfaceMode === 'STUTTER' || interfaceMode === 'EXPERT') {
        loopDuration = stutterLength;
      }

      // Schedule the loop to restart at the end
      this.loopInterval = window.setInterval(() => {
        if (this.player && this.state.isPlaying && !currentLoop.isMuted) {
          this.player.stop();
          this.player.start('+0.01', start);
          this.playbackStartTime = this.context.currentTime + 0.01;
        }
      }, loopDuration * 1000);
    }
    
    this.state.isPlaying = true;
    console.log('Loop playback started');
  }

  /**
   * Stop loop playback
   */
  stopLoopPlayback(): void {
    if (this.player) {
      this.player.stop();
    }
    
    this.clearScheduledEvents();
    
    this.state.isPlaying = false;
    console.log('Loop playback stopped');
  }

  /**
   * Clear all scheduled events
   */
  private clearScheduledEvents(): void {
    if (this.loopInterval !== null) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }

    this.scheduledEvents.forEach(id => Tone.Transport.clear(id));
    this.scheduledEvents = [];
  }

  /**
   * Get the current playback position within the loop
   */
  private getPlaybackPosition(): number {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    const start = currentLoop.windowStart !== null ? currentLoop.windowStart : currentLoop.startPoint;
    const end = currentLoop.windowEnd !== null ? currentLoop.windowEnd : currentLoop.endPoint;
    const duration = end - start;
    const elapsed = this.context.currentTime - this.playbackStartTime;
    const offset = elapsed % duration;
    return start + offset;
  }

  /**
   * Start overdubbing on the current loop
   */
  async startOverdub(): Promise<void> {
    if (!this.state.isPlaying || this.state.isOverdubbing) return;
    
    // Start the recorder
    this.recorder.start();
    
    this.state.isOverdubbing = true;
    console.log('Overdub started');
  }

  /**
   * Stop overdubbing and merge with the current loop
   */
  async stopOverdub(): Promise<void> {
    if (!this.state.isOverdubbing) return;
    
    // Stop the recorder and get the recorded audio
    const recording = await this.recorder.stop();
    
    // Create a blob from the recording
    const url = URL.createObjectURL(recording);
    
    // Load the recording into a buffer
    const overdubBuffer = await Tone.Buffer.fromUrl(url);
    
    // Get the current loop
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save the previous state for undo
    this.addUndoAction({
      type: 'OVERDUB',
      loopId: currentLoop.id,
      previousState: { buffer: currentLoop.buffer }
    });
    
    // If we're in replace mode, replace the audio
    if (this.state.settings.overdubMode === 'REP') {
      currentLoop.buffer = overdubBuffer.get();
    } 
    // Otherwise, mix the overdub with the existing loop
    else {
      if (currentLoop.buffer) {
        // Create offline context for mixing
        const offlineCtx = new OfflineAudioContext(
          currentLoop.buffer.numberOfChannels,
          currentLoop.buffer.length,
          currentLoop.buffer.sampleRate
        );
        
        // Create source nodes
        const originalSource = offlineCtx.createBufferSource();
        originalSource.buffer = currentLoop.buffer;
        
        const overdubSource = offlineCtx.createBufferSource();
        overdubSource.buffer = overdubBuffer.get();
        
        // Create gain nodes for mixing
        const originalGain = offlineCtx.createGain();
        const overdubGain = offlineCtx.createGain();
        
        // Connect nodes
        originalSource.connect(originalGain);
        overdubSource.connect(overdubGain);
        originalGain.connect(offlineCtx.destination);
        overdubGain.connect(offlineCtx.destination);
        
        // Start sources
        originalSource.start();
        overdubSource.start();
        
        // Render the mix
        const renderedBuffer = await offlineCtx.startRendering();
        
        // Update the loop buffer
        currentLoop.buffer = renderedBuffer;
      }
    }
    
    // Update the player with the new buffer
    if (this.player) {
      this.player.buffer.set(currentLoop.buffer);
    }
    
    this.state.isOverdubbing = false;
    console.log('Overdub stopped and merged');
  }

  /**
   * Toggle insert recording at the current playback position
   */
  async insertLoop(): Promise<void> {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    if (!this.state.isPlaying || !currentLoop) return;

    if (!this.state.isInserting) {
      this.recorder.start();
      this.insertPosition = this.getPlaybackPosition();
      this.state.isInserting = true;
      console.log('Insert recording started');
      return;
    }

    const recording = await this.recorder.stop();
    const url = URL.createObjectURL(recording);
    const insertBuffer = await Tone.Buffer.fromUrl(url);

    if (!currentLoop.buffer) {
      currentLoop.buffer = insertBuffer.get();
      currentLoop.endPoint = insertBuffer.duration;
    } else {
      this.addUndoAction({
        type: 'INSERT',
        loopId: currentLoop.id,
        previousState: { buffer: currentLoop.buffer, endPoint: currentLoop.endPoint }
      });

      const channels = currentLoop.buffer.numberOfChannels;
      const sampleRate = currentLoop.buffer.sampleRate;
      const startIndex = Math.floor(this.insertPosition * sampleRate);
      const newLength = currentLoop.buffer.length + insertBuffer.length;
      const newBuffer = this.context.createBuffer(channels, newLength, sampleRate);

      for (let ch = 0; ch < channels; ch++) {
        const data = newBuffer.getChannelData(ch);
        const oldData = currentLoop.buffer.getChannelData(ch);
        const insData = insertBuffer.get().getChannelData(ch);

        data.set(oldData.subarray(0, startIndex), 0);
        data.set(insData, startIndex);
        data.set(oldData.subarray(startIndex), startIndex + insData.length);
      }

      currentLoop.buffer = newBuffer;
      currentLoop.endPoint += insertBuffer.duration;
    }

    if (this.player) {
      this.player.buffer.set(currentLoop.buffer!);
    }

    this.state.isInserting = false;
    console.log('Insert recording completed');

    if (this.state.isPlaying) {
      this.stopLoopPlayback();
      this.startLoopPlayback();
    }
  }

  /**
   * Toggle replace recording over the current playback position
   */
  async replaceLoop(): Promise<void> {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    if (!this.state.isPlaying || !currentLoop) return;

    if (!this.state.isReplacing) {
      this.recorder.start();
      this.insertPosition = this.getPlaybackPosition();
      this.state.isReplacing = true;
      console.log('Replace recording started');
      return;
    }

    const recording = await this.recorder.stop();
    const url = URL.createObjectURL(recording);
    const replaceBuffer = await Tone.Buffer.fromUrl(url);

    if (!currentLoop.buffer) {
      currentLoop.buffer = replaceBuffer.get();
      currentLoop.endPoint = replaceBuffer.duration;
    } else {
      this.addUndoAction({
        type: 'REPLACE',
        loopId: currentLoop.id,
        previousState: { buffer: currentLoop.buffer }
      });

      const channels = currentLoop.buffer.numberOfChannels;
      const sampleRate = currentLoop.buffer.sampleRate;
      const startIndex = Math.floor(this.insertPosition * sampleRate);
      const endIndex = Math.min(startIndex + replaceBuffer.length, currentLoop.buffer.length);
      const newBuffer = this.context.createBuffer(channels, currentLoop.buffer.length, sampleRate);

      for (let ch = 0; ch < channels; ch++) {
        const data = newBuffer.getChannelData(ch);
        const oldData = currentLoop.buffer.getChannelData(ch);
        const repData = replaceBuffer.get().getChannelData(ch);

        data.set(oldData.subarray(0, startIndex), 0);
        data.set(repData.subarray(0, endIndex - startIndex), startIndex);
        if (endIndex < oldData.length) {
          data.set(oldData.subarray(endIndex), endIndex);
        }
      }

      currentLoop.buffer = newBuffer;
    }

    if (this.player) {
      this.player.buffer.set(currentLoop.buffer!);
    }

    this.state.isReplacing = false;
    console.log('Replace recording completed');

    if (this.state.isPlaying) {
      this.stopLoopPlayback();
      this.startLoopPlayback();
    }
  }

  /**
   * Start multiply operation (extends loop length)
   */
  startMultiply(): void {
    if (!this.state.isPlaying || this.state.isMultiplying) return;
    
    this.state.isMultiplying = true;
    console.log('Multiply started');
  }

  /**
   * Stop multiply operation and extend the loop
   */
  async stopMultiply(): Promise<void> {
    if (!this.state.isMultiplying) return;
    
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save the previous state for undo
    this.addUndoAction({
      type: 'MULTIPLY',
      loopId: currentLoop.id,
      previousState: { 
        buffer: currentLoop.buffer,
        endPoint: currentLoop.endPoint
      }
    });
    
    // Calculate the new loop length (doubled)
    const originalDuration = currentLoop.endPoint - currentLoop.startPoint;
    const newDuration = originalDuration * 2;
    
    if (currentLoop.buffer) {
      // Create a new buffer with double the length
      const newBuffer = this.context.createBuffer(
        currentLoop.buffer.numberOfChannels,
        currentLoop.buffer.length * 2,
        currentLoop.buffer.sampleRate
      );
      
      // Copy the original buffer data
      for (let channel = 0; channel < currentLoop.buffer.numberOfChannels; channel++) {
        const originalData = currentLoop.buffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        
        // Copy original data to the first half
        newData.set(originalData, 0);
        
        // Copy original data to the second half
        newData.set(originalData, originalData.length);
      }
      
      // Update the loop
      currentLoop.buffer = newBuffer;
      currentLoop.endPoint = newDuration;
      
      // Update the player
      if (this.player) {
        this.player.buffer.set(newBuffer);
      }
    }
    
    this.state.isMultiplying = false;
    console.log('Multiply stopped, loop extended');
    
    // Restart loop playback with the new extended loop
    this.stopLoopPlayback();
    this.startLoopPlayback();
  }

  /**
   * Reverse the current loop
   */
  reverseLoop(): void {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save the previous state for undo
    this.addUndoAction({
      type: 'REVERSE',
      loopId: currentLoop.id,
      previousState: { isReversed: currentLoop.isReversed }
    });
    
    // Toggle reverse state
    currentLoop.isReversed = !currentLoop.isReversed;
    
    // Update player if it exists
    if (this.player) {
      this.player.reverse = currentLoop.isReversed;
    }
    
    console.log(`Loop ${currentLoop.isReversed ? 'reversed' : 'forward'}`);
    
    // Restart playback to apply the change
    if (this.state.isPlaying) {
      this.stopLoopPlayback();
      this.startLoopPlayback();
    }
  }

  /**
   * Toggle half-speed playback
   */
  toggleHalfSpeed(): void {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save the previous state for undo
    this.addUndoAction({
      type: 'HALF_SPEED',
      loopId: currentLoop.id,
      previousState: { isHalfSpeed: currentLoop.isHalfSpeed }
    });
    
    // Toggle half-speed state
    currentLoop.isHalfSpeed = !currentLoop.isHalfSpeed;
    
    // Update player if it exists
    if (this.player) {
      this.player.playbackRate = currentLoop.isHalfSpeed ? 0.5 : 1;
    }
    
    console.log(`Loop playback ${currentLoop.isHalfSpeed ? 'half-speed' : 'normal speed'}`);
    
    // Restart playback to apply the change
    if (this.state.isPlaying) {
      this.stopLoopPlayback();
      this.startLoopPlayback();
    }
  }

  /**
   * Mute/unmute the current loop
   */
  toggleMute(): void {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save the previous state for undo
    this.addUndoAction({
      type: 'MUTE',
      loopId: currentLoop.id,
      previousState: { isMuted: currentLoop.isMuted }
    });
    
    // Toggle mute state
    currentLoop.isMuted = !currentLoop.isMuted;
    
    // Update player if it exists
    if (this.player) {
      if (currentLoop.isMuted) {
        this.player.volume.value = -Infinity;
      } else {
        this.player.volume.value = 0;
      }
    }
    
    console.log(`Loop ${currentLoop.isMuted ? 'muted' : 'unmuted'}`);
  }

  /**
   * Set the loop window (a subsection of the loop to play)
   */
  setLoopWindow(start: number | null, end: number | null): void {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save the previous state for undo
    this.addUndoAction({
      type: 'LOOP_WINDOW',
      loopId: currentLoop.id,
      previousState: { 
        windowStart: currentLoop.windowStart,
        windowEnd: currentLoop.windowEnd
      }
    });
    
    // Update window points
    currentLoop.windowStart = start;
    currentLoop.windowEnd = end;
    
    console.log(`Loop window set: ${start} to ${end}`);
    
    // Restart playback to apply the change
    if (this.state.isPlaying) {
      this.stopLoopPlayback();
      this.startLoopPlayback();
    }
  }

  /**
   * Switch to the next loop
   */
  nextLoop(): void {
    // If we're at the last loop, create a new one
    if (this.state.currentLoopIndex === this.state.loops.length - 1) {
      const newLoop = this.createEmptyLoop(this.state.loops.length);
      this.state.loops.push(newLoop);
    }
    
    // Stop current playback
    this.stopLoopPlayback();
    
    // Switch to the next loop
    this.state.currentLoopIndex++;
    
    // If the new loop has content, start playback
    if (this.state.loops[this.state.currentLoopIndex].buffer) {
      // Create a new player for the loop
      const buffer = new Tone.Buffer().fromArray(
        this.state.loops[this.state.currentLoopIndex].buffer!.getChannelData(0)
      );
      this.player = new Tone.Player(buffer);
      this.player.connect(this.mixer.b);
      if (this.state.settings.interfaceMode === 'DELAY' ||
          this.state.settings.interfaceMode === 'EXPERT') {
        this.player.connect(this.feedback);
      }
      
      // Start playback
      this.startLoopPlayback();
    }
    
    console.log(`Switched to loop ${this.state.currentLoopIndex + 1}`);
  }

  /**
   * Switch to the previous loop
   */
  previousLoop(): void {
    // If we're at the first loop, do nothing
    if (this.state.currentLoopIndex === 0) return;
    
    // Stop current playback
    this.stopLoopPlayback();
    
    // Switch to the previous loop
    this.state.currentLoopIndex--;
    
    // If the new loop has content, start playback
    if (this.state.loops[this.state.currentLoopIndex].buffer) {
      // Create a new player for the loop
      const buffer = new Tone.Buffer().fromArray(
        this.state.loops[this.state.currentLoopIndex].buffer!.getChannelData(0)
      );
      this.player = new Tone.Player(buffer);
      this.player.connect(this.mixer.b);
      if (this.state.settings.interfaceMode === 'DELAY' ||
          this.state.settings.interfaceMode === 'EXPERT') {
        this.player.connect(this.feedback);
      }
      
      // Start playback
      this.startLoopPlayback();
    }
    
    console.log(`Switched to loop ${this.state.currentLoopIndex + 1}`);
  }

  /**
   * Reset the current loop (clear its content)
   */
  resetLoop(): void {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save the previous state for undo
    this.addUndoAction({
      type: 'RESET',
      loopId: currentLoop.id,
      previousState: { ...currentLoop }
    });
    
    // Stop playback
    this.stopLoopPlayback();
    
    // Reset the loop
    this.state.loops[this.state.currentLoopIndex] = this.createEmptyLoop(currentLoop.id);
    
    console.log(`Loop ${currentLoop.id + 1} reset`);
  }

  /**
   * Retrigger the current loop from the start
   */
  retriggerLoop(): void {
    if (!this.state.isPlaying) return;
    
    // Restart playback from the beginning
    this.stopLoopPlayback();
    this.startLoopPlayback();
    
    console.log('Loop retriggered');
  }

  /**
   * Set the start point of the loop
   */
  setStartPoint(time: number): void {
    const currentLoop = this.state.loops[this.state.currentLoopIndex];
    
    // Save the previous state for undo
    this.addUndoAction({
      type: 'START_POINT',
      loopId: currentLoop.id,
      previousState: { startPoint: currentLoop.startPoint }
    });
    
    // Update start point
    currentLoop.startPoint = time;
    
    console.log(`Start point set to ${time}`);
    
    // Restart playback to apply the change
    if (this.state.isPlaying) {
      this.stopLoopPlayback();
      this.startLoopPlayback();
    }
  }

  /**
   * Undo the last action
   */
  undo(): void {
    if (this.state.undoHistory.length === 0) return;
    
    // Get the last action
    const lastAction = this.state.undoHistory.pop();
    
    if (!lastAction) return;
    
    // Find the loop
    const loop = this.state.loops.find(l => l.id === lastAction.loopId);
    
    if (!loop) return;
    
    // Apply the previous state
    Object.assign(loop, lastAction.previousState);
    
    console.log(`Undid ${lastAction.type} action`);
    
    // Restart playback to apply the change
    if (this.state.isPlaying) {
      this.stopLoopPlayback();
      this.startLoopPlayback();
    }
  }

  /**
   * Add an action to the undo history
   */
  private addUndoAction(action: UndoAction): void {
    this.state.undoHistory.push(action);
    
    // Limit undo history to 20 actions
    if (this.state.undoHistory.length > 20) {
      this.state.undoHistory.shift();
    }
  }

  /**
   * Update settings
   */
  updateSettings(settings: Partial<LoopSettings>): void {
    this.state.settings = { ...this.state.settings, ...settings };

    this.applySettingsToNodes(this.state.settings);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('echoplex-settings', JSON.stringify(this.state.settings));
    }

    console.log('Settings updated:', settings);
  }

  /** Apply settings values to audio nodes */
  private applySettingsToNodes(settings: LoopSettings): void {
    this.feedback.delayTime.value = settings.delayTime;
    this.feedback.feedback.value = settings.feedback;
    this.inputGain.gain.value = settings.inputGain;
    this.outputGain.gain.value = settings.outputGain;
    this.mixer.fade.value = settings.mix;
  }

  /**
   * Get the current state
   */
  getState(): EchoplexState {
    return this.state;
  }

  /**
   * Get waveform data for visualization
   */
  getWaveformData(): Float32Array {
    return this.analyser.getValue() as Float32Array;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stopLoopPlayback();
    
    if (this.microphone) {
      this.microphone.close();
    }
    
    if (this.player) {
      this.player.dispose();
    }
    
    this.recorder.dispose();
    this.feedback.dispose();
    this.inputGain.dispose();
    this.outputGain.dispose();
    this.mixer.dispose();
    this.analyser.dispose();
    
    this.context.close();
    
    console.log('Audio engine disposed');
  }
}
