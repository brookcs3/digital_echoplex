
### MIDI Sync

Handles synchronization with external MIDI clock or acts as master clock, according to sync settings:

```pseudo
# Sync settings from Parameter Layer
syncMode = Parameter.get("MIDI", "SyncMode")  # e.g., Off, SyncIn, SyncOut
midiTempo = Parameter.get("Timing", "Tempo")  # BPM if acting as master
clockTicksPerBeat = 24  # MIDI standard

function onMidiClockTick():
    if syncMode == "SyncIn":
        Timing.incrementExternalTicks()
        # If quantizing operations, check if a cycle or beat boundary is reached to trigger queued actions
        if Timing.ticksSinceLastBeat % (clockTicksPerBeat * Parameter.get("Timing","CycleBeats")) == 0:
            Timing.markCycleBoundary()

function sendMidiClock():
    # Called periodically if SyncOut mode is enabled
    if syncMode == "SyncOut":
        outputMidiClockTick()
        # maintain internal tempo based on midiTempo parameter
```

- If `SyncMode` is **SyncIn** (slave), the system listens for incoming MIDI Start/Stop and clock ticks. Loop timing aligns to the external tempo; any quantized actions (like starting/stopping loops) are scheduled on the beat or cycle boundaries of the incoming clock.
- If `SyncMode` is **SyncOut** (master), the system sends MIDI clock ticks at the current internal tempo and can send Start/Stop messages when loops begin or end. Tempo can be set via a Tempo parameter or derived from the first recorded loop length.
- If sync is **Off**, loops run on the internal clock only (free timing).

### Action Interpretation

Interprets button events (from hardware) according to the current mode and state, dispatching them to either parameter adjustment or loop control actions:

```pseudo
function handleButtonEvent(button, paramModeActive):
    if paramModeActive:
        # In Parameter Mode, non-Parameter buttons adjust parameter values
        ParameterLayer.handleParamButton(currentParamRow, button)
        Feedback.displayParamChange(currentParamRow, button)
    else:
        # In Play Mode, map button to loop controller or other actions
        switch button:
            case RECORD_BUTTON:   Controller.handleRecord()
            case OVERDUB_BUTTON:  Controller.handleOverdub()
            case MULTIPLY_BUTTON: Controller.handleMultiply()
            case INSERT_BUTTON:   Controller.handleInsert()
            case MUTE_BUTTON:     Controller.handleMute()
            case UNDO_BUTTON:     Controller.handleUndo()
            case NEXTLOOP_BUTTON: Controller.handleNextLoop()
            default: ignore  # unknown button
```

This module essentially routes user input to the correct subsystem:

- If Parameter Mode is **active**, the input is interpreted as a parameter increment/decrement or toggle (depending on the parameter type). For example, pressing the button corresponding to *MoreLoops* will increase the loop count parameter by one. The Parameter Layer is invoked to update the value, and the Feedback layer is signaled to show the new value.
- If Parameter Mode is **off** (normal **Play Mode**), each button triggers its primary control action in the Controller layer (record, overdub, etc., detailed below).

This layer also handles any special combinations or long-press interpretations:

```pseudo
# Examples of extended interpretations
if button == RECORD_BUTTON and longPress and not Controller.isRecording():
    Controller.resetCurrentLoop()  # long press Record resets (clears) current loop
if button == MULTIPLY_BUTTON and longPress and Controller.lastActionWasLoopReset:
    Controller.resetAllLoops()  # long press Multiply after a reset clears all loops
```

*(The above example shows how a long press or sequential command could be interpreted for special functions like clearing loops.)*

## Parameter Layer (Timing, Switches, MIDI, Loop)

Maintains configuration parameters that define system behavior. Parameters are grouped into four categories (rows) – **Timing**, **Switches**, **MIDI**, and **Loop** – each corresponding to a Parameter Mode row. This layer provides interfaces to read/update parameters and applies any immediate effects of parameter changes (e.g., reallocate memory when loop count changes).

**Parameter Storage and Defaults:**

```pseudo
# Parameter categories and their parameters with default values
Parameters = {
  "Timing": {
    "Quantize": "Off",      # Quantization of actions: Off, Cycle, Loop (timing alignment)
    "Tempo": 120,           # BPM for internal clock (if used in SyncOut)
    "CycleBeats": 8         # Number of MIDI 1/8 notes per cycle (for sync, e.g., 8 = 1 bar)
  },
  "Switches": {
    "RecordMode": "Toggle",   # Record button behavior: Toggle or Sustain
    "OverdubMode": "Toggle",  # Overdub button: Toggle or Sustain
    "InsertMode": "Insert",   # Insert function mode: Insert, Replace, Substitute, Reverse, HalfSpeed, etc.
    "MuteMode": "Continuous", # Mute behavior: Continuous or Start (retrigger at unmute)
    "SwitchQuant": "Off",     # Quantize loop switching: Off or On (align NextLoop/Mute to loop end)
    "RoundMode": "Off"        # Round timing for Multiply end: Off or On (complete cycle on exit)
  },
  "MIDI": {
    "SyncMode": "Off",       # MIDI Sync: Off, SyncIn (slave), SyncOut (master)
    "MIDIchannel": 1,        # MIDI channel for control messages
    "TrigThreshold": 0,      # Input audio threshold for auto-start recording (0 = off)
    "SamplerStyle": "Off",   # Sampler-style trigger mode: Off, NoteGate, OneShot (for MIDI control of loops)
    "Velocity": "Off"        # Whether MIDI velocity (or input level) affects loop volume on trigger
  },
  "Loop": {
    "MoreLoops": 1,        # Number of loops (memory is divided evenly among loops):contentReference[oaicite:6]{index=6}
