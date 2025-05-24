/**
 * Digital Echo Plex - Preset Manager
 * Handles saving and loading presets for the Echo Plex
 */

// Preset Manager class
class PresetManager {
  constructor(echoplexEngine) {
    this.echoplexEngine = echoplexEngine;
    this.presets = [];
    this.currentPresetIndex = -1; // -1 means no preset selected
    
    // Load presets from local storage
    this.loadPresetsFromStorage();
    
    console.log('PresetManager initialized');
  }
  
  // Load presets from local storage
  loadPresetsFromStorage() {
    try {
      const savedPresets = localStorage.getItem('echoplex_presets');
      if (savedPresets) {
        this.presets = JSON.parse(savedPresets);
        console.log(`Loaded ${this.presets.length} presets from storage`);
      } else {
        // Create default presets if none exist
        this.createDefaultPresets();
        console.log('Created default presets');
      }
    } catch (error) {
      console.error('Error loading presets from storage:', error);
      // Create default presets as fallback
      this.createDefaultPresets();
    }
  }
  
  // Create default presets
  createDefaultPresets() {
    this.presets = [
      {
        name: 'Default',
        description: 'Default Echo Plex settings',
        settings: {
          quantize: 'OFF',
          switchQuant: 'OFF',
          insertMode: 'INS',
          overdubMode: 'SWITCH',
          interfaceMode: 'LOOP',
          samplerStyle: 'PLAY',
          tempo: 120,
          cycleBeats: 8,
          feedback: 1.0,
          inputGain: 0.8,
          outputGain: 0.8,
          mix: 0.5
        }
      },
      {
        name: 'Ambient',
        description: 'Long decay, subtle mix',
        settings: {
          quantize: 'OFF',
          switchQuant: 'OFF',
          insertMode: 'INS',
          overdubMode: 'SWITCH',
          interfaceMode: 'LOOP',
          samplerStyle: 'PLAY',
          tempo: 80,
          cycleBeats: 16,
          feedback: 0.9,
          inputGain: 0.7,
          outputGain: 0.8,
          mix: 0.6
        }
      },
      {
        name: 'Rhythmic',
        description: 'Quantized for rhythmic loops',
        settings: {
          quantize: 'LOOP',
          switchQuant: 'CYCLE',
          insertMode: 'INS',
          overdubMode: 'SWITCH',
          interfaceMode: 'LOOP',
          samplerStyle: 'PLAY',
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
      localStorage.setItem('echoplex_presets', JSON.stringify(this.presets));
      console.log(`Saved ${this.presets.length} presets to storage`);
    } catch (error) {
      console.error('Error saving presets to storage:', error);
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
      console.error('Echo Plex engine not available');
      return false;
    }
    
    const state = this.echoplexEngine.getState();
    
    const newPreset = {
      name: name || `Preset ${this.presets.length + 1}`,
      description: description || 'Custom preset',
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
      console.error('Echo Plex engine not available');
      return false;
    }
    
    if (index < 0 || index >= this.presets.length) {
      console.error('Invalid preset index:', index);
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
      console.error('Echo Plex engine not available');
      return false;
    }
    
    if (index < 0 || index >= this.presets.length) {
      console.error('Invalid preset index:', index);
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
      console.error('Invalid preset index:', index);
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
      console.error('Echo Plex engine not available');
      return false;
    }
    
    try {
      const state = this.echoplexEngine.getState();
      
      // We can't directly serialize AudioBuffer objects, so we'll save metadata only
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
        recordMode: state.recordMode
      };
      
      localStorage.setItem('echoplex_state', JSON.stringify(stateToSave));
      console.log('Saved loop state to storage');
      return true;
    } catch (error) {
      console.error('Error saving loop state to storage:', error);
      return false;
    }
  }
  
  // Load loop state from local storage
  loadLoopState() {
    if (!this.echoplexEngine) {
      console.error('Echo Plex engine not available');
      return false;
    }
    
    try {
      const savedState = localStorage.getItem('echoplex_state');
      if (!savedState) {
        console.log('No saved state found');
        return false;
      }
      
      const parsedState = JSON.parse(savedState);
      
      // Apply settings
      this.echoplexEngine.updateSettings(parsedState.settings);
      
      // Set record mode
      this.echoplexEngine.setRecordMode(parsedState.recordMode);
      
      // Note: We can't restore actual audio buffers from local storage
      // But we can restore other loop properties and settings
      
      console.log('Loaded loop state from storage');
      return true;
    } catch (error) {
      console.error('Error loading loop state from storage:', error);
      return false;
    }
  }
}

// Make available globally
window.PresetManager = PresetManager;
