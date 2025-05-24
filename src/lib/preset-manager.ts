import * as Tone from 'tone';
import { EchoplexState, LoopSettings } from './types';

/**
 * Preset and persistence management for the Digital Echo Plex
 * Handles saving and loading presets and loop data
 */
export class PresetManager {
  private audioEngine: any; // Reference to the main audio engine
  private storagePrefix = 'digital-echoplex-';

  constructor(audioEngine: any) {
    this.audioEngine = audioEngine;
  }

  /**
   * Save current settings as a preset
   */
  savePreset(presetNumber: number): void {
    const state = this.audioEngine.getState();
    const settings = state.settings;
    
    // Store only the settings, not the audio data
    localStorage.setItem(
      `${this.storagePrefix}preset-${presetNumber}`,
      JSON.stringify(settings)
    );
    
    console.log(`Preset ${presetNumber} saved`);
  }

  /**
   * Load a preset
   */
  loadPreset(presetNumber: number): void {
    const presetData = localStorage.getItem(`${this.storagePrefix}preset-${presetNumber}`);
    
    if (!presetData) {
      console.log(`Preset ${presetNumber} not found`);
      return;
    }
    
    try {
      const settings = JSON.parse(presetData) as LoopSettings;
      this.audioEngine.updateSettings(settings);
      console.log(`Preset ${presetNumber} loaded`);
    } catch (error) {
      console.error('Error loading preset:', error);
    }
  }

  /**
   * Export preset as JSON file
   */
  exportPreset(presetNumber: number): string {
    const presetData = localStorage.getItem(`${this.storagePrefix}preset-${presetNumber}`);
    
    if (!presetData) {
      console.log(`Preset ${presetNumber} not found`);
      return '';
    }
    
    // Create a download link
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(presetData);
    
    return dataStr;
  }

  /**
   * Import preset from JSON data
   */
  importPreset(presetNumber: number, jsonData: string): void {
    try {
      const settings = JSON.parse(jsonData) as LoopSettings;
      
      // Validate the settings
      if (!this.validateSettings(settings)) {
        throw new Error('Invalid preset data');
      }
      
      // Store the preset
      localStorage.setItem(
        `${this.storagePrefix}preset-${presetNumber}`,
        jsonData
      );
      
      console.log(`Preset ${presetNumber} imported`);
    } catch (error) {
      console.error('Error importing preset:', error);
    }
  }

  /**
   * Validate settings object
   */
  private validateSettings(settings: any): boolean {
    // Check for required properties
    const requiredProps = [
      'quantize', 'switchQuant', 'insertMode', 'overdubMode', 
      'interfaceMode', 'samplerStyle', 'cycleBeats', 'tempo'
    ];
    
    for (const prop of requiredProps) {
      if (!(prop in settings)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Save loop to IndexedDB
   */
  async saveLoop(loopNumber: number): Promise<void> {
    const state = this.audioEngine.getState();
    const loop = state.loops[state.currentLoopIndex];
    
    if (!loop.buffer) {
      console.log('No loop data to save');
      return;
    }
    
    try {
      // Convert AudioBuffer to ArrayBuffer for storage
      const audioData = this.audioBufferToWav(loop.buffer);
      
      // Create a loop metadata object
      const loopData = {
        id: loop.id,
        startPoint: loop.startPoint,
        endPoint: loop.endPoint,
        windowStart: loop.windowStart,
        windowEnd: loop.windowEnd,
        isReversed: loop.isReversed,
        isHalfSpeed: loop.isHalfSpeed,
        isMuted: loop.isMuted,
        audioData
      };
      
      // Store in IndexedDB using a simple localStorage approach for this example
      // In a real implementation, use proper IndexedDB API
      localStorage.setItem(
        `${this.storagePrefix}loop-${loopNumber}`,
        JSON.stringify(loopData)
      );
      
      console.log(`Loop ${loopNumber} saved`);
    } catch (error) {
      console.error('Error saving loop:', error);
    }
  }

  /**
   * Load loop from IndexedDB
   */
  async loadLoop(loopNumber: number): Promise<void> {
    try {
      // In a real implementation, use proper IndexedDB API
      const loopDataStr = localStorage.getItem(`${this.storagePrefix}loop-${loopNumber}`);
      
      if (!loopDataStr) {
        console.log(`Loop ${loopNumber} not found`);
        return;
      }
      
      const loopData = JSON.parse(loopDataStr);
      
      // Convert stored data back to AudioBuffer
      const audioBuffer = await this.wavToAudioBuffer(loopData.audioData);
      
      // Create a new loop with the loaded data
      const newLoop = {
        id: loopData.id,
        buffer: audioBuffer,
        startPoint: loopData.startPoint,
        endPoint: loopData.endPoint,
        windowStart: loopData.windowStart,
        windowEnd: loopData.windowEnd,
        isReversed: loopData.isReversed,
        isHalfSpeed: loopData.isHalfSpeed,
        isMuted: loopData.isMuted
      };
      
      // Update the current loop
      const state = this.audioEngine.getState();
      state.loops[state.currentLoopIndex] = newLoop;
      
      // Update the player
      if (this.audioEngine.player) {
        this.audioEngine.player.buffer.set(audioBuffer);
      }
      
      console.log(`Loop ${loopNumber} loaded`);
    } catch (error) {
      console.error('Error loading loop:', error);
    }
  }

  /**
   * Save complete session state
   */
  saveSession(sessionName: string): void {
    const state = this.audioEngine.getState();
    
    // Create a session object without the audio buffers
    const sessionData = {
      currentLoopIndex: state.currentLoopIndex,
      settings: state.settings,
      loops: state.loops.map(loop => ({
        id: loop.id,
        startPoint: loop.startPoint,
        endPoint: loop.endPoint,
        windowStart: loop.windowStart,
        windowEnd: loop.windowEnd,
        isReversed: loop.isReversed,
        isHalfSpeed: loop.isHalfSpeed,
        isMuted: loop.isMuted,
        hasBuffer: !!loop.buffer
      }))
    };
    
    // Store the session data
    localStorage.setItem(
      `${this.storagePrefix}session-${sessionName}`,
      JSON.stringify(sessionData)
    );
    
    // For each loop with audio data, save it separately
    state.loops.forEach((loop, index) => {
      if (loop.buffer) {
        this.saveLoop(index);
      }
    });
    
    console.log(`Session "${sessionName}" saved`);
  }

  /**
   * Load complete session state
   */
  async loadSession(sessionName: string): Promise<void> {
    try {
      const sessionDataStr = localStorage.getItem(`${this.storagePrefix}session-${sessionName}`);
      
      if (!sessionDataStr) {
        console.log(`Session "${sessionName}" not found`);
        return;
      }
      
      const sessionData = JSON.parse(sessionDataStr);
      
      // Update settings
      this.audioEngine.updateSettings(sessionData.settings);
      
      // Update current loop index
      const state = this.audioEngine.getState();
      state.currentLoopIndex = sessionData.currentLoopIndex;

      // Recreate loop structures
      state.loops = sessionData.loops.map((l: any, idx: number) => ({
        id: idx,
        buffer: null,
        startPoint: l.startPoint,
        endPoint: l.endPoint,
        windowStart: l.windowStart,
        windowEnd: l.windowEnd,
        isReversed: l.isReversed,
        isHalfSpeed: l.isHalfSpeed,
        isMuted: l.isMuted
      }));

      // Load audio buffers where available
      for (let i = 0; i < sessionData.loops.length; i++) {
        if (sessionData.loops[i].hasBuffer) {
          await this.loadLoop(i);
        }
      }
      
      console.log(`Session "${sessionName}" loaded`);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }

  /**
   * Export audio as WAV file
   */
  exportAudio(loopIndex: number): string {
    const state = this.audioEngine.getState();
    const loop = state.loops[loopIndex];
    
    if (!loop.buffer) {
      console.log('No audio data to export');
      return '';
    }
    
    // Convert AudioBuffer to WAV
    const wavData = this.audioBufferToWav(loop.buffer);
    
    // Create a download link
    const dataStr = "data:audio/wav;base64," + btoa(
      String.fromCharCode.apply(null, new Uint8Array(wavData) as any)
    );
    
    return dataStr;
  }

  /**
   * Import audio from file
   */
  async importAudio(file: File): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          resolve(audioBuffer);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Convert AudioBuffer to WAV format
   * This is a simplified version - a real implementation would need a proper WAV encoder
   */
  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    // In a real implementation, this would convert the AudioBuffer to WAV format
    // For this example, we'll just serialize the first channel's data
    const channelData = buffer.getChannelData(0);
    return channelData.buffer.slice(0);
  }

  /**
   * Convert WAV data to AudioBuffer
   * This is a simplified version - a real implementation would need a proper WAV decoder
   */
  private async wavToAudioBuffer(wavData: ArrayBuffer): Promise<AudioBuffer> {
    // In a real implementation, this would parse the WAV format
    // For this example, we'll just create a buffer from the raw data
    const audioContext = new AudioContext();
    const audioBuffer = audioContext.createBuffer(1, wavData.byteLength / 4, audioContext.sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    channelData.set(new Float32Array(wavData));
    return audioBuffer;
  }
}
