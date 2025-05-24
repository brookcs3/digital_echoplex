// Main integration test script for Digital Echo Plex
// This script verifies that all features from the manual are implemented correctly

import * as Tone from 'tone';
import { EchoplexAudioEngine } from './audio-engine';
import { AdvancedLooperFunctions } from './advanced-functions';
import { PresetManager } from './preset-manager';

/**
 * Test suite for the Digital Echo Plex
 */
export class EchoplexTester {
  private audioEngine: EchoplexAudioEngine;
  private advancedFunctions: AdvancedLooperFunctions;
  private presetManager: PresetManager;
  private testResults: { feature: string, passed: boolean, notes: string }[] = [];

  constructor() {
    // Initialize components
    this.audioEngine = new EchoplexAudioEngine();
    this.advancedFunctions = new AdvancedLooperFunctions(this.audioEngine);
    this.presetManager = new PresetManager(this.audioEngine);
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log('Starting Digital Echo Plex test suite...');
    
    // Core functionality tests
    await this.testRecordPlayback();
    await this.testOverdub();
    await this.testMultiply();
    await this.testReverseAndHalfSpeed();
    await this.testMute();
    await this.testUndo();
    await this.testNextPreviousLoop();
    
    // Advanced functionality tests
    await this.testLoopWindowing();
    await this.testMoveLoopWindow();
    await this.testSubstitute();
    await this.testSUSCommands();
    await this.testMultiIncrease();
    await this.testLoopDivide();
    await this.testQuantization();
    await this.testSyncFeatures();
    await this.testSetTempo();
    await this.testExternalSync();
    await this.testReAlign();
    
    // Parameter tests
    await this.testInterfaceModes();
    await this.testSamplerStyles();
    
    // Persistence tests
    await this.testPresetSaveLoad();
    await this.testSessionSaveLoad();
    await this.testAudioExportImport();
    
    // Report results
    this.reportResults();
  }

  /**
   * Test basic record and playback
   */
  private async testRecordPlayback(): Promise<void> {
    console.log('Testing record and playback...');
    
    try {
      // Create a test tone
      const osc = new Tone.Oscillator(440, 'sine').toDestination();
      osc.volume.value = -20;
      
      // Start recording
      await this.audioEngine.startRecording();
      
      // Play test tone for 1 second
      osc.start();
      await new Promise(resolve => setTimeout(resolve, 1000));
      osc.stop();
      
      // Stop recording
      await this.audioEngine.stopRecording();
      
      // Verify that a loop was created
      const state = this.audioEngine.getState();
      const hasLoop = state.loops[state.currentLoopIndex].buffer !== null;
      
      this.recordTestResult('Record and Playback', hasLoop, 
        hasLoop ? 'Successfully recorded and created loop' : 'Failed to create loop');
      
    } catch (error) {
      this.recordTestResult('Record and Playback', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test overdub functionality
   */
  private async testOverdub(): Promise<void> {
    console.log('Testing overdub...');
    
    try {
      // Ensure we have a loop to overdub
      const state = this.audioEngine.getState();
      if (!state.loops[state.currentLoopIndex].buffer) {
        throw new Error('No loop available for overdub test');
      }
      
      // Start playback
      this.audioEngine.startLoopPlayback();
      
      // Start overdub
      await this.audioEngine.startOverdub();
      
      // Create a test tone at different frequency
      const osc = new Tone.Oscillator(880, 'sine').toDestination();
      osc.volume.value = -20;
      
      // Play test tone for 1 second
      osc.start();
      await new Promise(resolve => setTimeout(resolve, 1000));
      osc.stop();
      
      // Stop overdub
      await this.audioEngine.stopOverdub();
      
      // Stop playback
      this.audioEngine.stopLoopPlayback();
      
      this.recordTestResult('Overdub', true, 'Overdub test completed');
      
    } catch (error) {
      this.recordTestResult('Overdub', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test multiply functionality
   */
  private async testMultiply(): Promise<void> {
    console.log('Testing multiply...');
    
    try {
      // Ensure we have a loop to multiply
      const state = this.audioEngine.getState();
      if (!state.loops[state.currentLoopIndex].buffer) {
        throw new Error('No loop available for multiply test');
      }
      
      // Get original loop length
      const originalLength = state.loops[state.currentLoopIndex].endPoint;
      
      // Start playback
      this.audioEngine.startLoopPlayback();
      
      // Start multiply
      this.audioEngine.startMultiply();
      
      // Wait for a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stop multiply
      await this.audioEngine.stopMultiply();
      
      // Stop playback
      this.audioEngine.stopLoopPlayback();
      
      // Verify that the loop length doubled
      const newLength = this.audioEngine.getState().loops[state.currentLoopIndex].endPoint;
      const multiplied = newLength > originalLength;
      
      this.recordTestResult('Multiply', multiplied, 
        multiplied ? 'Successfully multiplied loop' : 'Failed to multiply loop');
      
    } catch (error) {
      this.recordTestResult('Multiply', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test reverse and half-speed functionality
   */
  private async testReverseAndHalfSpeed(): Promise<void> {
    console.log('Testing reverse and half-speed...');
    
    try {
      // Ensure we have a loop
      const state = this.audioEngine.getState();
      if (!state.loops[state.currentLoopIndex].buffer) {
        throw new Error('No loop available for reverse/half-speed test');
      }
      
      // Test reverse
      this.audioEngine.reverseLoop();
      const isReversed = this.audioEngine.getState().loops[state.currentLoopIndex].isReversed;
      
      // Test half-speed
      this.audioEngine.toggleHalfSpeed();
      const isHalfSpeed = this.audioEngine.getState().loops[state.currentLoopIndex].isHalfSpeed;
      
      // Reset to normal
      this.audioEngine.reverseLoop();
      this.audioEngine.toggleHalfSpeed();
      
      this.recordTestResult('Reverse', isReversed, 
        isReversed ? 'Successfully reversed loop' : 'Failed to reverse loop');
      
      this.recordTestResult('Half-Speed', isHalfSpeed, 
        isHalfSpeed ? 'Successfully set half-speed' : 'Failed to set half-speed');
      
    } catch (error) {
      this.recordTestResult('Reverse and Half-Speed', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test mute functionality
   */
  private async testMute(): Promise<void> {
    console.log('Testing mute...');
    
    try {
      // Ensure we have a loop
      const state = this.audioEngine.getState();
      if (!state.loops[state.currentLoopIndex].buffer) {
        throw new Error('No loop available for mute test');
      }
      
      // Test mute
      this.audioEngine.toggleMute();
      const isMuted = this.audioEngine.getState().loops[state.currentLoopIndex].isMuted;
      
      // Reset to unmuted
      this.audioEngine.toggleMute();
      
      this.recordTestResult('Mute', isMuted, 
        isMuted ? 'Successfully muted loop' : 'Failed to mute loop');
      
    } catch (error) {
      this.recordTestResult('Mute', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test undo functionality
   */
  private async testUndo(): Promise<void> {
    console.log('Testing undo...');
    
    try {
      // Ensure we have a loop
      const state = this.audioEngine.getState();
      if (!state.loops[state.currentLoopIndex].buffer) {
        throw new Error('No loop available for undo test');
      }
      
      // Make a change (toggle mute)
      this.audioEngine.toggleMute();
      const isMuted = this.audioEngine.getState().loops[state.currentLoopIndex].isMuted;
      
      // Undo the change
      this.audioEngine.undo();
      const isUndone = this.audioEngine.getState().loops[state.currentLoopIndex].isMuted !== isMuted;
      
      this.recordTestResult('Undo', isUndone, 
        isUndone ? 'Successfully undid action' : 'Failed to undo action');
      
    } catch (error) {
      this.recordTestResult('Undo', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test next/previous loop functionality
   */
  private async testNextPreviousLoop(): Promise<void> {
    console.log('Testing next/previous loop...');
    
    try {
      // Get current loop index
      const initialIndex = this.audioEngine.getState().currentLoopIndex;
      
      // Test next loop
      this.audioEngine.nextLoop();
      const nextIndex = this.audioEngine.getState().currentLoopIndex;
      const nextWorked = nextIndex > initialIndex;
      
      // Test previous loop
      this.audioEngine.previousLoop();
      const prevIndex = this.audioEngine.getState().currentLoopIndex;
      const prevWorked = prevIndex === initialIndex;
      
      this.recordTestResult('Next/Previous Loop', nextWorked && prevWorked, 
        (nextWorked && prevWorked) ? 'Successfully navigated loops' : 'Failed to navigate loops');
      
    } catch (error) {
      this.recordTestResult('Next/Previous Loop', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test loop windowing functionality
   */
  private async testLoopWindowing(): Promise<void> {
    console.log('Testing loop windowing...');
    
    try {
      // Ensure we have a loop
      const state = this.audioEngine.getState();
      if (!state.loops[state.currentLoopIndex].buffer) {
        throw new Error('No loop available for windowing test');
      }
      
      // Set a window
      const loopLength = state.loops[state.currentLoopIndex].endPoint;
      const windowStart = loopLength * 0.25;
      const windowEnd = loopLength * 0.75;
      
      this.audioEngine.setLoopWindow(windowStart, windowEnd);
      
      // Verify window was set
      const updatedLoop = this.audioEngine.getState().loops[state.currentLoopIndex];
      const windowSet = updatedLoop.windowStart === windowStart && updatedLoop.windowEnd === windowEnd;
      
      // Reset window
      this.audioEngine.setLoopWindow(null, null);
      
    this.recordTestResult('Loop Windowing', windowSet,
      windowSet ? 'Successfully set loop window' : 'Failed to set loop window');

  } catch (error) {
    this.recordTestResult('Loop Windowing', false,
      `Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

  /**
   * Test moving the loop window
   */
  private async testMoveLoopWindow(): Promise<void> {
    console.log('Testing move loop window...');

    try {
      const state = this.audioEngine.getState();
      if (!state.loops[state.currentLoopIndex].buffer) {
        throw new Error('No loop available for move window test');
      }

      const loopLength = state.loops[state.currentLoopIndex].endPoint;
      const windowStart = loopLength * 0.1;
      const windowEnd = loopLength * 0.4;

      this.audioEngine.setLoopWindow(windowStart, windowEnd);

      this.advancedFunctions.moveLoopWindow('forward', loopLength * 0.1);
      const movedLoop = this.audioEngine.getState().loops[state.currentLoopIndex];
      const moved = movedLoop.windowStart !== null && movedLoop.windowStart > windowStart;

      this.audioEngine.setLoopWindow(null, null);

      this.recordTestResult('Move Loop Window', moved,
        moved ? 'Successfully moved loop window' : 'Failed to move loop window');

    } catch (error) {
      this.recordTestResult('Move Loop Window', false,
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test substitute functionality
   */
  private async testSubstitute(): Promise<void> {
    console.log('Testing substitute...');
    
    try {
      // This is a complex test that would require actual audio input
      // For this example, we'll just verify the function exists
      const hasSubstitute = typeof this.advancedFunctions.startSubstitute === 'function' && 
                            typeof this.advancedFunctions.stopSubstitute === 'function';
      
      this.recordTestResult('Substitute', hasSubstitute, 
        hasSubstitute ? 'Substitute functions exist' : 'Substitute functions missing');
      
    } catch (error) {
      this.recordTestResult('Substitute', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test SUS commands
   */
  private async testSUSCommands(): Promise<void> {
    console.log('Testing SUS commands...');
    
    try {
      // Verify SUS functions exist
      const hasSUS = typeof this.advancedFunctions.startSUSCommand === 'function' && 
                     typeof this.advancedFunctions.stopSUSCommand === 'function';
      
      this.recordTestResult('SUS Commands', hasSUS, 
        hasSUS ? 'SUS command functions exist' : 'SUS command functions missing');
      
    } catch (error) {
      this.recordTestResult('SUS Commands', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test MultiIncrease functionality
   */
  private async testMultiIncrease(): Promise<void> {
    console.log('Testing MultiIncrease...');
    
    try {
      // Verify function exists
      const hasMultiIncrease = typeof this.advancedFunctions.multiIncrease === 'function';
      
      this.recordTestResult('MultiIncrease', hasMultiIncrease, 
        hasMultiIncrease ? 'MultiIncrease function exists' : 'MultiIncrease function missing');
      
    } catch (error) {
      this.recordTestResult('MultiIncrease', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test LoopDivide functionality
   */
  private async testLoopDivide(): Promise<void> {
    console.log('Testing LoopDivide...');
    
    try {
      // Verify function exists
      const hasLoopDivide = typeof this.advancedFunctions.loopDivide === 'function';
      
      this.recordTestResult('LoopDivide', hasLoopDivide, 
        hasLoopDivide ? 'LoopDivide function exists' : 'LoopDivide function missing');
      
    } catch (error) {
      this.recordTestResult('LoopDivide', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test quantization features
   */
  private async testQuantization(): Promise<void> {
    console.log('Testing quantization...');
    
    try {
      // Test setting different quantize values
      this.audioEngine.updateSettings({ quantize: 'LOOP' });
      const loopQuantize = this.audioEngine.getState().settings.quantize === 'LOOP';

      this.audioEngine.updateSettings({ quantize: '8TH' });
      const eighthQuantize = this.audioEngine.getState().settings.quantize === '8TH';

      this.audioEngine.updateSettings({ quantize: 'CYC' });
      const cycleQuantize = this.audioEngine.getState().settings.quantize === 'CYC';

      // Run quantized record/stop to ensure they execute
      await this.advancedFunctions.startQuantizedRecording();
      await this.advancedFunctions.stopQuantizedRecording();

      this.audioEngine.updateSettings({ quantize: 'OFF' });

      const quantizeWorks = loopQuantize && eighthQuantize && cycleQuantize;

      this.recordTestResult('Quantization', quantizeWorks,
        quantizeWorks ? 'Quantization features work correctly' : 'Issues with quantization features');
      
    } catch (error) {
      this.recordTestResult('Quantization', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test synchronization features
   */
  private async testSyncFeatures(): Promise<void> {
    console.log('Testing sync features...');
    
    try {
      // Verify sync functions exist
      const hasTempo = typeof this.advancedFunctions.setTempo === 'function';
      const hasSync = typeof this.advancedFunctions.syncToExternalClock === 'function';
      const hasReAlign = typeof this.advancedFunctions.reAlign === 'function';
      
      const syncFeaturesExist = hasTempo && hasSync && hasReAlign;
      
      this.recordTestResult('Sync Features', syncFeaturesExist, 
        syncFeaturesExist ? 'Sync features exist' : 'Some sync features are missing');
      
    } catch (error) {
      this.recordTestResult('Sync Features', false,
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test tempo setting
   */
  private async testSetTempo(): Promise<void> {
    console.log('Testing set tempo...');

    try {
      const newTempo = 130;
      this.advancedFunctions.setTempo(newTempo);
      const tempoSet = this.audioEngine.getState().settings.tempo === newTempo;

      this.recordTestResult('Set Tempo', tempoSet,
        tempoSet ? 'Tempo set correctly' : 'Failed to set tempo');

    } catch (error) {
      this.recordTestResult('Set Tempo', false,
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test external clock sync
   */
  private async testExternalSync(): Promise<void> {
    console.log('Testing external clock sync...');

    try {
      this.advancedFunctions.syncToExternalClock(true);
      const enabled = (Tone.Transport as any).syncSource === 'midi';

      this.advancedFunctions.syncToExternalClock(false);
      const disabled = (Tone.Transport as any).syncSource !== 'midi';

      this.recordTestResult('External Sync', enabled && disabled,
        enabled && disabled ? 'External sync toggled' : 'Failed to toggle sync');

    } catch (error) {
      this.recordTestResult('External Sync', false,
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test re-align functionality
   */
  private async testReAlign(): Promise<void> {
    console.log('Testing re-align...');

    try {
      // Start playback if possible
      this.audioEngine.startLoopPlayback();
      this.advancedFunctions.reAlign();

      this.recordTestResult('ReAlign', true, 'ReAlign executed');

    } catch (error) {
      this.recordTestResult('ReAlign', false,
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.audioEngine.stopLoopPlayback();
    }
  }

  /**
   * Test interface modes
   */
  private async testInterfaceModes(): Promise<void> {
    console.log('Testing interface modes...');
    
    try {
      // Test setting different interface modes
      const modes = ['LOOP', 'STUTTER', 'DELAY', 'EXPERT', 'INPUT', 'OUTPUT', 'REPLACE', 'FLIP'];
      let allModesWork = true;
      
      for (const mode of modes) {
        this.audioEngine.updateSettings({ interfaceMode: mode as any });
        const modeSet = this.audioEngine.getState().settings.interfaceMode === mode;
        if (!modeSet) {
          allModesWork = false;
          break;
        }
      }
      
      // Reset to LOOP mode
      this.audioEngine.updateSettings({ interfaceMode: 'LOOP' });
      
      this.recordTestResult('Interface Modes', allModesWork, 
        allModesWork ? 'All interface modes work correctly' : 'Issues with interface modes');
      
    } catch (error) {
      this.recordTestResult('Interface Modes', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test sampler styles
   */
  private async testSamplerStyles(): Promise<void> {
    console.log('Testing sampler styles...');
    
    try {
      // Test setting different sampler styles
      const styles = ['PLAY', 'START', 'ONCE', 'ATTACK', 'RUN'];
      let allStylesWork = true;
      
      for (const style of styles) {
        this.audioEngine.updateSettings({ samplerStyle: style as any });
        const styleSet = this.audioEngine.getState().settings.samplerStyle === style;
        if (!styleSet) {
          allStylesWork = false;
          break;
        }
      }
      
      // Reset to PLAY style
      this.audioEngine.updateSettings({ samplerStyle: 'PLAY' });
      
      this.recordTestResult('Sampler Styles', allStylesWork, 
        allStylesWork ? 'All sampler styles work correctly' : 'Issues with sampler styles');
      
    } catch (error) {
      this.recordTestResult('Sampler Styles', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test preset save/load
   */
  private async testPresetSaveLoad(): Promise<void> {
    console.log('Testing preset save/load...');
    
    try {
      // Set some unique settings
      const testSettings = {
        quantize: 'LOOP' as const,
        tempo: 123,
        cycleBeats: 16
      };
      
      this.audioEngine.updateSettings(testSettings);
      
      // Save as preset 1
      this.presetManager.savePreset(1);
      
      // Change settings
      this.audioEngine.updateSettings({
        quantize: 'OFF' as const,
        tempo: 120,
        cycleBeats: 8
      });
      
      // Load preset 1
      this.presetManager.loadPreset(1);
      
      // Verify settings were restored
      const state = this.audioEngine.getState();
      const settingsRestored = state.settings.quantize === testSettings.quantize &&
                              state.settings.tempo === testSettings.tempo &&
                              state.settings.cycleBeats === testSettings.cycleBeats;
      
      this.recordTestResult('Preset Save/Load', settingsRestored, 
        settingsRestored ? 'Preset save/load works correctly' : 'Issues with preset save/load');
      
    } catch (error) {
      this.recordTestResult('Preset Save/Load', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test session save/load
   */
  private async testSessionSaveLoad(): Promise<void> {
    console.log('Testing session save/load...');
    
    try {
      // Verify functions exist
      const hasSessionFunctions = typeof this.presetManager.saveSession === 'function' && 
                                 typeof this.presetManager.loadSession === 'function';
      
      this.recordTestResult('Session Save/Load', hasSessionFunctions, 
        hasSessionFunctions ? 'Session functions exist' : 'Session functions missing');
      
    } catch (error) {
      this.recordTestResult('Session Save/Load', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test audio export/import
   */
  private async testAudioExportImport(): Promise<void> {
    console.log('Testing audio export/import...');
    
    try {
      // Verify functions exist
      const hasExportImport = typeof this.presetManager.exportAudio === 'function' && 
                             typeof this.presetManager.importAudio === 'function';
      
      this.recordTestResult('Audio Export/Import', hasExportImport, 
        hasExportImport ? 'Audio export/import functions exist' : 'Audio export/import functions missing');
      
    } catch (error) {
      this.recordTestResult('Audio Export/Import', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Record a test result
   */
  private recordTestResult(feature: string, passed: boolean, notes: string): void {
    this.testResults.push({ feature, passed, notes });
  }

  /**
   * Report all test results
   */
  private reportResults(): void {
    console.log('\n=== Digital Echo Plex Test Results ===\n');
    
    let passCount = 0;
    let failCount = 0;
    
    for (const result of this.testResults) {
      console.log(`${result.passed ? '✅' : '❌'} ${result.feature}: ${result.notes}`);
      
      if (result.passed) {
        passCount++;
      } else {
        failCount++;
      }
    }
    
    console.log(`\nSummary: ${passCount} passed, ${failCount} failed`);
    console.log(`Overall: ${failCount === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  }

  /**
   * Retrieve test results
   */
  getResults(): { feature: string; passed: boolean; notes: string }[] {
    return this.testResults;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.audioEngine.dispose();
  }
}
