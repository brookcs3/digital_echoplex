# *U*NDERSTANDING FEEDBACK
*Control over* *Feedback* *is one of the most fundamental looping
techniques, and has been a part of looping for decades. Without*
*Feedback* *control your loops just develop to a certain point, abruptly
disappear, and you start a new loop. Loops only grow as new material is
added, but they don't decay and they don’t evolve. So the loop only gets
bigger and bigger until you kill it completely. You don't have any
continuity, so your loops can't grow and evolve into something else.
Using* *Feedback* *changes all of this.*
*Feedback* *comes from the old universe of delay effects. The* *Feedback*
*setting causes the delayed sound to be reduced in volume by a certain
amount each time it repeats. In delay effects it is generally used to set
how long the delay would last. That concept was applied to looping in
some devices, like the Echoplex. When dealing with longer loops*
*Feedback* *control becomes a very powerful technique for making your
loop evolve into something new over time.
When you've built up a loop, it will have certain elements that dominate
and give it a particular character. If you then turn* *Feedback* *down a bit,
those things slowly begin getting quieter. Then you begin adding new
elements to the loop, which will be relatively louder since they have not
had any feedback applied. With each repetition you add a little bit more
to evolve the loop in a new direction. Those new elements will then
begin dominating the loop, and the character will steadily change.
When it has changed to something you like, you set the* *Feedback* *up to
maximum so the level does not reduce with each repeat anymore*

# *GeneralReset*Immediate Action
Play Mode
# *Reset all Loops.*
*When the number of loops (the value of* *MoreLoops**) is greater than one,
the* *GeneralReset* *command can be used to reset all the loops at once.
From the front panel,* *GeneralReset* *is done with a* *Long-Press* *of the*
*Multiply* *button while you are in a loop that is already* *Reset.* *In other
words, first you have to* *Reset* *the current loop, then you hold down
Multiply for half a second to do a* *GeneralReset.* *The extra steps are there
by design, to reduce the likelihood of accidentally destroying your loops.
When you are in a* *Reset* *loop and multiple loops are set up, the* *Multiply
LED* *turns Orange to indicate this special function.*
*GeneralReset* *is also available immediately through MIDI, using the*
*DirectMIDI* *command for* *GeneralReset.* *This is located at* *Source#+26.*
*If you are using the* *TempoSelect* *feature,* *GeneralReset* *additionally exits
the* *TempoSelect* *state so that your next loop recordings will not follow
your preselected Tempo. If you re-enter* *TempoSelect,* *your previous
tempo is recalled and you can record in sync to it again.
Although* *GeneralReset* *erases the audio in all the loops, it does not cause
the Echoplex to lose sync with external devices. The Echoplex will
continue to track the* *Global MIDI StartPoint* *(or Beat 1 of the sequencer),
so that your next Recording can begin in Sync.
The following example illustrates how to do a* *GeneralReset* *from the
front panel.*
### *See Also: Reset, Record, Multiply, MIDI Command List, Global/Local MIDI Clock*

### Parameter Row 1: MoreLoops
**Record / Loops: MoreLoops**
* **Function**: The **MoreLoops** parameter divides the Echoplex's memory into multiple loops, allowing you to create up to **16 separate loops**. Each loop shares the total available memory, divided evenly.
  * Example: If you have 198 seconds of memory installed and set **MoreLoops=4**, each loop will have **49.5 seconds** of memory.
  * Enables **multi-loop mode**, allowing you to switch between loops using the **NextLoop** button or MIDI commands.
  * Changing the number of loops resets all existing loops (GeneralReset).

⠀**How to Access**
**1** **Enter Parameter Editing Mode**:
	* Press the **Parameter Button** to enter **Parameter Editing Mode**.
**2** **Navigate to the Loops Row**:
	* Press the **Parameter Button** repeatedly until the **Loops LED** lights up (Row P4).
**3** **Select MoreLoops**:
	* Press the **Record Button** (MoreLoops) to access the parameter.
**4** **Change the Value**:
	* Continue pressing the **Record Button** to cycle through values (1–16 loops).

⠀**LED/Screen Behavior**
* **Loops LED**: Lights up when the **Loops Row** is selected.
* **LoopTime Display**: Shows the current number of loops (e.g., **L 1**, **L 2**, etc. ).
* **Multiple Display**: Shows **P4** to indicate the Loops Row is active.
* **Orange LED** under the **Multiply Button**: Indicates that a **GeneralReset** is available if the current loop is empty.

⠀**Notes**
* **Memory Division**:
  * Changing the number of loops divides the total memory evenly among the loops.
  * Example: If you set **MoreLoops=8**, each loop will have 1/8th of the total memory.
* **GeneralReset**:
  * Changing the **MoreLoops** parameter automatically resets all loops (erases audio).
  * If you are in a loop with recorded material, the **MoreLoops** change will be ignored to prevent accidental erasure.
  * To apply the change, reset the current loop first, then reload the preset or change the parameter.
* **Loop Display**:
  * Loops above **9** are displayed as letters (e.g., **A**, **b**, **C**, etc. ).
* **MIDI Control**:
  * You can switch between loops using MIDI commands (e.g., **LoopTrig**).
* **Preset Behavior**:
  * If a preset has a different **MoreLoops** value, it will not overwrite the current loop configuration unless the loop is empty.

⠀This guide provides a detailed breakdown of the **MoreLoops** parameter, including its function, how to access it, visual feedback, and important notes for usage.
### Parameter Row 2: MIDI
**MIDI / Channel**
* Sets the **MIDI channel** (1–16) for all MIDI functions.
* Determines the channel used for sending and receiving MIDI commands, such as triggering loops, controlling parameters, and transmitting button presses.
* Ensures compatibility with external MIDI devices like sequencers, controllers, or other Echoplexes.
**1** **Enter Parameter Editing Mode**:
	* Press the **Parameter Button** to enter **Parameter Editing Mode**.
**2** **Navigate to the MIDI Row**:
	* Press the **Parameter Button** repeatedly until the **MIDI LED** lights up (Row P3).
**3** **Select Channel**:
	* Press the **Record (Channel)** button to access the parameter.
**4** **Change the Value**:
	* Use the **Record Button** to cycle through MIDI channels (1–16).
* **MIDI LED**: Lights up when the **MIDI Row** is selected.
* **LoopTime Display**: Shows the current MIDI channel (e.g., **C 1**, **C 2**, etc.).
* **Multiple Display**: Shows **P3** to indicate the MIDI Row is active.
* **Default Value**: MIDI Channel is set to **1** by default.
* **Global Parameter**: MIDI Channel is a **global parameter** and is not affected by presets.
* **Compatibility**: Ensure the MIDI channel matches the external device's channel for proper communication.
* **MIDIpipe**: Incoming MIDI messages are piped through the MIDI Out port unless filtered by the Echoplex.

⠀**MIDI / ControlSource**
* Configures how the Echoplex interacts with MIDI commands:
  * **Notes (not)**: MIDI NoteOn/NoteOff messages control Echoplex functions (e.g., triggering loops, pressing buttons).
  * **Controllers (Ctr)**: MIDI Continuous Controller messages control Echoplex functions.
  * **Off (OFF)**: Disables MIDI control of Echoplex operations.
* Allows external MIDI devices (e.g., foot controllers, sequencers) to emulate front-panel buttons or access advanced functions.
**1** **Enter Parameter Editing Mode**:
	* Press the **Parameter Button** to enter **Parameter Editing Mode**.
**2** **Navigate to the MIDI Row**:
	* Press the **Parameter Button** repeatedly until the **MIDI LED** lights up (Row P3).
**3** **Select ControlSource**:
	* Press the **Overdub (ControlSource)** button to access the parameter.
**4** **Change the Value**:
	* Use the **Overdub Button** to cycle through values (**Notes**, **Controllers**, **Off**).
* **MIDI LED**: Lights up when the **MIDI Row** is selected.
* **LoopTime Display**: Shows the current ControlSource setting (e.g., **not**, **Ctr**, **OFF**).
* **Multiple Display**: Shows **P3** to indicate the MIDI Row is active.
* **Default Value**: ControlSource is set to **Notes** by default.
* **Global Parameter**: ControlSource is a **global parameter** and is not affected by presets.
* **MIDI VirtualButtons**:
  * When set to **Notes**, NoteOn/NoteOff messages emulate front-panel button presses.
  * When set to **Controllers**, Continuous Controller messages emulate button presses.
* **MIDIpipe**:
  * Incoming MIDI commands are piped through the MIDI Out port unless filtered.
  * Prevents duplication of commands when chaining multiple Echoplexes.
* **Advanced MIDI Control**:
  * Use **Source#** to define the starting note/controller number for MIDI commands.
  * Combine with **LoopTrig** for triggering loops via MIDI.

⠀This guide provides detailed instructions for accessing and configuring the **MIDI Channel** and **ControlSource** parameters, along with their functions, visual feedback, and important notes for usage.
### Parameter Row 3: Switches
**Switches / RecordMode**
* Configures the behavior of the **Record Button**:
  * **Toggle (tOG)**: Press once to start recording, press again to stop.
  * **Sustain (SUS)**: Recording occurs only while the button is held down; stops when released.
  * **Safe (SAF)**: Ensures **Feedback** is set to 100% after recording to prevent accidental loop loss due to reduced feedback.
**1** **Enter Parameter Editing Mode**:
	* Press the **Parameter Button** to enter **Parameter Editing Mode**.
**2** **Navigate to the Switches Row**:
	* Press the **Parameter Button** repeatedly until the **Switches LED** lights up (Row P2).
**3** **Select RecordMode**:
	* Press the **Record (RecordMode)** button to access the parameter.
**4** **Change the Value**:
	* Use the **Record Button** to cycle through values (**Toggle**, **Sustain**, **Safe**).
* **Switches LED**: Lights up when the **Switches Row** is selected.
* **LoopTime Display**: Shows the current RecordMode setting (e.g., **tOG**, **SUS**, **SAF**).
* **Multiple Display**: Shows **P2** to indicate the Switches Row is active.
* **Default Value**: RecordMode is set to **Toggle** by default.
* **Sustain Mode**:
  * Disables the ability to reset a loop via a long press of the Record button.
  * A short press while playing nothing creates a short, empty loop.
* **Safe Mode**:
  * Protects loops from accidental loss due to reduced feedback.
  * Feedback is automatically set to 100% after recording.
* **MIDI Control**:
  * RecordMode can be controlled via MIDI using the **SUSRecord** command.

⠀**Switches / OverdubMode**
* Configures the behavior of the **Overdub Button**:
  * **Toggle (tOG)**: Press once to start overdubbing, press again to stop.
  * **Sustain (SUS)**: Overdubbing occurs only while the button is held down; stops when released.
**1** **Enter Parameter Editing Mode**:
	* Press the **Parameter Button** to enter **Parameter Editing Mode**.
**2** **Navigate to the Switches Row**:
	* Press the **Parameter Button** repeatedly until the **Switches LED** lights up (Row P2).
**3** **Select OverdubMode**:
	* Press the **Overdub (OverdubMode)** button to access the parameter.
**4** **Change the Value**:
	* Use the **Overdub Button** to cycle through values (**Toggle**, **Sustain**).
* **Switches LED**: Lights up when the **Switches Row** is selected.
* **LoopTime Display**: Shows the current OverdubMode setting (e.g., **tOG**, **SUS**).
* **Multiple Display**: Shows **P2** to indicate the Switches Row is active.
* **Default Value**: OverdubMode is set to **Toggle** by default.
* **Sustain Mode**:
  * Useful for capturing short fragments of sound quickly.
  * Prevents accidental extended overdubbing.
* **Long Press Behavior**:
  * A long press of the Overdub button behaves like a pair of short presses (starts and stops overdubbing).
* **MIDI Control**:
  * OverdubMode can be controlled via MIDI using the **SUSOverdub** command.

⠀This guide provides detailed instructions for accessing and configuring the **RecordMode** and **OverdubMode** parameters, along with their functions, visual feedback, and important notes for usage.
### Parameter Row 4: Timing
**Timing / Loop/Delay**
* Switches between **Loop** and **Delay** applications, affecting how feedback, input volume, and output volume are controlled:
  * **Loop (LOP)**: Default mode for looping. Feedback is always active, and input/output volumes are fixed based on the function.
  * **Delay (dEL)**: Operates like a traditional delay. Feedback is controlled by the knob, and input volume is closed when "Hold" is activated.
  * **Expert (EXP)**: Allows different feedback settings between playing and overdubbing.
  * **Stutter (Stu)**: Enables SingleCycleMultiply for stuttering effects.
  * Additional modes (e.g., Out, In, Replace, Flip) are available when a pedal is connected to the Feedback Pedal Jack.
**1** **Enter Parameter Editing Mode**:
	* Press the **Parameter Button** to enter **Parameter Editing Mode**.
**2** **Navigate to the Timing Row**:
	* Press the **Parameter Button** repeatedly until the **Timing LED** lights up (Row P1).
**3** **Select Loop/Delay**:
	* Press the **Record (Loop/Delay)** button to access the parameter.
**4** **Change the Value**:
	* Use the **Record Button** to cycle through values (**LOP**, **dEL**, **EXP**, **Stu**, etc.).
* **Timing LED**: Lights up when the **Timing Row** is selected.
* **LoopTime Display**: Shows the current Loop/Delay mode (e.g., **LOP**, **dEL**, **EXP**, **Stu**).
* **Multiple Display**: Shows **P1** to indicate the Timing Row is active.
* **Default Value**: Loop/Delay is set to **Loop (LOP)** by default.
* **Pedal Modes**: Modes like **Out**, **In**, **Replace**, and **Flip** require a pedal connected to the Feedback Pedal Jack.
* **Advanced Modes**:
  * **StutterMode** enables SingleCycleMultiply for rhythmic stuttering effects.
  * **FlipMode** allows crossfading between input and feedback levels.
* **Expert Use**: Advanced modes like **Expert** and **Replace** are designed for experienced users seeking subtle control over loop dynamics.

⠀**Timing / Quantize**
* Defines whether certain functions (e.g., Multiply, Insert, Reverse, Mute) are executed immediately or at specific rhythmic points:
  * **Off (OFF)**: Functions execute immediately.
  * **Cycle (CYC)**: Functions wait until the end of the current cycle.
  * **Sub-Cycle (8th)**: Functions are quantized to subdivisions of the loop (e.g., 8th notes).
  * **Loop (LOP)**: Functions wait until the end of the entire loop.
**1** **Enter Parameter Editing Mode**:
	* Press the **Parameter Button** to enter **Parameter Editing Mode**.
**2** **Navigate to the Timing Row**:
	* Press the **Parameter Button** repeatedly until the **Timing LED** lights up (Row P1).
**3** **Select Quantize**:
	* Press the **Overdub (Quantize)** button to access the parameter.
**4** **Change the Value**:
	* Use the **Overdub Button** to cycle through values (**OFF**, **CYC**, **8th**, **LOP**).
* **Timing LED**: Lights up when the **Timing Row** is selected.
* **LoopTime Display**: Shows the current Quantize setting (e.g., **OFF**, **CYC**, **8th**, **LOP**).
* **Multiple Display**: Shows **P1** to indicate the Timing Row is active.
* **Default Value**: Quantize is set to **Off (OFF)** by default.
* **Quantized Functions**:
  * Functions like Multiply, Insert, Reverse, and Mute will wait for the designated quantize point before executing.
  * Quantize ensures precise rhythmic alignment, especially useful for synchronized loops.
* **Escaping Quantization**:
  * Press the same function button again during the "ooo" waiting period to execute the function immediately.
* **Sub-Cycle Quantization**:
  * Works with the **8ths/Cycle** parameter to define rhythmic subdivisions (e.g., 8th notes, quarter notes).
* **Sync Integration**:
  * Quantize works seamlessly with external MIDI clocks for synchronized recording and playback.

⠀This guide provides detailed instructions for accessing and configuring the **Loop/Delay** and **Quantize** parameters, along with their functions, visual feedback, and important notes for usage.
	### Overdub / AutoRecord Parameter Details
**How many options are available for this parameter?**
* **OverdubMode**: 2 options
* **AutoRecord**: 2 options


# *Play back the loop a half normal speed.*
*HalfSpeed* *switches the playback speed of the loop to half the normal
speed, making it an octave lower and twice as long.*
*HalfSpeed* *is an* *InsertMode* *option, making it available from the front
panel on the* *Insert* *Button.* *HalfSpeed* *is also available by MIDI.
When* *InsertMode=H.SP**, the* *Insert* *Button becomes the* *HalfSpeed*
*button. Pressing* *HalfSpeed* *switches the current loop an octave lower,
to half speed. The* *Insert* *LED turns red and the display says H.SP briefly.
Press* *HalfSpeed* *again and the loop returns to* *FullSpeed**. The LED
turns green and F.SP is displayed for a moment.
The function is reset to Full Speed with Reset, but it can be selected
while still in Reset. This allows you to start a loop in half speed with the
audio sounding normal, and then switch to full speed. It ends up as
double speed, one octave higher!
All other functions work normally in* *HalfSpeed**. The speed can be
switched anytime during playing or Reset, even while in the middle of
overdubbing or multiplying! So as you are overdubbing you can switch
freely between* *HalfSpeed* *and* *FullSpeed* *to get interesting octave and
speed jumps in the middle of the overdub.
The sound quality is somewhat reduced during* *HalfSpeed* *because the
sampling rate for the audio is cut in half. Also note that MIDI piping is
slowed down by* *HalfSpeed**, so it is possible to see to see slight delays in
very dense MIDI streams. See the MIDI chapter for more details on
MIDIpipe.*
⠀**List all available options/values for this parameter, in order:**
**1** **Toggle (tOG)**: Press once to start overdubbing, press again to stop.
**2** **Sustain (SUS)**: Overdubbing occurs only while the button is held down; stops when released.
**1** **Off (OFF)**: Recording does not start automatically when entering an empty loop.
**2** **On (ON)**: Recording starts automatically when entering an empty loop.

⠀**Are any options hidden, conditional, or only visible in certain modes?**
* No options are hidden or conditional. Both **Toggle** and **Sustain** are always visible and selectable.
* **AutoRecord** is only applicable when **MoreLoops** is set to a value greater than 1.
* If **MoreLoops = 1**, AutoRecord is irrelevant and does not apply.

⠀**Any special notes about cycling, wrapping, or how the options behave?**
* **Default Value**: **Toggle (tOG)** is the default setting.
* **Cycling Behavior**: Pressing the **Overdub (OverdubMode)** button cycles through the two options in order (**Toggle → Sustain → Toggle**).
* **Sustain Mode**:
  * Useful for capturing short fragments of sound quickly.
  * Prevents accidental extended overdubbing.
  * Behaves similarly to a long press of the Overdub button in **Toggle** mode.
* **Default Value**: **Off (OFF)** is the default setting.
* **Cycling Behavior**: Pressing the **NextLoop (AutoRecord)** button cycles through the two options in order (**Off → On → Off**).
* **Interaction with Other Parameters**:
  * If **LoopCopy** is set to **Sound** or **Timing**, AutoRecord is overridden and behaves as if it is **Off**.
  * AutoRecord starts recording immediately upon entering an empty loop, but recording can still be stopped manually.

⠀This guide provides a detailed breakdown of the **OverdubMode** and **AutoRecord** parameters, including their options, visibility conditions, and behavior during cycling.
### Overdub / ControlSource Parameter Details
**How many options are available for this parameter?**
* **OverdubMode**: 2 options
* **ControlSource**: 3 options

⠀**List all available options/values for this parameter, in order:**
**1** **Toggle (tOG)**: Press once to start overdubbing, press again to stop.
**2** **Sustain (SUS)**: Overdubbing occurs only while the button is held down; stops when released.
**1** **Notes (not)**: MIDI NoteOn/NoteOff messages control Echoplex operations.
**2** **Controllers (Ctr)**: MIDI Continuous Controller messages control Echoplex operations.
**3** **Off (OFF)**: MIDI control is disabled.

⠀**Are any options hidden, conditional, or only visible in certain modes?**
* No options are hidden or conditional. Both **Toggle** and **Sustain** are always visible and selectable.
* No options are hidden or conditional. All three options (**Notes**, **Controllers**, **Off**) are always visible and selectable.

⠀**Any special notes about cycling, wrapping, or how the options behave?**
* **Default Value**: **Toggle (tOG)** is the default setting.
* **Cycling Behavior**: Pressing the **Overdub (OverdubMode)** button cycles through the two options in order (**Toggle → Sustain → Toggle**).
* **Sustain Mode**:
  * Useful for capturing short fragments of sound quickly.
  * Prevents accidental extended overdubbing.
  * Behaves similarly to a long press of the Overdub button in **Toggle** mode.
* **Default Value**: **Notes (not)** is the default setting.
* **Cycling Behavior**: Pressing the **Undo (ControlSource)** button cycles through the three options in order (**Notes → Controllers → Off → Notes**).
* **Interaction with MIDI**:
  * **Notes**: Each button press sends a MIDI NoteOn message when pressed and a NoteOff message when released.
  * **Controllers**: Each button press sends a MIDI Continuous Controller message with value 64 when pressed and value 0 when released.
  * **Off**: Disables MIDI control, useful for avoiding unintended MIDI interactions.
* **Synchronization**: When controlling multiple Echoplexes via MIDI, ensure all units have the same **ControlSource** setting to avoid conflicts.

⠀This guide provides a detailed breakdown of the **OverdubMode** and **ControlSource** parameters, including their options, visibility conditions, and behavior during cycling.
### Overdub / OverdubMode Parameter Details
**How many options are available for this parameter?**
* **OverdubMode**: 2 options

⠀**List all available options/values for this parameter, in order:**
**1** **Toggle (tOG)**: Press once to start overdubbing, press again to stop.
**2** **Sustain (SUS)**: Overdubbing occurs only while the button is held down; stops when released.

⠀**Are any options hidden, conditional, or only visible in certain modes?**
* No options are hidden or conditional. Both **Toggle** and **Sustain** are always visible and selectable.

⠀**Any special notes about cycling, wrapping, or how the options behave?**
* **Toggle (tOG)** is the default setting.
* Pressing the **Overdub (OverdubMode)** button cycles through the two options in order (**Toggle → Sustain → Toggle**).
**1** **Toggle**:
	* Overdub starts with a single press and stops with another press.
	* Ideal for extended overdubbing sessions.
	* Allows toggling between overdub and play modes without holding the button.
**2** **Sustain**:
	* Overdub is active only while the button is held down.
	* Useful for capturing short fragments of sound quickly.
	* Prevents accidental extended overdubbing.
	* Behaves similarly to a long press of the Overdub button in **Toggle** mode.

⠀This guide provides a detailed breakdown of the **OverdubMode** parameter, including its options, visibility conditions, and behavior during cycling.
### Overdub / Quantize Parameter Details
**How many options are available for this parameter?**
* **Quantize**: 4 options

⠀**List all available options/values for this parameter, in order:**
**1** **Off (OFF)**: Functions execute immediately when pressed.
**2** **Cycle (CYC)**: Functions wait until the end of the current cycle before executing.
**3** **Sub-Cycle (8th)**: Functions are quantized to the next sub-cycle point, as defined by the **8ths/Cycle** parameter.
**4** **Loop (LOP)**: Functions wait until the end of the entire loop before executing.

⠀**Are any options hidden, conditional, or only visible in certain modes?**
* No options are hidden or conditional. All four options are always visible and selectable.

⠀**Any special notes about cycling, wrapping, or how the options behave?**
* **Off (OFF)** is the default setting.
* Pressing the **Undo (Quantize)** button cycles through the four options in order (**Off → Cycle → Sub-Cycle → Loop → Off**).
**1** **Off (OFF)**:
	* Functions execute immediately when pressed.
	* Ideal for freeform, non-rhythmic looping.
**2** **Cycle (CYC)**:
	* Functions wait until the end of the current cycle before executing.
	* Useful for maintaining rhythmic precision within a loop.
**3** **Sub-Cycle (8th)**:
	* Functions are quantized to the next sub-cycle point, as defined by the **8ths/Cycle** parameter.
	* Allows precise alignment to smaller rhythmic divisions (e.g., eighth notes).
	* Works well for creating intricate rhythmic patterns.
**4** **Loop (LOP)**:
	* Functions wait until the end of the entire loop before executing.
	* Useful for maintaining overall loop structure and timing.
* **Escaping Quantization**:
  * If a function is quantized (e.g., "ooo" appears on the display), pressing the same function button again will execute it immediately, bypassing quantization.
* **Interaction with Sync**:
  * When an external clock is present and **Sync=In**, quantized functions align with the external clock's timing.
* **Sub-Cycle Precision**:
  * The **8ths/Cycle** parameter determines the granularity of sub-cycle quantization.

⠀This guide provides a detailed breakdown of the **Quantize** parameter for **Overdub**, including its options, visibility conditions, and behavior during cycling.
### Multiply / LoopCopy Parameter Details
**How many options are available for this parameter?**
* **LoopCopy**: 3 options

⠀**List all available options/values for this parameter, in order:**
**1** **Off (OFF)**: No automatic copying occurs when switching to a reset loop.
**2** **Timing (ti)**: Copies the timing (cycle length) of the current loop into the next reset loop.
**3** **Sound (Snd)**: Copies the audio content of the current loop into the next reset loop.

⠀**Are any options hidden, conditional, or only visible in certain modes?**
* **LoopCopy** options are always visible and selectable.
* However, **LoopCopy** only applies when switching into a reset loop.

⠀**Any special notes about cycling, wrapping, or how the options behave?**
* **Off (OFF)** is the default setting.
* Pressing the **Multiply (LoopCopy)** button cycles through the three options in order (**Off → Timing → Sound → Off**).
**1** **Off (OFF)**:
	* No automatic copying occurs when switching to a reset loop.
	* Useful for creating entirely new loops without inheriting timing or audio from the previous loop.
**2** **Timing (ti)**:
	* Copies the cycle length of the current loop into the next reset loop.
	* Works like an **Insert** operation, allowing the new loop to inherit the timing structure of the previous loop.
	* Any new material played during the copy is added to the new loop.
**3** **Sound (Snd)**:
	* Copies the audio content of the current loop into the next reset loop.
	* Works like a **Multiply** operation, allowing the new loop to inherit the audio content of the previous loop.
	* Any new material played during the copy is overdubbed onto the new loop.
* **Interaction with AutoRecord**:
  * If **AutoRecord=On** and **LoopCopy** is not set to **Off**, **LoopCopy** takes precedence, and the Echoplex behaves as if **AutoRecord=Off**.
* **Manual Copying**:
  * LoopCopy can also be manually triggered using **Multiply**, **Insert**, or **Overdub** as alternate endings to a **NextLoop** press when **SwitchQuant=On**.
* **Caution**:
  * LoopCopy erases the existing contents of the next loop.

⠀This guide provides a detailed breakdown of the **LoopCopy** parameter for **Multiply**, including its options, visibility conditions, and behavior during cycling.
### Multiply / Source Parameter Details
**How many options are available for this parameter?**
* **Source #**: 100 options

⠀**List all available options/values for this parameter, in order:**
* Values range from **0** to **99**.

⠀**Are any options hidden, conditional, or only visible in certain modes?**
* **Source #** is always visible and selectable.
* It is only relevant when using MIDI to control the Echoplex.

⠀**Any special notes about cycling, wrapping, or how the options behave?**
* **36** is the default setting.
* **Source #** determines the starting MIDI note or controller number for MIDI control of Echoplex operations.
* All buttons and functions are assigned to notes or controllers based on this parameter value.
* If **ControlSource=Notes**, the MIDI note corresponding to **Source #** triggers the first function (e.g., Record).
* If **ControlSource=Controllers**, the MIDI controller corresponding to **Source #** triggers the first function.
* Functions are mapped sequentially based on the **Source #** value. For example:
  * If **Source #=36**, then:
    * **Note 36** triggers Record.
    * **Note 37** triggers Overdub.
    * **Note 38** triggers Multiply.
    * And so on.
* **Cycling Behavior**:
  * The **Feedback Knob** acts as a **DataWheel** during parameter editing, allowing quick adjustment of the **Source #** value.
* **MIDI Compatibility**:
  * Ensure the **Source #** value aligns with your MIDI controller or sequencer setup for seamless operation.
* **Global Parameter**:
  * **Source #** is a global parameter and is not affected by Presets.

⠀This guide provides a detailed breakdown of the **Source #** parameter for **Multiply**, including its options, visibility conditions, and behavior during cycling.
### Multiply / 8ths/Cycle Parameter Details
**How many options are available for this parameter?**
* **8ths/Cycle**: 99 options

⠀**List all available options/values for this parameter, in order:**
* Values range from **1** to **96**, **128**, and **256**.
* The most common values appear first for easier selection:
  * **8, 4, 2, 6, 12, 16, 32, 64, 128, 256**, followed by **1, 2, 3...96**.

⠀**Are any options hidden, conditional, or only visible in certain modes?**
* **8ths/Cycle** is always visible and selectable.
* It is only relevant when synchronizing with MIDI or using rhythmic subdivisions for quantized functions.

⠀**Any special notes about cycling, wrapping, or how the options behave?**
* **8** is the default setting.
* **8ths/Cycle** determines the number of 8th notes that make up each cycle.
* It is used for synchronization with MIDI clocks or for quantizing functions like Multiply, Insert, and Reverse.
* When synchronizing with MIDI, **8ths/Cycle** defines the rhythmic subdivision of the loop based on incoming MIDI clock signals.
* For example:
  * **8ths/Cycle=8**: Each cycle is one measure long (8 eighth notes).
  * **8ths/Cycle=16**: Each cycle is two measures long (16 eighth notes).
* The **Feedback Knob** acts as a **DataWheel** during parameter editing, allowing quick adjustment of the **8ths/Cycle** value.
* The knob resolution is limited to **54** for easier selection of common values. To access values between **54** and **96**, use the front panel button to increment further.
* **Long Press Reset**:
  * A long press while editing **8ths/Cycle** resets the value to the default (**8**).
* **Quantized Changes**:
  * Changes to **8ths/Cycle** are activated only at the next loop StartPoint after exiting Parameter Editing mode. This ensures smooth transitions into new time signatures.
* **MIDI Clock Limits**:
  * The Echoplex can transmit MIDI clocks up to approximately **400 BPM**. Short loops with high **8ths/Cycle** values may exceed this limit, and MIDI clocks will not be transmitted.

⠀This guide provides a detailed breakdown of the **8ths/Cycle** parameter for **Multiply**, including its options, visibility conditions, and behavior during cycling.
### Ins/Rev / SwitchQuant Parameter Details
**How many options are available for this parameter?**
* **SwitchQuant**: 6 options

⠀**List all available options/values for this parameter, in order:**
**1** **Off** (OFF)
**2** **Confirm** (CnF)
**3** **Cycle** (CYC)
**4** **ConfirmCycle** (CCY)
**5** **Loop** (LOP)
**6** **ConfirmLoop** (CLP)

⠀**Are any options hidden, conditional, or only visible in certain modes?**
* **SwitchQuant** is always visible and selectable.
* It is only relevant when using multiple loops (set via the **MoreLoops** parameter).

⠀**Any special notes about cycling, wrapping, or how the options behave?**
* **Off** (OFF)
* **SwitchQuant** determines when the switch to the next loop occurs after pressing the **NextLoop** button or receiving a MIDI LoopTrigger.
* Options define whether the switch happens immediately, at the end of the current cycle or loop, or after a confirming action.
**1** **Off (OFF)**:
	* Loop switches immediately when **NextLoop** is pressed.
	* No quantization is applied.
**2** **Confirm (CnF)**:
	* Loop switches only after a confirming action (e.g., pressing **Undo** or another function button).
	* During the waiting period, you can select a different loop without switching immediately.
**3** **Cycle (CYC)**:
	* Loop switches at the end of the current cycle.
	* You can select a different loop or arm a function to execute in the new loop during the waiting period.
**4** **ConfirmCycle (CCY)**:
	* Combines **Confirm** and **Cycle** behaviors.
	* After a confirming action, the loop switch is quantized to the next cycle point.
**5** **Loop (LOP)**:
	* Loop switches at the end of the current loop.
	* Useful for maintaining rhythm when loops have multiple cycles.
**6** **ConfirmLoop (CLP)**:
	* Combines **Confirm** and **Loop** behaviors.
	* After a confirming action, the loop switch is quantized to the next loop StartPoint.
* The **Feedback Knob** acts as a **DataWheel** during parameter editing, allowing quick adjustment of the **SwitchQuant** value.
* **Quantize Period**:
  * During the quantize period (waiting for the switch), the **LoopTime Display** shows the destination loop (e.g., "L 1", "L 2").
  * Additional presses of **NextLoop** or MIDI LoopTriggers update the display to reflect the target loop.
* **Alternate Functions**:
  * During the quantize period, pressing buttons like **Multiply**, **Insert**, or **Record** can execute alternate functions in the new loop (e.g., **LoopCopy**, **TimeCopy**, or recording).

⠀This guide provides a detailed breakdown of the **SwitchQuant** parameter for **Ins/Rev**, including its options, visibility conditions, and behavior during cycling.
### Ins/Rev / VolumeCont Parameter Details
**How many options are available for this parameter?**
* **VolumeCont**: 99 options

⠀**List all available options/values for this parameter, in order:**
* Values range from **1** to **99**.

⠀**Are any options hidden, conditional, or only visible in certain modes?**
* **VolumeCont** is always visible and selectable.
* It is only relevant when controlling the **Loop Output Volume** via MIDI Continuous Controller messages.

⠀**Any special notes about cycling, wrapping, or how the options behave?**
* **7**
* **VolumeCont** determines which MIDI Continuous Controller (CC) will control the **Loop Output Volume**.
* Only MIDI CC messages on the channel specified by the **Channel** parameter are recognized.
* The **Feedback Knob** acts as a **DataWheel** during parameter editing, allowing quick adjustment of the **VolumeCont** value.
* The knob smoothly cycles through all 99 options without wrapping.
* **MIDI Control**:
  * Incoming MIDI CC messages can dynamically adjust the loop output volume.
  * This does not affect the direct signal, only the loop playback volume.

⠀This guide provides a detailed breakdown of the **VolumeCont** parameter for **Ins/Rev**, including its options, visibility conditions, and behavior during cycling.
### Ins/Rev / InsertMode Parameter Details
**How many options are available for this parameter?**
* **InsertMode**: 7 options

⠀**List all available options/values for this parameter, in order:**
**1** **Rehearse** (rhr)
**2** **Replace** (rPL)
**3** **Substitute** (Sub)
**4** **HalfSpeed** (h.SP)
**5** **Reverse** (rEV)
**6** **Insert** (InS)
**7** **Sustain** (SUS)

⠀**Are any options hidden, conditional, or only visible in certain modes?**
* **InsertMode** is always visible and selectable.
* The behavior of the **Insert** button changes based on the selected **InsertMode** value.

⠀**Any special notes about cycling, wrapping, or how the options behave?**
* **Rehearse** (rhr)
* **InsertMode** redefines the function of the **Insert** button, allowing it to perform different operations depending on the selected mode.
**1** **Rehearse (rhr)**:
	* Allows you to practice a part before committing it to the loop.
	* The cycle plays back once, and new audio is fed into the loop.
**2** **Replace (rPL)**:
	* Replaces a segment of the loop with new material while maintaining the overall loop length.
**3** **Substitute (Sub)**:
	* Replaces a section of the loop, but the original loop continues playing while the new material is added.
**4** **HalfSpeed (h.SP)**:
	* Plays the loop at half speed, lowering the pitch by an octave.
	* Pressing **Insert** again returns the loop to full speed.
**5** **Reverse (rEV)**:
	* Plays the loop backward.
	* Pressing **Insert** again toggles back to forward playback.
**6** **Insert (InS)**:
	* Inserts cycles into the loop, extending its length.
**7** **Sustain (SUS)**:
	* Turns **Insert** into an unrounded function with sustain action.
	* The function starts when the button is pressed and ends immediately when released.
* The **Feedback Knob** acts as a **DataWheel** during parameter editing, allowing quick adjustment of the **InsertMode** value.
* The knob cycles through all 7 options without wrapping.
* **InsertMode** affects both the **Insert** button and MIDI commands related to **Insert**.
* Each mode offers unique functionality, making it versatile for different looping techniques.

⠀This guide provides a detailed breakdown of the **InsertMode** parameter for **Ins/Rev**, including its options, visibility conditions, and behavior during cycling.
### HalfSpeed Playback and Differences Between Insert Reverse and Undo Reverse
**HalfSpeed Playback**
* **What It Does**:
  * Plays the loop at **half speed**, lowering the pitch by an octave and doubling the loop length.
  * Useful for creating slower, deeper textures or experimenting with pitch and timing.
* **How to Access HalfSpeed**:
  **1** **Set InsertMode to HalfSpeed (h.SP)**:
  * Navigate to the **InsertMode** parameter in the **Switches Row** of the **Parameter Matrix**.
  * Press the **Parameter** button until the **Switches LED** is lit and the **Multiple Display** shows "P2."
  * Press the **Insert** button repeatedly until the **LoopTime Display** shows "h.SP."
  **2** **Use the Insert Button**:
  * Press the **Insert** button to toggle HalfSpeed playback:
  * **Press once**: The loop plays at half speed.
  * **Press again**: The loop returns to full speed.
* **Special Notes**:
  * **Sound Quality**: Audio quality is slightly reduced during HalfSpeed due to the lower sampling rate.
  * **Overdub Compatibility**: You can overdub while in HalfSpeed, and the overdubbed material will play at normal speed when toggled back to FullSpeed.

⠀**Difference Between Insert Reverse and Undo Reverse**
**1** **Insert Reverse**:
	* **How It Works**:
		* When **InsertMode** is set to **Reverse (rEV)**, pressing the **Insert** button toggles the loop playback direction.
		* **Press once**: The loop plays backward.
		* **Press again**: The loop returns to forward playback.
	* **Use Case**:
		* Ideal for live manipulation of loop playback direction during performances.
		* Allows you to toggle between forward and reverse playback seamlessly.
**2** **Undo Reverse**:
	* **How It Works**:
		* Pressing **Undo** while the loop is in reverse cancels the reverse playback and restores the loop to its previous state.
		* Undo can also remove overdubs or changes made while the loop was in reverse.
	* **Use Case**:
		* Useful for recovering from accidental reverse playback or removing changes made during reverse playback.
		* Cannot toggle playback direction like Insert Reverse.

⠀**Key Differences****:**
| **Feature** | **Insert Reverse** | **Undo Reverse** |
|:-:|:-:|:-:|
| **Purpose** | Toggles playback direction (forward/reverse). | Cancels reverse playback and restores the loop. |
| **Access** | Requires **InsertMode = Reverse (rEV)**. | Available anytime during reverse playback. |
| **Live Manipulation** | Designed for real-time performance effects. | Designed for recovery or undoing changes. |
| **Behavior** | Loop continues playing in reverse or forward. | Restores the loop to its previous state. |
**Summary**
* **HalfSpeed**: Slows down the loop and lowers pitch by an octave, accessible via **InsertMode = HalfSpeed**.
* **Insert Reverse**: Toggles playback direction for creative live effects.
* **Undo Reverse**: Cancels reverse playback and restores the loop, primarily for recovery purposes.
### Ins/Rev / Sync Parameter Overview
**1. How Many Options Are Available?**
* The **Sync** parameter has **4 options**.

⠀**2. List of All Available Options/Values (in order):**
**1** **Off (OFF)**: No synchronization signals are received or sent.
**2** **Out (OUT)**: Sends MIDI clocks, StartSong, and StopSong messages automatically.
**3** **OutUserStart (OuS)**: Sends MIDI clocks but requires manual commands to send StartSong and StopSong messages.
**4** **In (IN)**: Receives MIDI clocks, StartSong, StopSong, and Continue messages from external devices.

⠀**3. Are Any Options Hidden, Conditional, or Only Visible in Certain Modes?**
* **Hidden/Conditional Behavior**:
  * The **Sync=In** option is only meaningful when an external clock source is connected to the MIDI In port or BeatSync jack.
  * **Sync=OutUserStart (OuS)** is useful for manual control of StartSong and StopSong messages, but requires user intervention to send these commands.

⠀**4. Special Notes About Cycling, Wrapping, or Behavior:**
* **Cycling Through Options**:
  * The options cycle sequentially when pressing the corresponding button in the **Timing Row** of the **Parameter Matrix**.
  * After reaching the last option (**In**), the parameter wraps back to the first option (**Off**).
* **Behavior Notes**:
  * **Sync=Off**:
    * No synchronization occurs, and MIDI clocks are ignored.
    * Useful for standalone operation without external sync.
  * **Sync=Out**:
    * Automatically sends MIDI clocks based on the loop's cycle length and the **8ths/Cycle** parameter.
    * Sends StartSong and StopSong messages automatically during certain actions (e.g., recording loops).
  * **Sync=OutUserStart (OuS)**:
    * Allows manual control over StartSong and StopSong messages.
    * Useful for scenarios where you want to control when external sequencers or drum machines start and stop.
  * **Sync=In**:
    * Receives MIDI clocks and aligns the loop's cycle length to the external clock.
    * Allows synchronized recording and playback with external devices.

⠀**Special Notes About Sync Behavior****:**
* **Quantized Sync**:
  * When **Quantize** is enabled, sync-related actions (e.g., recording, playback) are aligned to the external clock's cycle points.
* **Unquantized Sync**:
  * When **Quantize=Off**, sync actions can start immediately but still round off to match the external clock's cycle length.
* **BeatSync and BrotherSync**:
  * Sync=In can also use pulses from the BeatSync jack or BrotherSync connection for synchronization.

⠀Summary
* **Options**: 4 (Off, Out, OutUserStart, In).
* **Hidden/Conditional**: Sync=In requires an external clock source; Sync=OutUserStart requires manual commands.
* **Cycling**: Options wrap back to the first after the last.
* **Behavior**: Each option serves specific synchronization needs, from standalone operation to tight integration with external devices.
### Ins/Rev / Sync Parameter Overview
**1. How Many Options Are Available?**
* The **Sync** parameter has **4 options**.

⠀**2. List of All Available Options/Values (in order):**
**1** **Off (OFF)**: No synchronization signals are received or sent.
**2** **Out (OUT)**: Sends MIDI clocks, StartSong, and StopSong messages automatically.
**3** **OutUserStart (OuS)**: Sends MIDI clocks but requires manual commands to send StartSong and StopSong messages.
**4** **In (IN)**: Receives MIDI clocks, StartSong, StopSong, and Continue messages from external devices.

⠀**3. Are Any Options Hidden, Conditional, or Only Visible in Certain Modes?**
* **Hidden/Conditional Behavior**:
  * The **Sync=In** option is only meaningful when an external clock source is connected to the MIDI In port or BeatSync jack.
  * **Sync=OutUserStart (OuS)** is useful for manual control of StartSong and StopSong messages, but requires user intervention to send these commands.

⠀**4. Special Notes About Cycling, Wrapping, or Behavior:**
* **Cycling Through Options**:
  * The options cycle sequentially when pressing the corresponding button in the **Timing Row** of the **Parameter Matrix**.
  * After reaching the last option (**In**), the parameter wraps back to the first option (**Off**).
* **Behavior Notes**:
  * **Sync=Off**:
    * No synchronization occurs, and MIDI clocks are ignored.
    * Useful for standalone operation without external sync.
  * **Sync=Out**:
    * Automatically sends MIDI clocks based on the loop's cycle length and the **8ths/Cycle** parameter.
    * Sends StartSong and StopSong messages automatically during certain actions (e.g., recording loops).
  * **Sync=OutUserStart (OuS)**:
    * Allows manual control over StartSong and StopSong messages.
    * Useful for scenarios where you want to control when external sequencers or drum machines start and stop.
  * **Sync=In**:
    * Receives MIDI clocks and aligns the loop's cycle length to the external clock.
    * Allows synchronized recording and playback with external devices.

⠀**Special Notes About Sync Behavior****:**
* **Quantized Sync**:
  * When **Quantize** is enabled, sync-related actions (e.g., recording, playback) are aligned to the external clock's cycle points.
* **Unquantized Sync**:
  * When **Quantize=Off**, sync actions can start immediately but still round off to match the external clock's cycle length.
* **BeatSync and BrotherSync**:
  * Sync=In can also use pulses from the BeatSync jack or BrotherSync connection for synchronization.

⠀Summary
* **Options**: 4 (Off, Out, OutUserStart, In).
* **Hidden/Conditional**: Sync=In requires an external clock source; Sync=OutUserStart requires manual commands.
* **Cycling**: Options wrap back to the first after the last.
* **Behavior**: Each option serves specific synchronization needs, from standalone operation to tight integration with external devices.
### Ins/Rev / Sync Parameter Overview
**1. How Many Options Are Available?**
* The **Sync** parameter has **4 options**.

⠀**2. List of All Available Options/Values (in order):**
**1** **Off (OFF)**: No synchronization signals are received or sent.
**2** **Out (OUT)**: Sends MIDI clocks, StartSong, and StopSong messages automatically.
**3** **OutUserStart (OuS)**: Sends MIDI clocks but requires manual commands to send StartSong and StopSong messages.
**4** **In (IN)**: Receives MIDI clocks, StartSong, StopSong, and Continue messages from external devices.

⠀**3. Are Any Options Hidden, Conditional, or Only Visible in Certain Modes?**
* **Hidden/Conditional Behavior**:
  * The **Sync=In** option is only meaningful when an external clock source is connected to the MIDI In port or BeatSync jack.
  * **Sync=OutUserStart (OuS)** is useful for manual control of StartSong and StopSong messages, but requires user intervention to send these commands.

⠀**4. Special Notes About Cycling, Wrapping, or Behavior:**
* **Cycling Through Options**:
  * The options cycle sequentially when pressing the corresponding button in the **Timing Row** of the **Parameter Matrix**.
  * After reaching the last option (**In**), the parameter wraps back to the first option (**Off**).
* **Behavior Notes**:
  * **Sync=Off**:
    * No synchronization occurs, and MIDI clocks are ignored.
    * Useful for standalone operation without external sync.
  * **Sync=Out**:
    * Automatically sends MIDI clocks based on the loop's cycle length and the **8ths/Cycle** parameter.
    * Sends StartSong and StopSong messages automatically during certain actions (e.g., recording loops).
  * **Sync=OutUserStart (OuS)**:
    * Allows manual control over StartSong and StopSong messages.
    * Useful for scenarios where you want to control when external sequencers or drum machines start and stop.
  * **Sync=In**:
    * Receives MIDI clocks and aligns the loop's cycle length to the external clock.
    * Allows synchronized recording and playback with external devices.

⠀**Special Notes About Sync Behavior****:**
* **Quantized Sync**:
  * When **Quantize** is enabled, sync-related actions (e.g., recording, playback) are aligned to the external clock's cycle points.
* **Unquantized Sync**:
  * When **Quantize=Off**, sync actions can start immediately but still round off to match the external clock's cycle length.
* **BeatSync and BrotherSync**:
  * Sync=In can also use pulses from the BeatSync jack or BrotherSync connection for synchronization.

⠀Summary
* **Options**: 4 (Off, Out, OutUserStart, In).
* **Hidden/Conditional**: Sync=In requires an external clock source; Sync=OutUserStart requires manual commands.
* **Cycling**: Options wrap back to the first after the last.
* **Behavior**: Each option serves specific synchronization needs, from standalone operation to tight integration with external devices.
### HalfSpeed Playback and Differences Between Insert Reverse and Undo Reverse
**HalfSpeed Playback**
* **What It Does**:
  * Plays the loop at **half speed**, lowering the pitch by an octave and doubling the loop length.
  * Useful for creating slower, deeper textures or experimenting with pitch and timing.
* **How to Access HalfSpeed**:
  **1** **Set InsertMode to HalfSpeed (h.SP)**:
  * Navigate to the **InsertMode** parameter in the **Switches Row** of the **Parameter Matrix**.
  * Press the **Parameter** button until the **Switches LED** is lit and the **Multiple Display** shows "P2."
  * Press the **Insert** button repeatedly until the **LoopTime Display** shows "h.SP."
  **2** **Use the Insert Button**:
  * Press the **Insert** button to toggle HalfSpeed playback:
  * **Press once**: The loop plays at half speed.
  * **Press again**: The loop returns to full speed.
* **Special Notes**:
  * **Sound Quality**: Audio quality is slightly reduced during HalfSpeed due to the lower sampling rate.
  * **Overdub Compatibility**: You can overdub while in HalfSpeed, and the overdubbed material will play at normal speed when toggled back to FullSpeed.

⠀**Difference Between Insert Reverse and Undo Reverse**
**1** **Insert Reverse**:
	* **How It Works**:
		* When **InsertMode** is set to **Reverse (rEV)**, pressing the **Insert** button toggles the loop playback direction.
		* **Press once**: The loop plays backward.
		* **Press again**: The loop returns to forward playback.
	* **Use Case**:
		* Ideal for live manipulation of loop playback direction during performances.
		* Allows you to toggle between forward and reverse playback seamlessly.
**2** **Undo Reverse**:
	* **How It Works**:
		* Pressing **Undo** while the loop is in reverse cancels the reverse playback and restores the loop to its previous state.
		* Undo can also remove overdubs or changes made while the loop was in reverse.
	* **Use Case**:
		* Useful for recovering from accidental reverse playback or removing changes made during reverse playback.
		* Cannot toggle playback direction like Insert Reverse.

⠀**Key Differences****:**
| **Feature** | **Insert Reverse** | **Undo Reverse** |
|:-:|:-:|:-:|
| **Purpose** | Toggles playback direction (forward/reverse). | Cancels reverse playback and restores the loop. |
| **Access** | Requires **InsertMode = Reverse (rEV)**. | Available anytime during reverse playback. |
| **Live Manipulation** | Designed for real-time performance effects. | Designed for recovery or undoing changes. |
| **Behavior** | Loop continues playing in reverse or forward. | Restores the loop to its previous state. |
**Summary**
* **HalfSpeed**: Slows down the loop and lowers pitch by an octave, accessible via **InsertMode = HalfSpeed**.
* **Insert Reverse**: Toggles playback direction for creative live effects.
* **Undo Reverse**: Cancels reverse playback and restores the loop, primarily for recovery purposes.
### MuteMode Parameter Overview:
**Number of Options:** MuteMode has **2 options**.
**Available Options/Values (in order):**
**1** **Continuous (Cnt)**
	* The loop continues counting even when muted. When unmuted, playback resumes from wherever the loop happens to be at that time.
	* Useful for silencing the loop temporarily while keeping it in sync with other musicians or devices.
**2** **Start (StA)** 
	* Playback always restarts at the beginning of the loop when unmuted.
	* Useful for solo playing or when precise alignment with the loop's start is needed.

⠀**Hidden, Conditional, or Mode-Specific Behavior:**
* MuteMode affects how the loop behaves when unmuted, but it does not have hidden or conditional options.
* The Undo button provides an alternate way to unmute the loop, using the opposite behavior of the current MuteMode setting. For example:
  * If MuteMode = Start, Undo behaves as if MuteMode = Continuous.
  * If MuteMode = Continuous, Undo behaves as if MuteMode = Start.

⠀**Special Notes on Cycling or Wrapping:**
* MuteMode does not cycle or wrap through options. It is set explicitly via the Parameter Matrix under the Switches Row.
* Quantize settings can influence the timing of unmuting when MuteMode = Start. If Quantize = On, unmuting will wait until the end of the current cycle.

⠀**Additional Notes:**
* MuteMode is particularly useful for managing loop playback in live performance scenarios, allowing flexibility in how loops are reintroduced after being muted.
* The Mute button can also be used for stuttering effects when combined with other functions like Insert or Multiply.

⠀See also: **Mute**, **Undo**, **Quantize**.
### MuteMode Parameter
**Options Available:**
MuteMode has **2 options**:
**1** **Continuous (Cnt)**
**2** **Start (StA)**

⠀**List of Available Options/Values:
1** **Continuous (Cnt)**: The loop continues counting even when muted. When unmuted, playback resumes from wherever the loop is at that moment.
**2** **Start (StA)**: Playback always restarts at the beginning of the loop when unmuted.

⠀**Hidden, Conditional, or Mode-Specific Options:**
No options are hidden or conditional. Both options are always visible and selectable.
**Special Notes:**
* **Undo Behavior**: Undo takes the opposite viewpoint of the MuteMode setting. For example:
  * If MuteMode=Start, Undo behaves as if MuteMode=Continuous.
  * If MuteMode=Continuous, Undo behaves as if MuteMode=Start.
* **Quantize Interaction**: When MuteMode=Start and Quantize=On, unmuting waits until the end of the current cycle before restarting playback.
* **Cycling/Behavior**: The options do not cycle or wrap. You must explicitly select the desired mode.

⠀LoopTrig Parameter
**Options Available:**
LoopTrig has **128 options** (MIDI note numbers ranging from 0 to 127).
**List of Available Options/Values:**
* Each value corresponds to a MIDI note number, starting from **0** (lowest note) to **127** (highest note).
* The default value is **84**, which corresponds to MIDI note C5 or C6 (depending on the sequencer).

⠀**Hidden, Conditional, or Mode-Specific Options:**
* LoopTrig is only relevant when **MoreLoops** is set to a value greater than 1.
* The parameter determines the MIDI note number that triggers Loop 1. Subsequent loops are triggered by successive note numbers (e.g., Loop 2 = LoopTrig+1, Loop 3 = LoopTrig+2, etc. ).

⠀**Special Notes:**
* **Velocity Interaction**: If the **Velocity** parameter is set to On, the velocity of the incoming MIDI NoteOn message affects the playback volume of the triggered loop.
* **SamplerStyle Interaction**: The behavior of triggered loops depends on the **SamplerStyle** parameter (e.g., Run, Once, Start, Attack).
* **Cycling/Behavior**: The values do not cycle or wrap. You must explicitly set the desired MIDI note number.

⠀Let me know if you need further clarification!
### MuteMode Parameter
**Options Available:**
MuteMode has **2 options**:
**1** **Continuous (Cnt)**
**2** **Start (StA)**

⠀**List of Available Options/Values:
1** **Continuous (Cnt)**: The loop continues counting even when muted. When unmuted, playback resumes from wherever the loop is at that moment.
**2** **Start (StA)**: Playback always restarts at the beginning of the loop when unmuted.

⠀**Hidden, Conditional, or Mode-Specific Options:**
No options are hidden or conditional. Both options are always visible and selectable.
**Special Notes:**
* **Undo Behavior**: Undo takes the opposite viewpoint of the MuteMode setting. For example:
  * If MuteMode=Start, Undo behaves as if MuteMode=Continuous.
  * If MuteMode=Continuous, Undo behaves as if MuteMode=Start.
* **Quantize Interaction**: When MuteMode=Start and Quantize=On, unmuting waits until the end of the current cycle before restarting playback.
* **Cycling/Behavior**: The options do not cycle or wrap. You must explicitly select the desired mode.

⠀Let me know if you need further clarification!
### Threshold Parameter
**Options Available:**
Threshold has **9 options**:
**1** **0**
**2** **1**
**3** **2**
**4** **3**
**5** **4**
**6** **5**
**7** **6**
**8** **7**
**9** **8**

⠀**List of Available Options/Values:**
* **0**: Recording starts immediately when the Record button is pressed, without waiting for an audio signal.
* **1-8**: Recording waits until the input audio signal exceeds the set threshold level. Each successive number represents a 6dB increase in the volume required to trigger recording:
  * **1**: Very sensitive (low threshold).
  * **8**: Requires a very loud signal (high threshold).

⠀**Hidden, Conditional, or Mode-Specific Options:**
No options are hidden or conditional. All values are always visible and selectable.
**Special Notes:**
* **Cycling/Behavior**: The values do not cycle or wrap. You must explicitly select the desired threshold level.
* **Waiting State**: When a non-zero threshold is set, the LoopTime Display shows "ooo" while waiting for the input signal to exceed the threshold and start recording.
* **Use Case**: Threshold is useful for hands-free operation or when recording loops triggered by specific audio events.
### Velocity Parameter
**Options Available:**
Velocity has **2 options**:
**1** **Off (OFF)**
**2** **On (On)**

⠀**List of Available Options/Values:
1** **Off (OFF)**: Loops triggered by MIDI NoteOn messages play back at full volume, regardless of the velocity value in the MIDI message.
**2** **On (On)**: Loops triggered by MIDI NoteOn messages have their playback volume scaled according to the velocity value in the MIDI message:
	* **Velocity 127**: Full volume.
	* **Velocity 1**: Very quiet or potentially inaudible.

⠀**Hidden, Conditional, or Mode-Specific Options:**
No options are hidden or conditional. Both values are always visible and selectable.
**Special Notes:**
* **Cycling/Behavior**: The options do not cycle or wrap. You must explicitly select the desired mode.
* **Use Case**: Velocity=On is particularly useful when using MIDI controllers to dynamically control loop playback volume based on performance intensity.

⠀Let me know if you need further clarification!
### Dump Parameter
**Options Available:**
Dump is an **Immediate Action** parameter and does not have multiple selectable options. It is a single-action command.
**List of Available Options/Values:**
* **Dump**: Sends the contents of the current loop in MIDI Sample Dump format to the MIDI Out port.

⠀**Hidden, Conditional, or Mode-Specific Options:**
* **Conditional Visibility**: The Dump function is only accessible in **Parameter Editing Mode** under the **MIDI Row (P3)** of the Parameter Matrix. It is not visible or usable in Play Mode.
* **Mode-Specific Behavior**: Dump requires a connected MIDI device capable of receiving MIDI Sample Dump data. If no device is connected, the action will not have any effect.

⠀**Special Notes:**
* **Cycling/Behavior**: Since Dump is a single-action command, there is no cycling or wrapping behavior.
* **Abort Option**: You can abort the dump process by pressing the **Parameter Button** while the dump is in progress.
* **Transmission Time**: MIDI Sample Dump is slow, and the transmission time depends on the loop length and whether the receiving device acknowledges packets (closed loop is faster than open loop).
* **Default Settings**: The device ID is set to **1**, and the sample number corresponds to the loop number.

⠀Let me know if you need further clarification!
### Overflow Parameter
**Options Available:**
Overflow has **2 options**:
**1** **Stop (StP)**
**2** **Play (PLY)**

⠀**List of Available Options/Values:
1** **Stop (StP)**: If the memory capacity is exceeded during a **Record** operation, the recording is immediately canceled, and the current loop is reset (erased).
**2** **Play (PLY)**: If the memory capacity is exceeded during a **Record** operation, the cycle length is set to the maximum available memory. The loop will include everything recorded up to the memory limit, while any audio played after the overflow point is ignored.

⠀**Hidden, Conditional, or Mode-Specific Options:**
* **Mode-Specific Visibility**: The Overflow parameter is only relevant during **Record** operations. It does not affect other functions like Multiply or Insert.
* **Always Visible**: Both options are always visible and selectable in **Parameter Editing Mode** under the **Switches Row (P2)** of the Parameter Matrix.

⠀**Special Notes:**
* **Cycling/Behavior**: The options do not cycle or wrap. You must explicitly select the desired mode.
* **Practical Use**: Overflow=Stop is recommended for rhythmic loops to avoid unexpected results, while Overflow=Play can be useful for capturing as much audio as possible within the memory limit.
* **Memory Awareness**: Users should monitor the time counter during recording to avoid overflow situations, especially when working with limited memory.

⠀Let me know if you need further clarification!
### Reverse Parameter
**Options Available:**
Reverse is an **Immediate Action** parameter and does not have multiple selectable options. It is a single-action command.
**List of Available Options/Values:**
* **Reverse**: Reverses the playback direction of the current loop, making the audio play backward.

⠀**Hidden, Conditional, or Mode-Specific Options:**
* **Conditional Visibility**: Reverse is accessible in **Play Mode** but requires specific setup:
  * It can be accessed directly by setting **InsertMode=Reverse**, which reassigns the **Insert Button** to act as the Reverse button.
  * Alternatively, Reverse can be triggered via **MIDI commands** (e.g., DirectMIDI or VirtualButtons).
  * It is indirectly accessible in **Parameter Editing Mode** under the **Timing Row (P1)** of the Parameter Matrix by pressing **Parameter** and then **Undo**.

⠀**Special Notes:**
* **Cycling/Behavior**: Reverse toggles between **Forward** and **Reverse** playback with each activation. There is no cycling or wrapping behavior.
* **Quantization**: Reverse is affected by the **Quantize** parameter:
  * If Quantize=Off, Reverse starts immediately upon pressing the button.
  * If Quantize=Cycle, Loop, or 8th, Reverse waits until the next quantization point before executing.
* **Interaction with Other Functions**:
  * **Overdub**: Overdubbed material can play forward or backward depending on the loop's current direction.
  * **Record**: Reverse can be used to end a Record operation, immediately starting playback in reverse.
  * **Multiply/Insert**: Reverse works seamlessly with loops that have multiple cycles, and the cycle count will decrement while in reverse.
* **Undo Behavior**: Undo can remove overdubs made during Reverse playback but cannot undo past the point where Reverse was engaged.

⠀Let me know if you need further clarification!
### SamplerStyle Parameter
**Options Available:**
SamplerStyle has **4 options**.
**List of Available Options/Values (in order):
1** **Run (run)**: The loop starts and plays continuously from where it was last left.
**2** **Start (StA)**: The loop triggers from the **StartPoint** and plays continuously.
**3** **Once (OnE)**: The loop triggers from the **StartPoint**, plays once, and then goes into **Mute Mode**.
**4** **Attack (Att)**: The loop triggers from the **StartPoint** and plays as long as the triggering MIDI note is held down. It stops when the note is released.

⠀**Hidden, Conditional, or Mode-Specific Options:**
* **Conditional Visibility**: SamplerStyle is primarily useful when **multiple loops** are set up using the **MoreLoops** parameter. It determines how loops are triggered via MIDI NoteOn messages or the **NextLoop** button.
* **Mode-Specific Behavior**:
  * **Attack (Att)** only makes sense when loops are triggered by MIDI NoteOn messages. When using the **NextLoop** button, it behaves like **Run** instead.
  * **Once (OnE)** has unique behavior with **NextLoop**, allowing the loop to play once and automatically return to the previous loop unless overridden by actions like Undo or Overdub.

⠀**Special Notes:**
* **Cycling/Behavior**:
  * The options do not cycle or wrap. You must explicitly select the desired mode in **Parameter Editing Mode** under the **Loops Row (P4)** of the Parameter Matrix.
* **Interaction with NextLoop**:
  * **Run**: Loops switch seamlessly and continue playing.
  * **Start**: Loops always restart from the **StartPoint** when switched.
  * **Once**: Allows improvisational control, playing a loop once before returning to the previous loop. Undo can override this behavior to stay in the new loop.
  * **Attack**: Loops behave like a MIDI-triggered sampler, playing only while the MIDI note is held.
* **MIDI Integration**: SamplerStyle works with **LoopTrig** and **Velocity** parameters to control loop triggering and playback dynamics.

⠀Let me know if you need further clarification!
x`x``x`x### Load Parameter
**Options Available:**
The **Load** parameter is an **Immediate Action** command and does not have multiple selectable options. It is a single-action function.
**List of Available Options/Values:**
* **Load**: Loads the current loop from a MIDI Sample Dump received at the MIDI In port.

⠀**Hidden, Conditional, or Mode-Specific Options:**
* **Conditional Visibility**:
  * The **Load** function is only accessible in **Parameter Editing Mode** under the **MIDI Row (P3)** of the Parameter Matrix.
  * It requires the Echoplex to be in **Upload Mode**, which is entered by pressing the **Load** button in the MIDI parameter mode.
  * While in Upload Mode, the Echoplex waits for incoming MIDI Sample Dump data and responds to Sample Dump Requests.
* **Mode-Specific Behavior**:
  * The **Load** function is only active when the Echoplex is in **Upload Mode**. During normal operation, all Sample Dump messages are ignored.

⠀**Special Notes:**
* **Cycling/Behavior**:
  * The **Load** function does not cycle or wrap. It is a one-time action triggered by pressing the **Load** button or receiving a Sample Dump Request.
* **Interaction with MIDI**:
  * The Echoplex can receive sample dumps from other devices, including samplers and sequencers, using the MIDI Sample Dump protocol.
  * Incoming samples with numbers **1–16** are stored in the corresponding loop. Samples with numbers outside this range are stored in the **current loop**.
* **Device ID**:
  * The Device ID must match between the sending and receiving devices for the Load function to work. The Echoplex supports broadcasting (Device ID = 127) to accept all incoming dumps.

⠀Let me know if you need further clarification!
### Presets Parameter
**Options Available:**
The **Presets** parameter allows access to **15 preset slots** for saving and recalling parameter setups.
**List of Available Options/Values (in order):
1** **Preset 1**
**2** **Preset 2**
**3** **Preset 3**
**4** **Preset 4**
**5** **Preset 5**
**6** **Preset 6**
**7** **Preset 7**
**8** **Preset 8**
**9** **Preset 9**
**10** **Preset 10**
**11** **Preset 11**
**12** **Preset 12**
**13** **Preset 13**
**14** **Preset 14**
**15** **Preset 15**

⠀**Hidden, Conditional, or Mode-Specific Options:**
* **Conditional Visibility**:
  * Preset selection is only available in **Reset Mode** or within the **Preset Editor** (accessed via the **Presets** parameter in the **Switches Row (P2)** of the Parameter Matrix).
  * Preset selection using the **Mute** and **Insert** buttons is **disabled** until at least one preset has been saved. This is designed to prevent accidental preset loading by new users.
  * When **InsertMode = HalfSpeed**, the **Insert** button is unavailable for scrolling through presets, as it is dedicated to toggling between **FullSpeed** and **HalfSpeed**.

⠀**Special Notes:**
* **Cycling/Behavior**:
  * Presets can be scrolled **up** using the **Mute** button and **down** using the **Insert** button while in Reset Mode.
  * The preset number is displayed on the **LoopTime Display** as "Pr #". If you stop scrolling for longer than 400ms, the selected preset is automatically loaded.
  * Preset selection does **not wrap**; reaching the first or last preset requires scrolling back in the opposite direction.
* **Behavior When Playing**:
  * If a preset is loaded while a loop is playing, the **MoreLoops** parameter from the preset is ignored to prevent accidental resetting of loops. To apply the preset's **MoreLoops** value, the current loop must first be reset.
* **Preset 0**:
  * The active playing state is referred to as **Preset 0**. Changes made during playback are stored in Preset 0 and persist after power-off. These changes can later be saved to one of the 15 preset slots.
* **Saving Presets**:
  * Presets are saved to non-volatile memory, ensuring they remain intact even after the unit is powered off.
  * Saving a preset takes approximately 400ms. Turning off the unit before the save completes may result in unexpected parameter values.

⠀Let me know if you need further clarification!
### StartPoint Parameter
**Options Available:**
The **StartPoint** parameter is an **Immediate Action** command and does not have multiple selectable options. It is a single-action function.
**List of Available Options/Values:**
* **StartPoint**: Redefines the logical starting point of the current loop to the moment the button is pressed.

⠀**Hidden, Conditional, or Mode-Specific Options:**
* **Conditional Visibility**:
  * The **StartPoint** function is accessible in **Parameter Editing Mode** under the **Timing Row (P1)** of the Parameter Matrix.
  * It can also be accessed directly during **Play Mode** by pressing the **Undo** button when the Timing Row is selected.
  * When **Sync = In** and an external clock is present, a **long press** on StartPoint executes the **QuantStartPoint** function, aligning the loop's StartPoint with the external clock's Global MIDI StartPoint.
* **Mode-Specific Behavior**:
  * The **StartPoint** function is only meaningful when a loop is recorded and playing. It has no effect in Reset Mode.

⠀**Special Notes:**
* **Cycling/Behavior**:
  * The **StartPoint** function does not cycle or wrap. It is a one-time action triggered by pressing the button.
* **Behavior with Quantization**:
  * If **Quantize = Cycle, Loop, or 8th**, the StartPoint change will wait until the next quantization point before taking effect.
  * If **Quantize = Off**, the StartPoint change occurs immediately.
* **Impact on Synchronization**:
  * Changing the StartPoint can shift the loop's alignment with external devices or other loops. This is useful for creating rhythmic variations or correcting timing issues.
  * The **QuantStartPoint** function (triggered by a long press) aligns the StartPoint with the external clock's beat 1, ensuring synchronization with external devices.
* **Visual Feedback**:
  * The **LoopTime Display** briefly shows "S.Pt" when the StartPoint is set.
  * If the StartPoint is aligned with the external clock using QuantStartPoint, the display shows "cS.P" to indicate the quantized adjustment.

⠀Let me know if you need further clarification!
# *Buttons and Row Indicator Lights*
## *P**LAY* M*ODE AND THE* R*OW* I*NDICATOR* L*IGHTS*
*The row of 8 buttons on the right side of the Echoplex Digital Pro Plus
control most operations. The leftmost button, labeled* *Parameters*
*alters the meaning of the other buttons. When none of the* *Row Indicator
Lights* *to the left of the* *Parameter Matrix* *(the printed names of all the
functions, arranged in a 4x8 grid under the buttons) are lit, then all
buttons perform their primary functions:* *Record, Overdub,
Multiply,* *etc. This state is what we call* *Play Mode**, and is probably
where you’ll spend the most time while performing. Pressing the*
*Parameter* *button several times selects each row in turn, lighting the
corresponding indicator light.
When a row indicator light is lit, then the buttons (other than*
*Parameters**) take on the meanings written in that row of the grid. For*
*2-4 Echoplex Digital Pro Plus User’s Manual*
*instance, when the* *Loops* *light is on, the* *Record* *button no longer
performs the* *Record* *function; instead, it finds a convenient phone
booth and changes into the* *MoreLoops* *button, able to increase the
number of loops with a single push. When we refer to this in the text,
we’ll utilize both button names; for example, "Press the* *Record
(MoreLoops)* *button."*
## *T**HE* P*ERSISTENCE OF* M*EMORY*
*All changes to parameters are active as soon as you make them, and
they’re stored into permanent memory when you choose a different
parameter or press the* *Parameter* *button.*
*K**EY* *P**OINT**:* *If you shut off the Echoplex Digital Pro and restart it, all your saved
parameters will remain the same (although you will lose any music that
you have in your loops).
You can reset all parameters to their factory defaults by holding down
the* *Parameters* *button when you power up.*

# *Define a Window for your loop and shift it over the audio
# stored in memory.*
*LoopWindowing* *originally started as an obscure bug in the LoopIIIv5.0
software for the Echoplex Digital Pro. People liked it so much they
insisted we not fix it, and instead turn it into a feature! The “bug” has
now been cleaned up to work predictably and in a consistent manner
with other functions. So now it really is an interesting function called*
*LoopWindowing**.*
# *U*NDERSTANDING LOOPWINDOWING
*LoopWindowing* *lets you define a short segment, or* *Window**, out of a
longer loop and let that short segment repeat as a loop. This* *Window* *is
defined on the fly, in real time.
Once you have defined a* *LoopWindow,* *you then have the ability to move
that window through the larger loop as it exists in memory. In fact, it is
more than just moving the window over the loop as it currently exists,
you really move back through the memory, through all of the changes
that have been recorded to the loop by overdubbing or multiplying or
any other functions you have used.
The* *LoopWindow* *can be moved backwards until you reach the very
initial point where the first tap of* *Record* *happened.*
*LoopWindowing* *can give a variety of interesting effects, depending on
the size of the* *Window* *and how much material is in the memory to*
*Window* *through. You can even resize the* *Window* *on the fly, to capture
different sized chunks of memory!*
# *LoopWindowing*
# *Continued*
*Reference - Functions 5-23*
# *C*REATING THE LOOPWINDOW
*The* *LoopWindow* *is created by either* *Re-Multiplying* *a loop or doing an*
*Unrounded Multiply**. Both of these are standard techniques that are are
quite useful in many cases.*
*Re-Multiplying* *is done on a loop that has already had* *Multiplies* *or* *Inserts*
*done on it, so you can see the* *Multiple* *display counting the cycles. If
you press* *Multiply* *again on this loop, and then press* *Multiply* *again
to end it somewhere well before the end of the loop, you will get a new
loop of just that section. In this case it will be neatly rounded off to the
previous cycle length. This technique allows you to chop out Cycles
from the larger loop. You may want to experiment with setting*
*Quantize=Cycle* *or* *Quantize=8th* *as a way to get rhythmically aligned*
*LoopWindows.
Unrounded Multiply* *is when you start a* *Multiply* *on a loop, and then end
it with a press of* *Record**. Instead of rounding off the cycle, it will stop
immediately and redefine the new loop length at exactly that point.*
*Unrounded Multiply* *is a great way to change rhythms by chopping out a
completely new loop lengths. Using the* *InsertMode=SUS* *function is also
an interesting way to create* *Unrounded Multiples**.
Either one of these techniques let you chop out a segment of your loop,
either maintaining rhythm or not depending on what you want to do.*
### *The resulting loop is your*LoopWindow.
# *M*OVING THE LOOPWINDOW
*Once a* *LoopWindow* *has been defined, we can move it backwards
through the loop memory by pressing* *Undo**. With each* *Undo* *press,
the* *LoopWindow* *jumps back in memory by the size of the window, and*
*5-24 Echoplex Digital Pro Plus User’s Manual*
# *LoopWindowing*
# *Continued*
*then loops over that section. You can continue moving the window
backwards to the point where the initial loop was started with the first
tap of* *Record**. If a* *Reverse* *has been done on the loop, then you can only
move it back to the point where* *Reverse* *was tapped.
Moving the* *LoopWindow* *works in the same way as* *Undo* *works, so it is
useful to understand the distinction between a* *ShortUndo* *and a*
*LongUndo**. (See the* *Undo* *section of this chapter for more discussion on*
*Undo**.) Basically, a long-press of* *Undo* *will jump you back a complete*
*LoopWindow* *length before your current window, and is the most
obvious to use. A short-press of* *Undo* *sets the LoopWindow to end at
the spot where you press it and begin a LoopWindow length before that.
For example: if you redefine the length of the* *LoopWindow* *from 8
seconds to 2 seconds, and then tap a short-press of* *Undo* *at 1.5
seconds, it is only the last .5 seconds that change in that window. The
previous 1.5 seconds of the window remain intact in the new window
after that initial* *Undo* *button press, except they will now be coming at
the end of the* *LoopWindow**. Your new loop will start .5 seconds before
the previous* *LoopWindow StartPoint**, and end at the 1.5 second point
where you tapped* *Undo**.
Using* *ShortUndo* *is more complicated to understand, but is also more
flexible. If you want to scroll through different sections of the loop
cleanly with* *ShortUndo**, press* *Undo* *right at the beginning of the
window. This way you will really jump back a whole Window length. If
you hit* *Undo* *somewhere within the boundaries of the window, you'll
find that you get a blend between different memory window sections,
with that blend happening at the exact point you hit* *Undo**. So the
timing of the* *Undo* *button press becomes a powerful tool for playing
with the distinction between window fragments. It is especially
powerful in rhythmic loops.*
# *M*ODIFYING THE LOOPWINDOW
*You can define new* *LoopWindow* *sizes at any time by doing more* *Re-
Multiplies* *or* *Unrounded Multiplies**, and then move the new* *LoopWindow*
*over the loop.*
# *LoopWindowing*
# *Continued*
*Reference - Functions 5-25*
*Once you have a* *LoopWindow* *defined, you can do any other loop
function on it that you like. For example, you can* *Overdub* *new material
onto it. Pressing* *Undo* *after that will first remove the new overdubs,
and then begin jumping backwards through memory of the larger loop.*
# *Status Indicator Lights*
*As you take the Echoplex through its paces, you’ll discover that the lights
directly under the front-panel buttons change. Here are the meanings of
these lights:*
*Unlit:* *The function is unavailable.*
*Green:* *The button is ready to perform its usual function.*
*Red:* *The button was the last pressed and its function is operating. The
button is the most likely candidate to end the function that it started.
While editing parameters, Red indicates the current parameter column
being edited.*
*Orange:* *The button is available, but will perform a function other
than its usual one—one that is especially appropriate to the current
activity or state of the Echoplex.*
# *Synchronization parameter that determines tempo based on
# Loop time.*
### *Values: 1-96, 128, 256*
*When synchronizing with MIDI,* *8ths/cycle* *determines the number of
8th-notes that make up each cycle. In order to use this feature, you must
have a device that generates or syncs to MIDI Clock messages. This
device will usually be a sequencer or drum machine. In this discussion,
we will refer to a device that generates MIDI clocks as a* *clock source**.
When editing* *8ths/cycle**, the most important values come first to make
them easy to select: 8,4,2,6,12,16,32,64,128,256, then it goes on with
1,2,3...96.
While editing* *8ths/cycle* *the* *Feedback Knob* *becomes the*
*DataWheel**, so you can use it to quickly change the value to what you
want.
Note that with the* *DataWheel* *feature, the top of the knob range ends
at 54 instead of 96. This was done because we found it was easier to set
the more typical values when the knob resolution was limited a little bit.
To reach the values between 54 and 96 you simply use the front panel
button to continue incrementing the number in the usual way.
A long-press while editing the* *8ths/cycle* *parameter returns you to the
initial value of 8.*
## *Example 4.1: Syncing to an external MIDI clock*
*1.* *Set* *8ths/Cycle=8.* *This means that each cycle will be eight eighth-notes
(one measure) long.*
*2.* *Set* *Sync=In.
3.* *Connect the* *MIDI Out* *port of a clock source to the Echoplex Digital
Pro’s* *MIDI In* *port using a standard MIDI cable.*
*4-2 Echoplex Digital Pro Plus User’s Manual*
# *8ths/Cycle*Default: 8
Parameter Row: Timing
*4.* *Make sure that your clock source is set to transmit MIDI Clocks (this
setting is usually found under a “MIDI” or “Sync” menu or function
key).*
*5.* *Reset the current loop by holding down the* *Record* *button for several
seconds.*
*6.* *Load a rhythm pattern or sequence into your clock source, set it up to
loop indefinitely, and hit Play. At the beginning of each measure, you
will see the sync LED flash on the Echoplex display.*
*7.* *The next time you hit* *Record,* *the Echoplex will wait for the beginning
of the next measure before starting the* *Record* *process**.* *You end the*
*Record* *operation by pressing the* *Record* *button a second time. Instead
of ending immediately, recording will continue until the next measure
boundary, as determined by the incoming MIDI clocks.*
*8.* *Once you’ve recorded your first cycle this way, the Echoplex continues to
monitor the clock source and maintain synchronization. However, once
the basic loop is recorded, the Echoplex will not change the timing or
playback speed of the loop to respond to changes in your clock rate.
Sequences with tempo changes in them, therefore, are not good choices
for sync sources for the Echoplex.
Another useful variation on the above theme is to reset the current loop
and briefly send MIDI clock to the Echoplex from your clock source. You
can easily do this by playing a single empty measure from a sequencer.
Once the Echoplex has received MIDI clock while in reset, it will know
to expect more. Press* *Record* *before restarting your clock source. Then,
the Echoplex will wait for the first clock pulse before recording,
displaying "ooo" in the display while it does so. This is a good way to get
the Echoplex and a sequencer to start simultaneously. Some sequencers
make this approach difficult, however, because they send out MIDI
clocks even when they’re not actively playing.*
## *Example 4.2: Syncing a drum machine or sequencer to the
## Echoplex*
*1.* *Set* *8ths/Cycle=8.* *This means that each cycle will be eight eighth-notes
(one measure) long.*
*Reference - Parameters 4-3*
# *8ths/Cycle*
# *Continued*
*2.* *Set* *Sync=Out.
3.* *Connect the* *MIDI In* *port of a sequencer or drum machine to the
Echoplex Digital Pro’s* *MIDI Out* *port using a standard MIDI cable.*
*4.* *Load a pattern or sequence into your drum machine or sequencer. Set
the clock parameter to* *Internal* *and play back the material to verify that
your MIDI and audio connections are working. Stop the device.*
*5.* *Set your drum machine or sequencer to sync to incoming MIDI Clocks.*
*6.* *Press Play on your drum machine or sequencer. It will wait for incoming
clocks before taking off.*
*7.* *Record a loop one measure long (in 4/4 time) in the Echoplex. As soon
as you press* *Record* *the second time, MIDI clocks will be transmitted.
Your drum machine or sequencer should play back in perfect sync.
If you want to sync to loops that have different lengths, set* *8ths/Cycle*
*appropriately. For instance, set* *8ths/Cycle=6* *to sync to a 3/4 time
measure, or set* *8ths/Cycle=16* *to sync to 2 4-beat measures.*
# *C*HANGING TIME SIGNATURE IN
# *R*HYTHM
*When a loop is playing and the* *8ths/Cycle* *or* *Sync* *parameters are edited,
the change of value is only activated at the first Loop* *StartPoint* *after you
come out of the* *Parameter Editing* *state. At that point you jump directly
to the new selected value. This means the value change occurs only
while back in the playing state, and only at a rhythmically sensible
point. This helps eliminate any confusion when working with a
synchronized sequencer and makes for much smoother transitions into
new time signatures.
Try changing* *8ths/Cycle* *with* *Sync = Out* *and a sequencer slaving to the
clock. You control the sequencer's tempo in relation to your loop!*
*4-4 Echoplex Digital Pro Plus User’s Manual*
# *8ths/Cycle*
# *Continued*
# *MIDI C*LOCK LIMITS
*There is a limit to how fast the Echoplex will transmit MIDI clocks—the
equivalent of about 400 beats per minute. If you create a loop that’s 1/2
a second long with* *8ths/Cycle=16,* *then that 1/2 second will represent 2
measures, or 8 beats. Since there are 120 1/2 seconds in a minute, each
with 8 beats, the effective timing would be 960 beats per second, which
isn’t very common in musical usage, and won’t be transmitted by the
Echoplex. The moral: short loops and high values of* *8ths/Cycle* *don’t
mix.
In older versions of the Echoplex hardware the* *8ths/Cycle* *parameter
was labeled* *8ths/Beat**.*
### *See Also: Sync, Quantize, Visual Tempo Guide, LoopDivide, MIDI Ports*# *Affects the behavior of the Insert button*
### *Values: Rehearse (rhr), Replace (rPL), Substitute (Sub), HalfSpeed
### (h.SP), Reverse (rEV), Insert (InS), Sustain (SUS)*
*InsertMode* *redefines the function of the* *Insert* *button so that different
functions can be available from the front panel according to your needs.
All of these functions are also available independently by MIDI.*
# *I*NSERTMODE=REHEARSE
*When used in* *Play* *mode,* *Rehearse* *has the same meaning as if*
*InsertMode=Insert**, described fully under the* *Insert* *heading.
The effect of* *InsertMode=Rehearse* *is felt when you end a* *Record* *with the*
*Insert* *button. The cycle that you’ve just recorded will be played back
exactly once, regardless of the* *feedback* *setting. The underlying timing of
the cycle will continue and any new audio played is fed into the loop. If
you play something that you really like and want to keep for more
repetitions, press* *Insert* *again immediately after you’ve played it. One
cycle’s worth of material prior to that point will be kept as the loop, and
will repeat according to the* *feedback* *setting.*
*Rehearse* *is useful for practicing an idea before keeping it as the loop.
See* *Rehearse* *in the Functions section for more information.*
# *I*NSERTMODE=INSERT
*When used in* *Play* *mode, this causes you to go into* *Insert* *mode when
the* *Insert* *button is pressed, fully described under the* *Insert* *heading in
this chapter.*# *InsertMode*
# *Continued*
*If* *InsertMode=Insert,* *pressing* *Insert* *at the end of a* *Record* *ends the
recording and immediately inserts a second cycle (as it continues
recording); in other words, it puts you into* *Insert* *mode. The insertion
continues until memory runs out or you end it with* *Insert* *or an
alternate ending for the* *Insert* *operation. This is very useful for dividing a
longer loop into multiple cycles as you record it. This can allow you to
easily set a tempo for an external sequencer when using MIDI clock out,
for example.
See* *Insert* *in the Functions section for more information.*
# *I*NSERTMODE=REPLACE
*When* *InsertMode=Replace,* *the* *Insert* *button becomes the* *Replace*
*button. Each press and release of the* *Replace* *button during* *Play* *mode
will replace a segment of the loop with new material for as long as*
*Replace* *is held down. The overall loop length is not changed.
If* *Quantize=On* *and* *Replace* *is pressed during a cycle, the function will
begin at the end of the current cycle, and will continue to the next cycle
point after* *Replace* *is released again.
When* *InsertMode=Replace* *and* *Insert* *is used as an alternate ending
during a* *Record**, the* *Record* *ends as if you’d pressed the* *Record* *button
and the Replace function immediately begins as explained above.
See* *Replace* *in the Functions section for more details.*
# *I*NSERTMODE=SUBSTITUTE
*When* *InsertMode=Substitute,* *the* *Insert* *button becomes the* *Substitute*
*button during* *Play* *mode.* *Substitute* *has some similarity to the* *Replace*
*function. However, with* *Substitute* *the original loop playback continues*
# *InsertMode*
# *Continued*
*Reference - Parameters 4-13*
*while you are playing the new material. On the next repetition, only the
new audio will remain in the loop and the old portion will be removed.
See* *Substitute* *in the Functions section for more details.*
# *I*NSERTMODE=HALFSPEED
*When* *InsertMode=HalfSpeed,* *the* *Insert* *button becomes the*
*HalfSpeed* *button during* *Play* *mode. Pressing* *HalfSpeed* *switches
the current loop an octave lower, to half speed. The* *Insert* *LED turns red
and the display says H.SP briefly. Press* *HalfSpeed* *again and the loop
returns to* *FullSpeed**. The LED turns green and F.SP is displayed for a
moment.
See* *HalfSpeed* *in the Functions section for more details.*
# *I*NSERTMODE=REVERSE
*When used in* *Play* *mode,* *Reverse* *causes the current loop to be played
backwards.
When* *InsertMode=Reverse* *and* *Insert* *is used as an alternate ending
during a* *Record**, the* *Record* *ends and reversed playback starts
immediately.
See* *Reverse* *in the Functions section for more details.*
*4-14*# *InsertMode*
# *Continued*
# *I*NSERTMODE=SUSTAIN
*InsertMode=Sustain* *changes the way the* *Insert* *and* *Multiply* *buttons
work. SUS turns* *Insert* *and* *Multiply* *into Unrounded functions with
Sustain action on the button. In other words, they start when the button
is pressed and end immediately when it is released, just like* *Record* *or*
*Overdub* *do when* *RecordMode* *or* *OverdubMode=SUS**. When the function
ends it does so as if* *Record* *had been pressed as an alternate ending to
the* *Insert**. This is what we call an* *Unrounded Multiply* *or* *Unrounded Insert**,
because instead of rounding off to the next Cycle point it is ended
immediately and the loop time is redefined.
See* *SUS Commands* *in the Functions section for more details.*
### *See also: Insert, Record, HalfSpeed, Reverse, Replace, Substitute, SUS Commands*
# *L*OOPMODE (LOOP/DELAY=LOP)
*LoopMode* *is the default setting for the* *Loop/Delay* *parameter, and is the
most common way of using the Echoplex. This is the* *InterfaceMode* *we
recommend people to start with, and most people stay with it.
In* *LoopMode* *the* *Feedback* *control is always active, whether* *Overdubbing*
*or not.* *Feedback* *is controlled by the front panel* *Feedback Knob* *if
there is no pedal inserted, or by a pedal in the* *Feedback Pedal Jack**.*
*Loop Input Volume* *and* *Loop Output Volume* *are fixed all the way on or off
depending on the function, so these are being set for you according to
what you are doing.
The following table shows how* *Feedback**,* *Loop Input Volume**, and* *Loop
Output Volume* *are set in various states.*
## *Table 4.x: LoopMode*
### *State Feedback Loop Loop*
*(Pedal/NoPedal)* Input Output
*Playing Pedal/Knob 0 100%
Overdubbing Pedal/Knob 100% 100%
Substituting 0 100% 100%
Recording NA 100% 0
Multiplying Pedal/Knob 100% 100%
Inserting 0 100% 0
Replacing 0 100% 0
Mute 100% 0 0*
# *Loop/Delay (InterfaceMode)*
# *Continued*
*Reference - Parameters 4-17*
# *D*ELAYMODE (LOOP/DELAY=dEL)
*DelayMode* *operation is like a traditional delay, and is useful for people
familiar with that style of looping. In a traditional delay, the input to the
delay line is always open and* *Feedback* *is always being applied. When a
“Hold” button is pressed, the input to the delay is closed, and the*
*Feedback* *is set to 100%.
Therefore, when the Echoplex is in* *DelayMode* *it acts much like a
traditional delay. You set (and reset) the delay time by a pair of presses
on the* *Record* *button. The* *Loop Input Volume* *is always open and*
*Feedback* *is controlled by the front panel* *Feedback Knob**. You’ll
probably want to keep the* *Feedback Knob* *set fairly low when you use
the delay function.
In* *DelayMode**, some actions have different effects than in* *LoopMode**.*
*n* *The* *Overdub* *button becomes the* *Hold* *button. When you press*
*Overdub* *the* *Feedback* *is set to 100% for infinite repeats and the* *Loop
Input Volume* *is closed so that no new material is recorded into the delay.
This is different from the* *LoopMode* *style, where* *Feedback* *is always
available to control independently of whether* *Overdub* *is on or not.*
*n* *Hold* *also works while* *Multiplying* *and while the loop is* *Muted**.*
*n* *Any pedal attached to the* *Feedback Jack* *will control the* *Loop Input
Volume* *to the delay rather than* *Feedback.* *This is useful as a way to do
volume swells into the delay line.*
*n* *Feedback* *will only be controllable with the front-panel* *Feedback
Knob**.
The following table shows how* *Feedback**,* *Loop Input Volume**, and* *Loop
Output Volume* *are set in various states.*
*4-18 Echoplex Digital Pro Plus User’s Manual*
# *Loop/Delay (InterfaceMode)*
# *Continued*
## *Table 4.x: DelayMode*
### *State Feedback Loop Loop*
*(Pedal/NoPedal)* Input Output
*Playing Knob Pedal 100%
Overdub (hold) 100% 0 100%
Substituting 0 Pedal 100%
Recording NA Pedal 0
Multiplying Knob Pedal 100%
Multiplying (hold) Knob 0 100%
Inserting 0 Pedal 0
Replacing 0 Pedal 0
Mute 100% Pedal 0
Mute (hold) 100% 0 0*
# *E*XPERTMODE (LOOP/DELAY=EXP)
*ExpertMode* *uses the pedal for* *Feedback* *during play and the front panel*
*FeedBack Knob* *for* *Feedback* *during* *Overdub, Multiply,* *and* *Substitute.*
*This allows you to have different* *Feedback* *settings between playing and
overdubbing. When there is no pedal connected to the* *Feedback
Pedal Jack**, the* *Feedback* *during play is always set to maximum
(100%).
The following table shows how* *Feedback**,* *Loop Input Volume**, and* *Loop
Output Volume* *are set in various states.*
# *Loop/Delay (InterfaceMode)*
# *Continued*
*Reference - Parameters 4-19*
## *Table 4.x: ExpertMode*
### *State Feedback Loop Loop*
*(Pedal/NoPedal)* Input Output
*Playing Pedal/100% 0 100%
Overdubbing Knob 100% 100%
Substituting 0 100% 100%
Recording NA 100% 0
Multiplying Knob/100% 100% 100%
Inserting 0 100% 0
Replacing 0 100% 0
Mute 100% 0 0
SamplePlay 100% 0 Pedal*
# *S*TUTTERMODE (LOOP/DELAY=Stu)
*StutterMode* *is just like* *LoopMode,* *except that* *Insert* *works as what we
call a* *SingleCycleMultiply**.*
*SingleCycleMultiply* *works as follows. When you have done a* *Multiply* *and
have several Cycles in a loop, pressing* *Insert* *will insert repetitions of
the next Cycle. As the inserts are made you can overdub a longer phrase
over the repetitions of the Cycle. The results will be inserted into the
loop when you press* *Insert* *again. If you press* *Undo* *instead, the loop
will return to its original form.
Using* *Insert-Undo* *like this lets you alter the flow of a loop by having
one of the Cycles* *Stutter* *in a way similar to a skipping CD, and then
return to the original. This can make very interesting results when
working with very short Cycles, and that is why it is called* *StutterMode.
4-20 Echoplex Digital Pro Plus User’s Manual*
# *Loop/Delay (InterfaceMode)*
# *Continued*
## *S**TUTTER AND* L*OOP*C*OPY*
*Stutters* *can be done into a new loop as a* *LoopCopy* *function when in*
*StutterMode.* *With multiple loops set up in* *MoreLoops**, and*
*SwitchQuant=On,* *pressing* *Next-Insert* *will do the stutter into a new
loop. Any new material you play will be overdubbed on this loop as it
stutters. And as before, you keep it with another press of* *Insert**.
Pressing* *Undo* *sends you back to where you were in the previous loop.
Copying a stutter is a good way to preserve the original loop while
making stuttered variation out of a fragment from it.*
## *M**ANAGING* M*EMORY IN* S*TUTTER*M*ODE*
*If you perform a very large number of repetitions of* *Insert* *and* *Undo*
*button presses to trigger and cancel the* *SingleCycleMultiply,* *you may
eventually notice bits of the loop being erased by the* *Undo* *presses as
well. This is a result of the way the Echoplex processes its memory. If
you're planning to do heavy* *Insert + Undo* *button combinations with*
*SingleCycleMultiply,* *you should be aware of this, and consider copying
your loop via* *NextLoop* *and* *LoopCopy* *before doing intensive* *Stutter*
*work, so you can return to the original loop fully intact if you wish.
Another trick you can do to avoid the loss of the overdubs is to first fill a
bit of memory reserve by letting the loop repeat a few times without*
*AutoUndo**. (Without the left green dot* *AutoUndo LED* *blinking.) You
can do this by reducing* *Feedback* *a little bit for a few repetitions, say to
120 – 125. That is small enough that the fading will not be obvious over a
couple of repetitions, but you will force the Echoplex to copy the loop a
few times into new memory. Obviously by doing this you lose some of
the older stuff in memory, which you will note if you later want to go
backwards with* *Undo**. The reasons why this works are very
complicated, but suffice to say that you will not find bits of your loop
disappearing when doing heavy stuttering effects!*
## *S**UBSTITUTE AND* S*TUTTER*M*ODE*
*Substitute* *gains more advanced control in* *StutterMode.* *If you have a
Pedal inserted in the* *Feedback Pedal Jack* *for* *Feedback* *control, the
pedal controls the* *Feedback* *during normal use and the knob setting is*
# *Loop/Delay (InterfaceMode)*
# *Continued*
*Reference - Parameters 4-21*
*not used. However, during* *Substitute* *the* *FeedBack Knob* *becomes
active for* *Feedback* *control. This lets you have two different* *Feedback*
*settings between normal playing and* *Substituting.* *If you do not have a
pedal inserted,* *Substitute* *operates the way it normally does in* *LoopMode*
*and has* *Feedback* *set to 0 while active. See the* *Substitute* *section to learn
more about this function.
The following table shows how* *Feedback**,* *Loop Input Volume**, and* *Loop
Output Volume* *are set in various states.*
## *Table 4.x: StutterMode*
### *State Feedback Loop Loop*
*(Pedal/NoPedal)* Input Output
*Playing Pedal/Knob 0 100%
Overdubbing Pedal/Knob 100% 100%
Substituting Knob/0 100% 100%
Recording NA 100% 0
Multiplying Pedal/Knob 100% 100%
Inserting Pedal/Knob 100% 100%
Replacing 0 100% 0
Mute 100% 0 0*
# *O*UTMODE (LOOP/DELAY=Out)
*The* *Out* *choice for the* *Loop/Delay* *parameter is only available when a
pedal is plugged into the* *Feedback Pedal Jack**. This state is identical*
*4-22 Echoplex Digital Pro Plus User’s Manual*
# *Loop/Delay (InterfaceMode)*
# *Continued*
*to normal* *LoopMode,* *except that the pedal will now control the* *Loop
Output Volume**, and* *Feedback* *will be controllable only from the front
panel* *FeedBack Knob**.
The following table shows how* *Feedback**,* *Loop Input Volume**, and* *Loop
Output Volume* *are set in various states.*
## *Table 4.x: OutMode*
### *State Feedback Loop Loop*
*(Pedal/NoPedal)* Input Output
*Playing Knob 0 Pedal
Overdubbing Knob 100% Pedal
Substituting 0 100% Pedal
Recording NA 100% 0
Multiplying Knob 100% Pedal
Inserting 0 100% 0
Replacing 0 100% 0
Mute 100% 0 0*
# *I*NPUTMODE (LOOP/DELAY=In)
*The* *In* *choice for the* *Loop/Delay* *parameter is only available when a
pedal is plugged into the* *Feedback Pedal Jack**.* *InputMode* *behaves
just like LoopMode except that the pedal controls the* *Loop Input Volume*
*in the states where the input is open. Feedback is only controlled by the*
# *Loop/Delay (InterfaceMode)*
# *Continued*
*Reference - Parameters 4-23*
*front panel* *FeedBack Knob**.* *InputMode* *does not exist without a Pedal
connected.
The following table shows how* *Feedback**,* *Loop Input Volume**, and* *Loop
Output Volume* *are set in various states.*
## *Table 4.x: InputMode*
### *State Feedback Loop Loop*
*(Pedal/NoPedal)* Input Output
*Playing Knob 0 100%
Overdubbing Knob Pedal 100%
Substituting 0 Pedal 100%
Recording NA Pedal 0
Multiplying Knob Pedal 100%
Inserting 0 Pedal 0
Replacing 0 Pedal 0
Mute 100% 0 0*
# *R*EPLACEMODE (LOOP/DELAY=rPL)
*In* *ReplaceMode* *the pedal controls* *Loop Output Volume* *and* *Feedback*
*simultaneously. The result is similar to* *LoopMode,* *except that you hear
the reduction for* *Feedback* *immediately instead of on the next loop pass.*
*ReplaceMode* *makes it easier to "sculpt" the loop using the* *Feedback*
*control. If you have* *Overdub* *on, the pedal serves as a* *Replace* *function*
*4-24 Echoplex Digital Pro Plus User’s Manual*
# *Loop/Delay (InterfaceMode)*
# *Continued*
*with smooth level control. This allows you to add new material and
smoothly drop out the loop underneath you as it is* *Overdubbed,*
*allowing for a smooth real-time* *Replace.*
*The disadvantage of* *ReplaceMode* *is that if the pedal is in the toe-up
position, the* *Loop Output Volume* *is also zero, so it is not possible to
create loops with only single repetitions.* *ReplaceMode* *is also less
interesting for any loops relying on reduced* *Feedback* *settings, since the
output is affected.*
*ReplaceMode* *does not exist without a Pedal connected to the* *Feedback
Pedal Jack**.
The following table shows how* *Feedback**,* *Loop Input Volume**, and* *Loop
Output Volume* *are set in various states.*
## *Table 4.x: ReplaceMode*
### *State Feedback Loop Loop
### Input Output*
*Playing Pedal 0 Pedal
Overdubbing Pedal 100% Pedal
Substituting Knob 100% 100%
Recording NA 100% 0
Multiplying Pedal 100% Pedal
Inserting 0 100% 0
Replacing 0 100% 0
Mute 100% 0 0*
# *Loop/Delay (InterfaceMode)*
# *Continued*
*Reference - Parameters 4-25*
# *F*L I PMODE (LOOP/DELAY=FLI)
*FlipMode* *is an unusual and interesting* *InterfaceMode,* *in that the pedal
controls both* *Loop Input Volume* *and* *Feedback* *simultaneously. The
interesting thing is that* *Feedback* *on the pedal is reversed! When the
pedal is all the way in the toe-up position, the Loop Input level is zero
and the feedback is at 100%. When the pedal is all the way in the toedown
position, the loop input is at 100%, but the feedback goes to 0.
In use this is like a* *Hold* *pedal, but with a more fluid action. You can also
think of the pedal as a “soft replace” since operating the pedal lets you
smoothly crossfade a replacement section into your loop.*
## *U**SING* F*LIP*M*ODE*
*To get the hang of* *FlipMode**, use loops of about 1 second, keep the pedal
in the toe-up position most of the time, and turn the front panel*
*FeedBack Knob* *to zero. Set the loop time with a couple presses of*
*Record**, and experiment with the pedal as you play new material.
To record an ordinary loop in* *FlipMode**, put the pedal in the toe-down
position and end* *Record* *with* *Overdub**.
In* *Overdub* *the* *Feedback* *is taken from the front panel* *FeedBack Knob*
*(which also operates in reverse!), so once you've made an interesting
loop by crossfading in Play, you can keep it by pressing* *Overdub**. You
can then* *Overdub* *onto it using the pedal to control the* *Loop Input
Volume**.
By setting the front panel* *FeedBack Knob* *you can make the* *Overdub*
*state into a simple delay, which can be used as a contrast to the unusual
crossfade effect.
Other functions interact with* *FlipMode* *as follows.*
*4-26 Echoplex Digital Pro Plus User’s Manual*
# *Loop/Delay (InterfaceMode)*
# *Continued*
*n* *Multiply* *allows you to continue to crossfade over repetitions of your
loop.*
*n* *Insert* *does a* *SingleCycleMultiply* *(as described under* *StutterMode**), so
you can* *Overdub* *onto repeats of the next Cycle in the loop. (Remember
you can hit* *Undo* *to end the* *SingleCycleMultiply* *and not keep the
stutters in the loop).*
*n* *Mute* *allows you to build up a crossfaded loop without hearing it and
then bring it in at once.*
*FlipMode* *does not exist without a Pedal connected.
The following table shows how* *Feedback**,* *Loop Input Volume**, and* *Loop
Output Volume* *are set in various states.*
## *Table 4.x: FlipMode*
### *State Feedback Loop Loop*
*(reversed)* Input Output
*Playing Pedal Pedal 100%
Overdubbing Knob Pedal 100%
Substituting 0 Pedal 100%
Recording NA Pedal 0
Multiplying Pedal Pedal 100%
Inserting Pedal Pedal 100%
Replacing 0 100% 0
Mute Pedal Pedal 0*
# *Loop/Delay (InterfaceMode)*
# *Continued*
*Reference - Parameters 4-27*
# *U*SING THE INTERFACEMODES WITH A
# *S*TEREO ECHOPLEX SETUP
*Many of the* *InterfaceModes* *require a pedal connected to the* *Feedback
Pedal Jack* *in order to be available at all, and use that pedal as a key
part of their functionality. This causes a problem with the traditional
Echoplex Stereo setup, where a pedal is only connected in the Master
side, and all value changes made with it are sent to the Slave Echoplex by
MIDI. With the alternate* *InterfaceModes**, the slave in such a setup will
not have a pedal inserted and it can not be set to the* *InterfaceModes*
*requiring a pedal. The slave will only cycle through the first four*
*InterfaceModes**, while the master cycles through all 8.
There are a few ways to work around this problem.
One way is to use a stereo volume pedal for the* *Feedback Pedal Jack**.
Connect the two channels of the pedal to the two Echoplexes, and then
each will have a pedal inserted with the control coming from the same
place. Both can be set to all* *InterfaceModes**, and be controlled
appropriately. If you are really picky, you may find that your pedal is not
exact between channels, so you may find values are not set exactly the
same between the two Echoplexes. Fixing this will either mean finding a
pedal that is better matched, or soldering a wire between the two
potentiometer wipers inside your pedal to force them to have the same
voltage. (This makes the pedal useless as a true stereo volume pedal, so
make sure you understand what you are doing before attempting such a
modification.)
A second approach is to use a single mono pedal connected to the*
*Feedback Pedal Jack* *of both units with a Y connector. For this to
work, the potentiometer in the pedal must be half the resistance of the
pedal requirement for a single Echoplex. This means it will have to be
approximately 10 KOhms or greater, but you may need to experiment a
bit to find a pedal that uses the full range of the pedal in the best way.
For some Echoplex units, values as low as 5 KOhm may work better.*
*4-28 Echoplex Digital Pro Plus User’s Manual*
# *Loop/Delay (InterfaceMode)*
# *Continued*
*A third way which is less useful is to insert a dummy connector into the*
*Feedback Pedal Jack* *of the slave, without connecting it to anything.
Then you will be able to at least set the slave to any of the* *InterfaceModes*
*and use some of their functionality, but on the slave you will not be able
to control some parameters that the pedal controls in some of the*
*InterfaceModes**. Any* *Feedback* *settings controlled by the pedal will be
sent by MIDI from the Master, so* *InterfaceModes* *that use the pedal for*
*Feedback* *will work fine. But* *Loop Input Volume* *and* *Loop Output Volume*
*will not be transmitted, so any* *InterfaceModes* *that use the pedal for
those will not work very well this way for Stereo.*
# *Copies the current loop into the next, in several ways*
### *Values: Off, Timing, Sound*
*When* *LoopCopy* *is set to* *Sound (Snd)* *or* *Timing (ti)**, The Echoplex will do a
copy function anytime you switch into a reset loop.*
# *C*OPY THE AUDIO TO A NEW LOOP
*If* *LoopCopy=Sound* *it will cause the audio content of the current loop to
be automatically copied into every empty (reset) loop that you enter.
The sound copy occurs in real time, and works just like doing a* *Multiply*
*into the new loop. If you let it keep going, your previous loop will be
repeated into multiple cycles in the new loop, which will be counted in
the* *Multiple Display**. Any new material that you play during this copy
will be overdubbed on top. When you want to complete the copy, press
the* *Multiply* *button to end. The copy will round off to the next cycle,
exactly as it does when using the* *Multiply* *function.*
# *C*OPY THE TIME BASE TO A NEW LOOP
*Similarly, if* *LoopCopy=Timing* *the length of the current loop will be
automatically copied into every reset loop that you enter. This also
happens in real time, and works just like doing an* *Insert* *into the new
loop. If you let it continue you will see additional cycles counted in the*
*Multiple Display**. Any new material that you play will be added to the
new loop. When you want to complete the copy, press* *Insert* *to end.
The copy will round off to the next cycle, exactly as it does when using
the* *Insert* *function.*
*not.*
### *See Also: Overdub*
# *Default: Stop*Overflow
# *Parameter Row: Switches*
*Reference - Parameters 4-35*
# *Determines how Record handles memory overflows.*
### *Values: Stop(StP), Play (PLY)*
*An overflow occurs when you attempt to use more memory than you
have during* *Record* *operations.
When* *Overflow=Stop,* *exceeding the memory capacity of your unit will
cause the* *Record* *operation to be immediately cancelled, and will reset
(erase) the current loop.
When* *Overflow=Play,* *exceeding the memory capacity of your unit will
cause the cycle length to be set to the full time available to the current
loop. Everything that you’ve played from the start of the* *Record* *to the
instant just before the overflow will be looped, and everything that
you’ve played after that instant will be ignored.
If you’re trying to create rhythmic loops, neither of these options will
produce very satisfactory results: you’re best off avoiding overflows in
the first place.*
### *See Also: Record*
*4-36 Echoplex Digital Pro Plus User’s Manual*
# *Quantize*Default: Off
Parameter Row: Timing
# *Defines whether certain functions are executed at the end of
# the the current loop, current cycle, the current sub-cycle or
# immediately.*
### *Values: Off (OFF), Cycle (CYC), Sub-Cycle (8th), Loop (Lop).
### Functions affected: Multiply, Insert, Reverse, Mute, Substitute,
### HalfSpeed, Replace.*
*Quantize* *forces a function to wait for a designated point before
executing. This is very useful for forcing functions to occur precisely in
rhythm. When* *Quantize=off**, all functions execute immediately.
When* *Quantize* *is on and you press a function button prior to the*
*Quantize* *point, you will see* *“ooo”* *on the* *LoopTime Display* *to
indicate the Echoplex is waiting.
See the entries for the functions affected for detailed explanations and
examples.*# *Q*UANTIZE OPTIONS
*The Quantize values mean the following:*
## *Q**UANTIZE* = L*OOP*
*When* *Quantize=Loop**, the Echoplex waits until the entire loop completes
before executing the function. This is meaningful if you have used*
*Multiply* *or* *Insert* *to add cycles to the loop. When you press a function in
the middle of the loop, it will wait until the* *Loop StartPoint* *to execute.*
## *Q**UANTIZE* = C*YCLE*
*When* *Quantize=Cycle**, the Echoplex waits until the current* *Cycle*
*completes before executing the function. This is more meaningful if you
have used* *Multiply* *or* *Insert* *to add cycles to the loop, otherwise the* *Cycle*
*and the overall Loop are the same.*
## *Q**UANTIZE* = S*UB*-C*YCLE* (8*TH*)
*When* *Quantize=8th,* *functions are* *Quantized* *to the next Sub-Cycle as
determined by the* *8ths/Cycle* *parameter. This is very useful for giving a
close to instant feel for operating the Echoplex, while maintaining
precise overall rhythm. With the default value of* *8ths/Cycle=8,* *the* *Sub-
Cycles* *are equal to 8th notes. However,* *8ths/Cycle* *can be set to divide
the loop anyway you want.
This setting for* *Quantize* *is essential for the concept of* *LoopDividing,*
*described in the Functions section of this chapter.*
# *S*YNC AND QUANTIZED RECORDING
*When an external clock is available for* *Sync,* *the Echoplex can force the
loop length to match so that the loops will be in perfect sync with the
clock. However, we don’t have to start recording at the downbeat
defined by this clock if we don’t want to. This is the feature called*
*SyncRecord.* *When* *Quantize=Off,* *the* *SyncRecord* *function lets you press*
*Record* *anytime to start recording, but* *Quantizes* *the ending of the*
*Record* *so that the loop length exactly matches the length defined by the
clock and* *8ths/Cycle.*
*If you set* *Quantize = Loop, Cycle, or Sub-Cycle,* *the Echoplex will* *Quantize*
*the start of the* *Record* *to the downbeat of the external clock. When you
press* *Record**, you will see the* *“ooo”* *display. When the external*
*StartPoint* *is reached,* *Record* *will begin.*
*Reference - Parameters 4-37*
# *Quantize*
# *Continued*
# *E*SCAPING QUANTIZATION
*If you use* *Quantize,* *you may find that sometimes you want to execute a
function* *Unquantized.* *You could do this by changing the* *Quantize*
*parameter to* *Off,* *executing your function, and then turning it back on
again, but that is hardly convenient or economical.
Instead, the Echoplex allows you an easy way to break free of the*
*Quantization* *when you choose to. Anytime you have pressed a function
and gone into the* *Quantizing Mode* *with* *“ooo”* *on the display, all you
have to do is press the same function again and it will execute
immediately. If you like, you can think of this as “double-clicking*
# *Affects the behavior of the Record button.*
### *Values: Toggle (tOG), Sustain (SUS), Safe (SAF)*
## *R**ECORD*M*ODE* = T*OGGLE*
*When* *RecordMode=Toggle,* *the* *Record* *button works as described in the*
*Record* *section. Press* *Record* *once to begin recording, and press it again
to stop.*
## *R**ECORD*M*ODE* = S*USTAIN*
*However, when* *RecordMode=Sustain,* *you can only record sounds while
you hold down the* *Record* *button—as soon as you release it, the
recording stops.
When* *RecordMode=Sustain,* *you lose the ability to* *Reset* *a loop from the
Echoplex front panel or EFC-7 Pedal, normally accomplished by a long
press of the* *Record* *button. This may not be a great loss for you, since a
short press of* *Record* *while you play nothing will create a short loop
with no contents. However, there are two consequences of this
approach:*
*n* *A loop that is pseudo-cleared this way will not go into* *AutoRecord* *if you
enter it with* *NextLoop.*
*n* *There is no way to do a* *GeneralReset* *of all loops in this situation, except
to enter a loop (with* *AutoRecord=Off**) that has not been recorded since
power-up. The orange light under the* *Multiply* *button, signifying that a
long press of that button will execute* *GeneralReset* *and clear all loops,
does not go on unless the current loop is completely empty.
If you are using MIDI, both* *Reset* *and* *GeneralReset* *are available
independently*# *S*WITCHQUANTIZE OPTIONS
## *O**FF* (S*WITCH*Q*UANT* = OFF)
*When* *NextLoop* *is pressed the Echoplex immediately switches to the
next loop with no quantizing. For example, if you are currently on loop
2, pressing* *NextLoop* *will instantly put you in loop 3.*
*Reference - Parameters 4-49*
# *SwitchQuant*
# *Continued*
## *C**ONFIRM* (S*WITCH*Q*UANT* = C*N*F)
*When* *NextLoop* *is pressed the Echoplex goes into the quantize period
but then waits indefinitely with the current loop playing until a
confirming action is made. During this waiting period you may
continue to press NextLoop to select different loops without actually
switching to them. The display shows the loop you will switch to when
the confirming action is made. The simplest type of confirm action is to
press the* *Undo* *button, which will send you immediately to the loop
you have selected. You can also confirm the loop switch with* *Record**,*
*Overdub**,* *Multiply**,* *Insert**, or* *Mute**, which will switch you to the
selected loop and immediately execute that respective function.*
## *C**YCLE* (S*WITCH*Q*UANT* = CYC)
*When* *NextLoop* *is pressed, the Echoplex will wait until the next Cycle
point to switch loops. During the quantize period you may select a
different loop to switch to by pressing* *NextLoop* *additional times. You
may also “arm” another function to execute in the new loop when the
switch occurs. For example, if you press* *Record* *during the waiting
period the Echoplex will wait until the current cycle of the current loop
ends, switch to the next loop, and immediately begin recording.*
## *C**ONFIRM*C*YCLE* (S*WITCH*Q*UANT* = CCY)
*ConfirmCycle* *is a combination of the* *Confirm* *and* *Cycle* *values. When
you press* *NextLoop**, the Echoplex goes into an indefinite waiting
period while the current loop plays, just like with* *Confirm.* *After a
confirming action is done, the Echoplex additionally quantizes the loop
switch to the next Cycle point as it does when* *SwitchQuant=Cycle**.*
## *L**OOP* (S*WITCH*Q*UANT* = LOP)
*When* *NextLoop* *is pressed, the Echoplex will wait until the next Loop
point to switch loops. During the quantize period you may select a*
*4-50 Echoplex Digital Pro Plus User’s Manual*
# *SwitchQuant*
# *Continued*
*different loop to switch to by pressing* *NextLoop* *additional times. You
may also “arm” another function to execute in the new loop when the
switch occurs. This value is useful when you have used* *Multiply* *or*
*Insert* *and wish to always quantize to the overall loop length.*
## *C**ONFIRM*L*OOP* (S*WITCH*Q*UANT* = CLP)
*Similar to ConfirmCycle. After a confirming action is done, the Echoplex
additionally quantizes the loop switch to the next loop StartPoint.*
## *Example 4.x: Using Confirm Cycle (CCY)*
*1.* *Set* *SwitchQuant=CCY
2.* *Set* *MoreLoops=2* *and record two loops.*
*3.* *Press* *NextLoop**, it waits for you to do some action.*
*4.* *Press the function you want (**Record, Overdub, Multiply, Insert,*
*etc...)*
*5.* *The action will begin in the new loop after the next Cycle point of the
current loop.*
# *D*ISPLAY# *D*ISPLAY DURING SWITCHQUANTIZING
*With* *SwitchQuant* *on**,* *a press of the* *NextLoop* *button will turn the
front-panel LEDs under the* *Record, Overdub, Multiply, Insert,
Mute,* *and* *Undo* *buttons orange, while the LED under* *NextLoop* *will
be red. The orange color indicates that all of these buttons take on
interesting functions during the quantize period, as the explanations
and examples on the following pages will illustrate.
During the quantize period the* *LoopTime Display* *changes to show
the destination loop. It will be displayed as “**L 1**”, “**L 2**”, etc. This is the*
*Reference - Parameters 4-51*
# *SwitchQuant*
# *Continued*
*loop you will go to when the quantize period ends. If you continue
pressing NextLoop during this time, you will see the destination
increment.*

# *B*UTTONS ACTIVE DURING THE
# *Q*UANTIZE PERIOD
NextLoop
*Pressing* *NextLoop* *during the quantize period increments the
destination loop without switching you there. This skips over the next
loop, allowing you to move to any other loop without activating the ones
in-between. The current destination loop is displayed in the* *LoopTime*
*display.*
## *Example 4.16: Switching to a Loop Other Than the Next One*
*When* *SwitchQuant* *is on, you can move directly from any loop to any
other, without passing through the intermediate loops. For instance, to
switch from Loop 1 to Loop 3, take the following steps:*
*1.* *Set* *MoreLoops* *to 3 or more*
*2.* *Set* *SwitchQuant=Loop
3.* *Record something a few seconds long into Loop 1, then end recording.*
*4.* *Near the beginning of the loop, press* *NextLoop* *twice. Notice that the
display shows “**L 3**” in red, indicating that you are going to loop 3 next.*
*5.* *When your loop ends, note that you will be switched immediately into
Loop 3. If* *AutoRecord=On,* *then the Echoplex Digital Pro will start
recording as soon as you enter that loop.*
*4-52 Echoplex Digital Pro Plus User’s Manual*
# *SwitchQuant*
# *Continued*
*You can also switch to a loop other than the next one with MIDI
messages, whether* *SwitchQuant* *is* *On* *or* *Off.* *See* *LoopTrig* *for more
information.*
# *Multiply/LoopCopy*
*Pressing* *Multiply* *during the quantize period will put you into*
*SoundCopy* *mode when you move to the next loop. This is an alternate
method of doing copies to the* *LoopCopy* *parameter. This* *SwitchQuant*
*method of copying gives you more direct control over copying instead of
the automated method using the* *LoopCopy* *parameter.
LoopCopy is essentially the same as multiplying your current loop into
the new one, so it all happens seamlessly in real-time. The audio from
the first loop will be copied to the new loop, and the Echoplex will
continue to add multiple cycles for as long as you let it run. You end the
copy by pressing the* *Multiply* *button again. The timing of this next
press of* *Multiply* *will determine how many cycles from the first loop
are kept. While the copy is happening, any new material that you play
will be added over the top of the new loop, just as with Multiply. This is a
great way to create a variation of your first loop into a new loop, and
then switch back and forth between them later.
Caution:* *LoopCopy* *erases the existing contents of the next loop!*
## *Example 4.17: Copying the Current Loop Prior to Switching*
*When* *SwitchQuant* *is on, you can take advantage of the quantize period
to copy the current loop into the next one by pressing the* *Multiply*
*button. This can be handy when you want to create a single backing
track for several distinct loops, which you’ll later embellish differently
with overdubbing and other actions. To see this in action, take the
following steps:*
*1.* *Set* *MoreLoops* *to 2 or more*
*2.* *Turn* *SwitchQuant On
3.* *Record something a few seconds long into Loop 1, then end recording.*
*Reference - Parameters 4-53*
# *SwitchQuant*
# *Continued*
*4.* *Near the beginning of the loop, press* *NextLoop,* *then press* *Multiply.
5.* *When your current loop ends, you will be switched immediately into
Loop 2, and you will be in* *Multiply* *mode. You won’t hear the transition
as it will sound like your current loop continues to play.*
*6.* *Keep playing, as you layer more sounds on top of the sounds being
copied from Loop 1. When you press* *Multiply* *again, the Copying will
end and the new loop with the added overdubs will begin repeating.
Multiples of Loop 1 will be copied as long as* *Multiply* *is active. If Loop 1
contains multiple cycles, then you may not get all of them if you end the*
*Multiply* *function prematurely. Another example can clarify this.*
## *Example 4.18: Copying a Portion of the Current Loop to the Next
## Loop*
*1.* *Set* *MoreLoops* *to 2 or more.*
*2.* *Set* *SwitchQuant=Loop**.*
*3.* *Record a few seconds of chordal background in Loop 1.*
*4.* *Use* *Multiply* *to record a short solo that lasts for 4 cycles or so, then end
the* *Multiply* *function.*
*5.* *Press* *NextLoop,* *then press* *Multiply.
6.* *When you enter the next loop (after all 4 cycles of the current loop have
completed), watch the* *Multiply* *counter in the right side of the display,
and press the* *Multiply* *button again when this counter reaches 2.*
*7.* *Listen to the truncated solo as it loops.
One final observation: you can achieve other effects by ending this*
*Multiply* *function with any of the “Alternate Endings” listed under*
*Multiply* *in the Functions section.*
*4-54 Echoplex Digital Pro Plus User’s Manual*
# *SwitchQuant*
# *Continued
# Inser t*
*Pressing* *Insert* *during the quantize period will execute a* *TimeCopy* *in
the new loop. This copies the timing (but not the audio contents) of the
current loop cycle into the next loop, in real-time. This is essentially the
same as putting you into* *Insert* *mode in the new loop, using the base
cycle time of the starting loop. You will see the cycle count incrementing
according to the cycle length of the starting loop, and any material you
play will be added to the new loop. When you are ready to end, press*
*Insert* *again and the Echoplex will round off to the next cycle point.
This technique gives you a seamless method to quickly create a new
loop based on the timing of an existing loop, so they maintain the same
rhythm. This is similar to using the more automated method with*
*LoopCopy=time**, except you can more directly control it and the copy will
proceed whether the destination loop is in reset or not.
Caution: TimeCopy erases the existing contents of the next loop.*
# *Mute*
*Pressing* *Mute* *during the quantize period will cause the Echoplex to
toggle* *Mute* *mode when it switches to the new loop.*
# *Overdub*
*Pressing* *Overdub* *during the quantize period has two possible results,
depending on whether the next loop is reset or not.
If the destination loop is reset, pressing* *Overdub* *will execute a*
*SimpleCopy**. This function creates exactly one copy of the current loop in
the new loop, without doing any multiplying. It ends by itself when it
reaches the end of the loop, so you do not have to do anything.* *Overdub*
*is on automatically upon entering the new loop, so new material can be
immediately added while the copy occurs.*
*Reference - Parameters 4-55*
# *SwitchQuant*
# *Continued*
*If the destination loop has material in it already, pressing* *Overdub*
*during the quantize period will turn* *Overdub* *on when you switch to the
new loop.*
# *Record*
*Pressing* *Record* *during the quantize period will cause the Echoplex to
begin recording immediately as soon as it enters the next loop. This is
like having* *AutoRecord=on,* *except that* *AutoRecord* *will only start
recording when you move into an empty loop, and it always happens in
such a case automatically. In this case, pressing* *Record* *during the
quantize period lets you choose when to record in a new loop, and it will
work whether there is a loop recorded there already or not.
Caution: This erases the existing contents of the next loop.*
# *S*WITCHQUANT AS A QUANTIZE
# *A*LTERNAT E FOR THE CURRENT LOOP
*ConfirmCycle* *and* *ConfirmLoop* *also give you an alternate method to
quantize actions in the current loop, similar to the way you might use
the standard Quantize parameter. After you press* *NextLoop* *to enter
the quantize period, continue pressing it until the current loop is
displayed as the destination. Now, any function you press will begin
according to the Confirm setting, regardless of the* *Quantize* *parameter
setting. This can be an easy way to have both quantized and
unquantized actions readily available to you without needing to change
parameter settings while you play. You can even start* *Overdub*
*quantized this way!*
## *Example 4.x: Quantizing Overdub in the Current Loop*
*1.* *Set* *MoreLoops* *to 2 or more.*
*4-56 Echoplex Digital Pro Plus User’s Manual*
# *SwitchQuant*
# *Continued*
*2.* *Set* *SwitchQuant=CLP* *and* *Quantize=OFF
3.* *Record a loop in loop number 1*
*4.* *Press NextLoop until next loop number 1 is displayed*
*5.* *In the middle of your current loop, press* *Overdub**.*
*6.* *The Echoplex will show “ooo” to indicate it is quantizing the Overdub.*
*7.* *When the loop restarts, Overdub will come on.*

# *MultiIncrease*Immediate Action
Play Mode
# *Predetermine the final cycle count of a Multiply or Insert.*
*Multiply* *has a feature to aid in creating very long multiplies, called*
*MultiIncrease**.* *MultiIncrease* *is also useful when you know exactly how
many multiples you want to do in advance.
Instead of waiting until the end of the* *Multiply* *to make the second press
of the* *Multiply* *button, now you can immediately tap in as many
Multiples as you want in the beginning of the multiplying. The Echoplex
will automatically complete that many multiply Cycles for you. This
same function is also available for* *Insert**, however for simplicity we will
just describe it in terms of* *Multiply**.*
*MultiIncrease* *is very helpful for situations where you want to have a large
number of multiples and you don’t want to wait to the very end to
remember to press* *Multiply* *a second time. This way you can set up in
advance how far it will multiply and let it go while you continue playing.*
*MultiIncrease* *is in addition to the normal* *Multiply* *operation, so the
standard use is not affected.*
# *H*OW TO USE MULT I INCREASE
*Once you have started* *Multiply* *with a tap of the* *Multiply* *button,
immediately tap the* *Multiply* *button again to signal you want to end.
The Echoplex begins* *Rounding* *off the* *Multiply**, just as it normally does.
During the Rounding period, continue tapping* *Multiply* *to increase the
number of Cycles you want to add. The number of Cycles where* *Multiply*
*will be stopped is briefly displayed as* *C <number>* *while you are
tapping* *Multiply**.
If you like, you can tap them in very quickly right from the beginning.
Or, if you have had* *Multiply* *going for a while, using* *MultiIncrease* *simply
adds to the number of multiples you already have.*
# *MultiIncrease*
# *Continued*
*Reference - Functions 5-27*
*If you are tapping the Cycles in quickly, it is helpful to remember that
the first tap of* *Multiply* *is just starting the* *Multiply**. The second tap is
where you start counting the total number of Cycles you will get. This
can throw you off when you count the* *Multiply* *taps quickly, because
you need to tap one extra time than the number of Cycles you want. So
if you want 4 Cycles total, you need to tap five times. You might count it
start – 1 – 2 – 3 – 4.*
## *Example 4.x: Basic Operation of MultiIncrease*
*1.* *Record a loop.*
*2.* *Tap* *Multiply* *4 times and you get:*
*Tap 1:* *Start* *Multiply
Tap 2:* *Stop* *Multiply**, begin* *Rounding
Tap 3: MultiIncrease* *(Cycles = 2)*
*Tap 4: MultiIncrease* *(Cycles = 3)*
*3.* *You’ve set it to Multiply by 3*
*4.* *At the third Cycle, the Multiply will stop automatically.*
# *M*ULT I INCREASE WITH QUANTIZE=LOOP
*When* *Quantize=Loop**,* *MultiIncrease* *adds entire loops. For example, if the
loop consisted of 4 Cycles,* *MultiIncrease* *counts C 8, C12, C16, etc.*
### *See Also: Multiply, Insert*
*5-28 Echoplex Digital Pro Plus User’s Manual*
# *Multiply*Immediate Action
Play Mode
# *Lets you overdub passages that are longer than the existing
# cycle.*
*Multiply* *makes it easy to layer a 4-measure melody over a repeating 1-
measure rhythm pattern, for instance. It’s called "Multiply" because the
original cycle is "multiplied"—copied multiple times—while the new
material is added to it. The result is a loop whose length is an integer
multiple of the length of the original cycle (unless you use the* *Record*
*button to end the multiplication—see "Alternate Endings" below).*
# *U*NQUANTIZED MULT I P L I C ATION
*The* *Multiply* *function is started by pressing the* *Multiply* *button. There
are several ways to end the function, but the most natural and common
is to press the* *Multiply* *button a second time. When you do this, you
will always create a loop that consists of an integer (1, 2, 3, etc.) number
of cycles. The existing cycle is repeated and mixed with the new playing,
which may be several cycles long.* *Figure 4.5* *demonstrates this behavior
when* *Quantize=Off.
Multiply* *doesn’t restart the loop the instant you press it the second
time—it always “rounds off” so that the original loop isn’t cut-off in the
middle. Normally it rounds up to the next cycle point. However, if you
press* *Multiply* *the second time within 150ms after the cycle point, it
will round down.
When you examine* *Figure 4.5**, you’ll see that there are two possible
results shown, depending on the value of the* *RoundMode* *parameter. If*
*RoundMode* *is set to* *Round,* *then the timing of your second press of the*
*Multiply* *button isn’t critical—everything in the current cycle
(measured from the first press of* *Multiply**) is recorded. In contrast, if*
*RoundMode* *is* *Off,* *then the overdubbing of the new performance stops
immediately, although it still rounds off so the entire copy of the original
cycle is included in the loop.*
# *Multiply*
# *Continued*
*Reference - Functions 5-29*
# *Q*UANTIZED MULT I P L I C ATION
*When* *Quantize=On,* *a press of the* *Multiply* *button will cause
multiplication to start at the beginning of the next cycle. As in the
previous example, ending the multiplication with a second press of*
*Multiply* *will cause an exact number of cycles to be mixed with copies
of the existing cycle—the loop will end at the end of the current cycle
(**see Figure 4.6**).
Unlike before, the setting of* *RoundMode* *will not have any effect. When*
*Quantize=On,* *music played after the second press of the* *Multiply*
*button is overdubbed until the* *Multiply* *ends at the next cycle point.*
*􀀀􀀀
􀀀􀀀􀀀
􀀀*
*Cycle 1 Cycle 2 Cycle 3 Cycle 4*
*M M*
*Results when
RoundMode=rnd*
*􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀
􀀀*
*Results when
RoundMode=Off
Existing Loop
Button Actions
New Performance*
*Time*
*1 cycle 1 cycle 1 cycle*
*􀀀􀀀
􀀀􀀀
􀀀
􀀀􀀀
􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀
􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀
􀀀
􀀀􀀀
􀀀􀀀
􀀀
􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀*
*A*
*F**IGURE* *4.5
Basic operation of the
Multiply button.
Quantize=Off*
*5-30 Echoplex Digital Pro Plus User’s Manual*
# *Multiply*
# *Continued*
# *O*VERFLOW HANDLING
*Watch the time counter when you’re doing a multiply that might extend
longer than your unit’s memory capacity. If you exceed this capacity, the
multiply operation will be undone and three dashes will appear in the
display. The* *Overflow* *parameter has no effect during* *Multiply**—it is only
relevant when you* *Record* *your first cycle.
The Echoplex always keeps your current loop in memory when you do
another function like* *Multiply.* *This way it is always possible to* *Undo*
*back to the original if you go into a function by mistake. This means that
the memory available for* *Multiply* *is reduced by the size of your
current loop.
For example, say you had 10 total seconds of memory available for a
loop, and recorded a 1 second loop. When you* *Multiply* *this loop you
can only go to 9 cycles, since 1 second is used to store the existing loop.
It is useful to pay attention to this so you know how far you can go with*
*Multiply.*
*􀀀􀀀
􀀀􀀀􀀀
􀀀*
*Cycle 1 Cycle 2 Cycle 3*
*M M*
*Results when
RoundMode=rnd
Results when
RoundMode=Off
Existing Loop
Button Actions
New Performance*
*Time*
*􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀*
*1 cycle 1 cycle*
*􀀀􀀀
􀀀
􀀀􀀀
􀀀􀀀
􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀
􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀**A*
*􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀*
*F**IGURE* *4.6
Quantized operation of the
Multiply button.*
# *Multiply*
# *Continued*
*Reference - Functions 5-31*
# *A*LTERNAT E ENDINGS
*The simplest way to end a* *Multiply* *operation is to press the* *Multiply*
*button a second time. You’ll get the results illustrated in the examples
above. However, you can also end the* *Multiply* *by pressing any of the
buttons whose front-panel lights are on during the* *Multiply.* *You’ll get
some interesting results, as illustrated in the next few examples.*
## *R**ECORD*
*Ending a* *Multiply* *operation with the* *Record* *button causes the
operation to end immediately, terminating the loop at the exact time of
the button press. Since the loop can’t contain fractional cycles, the
entire new loop will be considered a single cycle. This is called an*
*UnroundedMultiply**.* *Figure 4.7* *illustrates this behavior.*
*􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀**Cycle 1 Cycle 2 Cycle 3*
*M R*
*Results*
*􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀
􀀀*
*Existing Loop
Button Actions
New Performance*
*Time*
*Existing Cycles
New Cycle Cycle 1*
*􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀
􀀀
􀀀􀀀􀀀
􀀀􀀀
􀀀*
*F**IGURE* *4.7
Ending Multiply with
Record changes the cycle
length.
Quantize=Off*
*5-32 Echoplex Digital Pro Plus User’s Manual*
# *Multiply*
# *Continued*
*Unrounded Multiply* *is an important function. It allows you to change
the length of the loop on the fly, either shorter or longer. For example,
you can edit out a small portion of a larger loop as a means to quickly
transition to something new.* *Unrounded Multiply* *also changes the
rhythm of the loop, including the output of any synchronization pulses.
In this way you can easily manage tempo changes while looping, either
generating a new clock tempo for other devices, or fitting your loop to a
tempo change otherwise in the music.*
## *O**VERDUB*
*Ending a multiplication with* *Overdub* *is exactly like ending it with*
*Multiply,* *except that you immediately toggle* *Overdub* *mode after the*
*Multiply* *rounds off. It’s the equivalent of ending the multiplication by
pressing* *Multiply* *a second time, and then pressing* *Overdub*
*immediately. If* *Overdub* *was on before the multiply, this action will turn
it off. If it was off it will now be on.*
## *I**NSERT*
*Ending a multiplication with* *Insert* *is exactly like ending it with*
*Multiply,* *except that you are immediately put into* *Insert* *mode. It’s the
equivalent of ending the multiplication by pressing* *Multiply* *a second
time, and then pressing* *Insert* *immediately.*
## *M**UTE*
*Ending a multiplication with* *Mute* *is exactly like ending it with*
*Multiply,* *except that the audible sound will shut off as soon as the*
*Multiply* *ends. Once you’re in* *Mute* *mode, you can restart the sound with
the* *Mute* *button or with the Alternate Endings listed for the* *Mute* *entry
later in this chapter.*
# *Multiply*
# *Continued*
*Reference - Functions 5-33*
## *U**NDO*
*If you end a* *Multiply* *operation by pressing* *Undo,* *the loop will be
returned to its state before you pressed* *Multiply.*
## *R**EVERSE*
*Ending a multiplication with* *Reverse* *is exactly like ending it with*
*Multiply,* *except that you immediately toggle* *Overdub* *mode after the*
*Multiply* *rounds off. It’s the equivalent of ending the multiplication by
pressing* *Multiply* *a second time, and then pressing* *Reverse*
*immediately. If the loop was in* *Reverse* *before the* *Multiply**, this action
will put it back into* *Forward**.*
# *C*HANGING THE NUMBER OF CYCLES IN
AN EXISTING LOOP
*Do you want to change the number of cycles in a loop? In particular,
would you like to keep a couple of the cycles and throw away the others?
Do you want to add 1 cycle to make your repetition structure
appealingly asymetrical? You can do this by initiating a* *Multiply*
*operation on a loop that’s already been multiplied.*
## *Example 4.13: Dropping Cycles*
*Here’s an example that illustrates one way to use* *Multiply* *to alter an
existing loop. If you connect a microphone to the Echoplex’s* *Audio
Input**, you can use it to illuminate the effects of this procedure, as you’ll
see. Whether you have a microphone or not, it can be instructive to
follow along with this example, referring to* *Figure 4.8* *to see the effects
of each step.*
*5-34 Echoplex Digital Pro Plus User’s Manual*
# *Multiply*
# *Continued*
*1.* *Record a single tap or note into a short loop to provide a pulse. Make it
slow enough so that you can carry out the following steps without the
need for practice.*
*2.* *Set* *Quantize=On**.*
*3.* *Press* *Multiply* *right after you hear a pulse. Count "One-Two-
Three_Four" together with the pulses, and hit* *Multiply* *again,
immediately after the word "Four."*
*4.* *Now you have a loop that counts from 1 to 4, as shown in the figure.
Press* *Multiply* *right after the word "One," and again after the word
"Three." Note that the loop now consists of the words "Two" and
"Three."*
## *Example 4.14: Adding Cycles*
*Here’s an example that shows how to use* *Multiply* *to change a 2-cycle
loop to a 3-cycle loop. Follow along in* *Figure 4.9**.*
*Cycle 1 Cycle 2 Cycle 3*
*M M*
*Results
First cycle
Actions In Step 3*
*Time*
*(tap)
After Step 2
(tap)
"One"
(tap)
"Two"
(tap)
"Three"
(tap)
"Four"
Cycle 3
(tap)
"Two"
(tap)
"Three"
Cycle 1 Cycle 2
New Loop*
*F**IGURE* *4.8
This diagram accompanies
Example 4.13. It illustrates
how you can use Multiply
to change the number of
cycles in an existing loop.*
# *Multiply*
# *Continued*
*Reference - Functions 5-35
1.* *Record a single tap or note into a short loop to provide a pulse. Make it
slow enough so that you can carry out the following steps without the
need for practice.*
*2.* *Set* *Quantize=On.
3.* *Press* *Multiply* *right after you hear a pulse. Count "One-Two" together
with the pulses, and hit* *Multiply* *again immediately after the word
"Two."*
*4.* *Now you have a loop that counts from 1 to 2, as shown in the figure.
Press* *Multiply* *right after the word "One," and again after the 1st
repetition of the word "Two," as illustrated. Note that the loop now
consists of the words "Two-One-Two."
We’ve shown these examples with* *Quantize=On**. Try the same ideas with*
*Quantize=Off* *to see the difference. You may find the* *Quantize* *is very
useful when you want to keep your loops rhythmically precise. When*
*Quantize=Off* *on the other hand, you have the freedom to define exactly
where things happen as they fit your sense of the music.
Now try similar ideas using* *Unrounded Multiply**, as described above
in the Alternate Endings section. You do this by using* *Record* *as an
alternate ending to* *Multiply.* *With* *Unrounded Multiply* *you can*
*1 cycle*
*M*
*Results
First cycle
Button Actions In Step 3*
*Time*
*(tap)
After Step 2
(tap)
"One"
(tap)
"Two"
(tap)
"Two"
Cycle 1 Cycle 2
New Loop*
*M*
*Loop Loop
(tap)
"One"
(tap)
"Two"
(tap)
"One"
(tap)
"Two"
Cycle 3*
*F**IGURE* *4.9
This diagram accompanies
Example 4.14. It illustrates
how you can use Multiply
to increase the number of
cycles in an existing loop.*
*5-36 Echoplex Digital Pro Plus User’s Manual*
# *Multiply*
# *Continued*
*easily create a new loop length that is unrelated to the previous cycle
lengths. This is very useful for changing tempos, or editing out a small
fragment of a larger loop for the basis of something new.
Your taste and the musical situation will determine which of these
different techniques is most appropriate at any given time.*
# *F*ORCING UNROUNDEDMULT I P LY WHILE
# *R*OUNDING
*UnroundedMultiply* *can be executed while a* *Multiply* *is* *Rounding* *by
pressing* *Record* *during the* *Rounding* *period.
This means that in addition to doing an* *UnroundedMultiply* *by pressing*
*Multiply* *to start and ending with* *Record**, you can press* *Multiply* *to
start, then* *Multiply* *again to finish* *Multiplying* *and start* *Rounding,* *and
then press* *Record* *while it is rounding to force it to stop* *Unrounded**.
This is especially interesting when you use alternate functions to end*
*Multiply.* *Since ending* *Multiply* *with an alternate function does a rounded
ending, pressing* *Record* *after that forces it to go into that function
immediately and end the multiply* *Unrounded**.
For example, you could press* *Multiply* *to multiply your loop out as you
add something over it, press* *Reverse* *to end the* *Multiply* *and start it*
*Rounding,* *and then press* *Record* *to have it immediately start* *Reversing*
*with the loop length redefined to that point.
Or, you could chop out a short reversed snippet of your current longer
loop in a new loop. With* *SwitchQuant* *on, you press* *Next-Multiply-
Reverse-Record* *to create a reversed snippet. The* *Next-Multiply*
*portion begins a copy of the current loop into the new loop (which is
really the same as a multiply into the new loop). The* *Reverse* *starts it*
*Rounding* *with the* *Reverse* *command armed, and the* *Record* *executes it
immediately and redefines the new loop at that length.
This* *Rounding* *action also applies for using* *Insert**.*
# *Multiply*
# *Continued*
*Reference - Functions 5-37*
# *T*HE LONG PRESS
*Pressing and holding down the* *Multiply* *button has the same effect as
a pair of press-and-releases, regardless of the state of* *Quantize.*
# *R*ESETTING AL L LOOPS
*When the number of loops (the value of* *MoreLoops**) is more than one,
the* *Multiply* *button can be used to reset all the loops at once. First,
however, you must reset the current loop. The following example
illustrates that.*
## *Example 4.15: Resetting All Loops*
*1.* *Set the number of loops to be more than 1 (see* *MoreLoops**)*
*2.* *Record something in the first two loops.*
*3.* *Use* *NextLoop* *to move to Loop 1. Note that the light under the*
*Multiply* *button is green.*
*4.* *Press and hold the* *Record* *button to reset the current loop. The*
*Multiply* *light turns orange.*
*5.* *Press and hold the* *Multiply* *button to reset all loops.*
### *See Also: Record, Insert, Quantize, Overflow, RoundMode*
*5-38 Echoplex Digital Pro Plus User’s Manual*
# *Mute*Immediate Action
Play Mode
# *Silences the loop output.*
*This mutes (silences) and unmutes the output of the Echoplex Digital
Pro.* *Mute* *works very simply—it always silences the output immediately.
However, there are a number of options for restarting the output.*
# *T*HE EFFECT OF MUTEMODE
*MuteMode* *determines where loop playback starts the second time you
press the* *Mute* *button. As you’ll see under "Alternate Endings" below,
whichever approach you choose, the* *Undo* *button takes the opposite
viewpoint, so you’ll always have both ways to end a* *Mute* *readily
available.*
# *MuteMode=Star t*
*When* *MuteMode=Start**, a second press of the* *Mute* *button will always
restart the current loop at the beginning. This is probably the most
useful setting for solo playing.
When* *MuteMode=Start**, the end of the* *Mute* *is affected by the setting of*
*Quantize.* *If* *Quantize=On,* *then sound won’t restart until the end of the
current cycle.
Be aware that restarting the loop can move your StartPoint in relation to
external sequencers or other musicians. This could be a problem if you
wish to keep things tight with a sequencer, but it can also be very useful
if the band’s time has shifted and you need to line your loop up again
with everybody else.*
# *Mute*
# *Continued*
*Reference - Functions 5-39*
# *MuteMode=Continuous*
*When the* *MuteMode=Continuous,* *the loop continues counting even
when it is silenced by pressing* *Mute.* *Then, when you press* *Mute* *a
second time to allow audio output again, the loop will become audible
wherever it happens to be at that time. This is probably most useful if
you want to silence the loop for just a beat or two to play a fill, or have
your loop stay in time with other musicians even while it is not heard.*
# *A*LTERNAT E ENDINGS
*You can also end* *Mute* *with a number of other buttons, as follows:*
## *U**NDO*
*Acts like the second press of the* *Mute* *button, except that it uses the
opposite value of* *MuteMode.* *In other words, if* *MuteMode=Start**, then the*
*Undo* *ending behaves like the* *Mute* *button would if* *MuteMode* *were*
*Continuous**. Similarly, if* *MuteMode=Continuous**, then the* *Undo* *ending
behaves like the* *Mute* *button would if* *MuteMode* *were* *Start**.*
## *I**NSERT*
*Plays the loop once and then goes back into* *Mute* *state**.* *If you press it
again it will retrigger. Useful for stuttering effects.
This ending is affected by* *Quantize.* *If* *Quantize=On**, the loop will be
played once, starting at the end of the current cycle.*
## *M**ULTIPLY*
*Executes* *ReAlign,* *which allows you to get lined up with external devices
that have been stopped and restarted. See* *ReAlign* *for more info.*
*5-40 Echoplex Digital Pro Plus User’s Manual*
# *Mute*
# *Continued*
# *T*HE LONG PRESS
*When you press and hold the* *Mute* *button, the loop output will be
silenced until you release the button, at which time it will continue
playing. During this operation, the loop will continue running even
when silenced, regardless of the setting of* *MuteMode**—releasing the
button will not start the loop at the beginning, except by coincidence.*
### *See Also: MuteMode*
# *Immediate Action*NextLoop
# *Play Mode*
*Reference - Functions 5-41*
# *Moves to the next loop.*
*NextLoop* *is primarily used when multiple loops are set up with the*
*MoreLoops* *parameter. Pressing* *NextLoop* *will switch you to the next
loop.
The setting of* *SwitchQuant* *will affect when this happens—see the
discussion of* *SwitchQuant* *for a detailed explanation.*
# *R*ECORD - TO - NEXTLOOP
*If you have the* *MoreLoops* *parameter set greater than one, ending a
recording with* *NextLoop* *immediately ends the recording and puts
you immediately into the next loop.
If* *AutoRecord=On**, the Echoplex immediately continues recording in the
new loop. You can continue playing without any interruption, and have
what you play split into the two loops. This is especially useful for filling
the loops with the various parts of a song while playing continuously.
You just keep pressing Next as you play! This is a great way to record a
verse loop and chorus loop in one pass, as you play them live. If you
continue to press* *NextLoop* *at the end of each part, you can use this
method to record into all of the loops you have set up.
Similarly, if* *LoopCopy=Sound* *or* *LoopCopy=Time**, you can continuously
copy the audio or the time base into new loops as you record them in
one pass.
When* *MoreLoops=1**, ending* *Record* *by pressing* *NextLoop* *stops
recording and begins playing the loop, just as if the recording had been
ended with another press of* *Record**. Note however, that when*
*MoreLoops = 1**,* *NextLoop* *becomes a retrigger button, so* *Record**-to-*
*NextLoop* *can be an interesting way to immediately go into stutters of
your loop.*
*5-42 Echoplex Digital Pro Plus User’s Manual*
# *NextLoop*
# *Continued*
### *See also: MoreLoops, SwitchQuant, AutoRecord, LoopTrig, LoopCopy, SamplerStyle*
# *Immediate Action*Overdub
# *Play Mode*
*Reference - Functions 5-43*
# *Lets you add layers of sound.*
*Overdub* *is the basic magic wand of the Echoplex Digital Pro. It allows
you to add layer after layer of sound to any existing loop. As you play,
the level of the sound in the existing loop is subtly lowered to prevent a
gradual accumulation of signal that would overload the system. You can
leave* *Overdub* *on for extended periods of time, but we recommend that
you turn it off if you aren’t adding new sonic material to the mix.
See the Quick Start, page 1-1, for the fastest introduction to
overdubbing.*
*Overdub* *is related to the* *Insert* *and* *Multiply* *functions, but its behavior is
simpler. Unlike those operations,* *Overdub* *never changes the length of
the cycle or loop.* *Overdub* *is also not affected by the settings of* *Quantize*
*or* *RoundMode**—overdubbing starts when you press down the* *Overdub*
*button, and ends either when you press it a second time or when you
release it (see "The Long Press" below).* *Overdub* *is, however, affected by
the setting of* *OverdubMode* *(also discussed under "The Long Press"
below).*
# *B*ASIC OVERDUBBING
*The* *Overdub* *function is started by pressing the* *Overdub* *button. The
existing cycle is mixed with the new playing. Every time the cycle
reaches its start point, you’ll be adding another layer over that which
you’ve just recorded.* *Figure 4.10* *demonstrates this behavior**.
5-44 Echoplex Digital Pro Plus User’s Manual*
# *Overdub*
# *Continued*
# *A*LTERNAT E ENDINGS
*The only way to end an overdub operation is to press the* *Overdub*
*button a second time. You’ll get the results illustrated in the example
above. However, you can execute other functions while* *Overdubbing* *by
pressing any of the buttons whose front-panel lights are on during the*
*Overdub.* *The function will execute as normal, and when you end it*
*Overdub* *will still be on.*
# *T*HE LONG PRESS
*Pressing and holding down the* *Overdub* *button for longer than half a
second has the same effect as a pair of short press-and-releases**.* *In
other words, overdubbing will start when you press and hold the button
and end when you release it.*
### *O*
*Results* 
*􀀀
􀀀􀀀􀀀
􀀀*
*Existing Loop
Button Actions
New Performance
1 cycle*
### *O*
*􀀀􀀀􀀀 􀀀􀀀
􀀀􀀀􀀀
􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀􀀀􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀􀀀
􀀀􀀀
􀀀􀀀􀀀􀀀􀀀
􀀀􀀀􀀀*
*F**IGURE* *4.10
Basic operation of the
Overdub button.
In the Results row, each
cycle is the result of mixing
the contents of the previous
measure with the current
measures’ new
performance.*
# *Overdub*
# *Continued*
*Reference - Functions 5-45
Overdub* *can be held on in a sustain fashion with a long press while
simultaneously pressing other buttons to execute other functions. This
is true whether* *Overdub* *is activated from the front panel buttons, from
the foot pedal, or with a momentary switch in the* *Overdub Jack**.
For example, you can keep* *Overdub* *long-pressed and then press*
*Reverse* *simultaneously to go in and out of* *Reverse* *while* *Overdubbing**.*
*Simultaneous Overdub* *is useful when using* *Overdub* *as a* *SUS*
*function. Note this only works with the* *Overdub* *button, and no other
functions. Also, it does not work to do long-press functions on other
buttons while holding* *Overdub**. They will be treated as short-presses.*
# *T*HE EFFECT OF OVERDUBMODE
*When* *OverdubMode* *is set to* *Toggle,* *the* *Overdub* *button works as
described above. However, when* *OverdubMode* *is set to* *Sustain,* *you can
only layer sounds while you hold down the button—as soon as you
release it, the overdubbing stops. This is similar to using the long
presses of the* *Overdub* *button, except it is guaranteed to always
operate in* *Sustain* *fashion no matter how short or long you press it.
There are many situations when you’re likely to want to set*
*OverdubMode* *to* *Sustain,* *for example:*
*n* *You want to overdub extremely short excerpts from a sound source. If*
*OverdubMode=Toggle* *you have to press* *Overdub* *twice, which can be
difficult to do quickly. With* *OverdubMode=Sustain* *you can capture very
short fragments of sound into your loop.*
*n* *You want to guard against inadvertently putting yourself into an
extended* *Overdub,* *so you decide to overdub only when your foot is
holding down the button.This is extremely useful if you are playing
without looking at the Echoplex. You will always know the state of*
*Overdub* *by whether you are pressing it or not.*
### *See Also: Record, Insert, Quantize, Overflow*
*5-46 Echoplex Digital Pro Plus User’s Manual*
# *PreviousLoop*Immediate Action
Play Mode
# *DirectMIDI only command for switching to the previous loop.*
*An interesting feature that falls out of the* *DirectMIDI* *function called*
*SUSNextLoop* *is the* *PreviousLoop* *function. With* *SUSNextLoop* *the NoteOn
portion sends you forward one loop and the NoteOff portion sends you
back one loop. If you only use the NoteOff command for* *SUSNextLoop,*
*it only sends you backwards through the loops, and becomes the*
*PreviousLoop* *command!
If you set one button on a MIDI controller to only send the NoteOn for*
*SUSNextLoop,* *and another button to only send the NoteOff for*
*SUSNextLoop,* *you have a convenient way to go forward and backwards
through your loops.*
*PreviousLoop* *is only available through MIDI, and is located at*
*Source#+20.*
### *See Also: NextLoop, MoreLoops, MIDI Command List, SUSNextLoop, Receiving MIDI
### Commands.*
# *Immediate Action*Record
# *Play Mode*
*Reference - Functions 5-47*
# *Records a new cycle.*
*This is where it all starts. This button lets you record your first layer in a
loop or erase (reset) the current loop. You press it once to start
recording, and press it a second time to end recording and start looping.
A step-by-step example is given in the Quick Start.
If you go over the amount of memory available for the current loop
while recording, one of two actions can occur depending on the setting
of the* *Overflow* *parameter. See the description of that parameter for
more information.*
# *A*LTERNAT E ENDINGS
*The simplest way to stop recording is to press the* *Record* *button a
second time. However, you can also end the recording by pressing any
of the buttons whose front-panel lights are on during the recording.*
## *U**NDO*
*If you end a* *Record* *operation by pressing* *Undo,* *the loop will be
returned to its state before you pressed* *Record.* *This is particularly
useful if you accidentally press* *Record* *and don’t want to lose the
existing loop.
If the Echoplex doesn’t have enough memory to hold both the existing
loop and the new loop, you won’t be able to* *Undo* *the* *Record.* *See the
discussion under the* *Undo* *heading in this chapter for a full
explanation.*
## *I**NSERT*
*The effect of ending a recording with* *Insert* *depends on the setting of*
*InsertMode.
5-48 Echoplex Digital Pro Plus User’s Manual*
# *Record*
# *Continued*
*If* *InsertMode=Insert,* *then pressing* *Insert* *at the end of a recording ends
the recording and immediately inserts a second cycle (as it continues
recording); in other words, it puts you into* *Insert* *mode. The insertion
continues until memory runs out or you end it with* *Insert* *or an
alternate ending for the* *Insert* *operation. This is very useful for dividing a
longer loop into multiple cycles as you record it. This can allow you to
easily set a tempo for an external sequencer when using MIDI clock out,
for example.
If* *InsertMode=Replace,* *then pressing* *Insert* *at the end of a recording
ends the* *Record* *as if you’d pressed the* *Record* *button. The Replace
function immediately begins as explained in the* *InsertMode* *section.
If* *InsertMode=Rehearse,* *then pressing* *Insert* *at the end of a recording
puts you in* *Rehearse* *mode. The cycle that you’ve just recorded will be
played back exactly once, regardless of the* *Feedback* *setting. The
underlying timing of the cycle will continue and any new audio played
is fed into the loop. If you play something that you really like and want
to keep for more repetitions, press* *Insert* *again immediately after
you’ve played it. One cycle’s worth of material prior to that point will be
kept as the loop, and will repeat according to the* *Feedback* *setting.*
*Rehearse* *is useful for practicing an idea before keeping it as the loop.
If* *InsertMode=Reverse,* *then pressing* *Insert* *at the end of a recording will
end the* *Record* *and immediately start playing the loop backwards.*
## *M**UTE*
*Ending a recording with* *Mute* *is exactly like ending it with* *Record,*
*except that the audible sound will shut off as soon as you press the*
*Mute* *button. Once you’re in* *Mute* *mode, you can restart the sound with
the mute button or with the Alternate Endings under the "Mute"
heading in this chapter.*
## *O**VERDUB*
*Ending a recording with the* *Overdub* *button ends the recording
immediately and toggles* *Overdub* *mode. It’s the equivalent of ending
the* *Record* *by pressing* *Record* *a second time, and then pressing*
# *Record*
# *Continued*
*Reference - Functions 5-49
Overdub* *immediately. If* *Overdub* *was on before the* *Record* *this action
will turn it off. If* *Overdub* *was off it will now be on.*
## *N**EXT*L*OOP*
*If you have the* *MoreLoops* *parameter set greater than one, ending a
recording with* *NextLoop* *immediately ends the recording and puts
you immediately into the next loop.
If* *AutoRecord=On**, the Echoplex immediately continues recording in the
new loop. You can continue playing without any interruption, and have
what you play split into the two loops. This is especially useful for filling
the loops with the various parts of a song while playing continuously.
You just keep pressing Next as you play! This is a great way to record a
verse loop and chorus loop in one pass, as you play them live. If you
continue to press* *NextLoop* *at the end of each part, you can use this
method to record into all of the loops you have set up.
Similarly, if* *LoopCopy=Sound* *or* *LoopCopy=Time**, you can continuously
copy the audio or the time base into new loops as you record them in
one pass.
When* *MoreLoops=1**, ending* *Record* *by pressing* *NextLoop* *stops
recording and begins playing the loop, just as if the recording had been
ended with another press of* *Record**. Note however, that when*
*MoreLoops = 1**,* *NextLoop* *becomes a retrigger button, so* *Record**-to-*
*NextLoop* *can be an interesting way to immediately go into stutters of
your loop.*
# *T*HE LONG PRESS
*Pressing and holding down the* *Record* *button erases the entire current
loop. This is also called a* *Long Press Record**. The loop will then be in*
*Reset,* *and ready for a new recording.*
*5-50 Echoplex Digital Pro Plus User’s Manual*
# *Record*
# *Continued*
# *T*HE EFFECT OF RECORDMODE
*When* *RecordMode=Toggle,* *the* *Record* *button works as described
above. However, when* *RecordMode=Sustain,* *you can only record sounds
while you hold down the button—as soon as you release it, the
recording stops.
When* *RecordMode=Sustain,* *you lose the ability to reset a loop, normally
accomplished by a long press of the* *Record* *button. This may not be a
great loss for you, since a short press of* *Record* *while you play nothing
will create a short loop with no contents. However, there are two
consequences of this approach:*
*n* *A loop that is pseudo-cleared this way will not go into* *AutoRecord* *if you
enter it with* *NextLoop.*
*n* *There is no way to reset all loops in this situation, except to enter a loop
(with* *AutoRecord=Off**) that has not been recorded since power-up. The
orange light under the* *Multiply* *button, signifying that a long press of
that button will reset all loops, does not go on unless the current loop is
completely empty.*
# *U*SING AN AUDIO THRESHOLD
*When a non-zero value for the* *Threshold* *parameter is set, the* *Record*
*function waits until a large enough audio signal appears at the* *Input
jack* *before it actually starts recording. When* *Threshold=0,* *this waiting
is disabled and Recording begins immediately.*
# *Record*
# *Continued*
*Reference - Functions 5-51*
# *S*YNCHRONIZED RECORDING
*When a sync signal is being received by the Echoplex, and* *Sync=In,* *the
Echoplex will* *Record* *loops in sync with the external device’s tempo. Sync
signals can be in the form of MIDI Clock,* *BrotherSync* *from another
Echoplex, or pulses at the* *BeatSync* *input.
During Reset, the* *Overdub LED* *turns yellow to indicate that a Sync has
arrived. When the second Sync point arrives to define the Cycle length,
the* *LoopTime Display* *shows the resulting Cycle time. This cycle time
is determined by the* *8ths/cycle* *setting and the tempo of the incoming
clock. Whenever the* *Overdub LED* *is yellow like this, the next* *Record*
*press will be Synchronized**.*
*Loops recorded in sync will be either exactly this Cycle length, or an
integer multiple of it. You can decide in real-time how many cycles to*
*Record.* *You simply let the Echoplex continue* *Recording* *and it will keep
adding cycles until you stop the Record, at which point it will round off
to the next Cycle point and begin playing back the loop. This is very
similar to the way* *Multiply* *works, so it should be familiar if you have
used* *Multiply.*
## *Q**UANTIZED* S*YNC*
*When* *Quantize=Cycle, 8th, or Loop**, the Cycles are tracked and counted
properly when recording in sync. When* *Record* *is pressed, it will be
quantized to the next sync point defined by the incoming sync signal
before it starts, and again quantized when Record is pressed to end. This
means that if the incoming clock defines a Cycle length of 2 seconds and
you let Record continue to 8 seconds, you will see the multiple counter
counting from 1 to 4. The Cycle boundaries will be set at 2.0 seconds,
and the startpoint will be aligned with the startpoint defined by the
incoming sync.*
*5-52 Echoplex Digital Pro Plus User’s Manual*
# *Record*
# *Continued*
## *U**N*Q*UANTIZED* S*YNC* – S*YNC*R*ECORD*
*SyncRecord* *is a variation of* *Record* *that is automatically done when a
Sync of any type is being received,* *Sync=In**, and* *Quantize=OFF**.
Instead of always quantizing* *Record* *when a sync is being received, the
Echoplex will do a kind of “**Multiply* *over nothing” for this unquantized
case. This means* *SyncRecord* *starts immediately when you press*
*Record**, counts the Cycles on the green multiple display, and rounds off
at the end to fit the loop time defined by the sync.* *SyncRecord* *gives you
freedom from quantization so you can begin recording anytime you
like, while still allowing tight synchronization to an external clock
source.
With* *SyncRecord**, you only need to have received the first sync event to
begin Recording in sync. As you are Recording, the Echoplex will
continue watching the sync to determine what the right cycle times are.
When you press* *Record* *again to end, the Echoplex will automatically
round off to the right point so that your loop is exactly the correct length
to match the sync. This is useful to let you start recording immediately
without waiting for an entire sync period to occur.*
### *See Also: RecordMode, Overflow, Threshold, Sync, SyncRecord, Quantize, Reset*
# *Immediate Action*Rehearse
# *Play Mode*
*Reference - Functions 5-53*
# *Rehearse a part before committing it to the loop.*
*When* *InsertMode=Rehearse,* *pressing* *Insert* *at the end of a recording
puts you in* *Rehearse* *mode.
To use* *Rehearse,* *begin by tapping the* *Record* *button to start recording
a loop. Instead of ending the recording with a second press of the*
*Record* *button, press the* *Insert* *button. You will now be in* *Rehearse*
*mode. The cycle that you’ve just recorded will be played back exactly
once, regardless of the* *Feedback* *setting. The underlying timing of the
cycle will continue and any new audio played is fed into the loop and
repeated one time. This gives you an opportunity to practice ideas for
your loop.
When you play something you really like and want to keep for more
repetitions, press* *Insert* *again immediately after you’ve played it. This
will exit* *Rehearse* *mode and put you in the normal* *Play* *mode. You don’t
have to worry about where the Echoplex thinks the* *StartPoint* *is located.
One cycle’s worth of material prior to the point where you pressed*
*Insert* *will be kept as the loop, and will repeat according to the* *Feedback*
*setting.
Make sure you press* *Insert* *to exit* *Rehearse* *mode after you play the
material you wish to keep, and not after it repeats.*
*Rehearse* *is useful for practicing an idea before keeping it as the loop.*
### *See also: Record, Insert, InsertMode*
*5-54 Echoplex Digital Pro Plus User’s Manual*
# *Replace*Immediate Action
Play Mode
# *Replaces a section of the current loop.*
*When* *InsertMode=Replace,* *the* *Insert* *button becomes the* *Replace*
*button. Each press and release of the* *Replace* *button during* *Play* *mode
will replace a segment of the loop with new material for as long as*
*Replace* *is held down. The overall loop length is not changed.
If* *Quantize=On* *and* *Replace* *is pressed during a cycle, the function will
begin at the end of the current cycle, and will continue to the next cycle
point after* *Replace* *is released again.
When* *InsertMode=Replace* *and* *Insert* *is used as an alternate ending
during a* *Record**, the* *Record* *ends as if you’d pressed the* *Record* *button
and the Replace function immediately begins.*
### *I*
*Resulting Loop*
*􀀀
􀀀􀀀*
*Existing Loop
Button Actions
New Performance*
*Time*
*􀀀
􀀀􀀀
􀀀􀀀
􀀀􀀀*
### *I*
*􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀
􀀀􀀀􀀀􀀀*
*F**IGURE* *4.**X*
*Replacing with the
Insert button.
InsertMode=Replace.*
# *Immediate Action*Reset
# *Play Mode*
*Reference - Functions 5-55*
# *Resets the Current Loop.*
*To* *Reset* *the current loop, press and hold down the* *Record* *button for
about half a second.* *Reset* *erases the contents of the current loop. This is
also called a* *Long-Press Record**. The loop will then be in the* *Reset
State,* *and ready for a new recording.
You can also execute* *Reset* *immediately using MIDI. The* *DirectMIDI Reset*
*command is located at* *Source#+25**.
Although* *Reset* *erases the audio of the loop, it does not cause the
Echoplex to lose sync with external devices. The Echoplex will continue
to track the* *Global MIDI StartPoint* *(or Beat 1 of the sequencer), so that
your next Recording can begin in Sync.*
*Reset* *will also leave intact any tempos you have set using the* *TempoSelect*
*feature and keeps you in the* *TempoSelect* *state. This means if you have
recorded a loop to a preselected BPM tempo, and then* *Reset* *it, the next
loop you record will still follow that tempo. If you do a* *GeneralReset,* *the
Echoplex exists the* *TempoSelect* *state, although your Tempo will be
recalled if you enter it again.*
### *See also: Record, GeneralReset, MIDI Command List, TempoSelect, Global/Local MIDI Clock*
*5-56 Echoplex Digital Pro Plus User’s Manual*
# *Retrigger*Immediate Action
Play Mode
# *Restart a loop from the StartPoint and continue playing.*
*The* *Retrigger* *command instantly restarts the current loop from it’s
StartPoint and then continues looping. This is useful for manually
triggering a loop so that it starts in time with other music.
This is similar to the function called* *SamplePlay**. The difference is that*
*Retrigger* *will continue playing the loop, while* *SamplePlay* *plays it once
and then stops.
There are several ways to access* *Retrigger.*
## *M**UTE*-U*NDO*
*Press* *Mute* *to put the loop into the* *Mute* *state. When you want to*
*Retrigger* *the loop, press* *Undo**. The loop will trigger from the beginning
and continue playing.
Note that the* *MuteMode* *parameter affects this behavior. When*
*MuteMode=Start**, pressing* *Mute* *to leave the* *Mute* *state executes the*
*Retrigger* *function. In other words,* *MuteMode* *swaps the roles of the*
*Mute* *button and* *Undo* *button for leaving* *Mute**. This is useful when
you always want to* *Unmute* *with a* *Retrigger* *command, and prefer a
simpler way to remember it.*
## *N**EXT*L*OOP WITH* M*ORE*L*OOPS*=1
*When* *MoreLoops=1**, the otherwise unused* *NextLoop* *button does the*
*Retrigger* *function. Its LED becomes yellow to indicate it has a different
function than normal. When you press it, the current loop will retrigger
from the start, and then continue looping. This is similar to doing Mute-
Undo to retrigger a loop, but without silence from having to mute first.
This is only available when you have one loop set up in MoreLoops,
since the NextLoop button obviously changes loops otherwise.*
# *Retrigger*
# *Continued*
*Reference - Functions 5-57*
## *MIDI R**ETRIGGER* C*OMMAND*
*The* *Retrigger* *command can be executed directly from MIDI. The*
*Retrigger* *DirectMIDI command is located at* *Source#* *+ 37. So if you have*
*Source#=36* *and* *ControlSource=Notes**, the* *Retrigger* *command will be at
MIDI Note# 73.*
## *MIDI SUS M**UTE*-R*ETRIGGER*
*Another way to execute* *Retrigger* *with MIDI is the* *SUS Mute-Retrigger*
*command. With this command, when you press the appropriate MIDI
button down on your MIDI controller and the loop will immediately go
into* *Mute**. When you release the button, it will* *Retrigger* *the loop.*
*SUS Mute-Retrigger* *is located at* *Source#* *+ 30. So if* *Source#=36* *and*
*ControlSource=Notes**, the* *SUS Mute-Retrigger* *command will be at MIDI
Note# 66. NoteOn 66 will put the loop into* *Mute**, and NoteOff 66 will*
*Retrigger* *it.*
### *See also: Mute, MuteMode, SamplePlay*
*5-58 Echoplex Digital Pro Plus User’s Manual*
# *Reverse*Immediate Action
Play Mode
# *Reverses the direction of the current loop.*
*Reverse* *reverses the playback direction of the current loop, so that the
audio plays backwards.* *Reverse* *can be accessed at most times, and
most functions are available even while the loop is in* *Reverse**.
Since there is no LED specially designated for* *Reverse,* *the* *Insert LED*
*comes on when* *Reverse* *is engaged.
Whenever you engage* *Reverse,* *the front panel* *LoopTime Display* *will
briefly display* *“rE”* *to indicate that* *Reverse* *has started. When you press*
*Reverse* *again to go forward, the display will briefly show* *“Fd”.*
# *A*CCESSING REVERSE
*There are several different ways to access the* *Reverse* *function.
There is no direct* *Reverse* *button on the front panel, however you can
bring this function to the front panel and down to the footpedal by
setting* *InsertMode=Reverse.* *The* *Insert* *button then becomes the*
*Reverse* *button, and* *Reverse* *will take the place of the* *Insert* *function.
If you only need to access* *Reverse* *occasionally and want the* *Insert*
*button available for a different function, there is an indirect method
from the front panel to control* *Reverse.* *In the* *Parameter Matrix* *there
is a space labeled* *Reverse**, in the* *Timing Row* *under the* *Undo*
*button. At any time if you want to access* *Reverse,* *press* *Parameter*
*once, and then press* *Undo**.
Reverse is also available by MIDI. There are several different flavors of
MIDI Reverse:*
*n* *The MIDI VirtualButton* *ReverseButton* *is* *Source# + 13**. This behaves
exactly like the front panel buttons do, in this case as if there were a
front panel* *Reverse* *button.The NoteOn message presses the button,
and the NoteOff message releases the button. If you do a short-press tap*
# *Reverse*
# *Continued*
*Reference - Functions 5-59*
*of the* *ReverseButton,* *you go into* *Reverse,* *and then into* *Forward*
*when you tap it again. If you do a long-press of the* *ReverseButton**, it
will become SUS action and stay in* *Reverse* *as long as you hold the
button, and then go back to* *Forward* *when you release it.*
*n* *DirectMIDI SUSToggleReverse* *is* *Source# + 23**. This is* *Reverse* *with
SUS action, so* *Reverse* *will be engaged as long as the midi button is held.
When it is released the loop will go* *Forward* *again. If you are already in*
*Reverse* *when you use this command, it will actually use SUS action to
put you into* *Forward,* *and then back to* *Reverse* *when you release it.*
*n* *DirectMIDI Reverse* *is* *Source# + 33**. This command always puts the
loop into* *Reverse**. If the loop is already in* *Reverse* *it does nothing.*
*n* *DirectMIDI Forward* *is* *Source# + 32**. This command always puts the
loop into* *Forward**. If the loop is already in* *Forward* *it does nothing.*
# *R*EVERSE AND OTHER FUNCTIONS
## *O**VERDUB*
*If you* *Overdub* *while a reversed loop is playing and then press the*
*Reverse* *button a second time, you’ll hear your original loop play back
forwards and your overdubbed part play backwards. You can easily have
audio going forwards and backwards in loop by combining* *Reverse* *and*
*Overdub.* *This is great for backwards guitar solos or secret messages.
Reverse and Overdub are independent, so you can Reverse the loop
while Overdubbing, and the Overdub will continue.*
## *R**ECORD*
*Reverse* *can be used to end* *Record**, so that the* *Record* *stops and the loop
immediately plays backwards. This is very useful for doing backwards
audio tricks live. You may find this works especially well with the*
*Feedback Knob* *set to* *0* *and the* *Mix Knob* *set to* *Loop**. Note that this*
*5-60 Echoplex Digital Pro Plus User’s Manual*
# *Reverse*
# *Continued*
*only works with the* *Reverse* *button (**InsertMode=Reverse**) or the*
*Reverse VirtualButton**. the* *DirectMIDI Reverse* *has no effect while*
*Recording**.*
## *M**ULTIPLY AND* I*NSERT*
*Loops that have had cycles added to them using* *Multiply* *or* *Insert* *can
be* *Reversed**. You will notice the green* *Multiple Display* *counts the
cycles backwards while the loop is* *Reversed**. You can also engage*
*Multiply* *and* *Insert* *while the loop is* *Reversed**, and they work
normally.
The* *Multiply* *and* *Insert* *functions can be ended with a press of* *Reverse**.
The* *Multiply* *(or* *Insert**) will round off exactly like it normally would.
When it reaches the end of the cycle, the whole loop will immediately
play backwards. In this way you can go directly from* *Multiply* *into*
*Reverse* *without extra button presses.*
# *T*HE EFFECT OF QUANTIZE
*Reverse* *is affected by the setting of* *Quantize.* *If* *Quantize=Cycle, Loop, or
8th,* *the reverse playback will not begin until the end of the current
quantize period, and proceeds backwards from the end of the quantize
period towards the beginning of the loop. If* *Quantize=Off,* *then reverse
playback begins as soon as you press* *Reverse,* *and proceeds from the
time of the button press back towards the start of the loop.*
# *U*NDO AND REVERSE
*It is possible to press* *Undo* *while in* *Reverse. Undo* *during* *Reverse* *works
normally back to the point where* *Reverse* *happened. This means any
overdubs you do while* *Reversing* *can be* *Undone**. However, it is not
possible to* *Undo* *past a* *Reverse,* *since memory really does get used in*
# *Reverse*
# *Continued*
*Reference - Functions 5-61*
*the other direction and overdubs made prior to* *Reverse* *get destroyed by
overdubs made after the* *Reverse.
Record-Undo* *is also possible in* *Reverse**. So if you press* *Record* *by
mistake while in* *Reverse,* *pressing* *Undo* *returns you to where you were.
As a consequence, starting* *Record* *does not automatically force you to
be* *Forward**, but leaves the loop in* *Reverse**.
All of this means that* *Reverse* *and* *Forward* *are really equal, with the
exception that the green* *Multiple Display* *counts backwards when
you are in* *Reverse**.*
### *See also: InsertMode, Quantize, Multiply, Insert, Undo, Record*
*5-62 Echoplex Digital Pro Plus User’s Manual*
# *SamplePlay*Immediate Action
Play Mode
# *Trigger a loop to play once. Can be used to retrigger loops for
# stuttering effects.*
*The* *SamplePlay* *function triggers a loop from the StartPoint, plays it one
time, and then stops by putting the loop into* *Mute**.
While SamplePlay is running, the loop can be retriggered repeatedly to
give stuttering effects.
Pressing* *Undo* *during a* *SamplePlay* *puts you seamlessly back into*
*PlayMode,* *so your loop keeps going instead of stopping at the end. This
is really useful if you are doing a lot of retriggers for stutter effects, and
then finally decide to let the loop keep playing. You just have to press*
*Undo* *and it seamlessly continues!*
# *A*CCESSING SAMPLEPLAY
## *M**UTE*-I*NSERT*
*Mute-Insert* *allows you to do a* *SamplePlay* *from the basic front panel or
footpedal controls. Using this method is simple. First press* *Mute**.When
you want to trigger the loop, press the* *Insert* *button. The loop will
trigger from the* *StartPoint* *and play once, and then return to the* *Mute*
*state. Repeatedly pressing* *Insert* *button will retrigger the loop.*
## *MIDI N**OTE* T*RIGGERS*
*MIDI NoteOn messages can be used to trigger any of the loops you have
created by setting the* *MoreLoops* *parameter greater than 1. If you have*
*SamplerStyle=One**, the loops will be triggered in* *SamplePlay.* *When the
NoteOn message corresponding to a loop is received, the loop will
trigger from its StartPoint, play once, and go to Mute. Repeatedly*
# *SamplePlay*
# *Continued*
*Reference - Functions 5-63*
*playing the same note will retrigger the loop. The* *LoopTrig* *parameter
determines which NoteOn messages correspond to a given loop.*
## *MIDI S**AMPLE*P*LAY* C*OMMAND*
*The* *DirectMIDI* *command* *SamplePlay* *will trigger the current loop and
play it once, exactly as if you had pressed* *Mute-Insert**. The MIDI
location for* *SamplePlay* *is* *Source# + 36**.*
## *B**EAT*S*YNC* J*ACK* T*RIGGER*
*The Echoplex can be set so any trigger received through the* *BeatSync
Jack* *triggers the loop in SamplePlay. This is useful for triggering loops
from a pulse trigger from an external device, an external switch, a drum
trigger, or even an audio signal with a sharp attack. See the BeatSync
section for more information on the types of triggers that can be used in
this flexible input.
To set up the Echoplex to do a* *SamplePlay* *from a* *BeatSync* *trigger, first
set* *Sync=In**. Record your loop as normal, and press* *Mute**. Then press*
*Multiply**. This will arm the Echoplex to wait for a trigger to do a*
*SamplePlay.* *When a trigger is received at the* *BeatSync Jack**, the loop
will trigger from the beginning to play once. Repeated triggers will
retrigger the loop.*
### *See also: Mute, Retrigger, SamplerStyle, MoreLoops, LoopTrig, Sync, BeatSync*
*5-64 Echoplex Digital Pro Plus User’s Manual*
# *StartPoint*Immediate Action
Parameter Row: Timing
# *Changes the logical starting point of a loop.*
*The logical starting point of a loop is the beginning of the first cycle. You
can see when this point comes around by looking at the display—the
green decimal point in the lower-right-corner of the display flashes
briefly at the start of each loop.
Pressing this button makes the instant of the press the new* *StartPoint* *for
the loop.
There are several reasons that you might want to change the starting
point. For one thing, various operations that you perform might set the
starting point to a value that doesn’t make musical sense to you. In a
rhythmic loop with multiple cycles, this would be most evident if the
cycle numbers don’t appear to change on the beat.
The position of the beginning of the loop is important for several
reasons, among them:*
*n* *You can create arhythmic, textural loops where the startpoint isn’t
immediately obvious. At some point, additions to the loop might give it
a rhythmic character. At that point, you may want to redefine the
StartPoint so that other functions behave sensibly, in step with the
rhythm.*
*n* *When you restart the loop from the beginning after muting it, the*
*StartPoint* *is where it begins.*
*n* *Quantized activities occur on multiples of cycles, counted from the
logical starting point.*
*n* *It’s easier to relate to the display if the logical starting point makes
musical sense.*
### *See also: Quantize, Mute, MuteMode*
# *Immediate Action*Substitute
# *Play Mode*
*Reference - Functions 5-65*
# *Replaces a section of the current loop, beginning in the next
# repetition.*
*When* *InsertMode=Sub**, the* *Insert* *button becomes the* *Substitute*
*button.* *Substitute* *has some similarity to the* *Replace* *function. With*
*Replace* *the original loop playback is cut while the replace is done. So
while you are playing something new to replace what was there, you
don’t hear the old loop.* *Replace* *is useful when the new material would
clash with what was there, but oftentimes the result is not very tight
since you don’t have any guide to play along to as you are doing the
Replace.
With* *Substitute* *the original loop playback continues while you are
playing the new material. On the next repetition, only the new audio
will remain in the loop and the old portion will be removed. This helps
keep the groove going while substituting and gives you something to
play along to, as well as giving an overlap between the old portion and
the new portion for continuity.*
*Substitute* *is the same as if you were doing an* *Overdub* *with the* *Feedback*
*turned down to zero only during the* *Overdub.* *However, it is much
easier to just press* *Substitute**!*
# *U*SING SUBSTITUTE
*Substitute* *can be used in several ways:*
*n* *an* *Insert* *button press when* *InsertMode=Sub**.*
*n* *a* *LongMultiply* *(less accurate, see below).*
*n* *a* *Record-Insert* *combination when* *InsertMode=rhr**.*
*n* *the* *Substitute* *MIDI VirtualButton*
*n* *the* *SUS Substitute* *DirectMIDI command*
*5-66 Echoplex Digital Pro Plus User’s Manual*
# *Substitute*
# *Continued*
# *T*HE EFFECT OF QUANTIZE
*When* *Quantize=Off**,* *Substitute* *is an instant function with Sustain action,
same as* *Replace**. This means it is active while the* *Insert* *button is
pressed down and turns off when you release the button.
When* *Quantize=Loop, Cycle, or 8th**, pressing* *Substitute* *down puts the
Echoplex into the waiting state until the next Quantizing point. Once
the* *Substitute* *function starts, releasing it also goes into a waiting state
until the next Quantizing point is reached. If you simply tap the*
*Substitute* *button, it will be active for exactly one Quantize period.
This is very useful for replacing an exact rhythmic element, and letting
the Echoplex keep everything precisely lined up.*
# *S*UBSTITUTE USING LONGMULT I P LY
*One way to activate* *Substitute* *is by doing a Long-Press on the* *Multiply*
*button. This is convenient if you have the* *Insert* *button set for another
function, and are not using MIDI.
However, there is a problem when using the* *LongMultiply* *option for
Substitute. During the first 400ms until the switch action is detected as a
long press, it is treated like a* *Multiply.* *This means the old loop will still
be present in the loop for those 400ms, and only after that it mutes for
the* *Substitute**.
If you have* *Quantize* *on you will not have this problem, since the long
press can happen completely during the ooo waiting phase. When the
Cycle point comes* *Substitute* *is started directly.*
# *Substitute*
# *Continued*
*Reference - Functions 5-67*
# *S*UBSTITUTE FOR REHEARSING
*Substitute* *can be used in similar fashion to the* *Rehearse* *function.
As long as* *Substitute* *is active, all playing is repeated once. This can be
useful to find the groove to start a loop. Just hold* *Substitute* *down as
you play, and when you’ve played something you like let it go!*
# *A*DVANCED USE OF SUBSTITUTE
*If a* *Feedback Pedal* *is connected and you are using some of the
advanced* *InterfaceModes, Substitute* *has some extended functionality that
makes it even more powerful.* *Loop/Delay=StutterMode* *and*
*Loop/Delay=ReplaceMode* *have this capability.
While the* *Feedback Pedal* *continues to do* *Feedback* *during normal
playing, the front panel* *Feedback Knob* *controls the* *Feedback* *just for
the* *Substitute* *function. So you can have different* *Feedback* *settings for
each!
If you have the* *Feedback Knob* *all the way up, The existing audio is
completely preserved as you are adding more. So it turns into
Overdubbing. With the* *Feedback Knob* *turned all the way down, the
existing audio completely disappears on the next repetition, so it is the
normal* *Substitute**. In between is where it is interesting, because you can
choose how much the level of the existing audio should decay each time
you do an "overdub" with* *Substitute* *.*
*5-68 Echoplex Digital Pro Plus User’s Manual*
# *Substitute*
# *Continued*
*In* *ReplaceMode* *the loop output level is also set to 100% during* *Substitute*
*instead of being set by the Pedal as it is otherwise. See the section on the
Loop/Delay parameter for more details on the InterfaceModes .*
### *See also: Replace, Insert, Multiply, Rehearse, InsertMode, Loop/Delay*
# *Immediate Action*SUS Commands
# *Play Mode*
*Reference - Functions 5-69*
# *Changes Multiply and Insert into Real-Time Granular Loop
# commands.*
*One of the values on the InsertMode parameter is called* *SUS**. This is
short for Sustain.*
*InsertMode=Sustain* *changes the way in which the* *Insert* *and* *Multiply*
*buttons work.* *SUS* *turns* *Insert* *and* *Multiply* *into Unrounded functions
with Sustain action on the button. In other words, they start when the
button is pressed and end immediately when it is released, just like*
*Record* *or* *Overdub* *do when* *RecordMode* *or* *OverdubMode=SUS**.
When the function ends it does so as if Record had been pressed as an
alternate ending to the Insert. This is what we call an* *“Unrounded”
Multiply* *or* *Insert,* *because instead of rounding off to the next Cycle
point it is ended immediately and the loop time is redefined.*
# *U*NQUANTIZED SUS COMMANDS
*With* *Quantize=Off* *the effect of* *SUS* *with* *Multiply* *and* *Insert* *allows you to
splice together fragments of sound into a loop.
One use of this is to create very short loops and splice short "grains" of
sound together in real time by tapping on the multiply or insert buttons
as sounds are played into the input. If you hold the button down, the*
*Multiply* *or* *Insert* *goes on as long as you hold it, but if you just tap the
button lightly the functions will only be active for as long as the switch is
contacting. This can be as short as a few milliseconds, allowing you to
splice together very short fragments. The result is a “Granular” loop
where all the fragments, or Grains, of sound together become a new
sound.
Combine* *InsertMode=SUS* *with* *RecordMode=SUS* *and* *OverdubMode=SUS**,
as well as the* *SUS* *MIDI commands to access other functions as a
sustain action. (like* *SUSReplace* *and* *SUSSubstitute**).*
*5-70 Echoplex Digital Pro Plus User’s Manual*
# *SUS Commands*
# *Continued*
*SUS techniques give exciting new timbre and glitch effects, all created in
real-time. Real-Time Granular!*
# *Q*UANTIZED SUS COMMANDS
*With other settings of the* *Quantize* *parameter, the* *SUS Insert* *and* *SUS
Multiply* *start and stop quantized. There will always be an* *Insert* *or*
*Multiply* *of at least one time period as determined by the quantize
setting (**Loop**,* *Cycle* *or* *8th**). Even if you quickly tap the button such that
it is actually released before the start of the function, you will still get
one time period worth of the function. This is very useful when working
with short loops where it is important to maintain a rhythmic length.
With SUS you can get much quicker Inserts and Multiplies than you
could if you had to press the button twice. Note that this quantized
behavior is true with other SUS functions, like* *Replace* *and* *Substitute.*
*With Quantize = CYC it's easy to create rhythmic sequences of sounds
when using SUS commands.
With Quantize = 8th a short press of Multiply will change the loop length
to one Cycle divided by the value of 8th/Cycle.*
### *See also: Multiply, Insert, RecordMode, OverdubMode, Quantize, SUS MIDI Commands,
### MIDI Command List*
# *Sustain Action*SUSNextLoop
# *Play Mode*
*Reference - Functions 5-71*
# *Jump to the Next Loop and back.*
*SUSNextLoop* *is an interesting special case of the* *SUS MIDI Commands*
*described in the MIDI section.* *SUSNextLoop* *is only available as a MIDI
command, and is located at* *Source# + 20**.
With* *SUSNextLoop,* *pressing it puts you into the Next Loop and releasing
it returns you to the previous loop. In other words, NoteOn puts you into
the Next Loop and the NoteOff brings you back. This allows you to
bounce in and out of an alternate loop from your main loop.
Combining* *SUSNextLoop* *with functions like* *AutoRecord* *and* *LoopCopy*
*can give many interesting possibilities for creating alternate loops to
bounce in and out of.
Note that only sending the NoteOff component of* *SUSNextLoop* *gives
you the command* *PreviousLoop.*
### *See also: NextLoop, PreviousLoop, SUS MIDI Commands, MIDI Command List*
*5-72 Echoplex Digital Pro Plus User’s Manual*
# *Undo*Immediate Action
Play Mode
# *Cancels the previous action or erases the previous Overdub
# pass.*
*Undo* *can be used to cancel a function that you’ve already started or to
erase your last few* *Overdub* *passes**, Multiply* *cycles**,* *or* *Insert* *operations.
In situations when your loop length is short compared to the total
amount of memory available in the loop,* *Undo* *is easy to use. When
memory gets short, you may be limited in the number of steps that you
can* *Undo.*
# *B*ASIC UNDO OPERATION
*The basic operation of* *Undo* *is simple:*
*n* *If you have pressed a button by mistake, press* *Undo* *to cancel the
operation. The loop will be restored to the state it was in before you
started the operation, if possible. In this way, if you accidentally press
something like* *Record**, you can recover your loop. The Echoplex even
keeps track of where in the original loop you would have been, so you
can go back to it without even falling out of rhythm!*
*n* *After an operation like* *Overdub* *that changes the loop, a* *Long-Press* *of*
*Undo* *will erase the entire last layer of sound added (if possible).
Additional long presses will erase as many layers of sound as memory
permits, from the most recent to the most remote.*
*n* *A* *Short-Press* *of* *Undo* *will only remove the tail end of the last layer,
beginning at the time of the button press. In this way, if you* *Overdub* *a
passage and play a bad note at the end, you can* *Undo* *just that note and
keep the rest of the* *Overdub**.*
*n* *Undo* *can even remove passes of* *Feedback**. If you reduce* *Feedback* *and
let your loop fade down, each press of* *Undo* *will take away one layer of*
*Feedback* *reduction, so your loop fades back up to the original. If you
combine this with* *Overdub* *you can get very creative results, where you*
# *Undo*
# *Continued*
*Reference - Functions 5-73*
*evolve your loop in one direction with* *Overdub* *and* *Feedback**,* *Undo* *it
back a ways, and then evolve it in a different direction.
Operation of* *Undo* *depends on memory availability. The Echoplex
monitors this for you. When* *Undo* *is possible, you will see the* *Undo
LED* *is green. When it is not possible, the* *Undo LED* *will be off.*
# *A*LTERNAT I V E ROLES FOR UNDO
*The* *Undo* *button serves some alternate roles in certain cases.*
*n* *The* *Undo* *button can be used to escape from* *SamplePlay. SamplePlay* *is
where a loop has been triggered to play once like a sampler, and allows
retriggering and stuttering effects. Pressing* *Undo* *during a* *SamplePlay*
*puts you seamlessly back into* *PlayMode,* *so your loop keeps going
instead of stopping at the end. This is really useful if you are doing a lot
of retriggers for stutter effects, and then finally decide to let the loop
keep playing. You just have to press* *Undo* *and it seamlessly continues!*
*n* *When a loop is in* *Mute,* *pressing* *Undo* *triggers the loop to come out of*
*Mute* *and start playing from the* *StartPoint.* *Normally when you come out
of* *Mute* *by pressing* *Mute* *again, the loop comes back on where it
would be if it had continued playing. Note that the* *MuteMode* *parameter
reverses these roles.*
*n* *The* *Undo* *button is how you access the* *TempoSelect* *function while in*
*Reset.* *See the* *TempoSelect* *section in this chapter for more information
on using this feature.*
# *C*ONTROLLING UNDO WITH MIDI
*Several MIDI commands are available for controlling* *Undo**. These can
give you more flexibility than the front panel* *Undo* *button alone.*
*n* *The* *Undo VirtualButton* *MIDI command is located at* *Source# + 7**.
This command emulates the action of the front panel Undo button, and*
*5-74 Echoplex Digital Pro Plus User’s Manual*
# *Undo*
# *Continued*
*is exactly equivalent to using it in every way. For example, holding the*
*Undo VirtualButton* *down for half a second will do a* *Long-Press* *of*
*Undo**.*
*n* *The* *DirectMIDI ShortUndo* *command is located at* *Source# + 19**. This
command is the same as doing a* *Short-Press* *of the* *Undo* *button, and
will* *Undo* *material in an* *Overdub* *from the point where the command is
sent to the end of the loop.*
*n* *The* *DirectMIDI LongUndo* *command is located at* *Source# + 31**. This
command is the same as doing a* *Long-Press* *of the* *Undo* *button, and
will immediately* *Undo* *an entire* *Overdub* *pass. With the* *LongUndo*
*command there is no need to hold it down for a long press, it happens
immediately.*
# *U*NDER THE HOOD
*If you really want to understand the way that* *Undo* *interacts with
memory limitations, you have to take a look at the way memory is used
and understand the concept of the* *Playback Loop,* *all of which we’ll
explain in the next few paragraphs.*
# *When Memory Is Ample*
*Figure 4.11* *shows the normal operation of* *Overdub* *in a situation where
memory is ample. When the* *Overdub* *button is first pressed, the
Echoplex copies the beginning of the loop to a new memory area
(marked "A" in the diagram). It then mixes the previously-recorded
material with the new material into area B. When the* *Overdub* *ends, it
copies the remainder of the original loop to area C. This fills out seconds
40-80 of memory with a complete loop, the result of the* *Overdub. The*
*Echoplex then alters its* *playback loop* *so that the new recording is heard,
even though the original recording also resides in memory.*
# *Undo*
# *Continued*
*Reference - Functions 5-75*
*If, instead of completing the* *Overdub* *normally, you press the* *Undo*
*button to terminate it, the Echoplex simply resets the* *playback loop* *to
play back the first 40 seconds and marks the memory area that it was
using for the* *Overdub* *as available for the next operation.*
# *When Memory Is Tight*
*Now let’s look at what happens in a tight memory situation.* *Figure 4.12*
*shows the course of an* *Overdub/Undo* *when the original loop is 40
seconds long, and total memory is 50 seconds. As before, when you first
press the* *Overdub* *button, the Echoplex copies the beginning of the
existing loop to a free area at the end of memory. In this case, that
segment occupies all of free memory (the original loop was 40 seconds
long,* *Overdub* *is pressed at 10 seconds into the loop, so 10 seconds is
copied to free memory, filling it).
O*
*Audible Results* 
*􀀀􀀀
􀀀*
*Existing Loop
Button Actions
New Performance
1 loop*
*O* *􀀀􀀀
􀀀􀀀*
*Memory
40 seconds
0 40
Playback loop
80 100
Empty* *􀀀􀀀*
*After Overdub*
*A B C*
*F**IGURE* *4.11
Basic operation of
Overdub when memory is
ample.*
*5-76 Echoplex Digital Pro Plus User’s Manual*
# *Undo*
# *Continued*
*At this point, there’s nowhere to put the new material mixed with the
old. So the Echoplex starts overwriting the original loop. By the time the*
*Undo* *button is pressed, 30 seconds of material have been newlyrecorded:
the 10 seconds copied from the first loop, plus 20 seconds of
mixed material. This mixed material has overwritten the first 20 seconds
of the original loop. There’s no way to* *Undo**, because the original loop is
gone.
In this case, that press of the* *Undo* *button will set the* *playback loop* *to
play back seconds 0-40 of memory. But what you will hear will not be
the original loop; instead, it will be the final 20 seconds of the* *Overdub*
*followed by the final 20 seconds of the original loop. It’s an interesting
effect, but it may not be what you were shooting for.*
*􀀀􀀀
􀀀􀀀*
*Existing Loop
Button Actions
New Performance
Memory*
### *O U*
*0 10 20 30 40 50
Playback loop*
*􀀀􀀀
􀀀􀀀*
*1st 10 seconds of Overdub
recording
Final 20 seconds of Overdub
recording. The total length of 
newly-recorded material is 30
seconds, from the start of the
loop until the time Undo was
pressed).
Remnants of original loop*
*F**IGURE* *4.12
The difficulty of Undoing in
tight memory situations*
# *Undo*
# *Continued*
*Reference - Functions 5-77*
# *Undoing Multiple Layers*
*When you leave* *Overdub* *on for a long time, recording moves to a new
area of memory each time you pass the loop’s start point. If your loop is
short compared to the amount of memory available, then a number of*
*Overdub* *cycles can pass before overwriting of memory starts to occur. If
you end the* *Overdub* *before any overwriting occurs, then you’ll be able
to* *Undo* *each layer in succession, until you return to your original
recording. If overwriting occurs, then you’ll only be able to* *Undo* *back to
the last fully-intact recording.*
# *Arming Undo*
*Undo* *can be executed even when the* *Undo LED* *is not green. It will be
executed as soon as the* *Undo LED* *lights up, so you can easily* *Un**do the
maximum possible without struggling to press* *Undo* *at the right
moment. This is an improvement over previous versions of the
Echoplex, where you could have a loop with only a short area containing
an overdub that was undoable. The* *Undo LED* *turns on and off in such
a case to indicate when you are in the Undoable section. In older
versions you could only tap* *Undo* *during that time for it to work. Now
you can tap it any time and it will be done for you.*
# *Preventing Extra Undo Presses*
*Undo* *checks whether there may be a whole loop length in memory
without changes. If there is,* *Undo* *acts twice when you press it. This
eliminates the potentially frustrating cases where you might press*
*Undo* *and it appears that nothing happens. You would have to press*
*Undo* *twice to get rid of a bit you had just listened to. This makes* *Undo*
*feel a lot more responsive for some users.
The Echoplex also monitors whenever a pass of the loop has completed
and nothing has been done to change it. When this happens the
Echoplex automatically does what we call an* *AutoUndo**.*
*5-78 Echoplex Digital Pro Plus User’s Manual*
# *Undo*
# *Continued*
*Ordinarily, the Echoplex is always preparing for the possibility that you
might make a change at some point in the loop by writing the current
loop data into a new section of memory. Then if you do an* *Overdub* *at
the end of the loop, your previous version is safely stored for future uses
of* *Undo**. The new version is already in memory and becomes the new
loop that is played. However, if we get to the end of the loop and no
changes have been made we don’t want to waste new memory with an
exact copy of the previous section of memory. We also don’t want you to
have to press* *Undo* *numerous times to find the last section where a
change was made. So the Echoplex does an* *AutoUndo**, which
effectively puts it back in the previous memory area with the latest
version of the loop.*
*AutoUndo* *is even done if you leave on* *Overdub* *but do not actually
play anything. The Echoplex saves you from accidentally wasting
memory in this way, so that the next time you press* *Undo* *you really*
*Undo* *something from your loop.
The* *AutoUndo LED* *allows you to see* *AutoUndo* *in action. This LED is
the decimal point at the lower right of the* *Loop Display**. Every time an*
*AutoUndo* *occurs, it will blink faintly. This can be a useful way to
monitor the Echoplex if you ever feel that* *Undo* *is not doing what you
expect.
All of this occurs behind the scenes, and is certainly not necessary to
understand in order to use the Echoplex. It is presented here for those
who wish to understand a bit more about how it all works.*
