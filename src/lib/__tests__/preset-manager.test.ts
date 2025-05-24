import { EchoplexAudioEngine } from '../audio-engine';
import { PresetManager } from '../preset-manager';
jest.mock("tone");
import { jest } from '@jest/globals';
import 'tone';

describe('PresetManager basic operations', () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
  });

  test('save and load preset without errors', () => {
    const engine = new EchoplexAudioEngine();
    const manager = new PresetManager(engine);

    expect(() => manager.savePreset(1)).not.toThrow();
    expect(localStorage.getItem('digital-echoplex-preset-1')).not.toBeNull();

    const spy = jest.spyOn(engine, 'updateSettings');
    expect(() => manager.loadPreset(1)).not.toThrow();
    expect(spy).toHaveBeenCalled();

    engine.dispose();
  });
});
