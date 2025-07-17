This duplicates the audio and timing info from one loop to another. It is used when switching loops if the LoopCopy parameter is enabled.

**Overflow Handling:** If recording exceeds the allocated memory for a loop:

```pseudo
onRecordOverflow(loopIndex):
    if Parameter.get("Switches","Overflow") == "Play":
        # Stop recording and leave the loop as is (ignore extra input)
        stopRecording(loopIndex)
        Feedback.showMessage("Memory Full - Loop Length Maxed")
    elif Parameter.get("Switches","Overflow") == "Stop":
        # Stop recording and stop playback to signal the end (loop might be incomplete)
        stopRecording(loopIndex)
        stopPlayback(loopIndex)
        Feedback.showMessage("Memory Full - Loop Stopped")
```

This ensures the system handles running out of memory gracefully according to user preference (either keep playing the recorded portion or halt).

The Buffer Layer exposes interfaces to the other layers:

- To the Controller: functions like `startRecording`, `stopRecording`, `startPlayback`, `stopPlayback`, `copyLoop`, `saveLoopState`, `restoreLoopState`, etc.
- To the Signal Chain: functions to get the current playback sample (`playbackSample()` which reads from `loopBuffers[currentLoop][playPos]` taking into account reverse or half-speed flags) and to write a sample when recording/overdubbing.
- To the Feedback: information like current loop time (which can be `loopLengths[currentLoop] / sampleRate` for display), current position or cycle for progress indicators, etc.

## Feedback Layer (Visual Feedback, LEDs, Displays)

Coordinates all user feedback: updating LED indicators, numeric or text displays, and any other visual output in real-time based on the system state. This layer listens for state changes from all other layers and ensures the hardware LEDs and display show the correct status.

**Status LEDs Management:**

```pseudo
function updateStatusIndicators():
    # Called whenever a major state change occurs (record start/stop, mode change, etc.)
    for func in ["Record","Overdub","Multiply","Insert","Mute","Undo","NextLoop"]:
        color = "Off"
        if func == "Record":
            if Controller.recording: color = "Red"
            else if Controller.recording == False and (Controller.loopEmpty(currentLoop) || !Controller.overdubActive): color = "Green"
        if func == "Overdub":
            if Controller.overdubActive: color = "Red"
            else: color = "Green"
        if func == "Multiply":
            if Controller.multiplyMode: color = "Red"
            else if Controller.recording or Controller.overdubActive: color = "Off"  # e.g., can't multiply during record
            else: color = "Green"
        if func == "Insert":
            if Controller.insertActive: color = "Red"
            else: color = "Green"
        if func == "Mute":
            if SignalChain.muteActive: color = "Red"
            else: color = "Green"
        if func == "Undo":
            if Buffer.hasUndoState(currentLoop): color = "Green"  # can undo
            if Controller.undoToggled: color = "Orange"  # currently in undone state (ready to redo)
        if func == "NextLoop":
            if Controller.totalLoops > 1: color = "Green" 
            else: color = "Off"  # no next loop if only one loop
            if Controller.pendingLoopSwitch: color = "Orange"  # quantized switch scheduled
        LEDControl.setButtonLED(func, color)
```

*(The above logic is illustrative. It sets each function’s LED color based on availability and active status, following the scheme: Off = unavailable, Green = available, Orange = alternate or pending, Red = active. For example, if a loop is currently playing and not being multiplied, Multiply is Green (it’s ready and available). If a multiply is in progress, Multiply LED is Red. If a loop switch has been queued (SwitchQuant on), the NextLoop LED might be Orange until the switch occurs.)*

**Row Indicator LEDs:**

```pseudo
function updateRowIndicator():
    if SystemSoftware.parameterModeActive:
        LEDControl.setRowLED(currentParamRow, ON)
        for otherRow != currentParamRow: LEDControl.setRowLED(otherRow, OFF)
    else:
        LEDControl.allRowLEDs(OFF)
```

This ensures that when Parameter Mode is engaged, the active parameter row’s LED is lit. If Parameter Mode is off, none of the row LEDs are lit (indicating Play Mode).

**Display Updates:**
 The Echoplex has a numeric/time display and possibly text indicators. The Feedback layer updates it in different contexts:

```pseudo
function updateDisplay():
    if SystemSoftware.parameterModeActive:
        # Show parameter name/code and value
        let param = ParameterLayer.getParamName(currentParamRow, currentParamIndex)
        let val = ParameterLayer.get(currentParamRow, param)
        Display.show(param + ":" + formatValue(val))
    else:
        # In Play Mode, show loop timing and status
        if Controller.recording:
            Display.show(formatTime(Buffer.recordedTime(currentLoop)) + " REC")  # show recording time growing
        else if Controller.overdubActive:
            Display.show(formatTime(Buffer.loopLengths[currentLoop]) + " OD")   # loop length with overdub indicator
        else:
            # Show current loop number and length
            if Parameter.get("Loop","MoreLoops") > 1:
                Display.show("Loop " + (Controller.currentLoopIndex+1) + "/" + Controller.totalLoops 
                              + " " + formatTime(Buffer.loopLengths[currentLoop]))
            else:
                Display.show(formatTime(Buffer.loopLengths[currentLoop]) )  # just time
