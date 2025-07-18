            shutdownHardware()
        elif button == PARAM_BUTTON:
            # Toggle or cycle Parameter Mode rows
            if parameterModeActive:
                currentParamRow += 1
                if currentParamRow >= TOTAL_PARAM_ROWS:
                    # Exiting Parameter Mode after last row
                    parameterModeActive = False
                    currentParamRow = NONE
                else:
                    parameterModeActive = True  # remain in Parameter Mode on next row
            else:
                parameterModeActive = True
                currentParamRow = 0  # enter Parameter Mode at first row
            # Update row indicator LEDs to reflect currentParamRow (or off if exited)
            LEDControl.setRowIndicator(currentParamRow, parameterModeActive)
        else:
            # Forward button event to System Software for interpretation
            SystemSoftware.handleButtonEvent(button, parameterModeActive)
```

*When Parameter Mode is off (no Row LED lit), all buttons perform their primary loop functions (Record, Overdub, Multiply, etc.). When a Parameter Mode row is active (a Row Indicator LED is lit), the buttons map to parameter settings in that category (e.g. if the **Loops** row is active, the Record button functions as **MoreLoops** to increase loop count).*

### LEDs

- **Row Indicator LEDs:** Four LEDs indicating the active Parameter row. Controlled whenever Parameter Mode state changes:

```pseudo
if parameterModeActive:
    for each rowIndex in 0..3:
        LEDControl.rowLED[rowIndex] = (rowIndex == currentParamRow) ? ON : OFF
else:
    LEDControl.allRowLEDs(OFF)
```

- **Status Indicator LEDs:** Multi-color LEDs under each button for feedback. In **Play Mode** (Parameter Mode off), their colors reflect each function’s state:
  - **Unlit:** Function unavailable (cannot be used now).
  - **Green:** Function available and ready for normal use.
  - **Orange:** Function available, but will perform an alternate or secondary action (context-specific).
  - **Red:** Function is active (last pressed and awaiting completion or currently in use).

```pseudo
updateStatusLEDs():
    for each functionButton in [Record, Overdub, Multiply, Insert, Mute, Undo, NextLoop]:
        color = determineStatusColor(functionButton)
        LEDControl.setButtonLED(functionButton, color)
```

*(For example, when not recording, the Record LED is green (ready); once Record is pressed and recording begins, Record LED turns red until the loop is closed. If a button’s normal action is temporarily replaced by another (e.g. Record acting as MoreLoops in Parameter Mode), it may show orange to indicate the alternate function.)*

- **Level Indicator LEDs:** Dedicated LEDs (e.g. input level, feedback level) that show analog levels in real-time. These are updated continuously from the signal input/output:

```pseudo
updateLevelIndicators(inputLevel, loopOutputLevel):
    # Input LED: green at normal levels, orange when nearing clip, red if clipping
    LEDControl.inputLED = colorScale(inputLevel)
    # Feedback LED: indicates current loop playback volume or feedback saturation similarly
    LEDControl.feedbackLED = colorScale(loopOutputLevel)
```

### Knobs

Physical rotary controls for audio levels. There are typically four knobs (Input, Output, Mix, Feedback):

```pseudo
onKnobTurn(knob, newValue):
    if systemPower == OFF:
        return  # ignore when off
    # These knobs always control the signal chain directly (level adjustments)
    SignalChain.adjustLevel(knob, newValue)
    Feedback.updateLevelIndicators(...)  # reflect any level changes on meter LEDs
    # Parameter Mode does not repurpose these knobs in this design; they remain active for levels at all times
```

*(The Input, Output, Mix, and Feedback knobs set critical audio levels on the Echoplex. They are not used for parameter adjustment, so even in Parameter Mode they continue to affect live levels.)*

## System Software Layer (Parameter Mode, MIDI Sync, Action Interpretation)

High-level logic that interprets user input events, manages Parameter Mode state transitions, and handles MIDI synchronization. This layer mediates between hardware inputs and the functional layers below.

### Parameter Mode Management

Manages switching in and out of Parameter Editing mode and tracking which parameter category is selected:

```pseudo
state parameterModeActive = False
state currentParamRow = NONE  # e.g., 0=Timing, 1=Switches, 2=MIDI, 3=Loop

function enterParameterMode():
    parameterModeActive = True
    currentParamRow = 0  # start at first parameter category
    Feedback.showParamCategory(currentParamRow)

function exitParameterMode():
    parameterModeActive = False
    currentParamRow = NONE
    Feedback.clearParamDisplay()
```

When active, button presses (except the Parameter button itself) are routed to parameter editing. Each press of the Parameter button advances to the next category or exits after the last, as described above in the hardware layer logic. The UI is updated accordingly (row LEDs, display readout of the category or parameter being edited).
