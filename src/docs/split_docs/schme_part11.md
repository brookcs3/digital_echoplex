**Next Loop:**

```pseudo
function handleNextLoop():
    if totalLoops <= 1:
        return  # no alternate loops configured
    # Determine the next loop index (cycle through loop slots)
    nextIndex = (currentLoopIndex + 1) % totalLoops
    if nextIndex != currentLoopIndex:
        if Parameter.get("Switches","SwitchQuant") != "Off" and Controller.isLoopPlaying():
            # Quantized switching: schedule the loop switch at end of current loop cycle/loop
            Buffer.queueActionAtLoopEnd("SwitchLoop", nextIndex)
            Feedback.setStatusLED("NextLoop", ORANGE)  # indicate pending loop switch
        else:
            performLoopSwitch(nextIndex)
```

And the helper to perform the actual switch:

```pseudo
function performLoopSwitch(targetLoopIndex):
    # Stop or fade out current loop if needed
    overdubActive = False  # end any overdub on current loop
    recording = False      # ensure not recording
    Buffer.stopPlayback(currentLoopIndex)
    # If LoopCopy is enabled and target loop is empty, copy current loop content
    if Parameter.get("Loop","LoopCopy") == "On" and Buffer.isLoopEmpty(targetLoopIndex):
        Buffer.copyLoop(currentLoopIndex, targetLoopIndex)
    currentLoopIndex = targetLoopIndex
    Buffer.startPlayback(currentLoopIndex)
    Feedback.updateLoopDisplay(currentLoopIndex)
    # If the new loop is empty and AutoRecord is enabled, automatically start recording
    if Buffer.isLoopEmpty(currentLoopIndex) and Parameter.get("Loop","AutoRecord") == "On":
        recording = True
        Buffer.startRecording(currentLoopIndex)
        Feedback.setStatusLED("Record", RED)
```

**NextLoop** allows navigation through multiple loops (if `MoreLoops` > 1). On press, it selects the next loop:

- If a quantization for switching (**SwitchQuant**) is active, the command will not take effect immediately. Instead, it will be queued to execute when the current loop reaches its end (or the next cycle boundary, depending on implementation). The NextLoop LED may turn orange to show the switch is pending.
- If no quantization (immediate switch), it stops the current loop playback right away and jumps to the next loop index. If the next loop has been recorded already, that loop begins playing. If it’s empty, the system is now on a blank loop, ready for recording.
- **LoopCopy:** If this setting is ON and the next loop is empty, the content of the current loop is duplicated into the new loop upon switching (so the musician can use it as a starting point). This happens before starting playback/recording on the new loop.
- **AutoRecord:** If enabled and the new loop is empty, the system will automatically begin recording in the new loop as soon as it switches to it (so the user doesn’t have to hit Record again – useful for sequential looping).
- The loop index display and relevant indicators are updated to show the new current loop. If the loop count wraps (e.g., you were on loop 3 of 3 and pressed NextLoop, it may cycle back to loop 1), the system handles the wraparound logically.

*(This design assumes NextLoop always goes in one direction (ascending order). In practice, additional controls could allow moving to a previous loop or directly selecting a specific loop via MIDI or preset, but those are beyond this core scope.)*

All the above controller functions interact with the Buffer Layer to read or modify loop data, and with the Feedback Layer to reflect status changes on the interface (LEDs, display messages). Each operation also respects the Parameter Layer settings (for example, modes like Sustain or Toggle would be handled by checking the parameter and possibly adjusting how the function is called, quantization parameters affect timing, etc., as illustrated).

## Buffer Layer (Loop Data, Cycles, Memory)

Manages all loop audio data and timing. This layer is responsible for recording and playback buffers for loops, handling multiple loops in memory, tracking loop length and cycle information, and providing undo/redo buffers.

**Data Structures:**

```pseudo
totalMemorySeconds = hardwareInstalledMemory  # total available loop time in seconds
loopBuffers = [ new AudioBuffer() for i in range(Parameter.get("Loop","MoreLoops")) ]
loopLengths = [0, 0, ...]      # length of each loop (in samples or ticks)
baseCycleLength = [0, 0, ...]  # base cycle length for each loop (initial loop length for reference)
isLoopRecorded = [False, False, ...]
undoBuffers = [ None, None, ... ]  # backup audio for undo for each loop
playPos = 0         # current playback position (for current loop)
```

**Memory Allocation:**

```pseudo
function allocateMemory(loopCount):
    # Divide total memory evenly among loops
    loops = [] 
    for i in range(loopCount):
        loops[i] = new AudioBuffer(totalMemorySeconds / loopCount) 
    loopBuffers = loops
    loopLengths = [0]*loopCount
    baseCycleLength = [0]*loopCount
    undoBuffers = [None]*loopCount
    isLoopRecorded = [False]*loopCount
    # Note: Changing loop count erases existing loops and distributes memory equally:contentReference[oaicite:11]{index=11}
```

When the `MoreLoops` parameter changes, this function is invoked to reinitialize loop buffers. Memory is divided evenly so that *if you have 100 seconds total and set 4 loops, each loop gets 25 seconds max length*. This resets (clears) all loops because the memory layout changed.

**Recording and Playback:**

```pseudo
function startRecording(loopIndex):
    playPos = 0
    loopLengths[loopIndex] = 0
    isLoopRecorded[loopIndex] = True
    recordingLoopIndex = loopIndex
    # (Recording will proceed in processAudioFrame via SignalChain writing into buffer)

function stopRecording(loopIndex):
    # Finalize loop length
    loopLengths[loopIndex] = playPos
    baseCycleLength[loopIndex] = playPos  # first recording defines the cycle length
    playPos = 0
    recordingLoopIndex = None
