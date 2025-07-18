            Buffer.saveLoopState(currentLoopIndex)  # save state for undo
            Feedback.setStatusLED("Insert", RED)
            if mode == "Insert":
                # Extend loop length while button held (insert silence if no input)
                Buffer.beginInsert(currentLoopIndex)
            # mode "Replace": start replacing loop content with live input (destructive overdub)
            # mode "Substitute": start replacing but original audio is retrievable on exit (non-destructive audition)
        else:
            # Button released, finish insert operation
            Controller.insertActive = False
            Feedback.setStatusLED("Insert", GREEN)
            if mode == "Insert":
                Buffer.endInsert(currentLoopIndex)  # finalize new loop length
            # mode "Replace": stop replacing (loop returns to normal playback)
            # mode "Substitute": discard the overdub if this mode dictates, restoring original if needed
    elif mode == "Reverse":
        # Toggle reverse playback of the current loop
        Buffer.toggleReverse(currentLoopIndex)
        Feedback.showMessage("Loop Reverse " + (Buffer.isReversed(currentLoopIndex) ? "ON" : "OFF"))
    elif mode == "HalfSpeed":
        # Toggle half-speed playback (doubling loop length, lowering pitch)
        Buffer.toggleHalfSpeed(currentLoopIndex)
        Feedback.showMessage("Half Speed " + (Buffer.isHalfSpeed(currentLoopIndex) ? "ON" : "OFF"))
```

The **Insert** command has multiple behaviors depending on the configured `InsertMode`:

- In **Insert** mode, pressing Insert will *insert* time into the loop. The loop length increases for the duration the button is held (new blank space or new recording is inserted). Upon release, the loop is longer than before.
- In **Replace** mode, pressing Insert acts as a momentary “punch-in”: incoming audio replaces the existing loop content for as long as the button is held (when released, the loop continues as before, with the replaced section overwritten).
- In **Substitute** mode, similar to Replace, but intended as a temporary substitution (the original audio could be restored if the action is undone or if the design allows toggling back).
- In **Reverse** mode, pressing Insert toggles reverse playback of the loop (if currently playing forward, it starts playing backward from the current position or end; pressing again resumes forward play).
- In **HalfSpeed** mode, pressing Insert toggles half-speed playback for the loop (doubling its playback length and lowering pitch by an octave; pressing again returns to normal speed).

For momentary modes (Insert, Replace, Substitute), the Controller monitors the state of the Insert button (pressed vs released) to determine when to apply and when to stop the action. The Buffer Layer provides support functions like `beginInsert/endInsert` to adjust loop length and `saveLoopState` to preserve original audio if needed for undo. Visual feedback is provided via the Insert button LED (e.g., lit red while active).

**Multiply:**

```pseudo
function handleMultiply():
    if multiplyMode == False:
        # Initiate multiply mode
        multiplyMode = True
        pendingMultiplyCycles = 0
        Feedback.setStatusLED("Multiply", RED)
        Buffer.saveLoopState(currentLoopIndex)  # save original loop for undo, as length will change
        multiplyStartCycle = Buffer.currentCycleCount(currentLoopIndex)
        # If quantization is on, maybe align start to cycle boundary (if press happened mid-cycle)
        if Parameter.get("Timing","Quantize") == "Cycle" and not Buffer.atCycleStart():
            Buffer.queueActionAtCycleStart(currentLoopIndex, "StartMultiply")
    else:
        # Conclude multiply mode
        multiplyMode = False
        Feedback.setStatusLED("Multiply", GREEN)
        # Determine how many cycles elapsed during multiply
        endCycle = Buffer.currentCycleCount(currentLoopIndex)
        let n = endCycle - multiplyStartCycle
        if Parameter.get("Switches","RoundMode") == "On":
            # If RoundMode, ensure we complete the current cycle if the button was pressed early
            if not Buffer.atCycleStart():
                n += 1  # count the partial cycle as a full cycle
        if n < 1: n = 1  # safety: at least one cycle
        # Set new loop length as an integer multiple of original cycle length
        originalLength = Buffer.getCycleLength(currentLoopIndex)
        Buffer.setLoopLength(currentLoopIndex, originalLength * n)
        Buffer.setCycleCount(currentLoopIndex, n)
```

**Multiply** allows the performer to extend the loop by an integer multiple of its original length:

- On first press, multiply mode begins. The system starts counting loop cycles (the basic unit of the original loop length). The Multiply LED turns red to indicate the process. If quantization is enabled (Quantize = Cycle or Loop), the start of multiplication might wait until the next cycle boundary to synchronize the extension cleanly.
- On second press, multiply ends. The number of cycles spanned is calculated. If **RoundMode** is on, the operation will include the current partial cycle as a full additional cycle (ensuring the final loop length is a whole-number multiple of the original cycle). If RoundMode is off, the loop could end at the exact point of the second press (which might cut the last cycle short, but the Echoplex typically still rounds up to include that cycle, per design).
- The Buffer’s loop length is then updated to this new length. The content of the original loop is duplicated as needed to fill the new extended area (this would be handled inside `Buffer.setLoopLength`, which would copy the loop content or silence out to the new length as appropriate). Now the loop plays at a longer length, effectively repeating the original material n times (with any new overdubs that were performed during multiply recorded into those cycles).

**Undo:**

```pseudo
function handleUndo():
    if Buffer.hasUndoState(currentLoopIndex):
        if not Controller.undoToggled:
            # Perform undo: revert to last saved loop state
            Buffer.restoreLoopState(currentLoopIndex)
            Controller.undoToggled = True
            Feedback.setStatusLED("Undo", RED)
        else:
            # Perform redo (undo the undo) if no new actions since
            Buffer.redoLoopState(currentLoopIndex)
            Controller.undoToggled = False
            Feedback.setStatusLED("Undo", GREEN)
    else:
        Feedback.flashDisplay("Nothing to undo")
```

**Undo** lets the user revert the last change (typically the last overdub or insert). The Controller relies on the Buffer Layer to have stored a backup of the loop prior to the last action:

- If an undo state exists and no undo has been done yet (`undoToggled` is false), pressing Undo will replace the current loop audio with the saved previous state (erasing the last overdub). The Undo LED might light red to indicate that the loop is in an undone state.
- If the user presses Undo again immediately (and no new recording has occurred in between), the system can **redo** the change (restore the state that was undone). This toggling undo/redo is possible only until a new action happens, at which point the undo history is updated to that new action.
- If no undo is available, a feedback message or blink is shown to indicate nothing happened.

The Undo function typically only stores one level of history (the Echoplex has one level of undo/redo). It works for overdubs and certain Inserts. It cannot recover a loop once fully erased/reset or bring back material older than the most recent layer.

