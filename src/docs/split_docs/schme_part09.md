    # Mute control
    if muteActive:
        if Parameter.get("Switches","MuteMode") == "Continuous":
            output = 0  # silence output, loop continues running
        else if Parameter.get("Switches","MuteMode") == "Start":
            output = 0  # silence output
            if Controller.unmuting: 
                Buffer.playPos = 0  # reset loop to start on unmute
                Controller.unmuting = False
    # Apply master output level
    output *= Knob.OutputLevel
    return output
```

Key behaviors:

- **Volume Control:** The `InputLevel` knob scales the incoming signal; `OutputLevel` knob scales the final output. The `Mix` knob sets the ratio of direct input vs. loop playback (dry/wet mix).
- **Mute:** Toggled by the user via the Mute command. If `MuteMode` is *Continuous*, engaging mute simply silences the output but the loop playback position continues uninterrupted (so unmuting picks up wherever the loop would be). If `MuteMode` is *Start*, then unmuting the loop will restart playback from the loop’s beginning (the loop’s position resets when unmuted). Internally, if Start mode is selected, the system flags that the next unmute should reset the loop position to 0.
- **Feedback:** Controls loop audio persistence. The `FeedbackLevel` knob (0-100%) determines how much of the existing loop is retained when overdubbing new material. At 100%, the loop never decays (sound on sound looping); at lower values, each pass the older audio is quietly diminished. In *Loop Mode* (normal operation), feedback only applies when overdubbing (old audio is replaced by new audio times feedback factor). In *Delay Mode* (if such mode is enabled via a parameter), the loop continuously applies feedback every cycle even without explicit overdubbing, effectively behaving like a delay line where audio repeats fade out over time.
- **Signal Routing:** The dry input can be passed through to output (if mix < 100%) to allow live playing over the loop. The wet (loop) signal is taken from the Buffer’s current loop playback. The combination is then scaled by OutputLevel for final output. Mute, when active, overrides and silences the output entirely (while still possibly updating loop data in the background).

*(The Signal Chain Layer ensures that changes in knob positions or mute status immediately affect the audio output. It works closely with the Buffer Layer (for reading/writing loop samples) and the Controller (for overdub state).)*

## Controller Layer (Record, Overdub, Insert, Multiply, Undo, NextLoop)

Implements the core loop control commands. Each command manages state transitions and coordinates with the Buffer Layer and Signal Chain to carry out the looping functions. The Controller maintains the current loop number and states like whether recording or overdubbing is in progress.

**Shared Controller State:**

```pseudo
currentLoopIndex = 0
totalLoops = Parameter.get("Loop","MoreLoops")  # initial total loops
recording = False
overdubActive = False
multiplyMode = False
multiplyStartCycle = 0
pendingMultiplyCycles = 0
```

**Record:**

```pseudo
function handleRecord():
    if recording == False:
        # Start a new recording or overdub depending on loop state
        if Buffer.isLoopEmpty(currentLoopIndex):
            # Begin recording a new loop from silence
            recording = True
            Buffer.startRecording(currentLoopIndex)
            Feedback.setStatusLED("Record", RED)
            # If a trigger threshold is set, wait for input signal to exceed it
            if Parameter.get("MIDI","TrigThreshold") > 0:
                Buffer.recordPaused = True
                Feedback.flashDisplay("Waiting for sound...")
        else:
            # If loop already has content, Record might either do nothing or act as an alternate function
            # (By default, Record only starts a new loop when current loop is empty. Subsequent presses might be ignored or handled by Overdub.)
            return 
    else:
        # Stop recording and close the loop
        recording = False
        Buffer.stopRecording(currentLoopIndex)
        Feedback.setStatusLED("Record", GREEN)
        # If this was the first recording for the loop, set base cycle length
        Buffer.setCycleLength(currentLoopIndex, Buffer.loopLength(currentLoopIndex))
        # Auto-start overdub if AutoRecord is enabled (immediately go into overdub on new loop)
        if Parameter.get("Loop","AutoRecord") == "On":
            handleOverdub(start=True)
```

- A new recording is initiated if the current loop is empty. If the **RecordMode** parameter is “Sustain”, the system would start recording on button press and stop when the button is released (this pseudocode assumes a Toggle mode for simplicity – modify if sustain: start on press, stop on release).
- If a **TrigThreshold** is set, the loop will enter a waiting state when record is pressed: it won’t actually begin writing to the buffer until the input audio level exceeds the threshold. This allows for automatically trimming silence at the loop start.
- Stopping recording finalizes the loop: the length of the recorded material defines the loop length (and base cycle length). The system exits record mode and begins loop playback. If **AutoRecord** is enabled, it immediately enters overdub mode so the performer can continue layering without pressing Overdub separately.

**Overdub:**

```pseudo
function handleOverdub(start=None):
    # Overdub toggling or explicit control
    if start is not None:
        overdubActive = start  # external control (e.g., auto start overdub)
    else:
        overdubActive = not overdubActive  # toggle on button press (for Toggle mode)
    if overdubActive:
        Feedback.setStatusLED("Overdub", RED)
        Buffer.saveLoopState(currentLoopIndex)  # save current loop for potential undo
    else:
        Feedback.setStatusLED("Overdub", GREEN)
```

When **Overdub** is active, any incoming audio (from the instrument input) is added into the loop as it plays, with the existing content being attenuated by the feedback setting (implemented in the Signal Chain layer). In *Sustain* mode, holding the Overdub button keeps it active and releasing it stops overdubbing (the logic would call `handleOverdub(start=True)` on press and `handleOverdub(start=False)` on release). The controller signals the Feedback layer to indicate overdub status (LED red when recording into the loop). It also calls the Buffer to save the pre-overdub state for undo functionality.

**Insert:**

```pseudo
function handleInsert():
    mode = Parameter.get("Switches","InsertMode")
    if mode in ["Insert", "Replace", "Substitute"]:
        if not Controller.insertActive:
            Controller.insertActive = True
