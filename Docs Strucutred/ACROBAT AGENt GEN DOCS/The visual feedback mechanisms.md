# The visual feedback mechanisms 
of the Echoplex Digital Pro Plus are designed to provide clear and intuitive indications of the unit's status, operations, and parameter changes. Below is a detailed breakdown of how the LED behaviors and display updates function for each button and operation:
### 1. LED Behaviors
**Status Indicator Lights (Under Buttons)**
* **Unlit:** The function is unavailable.
* **Green:** The button is ready to perform its primary function.
* **Red:** Indicates the button is actively performing its function or is the last pressed button. In parameter editing mode, red indicates the current parameter column being edited.
* **Orange:** The button is available for an alternate function relevant to the current activity or state.

⠀**Visual Tempo Guide LEDs**
These LEDs provide rhythmic and synchronization feedback:
* **Timing LED:** Blinks at sub-cycle points (e.g., 8th notes) defined by the 8ths/Cycle parameter and the global clock.
* **Switches LED:** Blinks at local cycle start points.
* **MIDI LED:** Blinks at local loop start points (only shown if multiple loops are established).
* **Multiple Right Dot:** Indicates the global MIDI start point (beat 1 of the external clock). Blinks only if the local loop is not aligned.
* **Multiple Left Dot:** Indicates sync corrections:
  * **Bright:** Sync came early; external sequencer was fast.
  * **Faint:** Sync came late; external sequencer was slow.
* **Loop Green Dot:** Indicates AutoUndo execution (loop was unchanged during the last pass).

⠀**Level Indicator Lights**
* **Input Indicator:** Monitors incoming audio levels:
  * **Green:** Healthy signal.
  * **Orange:** Signal approaching maximum headroom.
  * **Red:** Signal distortion due to limiter engagement.
* **Feedback Indicator:** Monitors the volume of the material recorded in the current loop:
  * **Green:** Healthy loop volume.
  * **Orange:** Approaching distortion levels.
  * **Red:** Distorted loop volume.

⠀2. Display Updates
**LoopTime Display**
The LoopTime Display dynamically updates based on the current operation:
* **Standard Loop Time:** Displays the length of the current loop during playback.
* **Recording/Multiply/Insert:** Tracks the time recorded so far.
* **Feedback Display:** Shows feedback changes as a red number (0-127) when adjusted via the knob, foot pedal, or MIDI.
* **Volume Continuous Controller Display:** Displays loop output volume changes sent via MIDI.
* **Command Display:** Briefly shows command names for operations without dedicated LEDs:
  * **rE:** Reverse
  * **Fd:** Forward
  * **H.SP:** HalfSpeed
  * **F.SP:** FullSpeed
  * **S.Un:** Short Undo
  * **L.Un:** Long Undo
* **Sync Time Display:** Displays cycle time after sync pulses or MIDI clock synchronization.
* **Quantizing Display:** Shows "ooo" during quantized actions waiting for execution.
* **SwitchQuantize Display:** Displays the target loop number during loop switching (e.g., "L 1", "L 2").
* **Preset Display:** Shows preset numbers and their status (e.g., "Pr #", "PrE").

⠀**Multiple Display**
* **Cycle Count:** Displays the current cycle after Multiply or Insert operations.
* **Reverse Mode:** Counts cycles backward during reverse playback.
* **Parameter Editing Mode:** Displays the current row selected in the parameter matrix.
* **Preset Editor:** Displays the preset number being edited.

⠀3. Interaction Patterns
**Button Press Types**
* **Short Press:** Executes primary functions (e.g., Record, Overdub).
* **Long Press:** Activates alternate functions (e.g., Reset, Undo).
* **Double-Click:** Executes advanced operations like copying loops or stopping recording.

⠀**Parameter Editing**
* **Row Indicator Lights:** Illuminate to indicate the active parameter row (Timing, Switches, MIDI, Loops).
* **Feedback Knob as DataWheel:** Used for editing parameters with many values.

⠀4. Synchronization Feedback
* **External Clock Sync:** LEDs reflect external clock start points when Sync=In.
* **Global Clock Alignment:** LEDs indicate alignment or misalignment between global and local clocks.

⠀This detailed visual feedback system ensures users can intuitively monitor and control the Echoplex's operations, making it easier to replicate these mechanisms in a web-based emulation.
### Next Steps
1 I can outline how these visual feedback mechanisms can be implemented using Web Audio API and UI components.
2 I can detail the synchronization behaviors and their integration into the web-based interface.
