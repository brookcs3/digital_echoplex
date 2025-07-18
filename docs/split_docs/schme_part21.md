}
```

------

## 3.  Parameter Specification (`PARAM_SPEC`)

The spec tells the reducer **how** to step each parameter:

```pseudo
# Helper structs
enumSpec(vals...) = {type:"enum",  values:vals}
numSpec(min,max,step) = {type:"num", min:min, max:max, step:step}
tapSpec() = {type:"tap"}   # special (Tempo by tapping)

PARAM_SPEC = {
  # --- Timing (P1) ---
  "Loop/Delay"   : enumSpec("LOP","dEL","EXP","Stu","Out","In","rPL","FLI"),
  "Quantize"     : enumSpec("OFF","CYC","8th","LOP"),
  "8ths/Cycle"   : numSpec(1,96,1),
  "Sync"         : enumSpec("IN","OUT","OuS","OFF"),
  "Threshold"    : numSpec(0,127,1),
  "Reverse"      : enumSpec("FWD","rEV"),
  "StartPoint"   : numSpec(0,127,1),

  # --- Switches (P2) ---
  "RecordMode"   : enumSpec("TOG","SUS","SAF"),
  "OverdubMode"  : enumSpec("TOG","SUS","CON"),
  "RoundMode"    : enumSpec("OFF","ON"),
  "InsertMode"   : enumSpec("rPL","SUB","H.SP","rEV","SUS"),
  "MuteMode"     : enumSpec("CON","TOG","SUS"),
  "Overflow"     : enumSpec("PLY","RST"),
  "Presets"      : numSpec(1,16,1),

  # --- MIDI (P3) ---
  "Channel"        : numSpec(1,16,1),
  "ControlSource"  : enumSpec("NOT","CTR","OFF"),
  "Source #"       : numSpec(0,127,1),
  "VolumeCont"     : numSpec(0,127,1),
  "FeedBkCont"     : numSpec(0,127,1),
  "Dump"           : enumSpec("OFF","DMP"),
  "Load"           : enumSpec("OFF","LOD"),

  # --- Loops (P4) ---
  "MoreLoops"    : numSpec(1,16,1),
  "AutoRecord"   : enumSpec("OFF","ON"),
  "LoopCopy"     : enumSpec("OFF","CPY"),
  "SwitchQuant"  : enumSpec("OFF","ON"),
  "LoopTrig"     : enumSpec("OFF","TRG"),
  "Velocity"     : enumSpec("OFF","VEL"),
  "SamplerStyle" : enumSpec("RUN","ONE")
}
```

------

## 4.  Parameter Reducer

```pseudo
function parametersReducer(prev, action):
    state = clone(prev)             # immutable copy

    if action.type == 'PARAM_ADJUST':
        row  = action.rowIdx
        btn  = action.button
        dir  = action.dir      # +1 (increment) or ‑1 (decrement)

        pName = ROW_BUTTON_MATRIX[row][btn]
        if pName == null: return prev   # no mapping

        spec  = PARAM_SPEC[pName]
        cur   = state[pName]            # flat map for simplicity

        # -------- ENUM handling --------
        if spec.type == "enum":
            idx = indexOf(spec.values, cur)
            idx = (idx + dir) mod len(spec.values)
            state[pName] = spec.values[idx]

        # -------- NUM handling ---------
        elif spec.type == "num":
            newVal = clamp(cur + dir*spec.step, spec.min, spec.max)
            state[pName] = newVal

        # -------- TAP TEMPO ------------
        elif spec.type == "tap":
            state["TempoTapTimes"] =       # pseudo tap accumulator
                updateTapBuffer(state["TempoTapTimes"], now())
            bpm = computeBPM(state["TempoTapTimes"])
            if bpm: state["Tempo"] = bpm

    return state
```

*(Storing parameters in one flat dictionary keeps the reducer short; in production group them by category if you prefer.)*

The reducer fires a **secondary action** so other slices see the change:

```pseudo
if cur != state[pName]:
