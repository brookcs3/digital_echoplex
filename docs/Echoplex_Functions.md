# Echoplex Functions

This page summarizes the primary functions available in the Digital Echo Plex implementation.

## Core Loop Functions

- **RECORD** – Start recording a new loop.
- **OVERDUB** – Layer additional audio onto the existing loop.
- **MULTIPLY** – Extend loop length, typically by doubling the current buffer.
- **INSERT** – Insert new material at the current playback point.
- **REPLACE** – Overwrite a section of the loop with fresh recording.
- **UNDO** – Revert the last action performed on the loop.
- **MUTE** – Mute or unmute loop playback.
- **REVERSE** – Toggle reverse playback of the loop.
- **HALF_SPEED** – Play the loop at half speed.
- **NEXT_LOOP** – Switch to the next loop slot.
- **PREVIOUS_LOOP** – Return to the previous loop slot.
- **RESET** – Clear the current loop buffer.
- **RETRIGGER** – Restart playback from the loop start point.
- **START_POINT** – Set a new starting position within the loop.
- **LOOP_WINDOW** – Define a sub‑section of the loop for playback.
- **SUBSTITUTE** – Replace part of the loop with a new recording.
- **SUS_COMMAND** – Engage granular "SUS" commands for real‑time effects.
- **MULTI_INCREASE** – Increase loop length by a specified factor.
- **LOOP_DIVIDE** – Divide the loop into equal segments.

## Advanced Controls

Additional helpers expose more detailed control:

- **moveLoopWindow(direction, amount)** – Shift the active loop window forward or backward.
- **setTempo(bpm)** – Set the engine tempo used for sync features.
- **syncToExternalClock(enabled)** – Enable or disable synchronization to an external MIDI clock.
- **reAlign()** – Align loop playback with the next beat.
- **startQuantizedRecording() / stopQuantizedRecording()** – Begin or end recording on precise musical boundaries.

