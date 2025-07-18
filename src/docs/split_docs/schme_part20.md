    Substitute with an AudioWorklet or native DSP.
6. **Feedback**
    `Feedback_render()` computes LED colors & display strings from current state and writes into `state.sysHW.leds` / `display`. Replace with real GPIO/OLED drivers.

------

This single‑file prototype is **layer‑aware**, **event‑driven**, and contains the entire state‑management pipeline needed to coordinate **BLK**, **Parameter Mode**, the **7 × 4 matrix**, loop processing, and live feedback. Use it as a foundation; flesh out DSP and hardware I/O specifics as you port to firmware or a WebAudio simulation.

Below is a **complete, drop‑in pseudocode module** that unifies

1. **State‑store plumbing** (single `AppState`, reducers, dispatch loop)
2. **The full 7 × 4 Parameter Matrix** exactly as you listed
3. A **parameter‑spec catalogue** (value ranges / enumerations / special handlers)
4. **Low‑‑to‑mid‑level logic** for:
   - Row cycling (`P1…P4`)
   - Mapping a pressed button → parameter name
   - Increment / toggle / tap‑tempo behaviours
   - Emitting `PARAM_CHANGE` actions that every layer can observe

------

## 0.  File Layout

```
├─ store.js            # core Store / dispatch loop
├─ actions.js          # typed action creators
├─ reducers/
│   ├─ sysHW.js
│   ├─ sysSW.js
│   ├─ parameters.js   #  <— THE BIG ONE (matrix + stepping)
│   ├─ controller.js
│   ├─ buffer.js
│   └─ feedback.js
└─ middlewares/
    ├─ audioIO.js
    ├─ midiSync.js
    └─ ledDriver.js
```

Everything that follows fits into **`reducers/parameters.js`** and updates to `sysSW` where needed.
 (Translate to C++ / Rust etc. as desired; logic stays identical.)

------

## 1.  Constants

```pseudo
# Button IDs
BTN = ["Record","Overdub","Multiply","Insert","Mute","Undo","NextLoop"]

# Row indices
P1_TIMING   = 0
P2_SWITCHES = 1
P3_MIDI     = 2
P4_LOOPS    = 3
TOTAL_ROWS  = 4
```

------

## 2.  Parameter Matrix (`ROW_BUTTON_MATRIX`)

```pseudo
ROW_BUTTON_MATRIX = {
  P1_TIMING : {              # ----- TIMING ROW -----
    Record   : "Loop/Delay",
    Overdub  : "Quantize",
    Multiply : "8ths/Cycle",
    Insert   : "Sync",
    Mute     : "Threshold",
    Undo     : "Reverse",
    NextLoop : "StartPoint"
  },
  P2_SWITCHES : {            # ----- SWITCHES ROW -----
    Record   : "RecordMode",
    Overdub  : "OverdubMode",
    Multiply : "RoundMode",
    Insert   : "InsertMode",
    Mute     : "MuteMode",
    Undo     : "Overflow",
    NextLoop : "Presets"
  },
  P3_MIDI : {                # ----- MIDI ROW -----
    Record   : "Channel",
    Overdub  : "ControlSource",
    Multiply : "Source #",
    Insert   : "VolumeCont",
    Mute     : "FeedBkCont",
    Undo     : "Dump",
    NextLoop : "Load"
  },
  P4_LOOPS : {               # ----- LOOPS ROW -----
    Record   : "MoreLoops",
    Overdub  : "AutoRecord",
    Multiply : "LoopCopy",
    Insert   : "SwitchQuant",
    Mute     : "LoopTrig",
    Undo     : "Velocity",
    NextLoop : "SamplerStyle"
  }
