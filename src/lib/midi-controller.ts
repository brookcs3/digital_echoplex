import { EchoplexAudioEngine } from './audio-engine';
import { AdvancedLooperFunctions } from './advanced-functions';
import { LoopFunction } from './types';

interface NoteMapping {
  [note: number]: LoopFunction;
}

interface CCMapping {
  [cc: number]: keyof Pick<ReturnType<EchoplexAudioEngine['getState']>['settings'],
    'feedback' | 'inputGain' | 'outputGain' | 'mix'>;
}

export class MidiController {
  private midi: MIDIAccess | null = null;
  private input: MIDIInput | null = null;
  private clockCount = 0;
  private lastClock = 0;

  public onTempo?: (bpm: number) => void;
  public onStart?: () => void;
  public onStop?: () => void;

  constructor(
    private engine: EchoplexAudioEngine,
    private advanced: AdvancedLooperFunctions,
    private noteMap: NoteMapping = {},
    private ccMap: CCMapping = {}
  ) {}

  async init(): Promise<void> {
    this.midi = await navigator.requestMIDIAccess();
  }

  getInputs(): MIDIInput[] {
    return this.midi ? Array.from(this.midi.inputs.values()) : [];
  }

  setInput(id: string): void {
    if (!this.midi) return;
    if (this.input) {
      this.input.removeEventListener('midimessage', this.handleMessage);
    }
    this.input = this.midi.inputs.get(id) || null;
    if (this.input) {
      this.input.addEventListener('midimessage', this.handleMessage);
    }
  }

  private handleMessage = (e: WebMidi.MIDIMessageEvent) => {
    const [status, d1, d2] = e.data;

    if (status === 0xfa) {
      this.onStart?.();
      return;
    }
    if (status === 0xfc) {
      this.onStop?.();
      return;
    }
    if (status === 0xf8) {
      this.handleClock();
      return;
    }

    const cmd = status & 0xf0;
    if (cmd === 0xb0) {
      this.handleCC(d1, d2);
    } else if (cmd === 0x90 && d2 > 0) {
      this.handleNote(d1);
    }
  };

  private handleClock(): void {
    const now = performance.now();
    if (this.clockCount === 0) {
      this.lastClock = now;
    }
    this.clockCount++;
    if (this.clockCount >= 24) {
      const diff = now - this.lastClock;
      const bpm = 60000 / diff;
      this.onTempo?.(bpm);
      this.clockCount = 0;
      this.lastClock = now;
    }
  }

  private handleCC(cc: number, value: number): void {
    const param = this.ccMap[cc];
    if (!param) return;
    const scaled = value / 127;
    const update: any = {};
    update[param] = scaled;
    this.engine.updateSettings(update);
  }

  private handleNote(note: number): void {
    const func = this.noteMap[note];
    if (func === undefined) return;
    this.executeFunction(func);
  }

  private executeFunction(func: LoopFunction): void {
    const state = this.engine.getState();
    switch (func) {
      case LoopFunction.RECORD:
        if (state.isRecording) {
          this.engine.stopRecording();
        } else {
          this.engine.startRecording();
        }
        break;
      case LoopFunction.OVERDUB:
        if (state.isOverdubbing) {
          this.engine.stopOverdub();
        } else {
          this.engine.startOverdub();
        }
        break;
      case LoopFunction.MUTE:
        this.engine.toggleMute();
        break;
      case LoopFunction.REVERSE:
        this.engine.reverseLoop();
        break;
      case LoopFunction.HALF_SPEED:
        this.engine.toggleHalfSpeed();
        break;
      case LoopFunction.UNDO:
        this.engine.undo();
        break;
      case LoopFunction.NEXT_LOOP:
        this.engine.nextLoop();
        break;
      case LoopFunction.PREVIOUS_LOOP:
        this.engine.previousLoop();
        break;
      case LoopFunction.RESET:
        this.engine.resetLoop();
        break;
      default:
        break;
    }
  }
}

