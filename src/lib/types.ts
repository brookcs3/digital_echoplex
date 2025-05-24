// Core types for the Digital Echo Plex
export interface LoopSettings {
  quantize: 'OFF' | 'LOOP' | '8TH' | 'CYC';
  switchQuant: 'OFF' | 'CYCLE' | 'LOOP' | 'CCY' | 'CLP';
  insertMode: 'INS' | 'SUB' | 'SUS';
  overdubMode: 'OVR' | 'REP';
  interfaceMode: 'LOOP' | 'STUTTER' | 'DELAY' | 'EXPERT' | 'INPUT' | 'OUTPUT' | 'REPLACE' | 'FLIP';
  samplerStyle: 'PLAY' | 'START' | 'ONCE' | 'ATTACK' | 'RUN';
  cycleBeats: number;
  tempo: number;
  /**
   * Microphone monitoring mode. "RECORDING_ONLY" mirrors the classic hardware
   * behaviour where monitoring is only active while recording or overdubbing.
   * "ALWAYS_ON" keeps the microphone routed to the output at all times.
   */
  micMonitor: 'RECORDING_ONLY' | 'ALWAYS_ON';
  feedback: number;
  inputGain: number;
  outputGain: number;
  mix: number;
}

export interface Loop {
  id: number;
  buffer: AudioBuffer | null;
  startPoint: number;
  endPoint: number;
  windowStart: number | null;
  windowEnd: number | null;
  isReversed: boolean;
  isHalfSpeed: boolean;
  isMuted: boolean;
}

export interface EchoplexState {
  isRecording: boolean;
  isPlaying: boolean;
  isOverdubbing: boolean;
  isMultiplying: boolean;
  isInserting: boolean;
  isReplacing: boolean;
  isSUSActive: boolean;
  currentLoopIndex: number;
  loops: Loop[];
  settings: LoopSettings;
  undoHistory: UndoAction[];
}

export interface UndoAction {
  type: string;
  loopId: number;
  previousState: Partial<Loop>;
}

export enum LoopFunction {
  RECORD,
  OVERDUB,
  MULTIPLY,
  INSERT,
  REPLACE,
  UNDO,
  MUTE,
  REVERSE,
  HALF_SPEED,
  NEXT_LOOP,
  PREVIOUS_LOOP,
  RESET,
  RETRIGGER,
  START_POINT,
  LOOP_WINDOW,
  SUBSTITUTE,
  SUS_COMMAND,
  MULTI_INCREASE,
  LOOP_DIVIDE
}
