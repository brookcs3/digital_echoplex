        # Also flash small indicators for cycle and sync if applicable
        if Buffer.playPos == 0:
            Display.flashDot()  # flash a dot at loop start (StartPoint):contentReference[oaicite:15]{index=15}
        if SystemSoftware.syncMode == "SyncIn" or SystemSoftware.syncMode == "SyncOut":
            if MIDI.isClockPulse(): Display.flashSyncDot()
```

- In **Parameter Mode**, the display shows the parameter being edited and its current value (this could be a textual name or a code and numeric value). For example, editing MoreLoops might show “Loops: 4”.
- In **Play Mode**, by default the display might show the current loop’s length (in seconds or a time format). If multiple loops are available, it also shows the current loop number. The display updates dynamically:
  - While recording, it could show the recording time increasing.
  - When a loop is closed and playing, it could show the loop length.
  - Indicators (like dots or small LEDs on the display) flash to mark each loop start (for rhythm) and to indicate MIDI sync status (e.g., a MIDI sync indicator flashing on each beat).
- It can also display short status messages (via `showMessage`) for certain actions (e.g., “Loop Copied”, “Undo”, “HalfSpeed On”, etc.), typically for a brief moment before reverting to the default display.

**Real-time Level Meters:** The input and feedback LED indicators (mentioned in the Hardware layer) are updated continuously by sampling the audio levels:

```pseudo
function updateLevelMeters(inputLevelSample, loopOutputSample):
    # This might be called every audio frame or at intervals
    if inputLevelSample >= clipThreshold:
        LEDControl.setLevelLED("Input", RED)
    elif inputLevelSample >= highThreshold:
        LEDControl.setLevelLED("Input", ORANGE)
    elif inputLevelSample > 0:
        LEDControl.setLevelLED("Input", GREEN)
    else:
        LEDControl.setLevelLED("Input", OFF)
    # Similarly for feedback/output level:
    ...
```

This gives the performer immediate visual feedback to help set input gain (avoiding clipping) and monitor loop playback volume.

**Integration:** The Feedback layer receives triggers from other layers whenever state changes:

- The Controller will call functions like `Feedback.updateStatusIndicators()` or more specific ones (e.g., `Feedback.setStatusLED("Record", color)`) when an action starts or stops.
- The Parameter layer will call `Feedback.displayParamValue(...)` when a parameter is changed in edit mode.
- The Buffer layer might call `Feedback.updateDisplay()` when loop length changes (after recording or multiply).
- The System Software might call `Feedback.showMessage()` for system-level events (preset loaded, sync status, etc.).

All physical outputs (LED control, display text) ultimately go through the hardware interface (BLK) – for example, `LEDControl.setButtonLED(func,color)` and `Display.show(text)` would be low-level functions writing to the device’s LEDs and screen. The Feedback layer is the high-level coordinator that knows *what* to display, while the System Hardware layer knows *how* to actually light an LED or draw on the display.

## JSON Schema Representation

```json
{
  "System Hardware Layer": {
    "components": {
      "Power": {
        "role": "Manages device power state (on/off) and initialization/shutdown of system."
      },
      "BLK": {
        "Buttons": {
          "description": "Physical buttons for user input (Parameter, Record, Overdub, Multiply, Insert, Mute, Undo, NextLoop, etc).",
          "handling": "Debounced and converted to events. Ignored if power off. Parameter button toggles Parameter Mode; others send events to System Software."
        },
        "LEDs": {
          "description": "All physical LED indicators (status LEDs under buttons, row indicator LEDs, level meter LEDs).",
          "handling": "Driven by Feedback layer commands. Show power on status, Parameter Mode row, function statuses, input/loop levels."
        },
        "Knobs": {
          "description": "Analog control knobs (Input, Output, Mix, Feedback levels).",
          "handling": "Read continuously. Adjust audio levels in Signal Chain. Not repurposed by Parameter Mode (always active for volume/feedback control)."
        }
      }
    },
    "interfaces": {
      "outputs_events_to": ["System Software Layer (button presses, knob changes)"],
      "receives_commands_from": ["Feedback Layer (to set LED states, update display)"]
    }
  },
  "System Software Layer": {
    "components": {
      "Parameter Mode": {
        "description": "Tracks whether Parameter Edit mode is active and which parameter row is selected.",
        "state": ["parameterModeActive (bool)", "currentParamRow (index or NONE)"]
      },
      "MIDI Sync": {
        "description": "Handles MIDI clock synchronization and timing reference (acts as master or slave).",
        "state": ["syncMode (Off/SyncIn/SyncOut)", "internalTempo (BPM)"],
        "functions": ["onMidiClockTick()", "sendMidiClock()"]
      },
      "Action Interpretation": {
        "description": "Maps raw input events to system actions, depending on mode (parameter edit vs play).",
        "functions": ["handleButtonEvent(button, paramModeActive)", "interpretComboPresses()", "handleLongPress(button)"]
      }
    },
    "interfaces": {
      "receives_from_hardware": ["Button press events, Knob turn events"],
      "controls": [
        "Parameter Layer (invokes parameter adjustments in Parameter Mode)",
        "Controller Layer (invokes loop actions in Play Mode)",
        "Preset Layer (loads/saves presets on command)",
        "Feedback Layer (triggers UI updates like entering/leaving Parameter Mode, messages)"
      ],
      "depends_on": ["Parameter Layer (for current values like sync settings, modes)"]
    }
  },
  "Parameter Layer": {
    "categories": {
