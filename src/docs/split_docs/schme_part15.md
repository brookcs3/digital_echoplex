      "Timing": {
        "parameters": ["Quantize", "Tempo", "CycleBeats"],
        "purpose": "Timing and quantization settings for loop actions and sync."
      },
      "Switches": {
        "parameters": ["RecordMode", "OverdubMode", "InsertMode", "MuteMode", "SwitchQuant", "RoundMode", "Overflow"],
        "purpose": "Behavior of control functions (button modes, switching quantization, etc)."
      },
      "MIDI": {
        "parameters": ["SyncMode", "MIDIchannel", "TrigThreshold", "SamplerStyle", "Velocity"],
        "purpose": "MIDI synchronization and control settings."
      },
      "Loop": {
        "parameters": ["MoreLoops", "LoopCopy", "AutoRecord", "LoopTrig"],
        "purpose": "Loop management settings (number of loops, copy behavior, auto-record)."
      }
    },
    "interfaces": {
      "exposes": ["get(category, name)", "set(category, name, value)", "handleParamButton(row, button)"],
      "notifies": ["Buffer Layer (on MoreLoops change for memory realloc)", "Controller Layer (on mode changes like RecordMode, etc)", "Feedback Layer (to display new values)"]
    }
  },
  "Preset Layer": {
    "description": "Stores and recalls snapshots of all Parameter Layer settings as presets.",
    "state": ["presets[] (list of parameter sets)", "currentPresetIndex"],
    "interfaces": {
      "functions": ["savePreset(index)", "loadPreset(index)"],
      "receives_commands_from": ["System Software (user request to save/load)", "MIDI Program Change (optional)"],
      "affects": ["Parameter Layer (loads values into parameters)", "Buffer Layer (may reset loops if MoreLoops changes)", "Feedback Layer (display preset load/save confirmations)"]
    }
  },
  "Signal Chain Layer": {
    "description": "Processes audio input and loop playback to produce output, applying volume, mix, mute, and feedback controls.",
    "components": {
      "InputGain": "Input level control (pre-loop recording gain).",
      "MixControl": "Mix between live input (dry) and loop playback (wet).",
      "OutputVolume": "Master output level control.",
      "FeedbackControl": "Loop feedback amount control (decay rate of loop sound).",
      "MuteControl": "Mute toggle for output (with mode for continuous or restart)."
    },
    "interfaces": {
      "receives_from": ["Knobs (level adjustments)", "Controller (mute toggles, overdub state)"],
      "sends_to": ["Buffer Layer (writes input to buffer when recording/overdubbing)", "Output (audio signal to hardware output)"],
      "depends_on": ["Parameter Layer (for modes like LoopMode/DelayMode, MuteMode)"]
    }
  },
  "Controller Layer": {
    "description": "Implements loop control commands and state machines for recording and manipulating loops.",
    "commands": {
      "Record": {
        "function": "Start/stop recording a loop. Defines new loop length when stopped. Respects RecordMode (toggle/sustain) and TrigThreshold.",
        "uses": ["Buffer (to record audio)", "Feedback (to update Record LED, display)"]
      },
      "Overdub": {
        "function": "Toggle overdub on/off to layer sound onto the loop. Respects OverdubMode (toggle/sustain).",
        "uses": ["Buffer (to mix new audio with existing loop via feedback)", "Feedback (LED status)"]
      },
      "Insert": {
        "function": "Perform Insert function as configured (extend loop length, replace audio, reverse, half-speed, etc).",
        "uses": ["Buffer (to modify loop content or playback rate)", "Feedback (LED and messages for mode)"]
      },
      "Multiply": {
        "function": "Extend loop length by an integer multiple of its base length. Can be quantized; respects RoundMode for ending timing.",
        "uses": ["Buffer (to set new loop length, duplicate content)", "Feedback (LED, possibly timing indication)"]
      },
      "Undo": {
        "function": "Undo the last overdub/insert action (and possibly redo it if pressed again). One level of history.",
        "uses": ["Buffer (to restore saved loop state)", "Feedback (LED and display to show undo status)"]
      },
      "NextLoop": {
        "function": "Switch to the next loop. May be immediate or quantized (SwitchQuant). Optionally copy loop or auto-record on switch as per settings.",
        "uses": ["Buffer (to stop current and start next loop playback)", "Feedback (update loop number display, LED)"]
      }
    },
    "state": {
      "currentLoopIndex": "Index of the active loop (0-based).",
      "recording": "Whether a loop recording is in progress.",
      "overdubActive": "Whether overdub mode is currently on.",
      "multiplyMode": "Whether a Multiply is in progress (extending loop).",
      "insertActive": "Whether an Insert (Insert/Replace/Substitute) is in progress."
    },
    "interfaces": {
      "receives_from": ["System Software (interpreted button commands)"],
      "controls": ["Buffer Layer (start/stop recording, modify loop data, save/restore states)", "Signal Chain (toggles overdub which influences writing, mutes output)", "Feedback Layer (triggers status updates for LEDs/displays)"],
      "depends_on": ["Parameter Layer (to check modes like RecordMode, quantization settings, etc)"]
    }
  },
  "Buffer Layer": {
    "description": "Manages storage and manipulation of audio loop data for one or more loops.",
    "components": {
      "LoopBuffers": "Audio data buffers for each loop (circular).",
      "MemoryManager": "Allocation of total memory across loops. Handles memory per loop and overflow behavior.",
      "TimingTracker": "Tracks loop lengths, cycle counts, and playback position (for sync and quantization).",
      "UndoHistory": "Stores backup of loop audio for undo operations."
    },
    "interfaces": {
      "functions": [
        "startRecording(loop)", "stopRecording(loop)", "startPlayback(loop)", "stopPlayback(loop)",
        "saveLoopState(loop)", "restoreLoopState(loop)", "copyLoop(src,dest)",
        "toggleReverse(loop)", "toggleHalfSpeed(loop)", 
