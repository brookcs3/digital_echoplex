    startPlayback(loopIndex)  # immediately play the recorded loop

function startPlayback(loopIndex):
    playPos = 0
    # (Playback will be handled by reading loopBuffers[loopIndex] in processAudioFrame)

function stopPlayback(loopIndex):
    playPos = 0  # reset position (or keep last position if needed)
```

- The buffer uses a read-write pointer (`playPos`). When recording, new samples are written to the buffer sequentially and `playPos` is advanced. When recording stops, the length of the loop is set to the number of samples recorded.
- Starting playback (for a loop that has content) resets `playPos` to 0 and subsequent calls to get samples will read from the buffer in a loop (wrapping around at `loopLengths[loopIndex]`).
- The Buffer can handle continuous looping by wrapping `playPos` when it reaches `loopLength` (not shown explicitly, but implied in `getNextPosition()`):

```pseudo
function getNextPosition():
    pos = playPos + 1
    if pos >= loopLengths[currentLoopIndex]:
        pos = 0  # wrap around end of loop
        # mark cycle boundary for that loop (used in timing calculations)
    return pos
```

This ensures the loop repeats seamlessly and allows the system to detect when a loop cycle completes (useful for syncing and quantization).

**Cycle Tracking:** For each loop, `baseCycleLength` is stored when the loop is first recorded. If the loop is later multiplied, the `loopLength` becomes a multiple of `baseCycleLength`, and the system can compute how many cycles (`cycleCount = loopLength / baseCycleLength`). The Buffer can expose:

```pseudo
function currentCycleCount(loopIndex):
    return floor(playPos / baseCycleLength[loopIndex])
```

to tell which cycle is playing, and mark boundaries when `playPos` resets to 0 (that’s a new cycle loop).

**Undo Support:**

```pseudo
function saveLoopState(loopIndex):
    undoBuffers[loopIndex] = clone(loopBuffers[loopIndex])  # store a copy of the audio data
    undoLengths[loopIndex] = loopLengths[loopIndex]
    undoAvailable = True

function restoreLoopState(loopIndex):
    if undoBuffers[loopIndex] is not None:
        loopBuffers[loopIndex] = clone(undoBuffers[loopIndex])
        loopLengths[loopIndex] = undoLengths[loopIndex]
        # After undo, we could keep the old state in case redo is needed
        redoBuffers[loopIndex] = ... (store the state that was just replaced)
        undoAvailable = False  # or toggle a flag for redo
```

The Buffer layer handles storing a backup of the loop when a record/overdub/insert operation begins (so that the previous state can be recovered). Here we assume one level of undo. After an undo, the previous state could be kept in a `redoBuffer` to allow redo.

**Insert Operations:** The Buffer provides specialized operations for insert:

```pseudo
function beginInsert(loopIndex):
    insertStartPos = playPos
    inserting = True

function endInsert(loopIndex):
    if inserting:
        let insertDuration = playPos - insertStartPos
        # shift existing loop content from insertStartPos to end by insertDuration to make room
        loopBuffers[loopIndex].insertSilence(insertStartPos, insertDuration)
        loopLengths[loopIndex] += insertDuration
        inserting = False
```

This pseudo-logic indicates that when an Insert begins, we note the position and when it ends, we extend the loop by the amount of time the Insert was active (filling the gap with silence or the newly recorded material that was collected in that interval). Replace/Substitute would be handled by simply overwriting the buffer contents between insertStartPos and playPos while active (and possibly not changing length).

**Half-Speed/Reverse:** The Buffer can handle these by adjusting how it reads/writes:

```pseudo
function toggleHalfSpeed(loopIndex):
    if halfSpeedEnabled[loopIndex] is False:
        # Double the loop length by stretching playback
        halfSpeedEnabled[loopIndex] = True
        loopLengths[loopIndex] *= 2  # conceptually double length (playback pointer will step every other sample)
    else:
        halfSpeedEnabled[loopIndex] = False
        loopLengths[loopIndex] = baseCycleLength[loopIndex] * cycleCount(loopIndex)  # restore original length * cycles

function toggleReverse(loopIndex):
    reversePlay[loopIndex] = not reversePlay[loopIndex]
    # Actual reading of samples will check reversePlay flag and read buffer in reverse order if True
```

Half-speed playback can be implemented either by changing the effective sample rate or by reading each sample twice – conceptually above we double the loop length value so that the playback pointer wraps at double length, causing the loop to take twice as long to cycle (the Signal Chain could also interpolate between samples if needed for true half-speed effect). Reverse toggling simply inverts the direction of the playback pointer progression (the `getNextPosition()` would decrement `playPos` if reverse is active, or manage an index from end to start).

**Loop Copy:**

```pseudo
function copyLoop(srcIndex, destIndex):
    loopBuffers[destIndex] = clone(loopBuffers[srcIndex])
    loopLengths[destIndex] = loopLengths[srcIndex]
    baseCycleLength[destIndex] = baseCycleLength[srcIndex]
    isLoopRecorded[destIndex] = True
```

