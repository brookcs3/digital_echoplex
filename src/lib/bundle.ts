/**
 * Main bundle file for Digital Echo Plex
 * This file imports and exports all components to ensure proper bundling
 */

// Import all modules
import { EchoplexAudioEngine } from './audio-engine';
import { AdvancedLooperFunctions } from './advanced-functions';
import { PresetManager } from './preset-manager';
import { EchoplexTester } from './tester';
import { EchoplexState, Loop, LoopSettings } from './types';

// Export all modules to global scope for browser access
declare global {
  interface Window {
    EchoplexAudioEngine: typeof EchoplexAudioEngine;
    AdvancedLooperFunctions: typeof AdvancedLooperFunctions;
    PresetManager: typeof PresetManager;
    EchoplexTester: typeof EchoplexTester;
    echoplexEngine: EchoplexAudioEngine | null;
  }
}

// Assign to window object for browser access
window.EchoplexAudioEngine = EchoplexAudioEngine;
window.AdvancedLooperFunctions = AdvancedLooperFunctions;
window.PresetManager = PresetManager;
window.EchoplexTester = EchoplexTester;
window.echoplexEngine = null;

// Export for module usage
export {
  EchoplexAudioEngine,
  AdvancedLooperFunctions,
  PresetManager,
  EchoplexTester,
  EchoplexState,
  Loop,
  LoopSettings
};
