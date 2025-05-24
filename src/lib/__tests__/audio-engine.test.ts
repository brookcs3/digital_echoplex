import { EchoplexAudioEngine } from '../audio-engine';
import { jest } from '@jest/globals';
jest.mock("tone");
import 'tone';

describe('EchoplexAudioEngine basic operations', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('construct, updateSettings and dispose without errors', () => {
    const engine = new EchoplexAudioEngine();
    expect(() => engine.updateSettings({ tempo: 100 })).not.toThrow();
    const state = engine.getState();
    expect(state.settings.tempo).toBe(100);
    expect(() => engine.dispose()).not.toThrow();
  });
});
