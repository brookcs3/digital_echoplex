        "beginInsert(loop)", "endInsert(loop)"
      ],
      "called_by": ["Controller Layer (loop operations)", "Signal Chain (during audio processing for reading/writing samples)"],
      "notifies": ["Feedback Layer (e.g., when loop length changes or memory full)"],
      "depends_on": ["Parameter Layer (MoreLoops for allocation, sync settings for cycle calculations)"]
    }
  },
  "Feedback Layer": {
    "description": "Provides real-time visual feedback to the user via LEDs and display based on system state.",
    "components": {
      "StatusLEDs": "Multi-color LEDs under each function button indicating status (Off/Green/Orange/Red).",
      "RowIndicatorLEDs": "LEDs indicating which Parameter row is active (or none if in Play Mode).",
      "LevelMeters": "LED indicators for input and loop output levels (to aid gain adjustment).",
      "Display": "Text/numeric display for loop time, parameter values, messages, loop number, etc."
    },
    "interfaces": {
      "receives_state_from": [
        "Controller (record/overdub/mute/etc status changes)",
        "Parameter Layer (current parameter values and names for display in edit mode)",
        "Buffer Layer (loop length, position, memory status for time display and indicators)",
        "Preset/Software (messages like preset loaded, errors)"
      ],
      "controls_hardware": ["LEDs (on System Hardware via BLK)", "Display output"],
      "functions": [
        "updateStatusIndicators()", "updateRowIndicator()", "updateDisplay()", "updateLevelMeters()", 
        "showMessage(text)", "displayParamValue(param, value)"
      ]
    }
  }
}
```



Below is a **single, self‑contained JavaScript file** (`echoplex.js`) that models an **event‑driven, layer‑aware state‑management system** for the entire Echoplex unit. It integrates:

- All eight layers (System HW, System SW, Parameter, Preset, Signal Chain, Controller, Buffer, Feedback).
- The full **7 × 4 parameter matrix** (Record … NextLoop × Timing…Loops).
- A Redux‑style core (`dispatch()`, `reduce()`) so every layer can react to the same action stream.
- A minimal **hardware event loop** that reads buttons/knobs, dispatches actions, and renders LEDs/display.

> **Note** This is *illustrative pseudocode*:
>
> - no audio I/O API calls are wired (replace with real Web Audio / DSP code),
> - timing / clocking is skeleton code,
> - persistence (Flash / EEPROM) is mocked.

------

```js
/*───────────────────────────────────────────────────────────────────────────╮
│  echoplex.js – monolithic state‑management prototype for Echoplex Digital │
│  Pro Plus.  Layers:                                                       │
│    1. System HW  (power + BLK)                                            │
│    2. System SW  (mode flags, MIDI sync)                                  │
│    3. Parameter  (7×4 matrix)                                             │
│    4. Preset     (snapshot store)                                         │
│    5. SignalChain(out gain / mix / mute / feedback)                       │
│    6. Controller (record / overdub / multiply / …)                        │
│    7. Buffer     (loop audio + timing)                                    │
│    8. Feedback   (LED / display renderer)                                 │
╰───────────────────────────────────────────────────────────────────────────*/

// ───────────────────────────────────────────────────────────────────────────
//  GLOBAL STATE OBJECT  (flat but namespaced per layer)
// ───────────────────────────────────────────────────────────────────────────
const state = {
  /* 1. System HW */
  sysHW: {
    power: false,
    buttons: { Record:0, Overdub:0, Multiply:0, Insert:0, Mute:0, Undo:0, NextLoop:0, Param:0, Power:0 },
    knobs:   { Input:0.8, Output:0.8, Mix:0.5, Feedback:0.7 },
    leds:    {},          // filled by Feedback.render()
    rowLEDs: [false,false,false,false]
  },

  /* 2. System SW  */
  sysSW: {
    parameterMode: false,   // are we editing params?
    currentRow:    null,    // 0‑3 … active Parameter row
    midiSync:      { mode:'Off', bpm:120, extClock:false },
    lastActionTS:  0        // for debouncing / long‑press detection
  },

  /* 3. Parameter LAYER  —the 7×4 matrix */
  params: {
    Timing:   { LoopDelay:'LOP', Quantize:'OFF', Eighths:8,  Sync:'OFF', Threshold:0, Reverse:'FWD', StartPoint:0 },
    Switches: { RecordMode:'TOG', OverdubMode:'TOG', RoundMode:'OFF', InsertMode:'rPL',
                MuteMode:'CON',  Overflow:'PLY',   Presets:'',          _row:'Switches'},
    MIDI:     { Channel:1, ControlSource:'NOT', SourceNum:64, VolumeCont:7, FeedBkCont:11,
                Dump:'OFF', Load:'OFF' },
    Loops:    { MoreLoops:1, AutoRecord:'OFF', LoopCopy:'OFF', SwitchQuant:'OFF',
                LoopTrig:'OFF', Velocity:'OFF', SamplerStyle:'RUN' }
  },

  /* 4. Preset layer  – 16 snapshot slots (null = empty) */
  presets: Array(16).fill(null),
  currentPreset: null,

  /* 5. SignalChain */
