    "LoopCopy": "Off",     # Next loop copy mode: Off, On (whether to copy current loop into new loop)
    "AutoRecord": "Off",   # Auto-Record on loop change: Off or On (start recording automatically on empty loop)
    "LoopTrig": "Off"      # Loop trigger mode: Off or On (e.g., allow triggering loop start via MIDI or threshold)
  }
}
```

**Parameter Access and Update:**

```pseudo
function get(category, name):
    return Parameters[category][name]

function set(category, name, value):
    Parameters[category][name] = value
    # Apply side effects of certain parameter changes immediately:
    if category == "Loop" and name == "MoreLoops":
        Buffer.allocateMemory(value)  # re-divide memory among `value` loops:contentReference[oaicite:7]{index=7}
        Controller.currentLoopIndex = 0
        Controller.totalLoops = value
        # Changing loop count resets all existing loops :contentReference[oaicite:8]{index=8}
        Buffer.clearAllLoops()
        Feedback.refreshLoopCountDisplay(value)
    if category == "Loop" and name == "LoopCopy":
        Controller.loopCopyEnabled = (value == "On")
    if category == "Loop" and name == "AutoRecord":
        Controller.autoRecordEnabled = (value == "On")
    if category == "Switches" and name == "SwitchQuant":
        Controller.switchQuantize = (value != "Off")
    if category == "Switches" and name == "RoundMode":
        Controller.roundMode = (value == "On")
    # ... (apply other immediate effects if needed)
```

**Handling Parameter Adjustment (from user input in Parameter Mode):**

```pseudo
function handleParamButton(activeRow, button):
    # Map the pressed button to a specific parameter in the active row category
    paramName = mapButtonToParam(activeRow, button)
    currentValue = Parameters[activeRow][paramName]
    # Toggle or increment parameter value based on type (boolean, enumerated, numeric)
    newValue = getNextValue(paramName, currentValue)
    set(activeRow, paramName, newValue)
    # Provide immediate feedback to the user
    Feedback.displayParamValue(paramName, newValue)
```

This will be invoked by the System Software when in Parameter Mode. For example, if the **Loops** category is active and the user presses the button that corresponds to *MoreLoops*, the Parameter layer will increment the `MoreLoops` value by one and immediately apply it (allocating memory for an additional loop and updating displays). All parameter changes take effect in real-time and are persisted in memory so they remain across power cycles (unless explicitly reset).

## Preset Layer (Config Snapshots)

Manages saving and recalling sets of parameters (snapshots of the Parameter Layer) as presets. This allows quick reconfiguration of the entire system (for example, switching between different parameter setups for different performance styles).

```pseudo
presets = []  # list of preset objects, each storing a full copy of Parameters
currentPresetIndex = None

function savePreset(index):
    presets[index] = deepCopy(Parameters)
    Feedback.showMessage("Preset " + index + " saved")

function loadPreset(index):
    if index < len(presets) and presets[index] is not None:
        newParams = presets[index]
        # Apply each parameter to the system
        for category, paramMap in newParams:
            for name, value in paramMap:
                ParameterLayer.set(category, name, value)
        currentPresetIndex = index
        Feedback.showMessage("Preset " + index + " loaded")
    else:
        Feedback.showMessage("Preset " + index + " not defined")
```

Loading a preset updates the Parameter Layer (and by extension all dependent layers) to the stored values. For instance, if a preset has a different `MoreLoops` value than the current setting, loading it will reallocate loop memory and reset loops as needed (this happens via the Parameter Layer's `set` logic). The Preset Layer interfaces with System Software or MIDI (e.g., MIDI Program Change messages) to allow the user to recall presets. It ensures that *configurations (but not the audio content of loops)* can be saved and restored conveniently.

*(The number of presets and how they are accessed is design-dependent. Presets might be selected via dedicated buttons, via the Parameter Mode UI, or external MIDI program changes. In all cases, this layer handles the storage and retrieval of parameter sets.)*

## Signal Chain Layer (Mute, Volume, Feedback)

Responsible for the audio signal path processing — applying volume control, muting, and feedback (loop decay) according to current settings. This layer takes input from the instrument and loop playback from the Buffer, and outputs the final audio mix.

```pseudo
state muteActive = False

function processAudioFrame(inputSample):
    # Apply input level and mix settings
    inLevel = inputSample * Knob.InputLevel      # adjust input gain
    loopSample = Buffer.playbackSample()        # get current sample from loop playback
    # Determine wet/dry mix
    wetLevel = Knob.MixLevel   # proportion of loop playback in output
    dryLevel = 1 - wetLevel    # proportion of direct input in output
    output = (dryLevel * inLevel) + (wetLevel * loopSample)
    # Apply feedback: if Overdub is active or in Delay mode, write input to loop with feedback
    if Controller.overdubActive or Parameter.get("Timing","Quantize") == "DelayMode":
        # When overdubbing, integrate new input into loop with feedback decay
        Buffer.currentLoop[Buffer.playPos] = Buffer.currentLoop[Buffer.playPos] * Knob.FeedbackLevel + inLevel
    # Advance loop playback position
    Buffer.playPos = Buffer.getNextPosition()
