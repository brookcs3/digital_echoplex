# Echoplex Digital Pro Plus State Machine Analysis

## Overview
This document provides a comprehensive analysis of the Echoplex Digital Pro Plus state machine based on the official manual documentation. This analysis is intended to guide the implementation of proper state management in the WebAudioAPI version.

## Core Loop States

### 1. **RESET** (Empty State)
- **Characteristics**: Loop is completely empty, no audio recorded
- **Display**: Shows only decimal point in LoopTime display
- **LED Status**: All function LEDs off except available actions
- **Entry Conditions**: Long press Record button, GeneralReset, or first power-on
- **Available Actions**: Record, TempoSelect (via Undo), Parameter editing
RESET State Overview for the Echoplex Digital Pro Plus
Characteristics

Loop Status: The loop is completely empty, with no audio recorded. 
Display: The LoopTime display shows only a decimal point, indicating an empty state. 
LED Status: All function LEDs are off, except for those indicating available actions. 

Entry Conditions

Long Press Record Button: Holding the Record button for half a second resets the current loop. 
GeneralReset: A long press of the Multiply button while in a reset loop clears all loops. 
First Power-On: The device starts in the RESET state upon initial power-up. 

Available Actions

Record: Begin recording a new loop. 
TempoSelect: Accessed via Undo, allows setting tempo before recording. 
Parameter Editing: Modify device parameters while in RESET. 


Additional Notes

GeneralReset Behavior: Exits the TempoSelect state if active, but retains the previously set tempo for recall. 
Sync Compatibility: RESET does not disrupt synchronization with external devices; the Echoplex continues tracking the Global MIDI StartPoint. 




### 2. **RECORD** (Recording State)
- **Characteristics**: Actively recording new loop content
- **Display**: Shows elapsed recording time counting up
- **LED Status**: Record LED red
- **Entry Conditions**: Short press Record from Reset or any Play state
- **Available Actions**: 
  - End Record (Record button)
  - Alternate endings (Undo, Insert, Mute, Overdub, NextLoop)
  - Cancel with Undo (if memory permits)

RECORD State Overview for the Echoplex Digital Pro Plus
Characteristics

Loop Status: Actively recording new loop content. 
Display: The LoopTime display shows elapsed recording time, counting up in real-time. 
LED Status: The Record LED glows red, indicating the active recording state.

Entry Conditions

Short Press Record: Initiates recording from either the Reset state or any Play state. 

Available Actions

End Record: Press the Record button again to stop recording and transition to Play mode. 
Alternate Endings:

Undo: Cancels the recording and restores the loop to its previous state (if memory permits). 
Insert: Ends recording and starts Insert mode, depending on the InsertMode parameter. 
Mute: Ends recording and mutes the loop immediately. 
Overdub: Ends recording and toggles Overdub mode. 
NextLoop: Ends recording and transitions to the next loop (if MoreLoops > 1).


Cancel Recording: Press Undo during recording to cancel the operation entirely. 

Additional Notes

Memory Constraints: Undo is unavailable if the device lacks sufficient memory to store both the new and previous loop states. 
Sync Compatibility: Recording can be synchronized with external MIDI or BeatSync signals, ensuring precise loop alignment. 
Threshold Parameter: If set, recording begins only when the input signal exceeds the defined threshold. 


### 3. **PLAY** (Playback State)
- **Characteristics**: Loop playing back continuously
- **Display**: Shows loop length, cycle indicators flash
- **LED Status**: Most function LEDs green (available)
- **Entry Conditions**: Completing Record, exiting other states
- **Available Actions**: All primary functions (Overdub, Multiply, Insert, Mute, etc.)
PLAY State Overview for the Echoplex Digital Pro Plus
Characteristics

Loop Status: The loop plays back continuously without interruption. 
Display: The LoopTime display shows the length of the loop, and cycle indicators flash to denote the Loop StartPoint and Cycle StartPoint. 
LED Status: Most function LEDs are green, indicating their availability for use.

Entry Conditions

Completing Record: Transition to Play mode occurs automatically after recording ends. 
Exiting Other States: Play mode is entered when exiting states like Overdub, Multiply, or Insert. 

Available Actions

Primary Functions:

Overdub: Add new material to the loop. 
Multiply: Extend the loop by repeating cycles. 
Insert: Add new cycles or modify existing ones. 
Mute: Silence the loop without erasing it. 
Undo: Remove recent changes or overdubs. 
NextLoop: Switch to another loop if multiple loops are set up. 


Alternate Functions:

Reverse: Play the loop backward (requires InsertMode=Reverse). 
HalfSpeed: Play the loop at half speed (requires InsertMode=HalfSpeed). 
Replace: Replace sections of the loop with new material (requires InsertMode=Replace). 



User Interface Details

Control Layout:

The front panel includes buttons for Record, Overdub, Multiply, Insert, Mute, Undo, and NextLoop. 
The LoopTime display provides real-time feedback on loop length and cycle indicators.
LEDs under each button indicate their status: green (available), red (active), or orange (alternate function). 


Interaction Patterns:

Buttons support short presses for immediate actions and long presses for alternate functions. 
MIDI VirtualButtons allow remote control of front-panel functions via MIDI commands.



Audio Processing Details

DSP Algorithms:

Continuous playback of recorded loops with real-time modifications (Overdub, Multiply, etc. ).
Feedback control allows gradual fadeouts or evolution of loops. 
Reverse and HalfSpeed operations modify playback speed and direction. 


Parameter Interdependencies:

Feedback is scaled during Overdub and Multiply to prevent overload. 
InsertMode determines the behavior of the Insert button (e.g., Reverse, HalfSpeed, Replace).


Latency: Minimal latency during playback and real-time operations. 

Technical Specifications

Input/Output Configurations:

High-impedance input for instruments, microphones, or line-level signals. 
Line-level output with adjustable volume via the Output knob. 


Control Parameters:

Feedback: Adjustable from 0% to 100% via the Feedback knob or MIDI Continuous Controller. 
Mix: Balances input signal and loop playback. 
Output: Controls overall output volume. 


Signal Routing:

Input signal is routed to the loop and output simultaneously, with levels controlled by Mix and Feedback. 


MIDI Implementation:

MIDI VirtualButtons emulate front-panel controls. 
MIDI Continuous Controllers adjust Feedback and Volume. 
MIDI SysEx allows parameter editing and preset management. 



Implementation Notes for Web-Based Emulation

Web Audio API Nodes:

Use AudioBufferSourceNode for loop playback.
Implement GainNode for Feedback and Mix control. 
Use ScriptProcessorNode for real-time DSP operations like Reverse and HalfSpeed. 


UI Component Specifications:

Create interactive buttons for Record, Overdub, Multiply, Insert, Mute, Undo, and NextLoop. 
Include a dynamic display for loop length and cycle indicators. 
Use color-coded LEDs to indicate button states. 


State Management:

Maintain loop state (length, cycles, playback direction) in a central store.
Track active functions and parameter values for real-time updates. 


Performance Considerations:

Optimize audio processing to minimize latency. 
Ensure smooth transitions between states (e.g., Record to Play).


### 4. **OVERDUB** (Overdubbing State)
- **Characteristics**: Adding layers to existing loop
- **Display**: Loop length shown, overdub activity indicator
- **LED Status**: Overdub LED red
- **Entry Conditions**: Press Overdub from Play state
- **Available Actions**: 
  - End Overdub (Overdub button)
  - Other functions can be executed simultaneously
  - Cancel with Undo
OVERDUB State Overview for the Echoplex Digital Pro Plus
Characteristics

Loop Status: Adds new audio layers to the existing loop without altering its length. 
Display: The LoopTime display shows the loop length, with an indicator for overdub activity. 
LED Status: The Overdub LED glows red, signaling active overdubbing. 

Entry Conditions

Press Overdub: Initiates overdubbing from the Play state. 

Available Actions

End Overdub: Press the Overdub button again to stop overdubbing. 
Simultaneous Functions: Other functions (e.g., Reverse, Multiply, Insert) can be executed while overdubbing. 
Cancel Overdub: Press Undo to erase the overdub layer and revert to the previous loop state. 

Additional Notes

OverdubMode Parameter:

Toggle: Overdub starts/stops with button presses. 
Sustain: Overdub is active only while the button is held down. 


Simultaneous Overdub: Long-press Overdub while executing other functions (e.g., Reverse) for combined effects. 
Memory Constraints: Undo is unavailable if memory is insufficient to store both the new and previous loop states.
Feedback Control: During overdubbing, feedback is adjusted to prevent signal overload. 

Technical Specifications

Signal Routing:

Input signal is mixed with the existing loop during overdubbing. 
Feedback determines the decay rate of previous layers. 


DSP Algorithms:

Real-time mixing of input and loop audio.
Memory allocation for undoable overdub layers. 


Latency: Minimal latency ensures seamless layering during overdubbing. 

Interaction Patterns

Button Behavior:

Short press toggles overdub. 
Long press sustains overdub while enabling simultaneous functions. 


Visual Feedback:

Overdub LED indicates active state.
LoopTime display updates dynamically during overdubbing. 



Implementation Notes for Web-Based Emulation

Web Audio API Nodes:

Use GainNode for feedback control. 
Implement AudioBufferSourceNode for loop playback.
Use ScriptProcessorNode for real-time mixing.


UI Component Specifications:

Create an Overdub button with toggle and 


### 5. **MULTIPLY** (Multiply State)
- **Characteristics**: Extending loop by integer multiples of original cycle
- **Display**: Multiple counter shows current cycle number
- **LED Status**: Multiply LED red
- **Entry Conditions**: Press Multiply from Play state
- **Available Actions**:
  - End Multiply (Multiply button - rounded)
  - Alternate endings (Record for unrounded, Undo, Reverse, etc.)
  - MultiIncrease for automatic ending
MULTIPLY State Overview for the Echoplex Digital Pro Plus
Characteristics

Loop Status: Extends the loop by integer multiples of the original cycle length. 
Display: The Multiple Display shows the current cycle number during multiplication. 
LED Status: The Multiply LED glows red, indicating active multiplication. 

Entry Conditions

Press Multiply: Initiates multiplication from the Play state. 

Available Actions

End Multiply:

Press Multiply again to stop multiplication and round off the loop length. 
Alternate endings include pressing Record for unrounded multiplication, Undo, Reverse, or other function buttons.


MultiIncrease:

Tap Multiply multiple times during the rounding period to predetermine the number of cycles to multiply. 
The number of cycles is briefly displayed as C during tapping. 


Cancel Multiply:

Press Undo to revert the loop to its state before multiplication. 



Additional Notes

Quantize Parameter:

When Quantize=On, multiplication starts at the next cycle point and ends at the next cycle point after the second press. 
When Quantize=Off, multiplication starts immediately and rounds off to the nearest cycle point.


Unrounded Multiply:

Press Record during the rounding period to force an unrounded multiplication, redefining the loop length without completing the cycle. 


Memory Constraints:

Multiply is limited by the available memory. If memory is exceeded, the operation is undone, and the display shows three dashes (---). 



Technical Specifications

Signal Routing:

Input signal is mixed with the existing loop during multiplication. 
Feedback determines the decay rate of previous layers. 


DSP Algorithms:

Real-time mixing of input and loop audio. 
Memory allocation for undoable multiplication layers. 


Latency: Minimal latency ensures seamless layering during multiplication.

Interaction Patterns

Button Behavior:

Short press toggles multiplication. 
Long press resets all loops when MoreLoops > 1. 


Visual Feedback:

Multiply LED indicates active state.
Multiple Display updates dynamically during multiplication. 



Implementation Notes for Web-Based Emulation

Web Audio API Nodes:

Use GainNode for feedback control. 
Implement AudioBufferSourceNode for loop playback.
Use ScriptProcessorNode for real-time mixing.


UI Component Specifications:

Create a Multiply button with toggle and MultiIncrease modes. 
Include dynamic LED indicators for Multiply state.
Display cycle count and rounding status in real-time.


State Management:

Track Multiply state and memory allocation for undo functionality. 
Manage alternate endings and MultiIncrease interactions. 


Performance Considerations:

Optimize audio processing to minimize latency.
Ensure smooth transitions between Multiply and other states. 



### 6. **INSERT** (Insert State)
- **Characteristics**: Adding new cycles to existing loop
- **Display**: Shows insertion progress
- **LED Status**: Insert LED red
- **Entry Conditions**: Press Insert from Play state (when InsertMode=Insert)
- **Available Actions**:
  - End Insert (Insert button - rounded)
  - Alternate endings (Record for unrounded, Undo, etc.)
INSERT State Overview for the Echoplex Digital Pro Plus
Characteristics

Loop Status: Adds new cycles to the existing loop, modifying its length. 
Display: The LoopTime display shows insertion progress, including the number of cycles added. 
LED Status: The Insert LED glows red, indicating active insertion. 

Entry Conditions

Press Insert: Initiates insertion from the Play state when InsertMode=Insert. 

Available Actions

End Insert:

Press Insert again to stop insertion and round off the loop length. 
Alternate endings include pressing Record for unrounded insertion, Undo, or other function buttons. 


Quantized Insert:

If Quantize=On, insertion starts at the next cycle point and ends at the next cycle point after the second press. 


Cancel Insert:

Press Undo to revert the loop to its state before insertion. 



InsertMode Variations

InsertMode=Insert: Adds exact cycles to the loop, rounding off to the nearest cycle point unless forced to end unrounded. 
InsertMode=Replace: Replaces sections of the loop with new material.
InsertMode=Rehearse: Allows playback of the newly recorded cycle once before committing it to the loop. 
InsertMode=Reverse: Plays the loop backward after insertion. 
InsertMode=HalfSpeed: Plays the loop at half speed (octave lower) during insertion. 
InsertMode=Sustain: Turns Insert into an unrounded function that starts and ends immediately with button presses. 

Additional Notes

Quantize Parameter:

When Quantize=Off, insertion starts immediately and ends based on user input. 
When Quantize=On, insertion aligns with rhythmic points (e.g., cycle start/end).


RoundMode Parameter:

Determines whether insertion rounds off to the nearest cycle or ends unrounded. 


Memory Constraints:

Insert is limited by available memory. If memory is exceeded, the operation is undone, and the display shows three dashes (---). 



Technical Specifications

Signal Routing:

Input signal is mixed with the existing loop during insertion. 
Feedback determines the decay rate of previous layers. 


DSP Algorithms:

Real-time mixing of input and loop audio.
Memory allocation for undoable insertion layers. 


Latency: Minimal latency ensures seamless layering during insertion. 

Interaction Patterns

Button Behavior:

Short press toggles insertion. 
Long press sustains insertion while enabling simultaneous functions.


Visual Feedback:

Insert LED indicates active state. 
LoopTime display updates dynamically during insertion. 




### 7. **MUTE** (Muted State)
- **Characteristics**: Loop continues internally but output is silenced
- **Display**: Loop continues counting (if MuteMode=Continuous)
- **LED Status**: Mute LED red
- **Entry Conditions**: Press Mute from any audible state
- **Available Actions**:
  - Unmute (Mute button - behavior depends on MuteMode)
  - Retrigger (Undo button)
  - SamplePlay (Insert button)
  - ReAlign (Multiply button)

Updated Description of the MUTE State
Characteristics

The loop continues running internally, but the audio output is silenced. 
If MuteMode=Continuous, the loop continues counting even while muted. 

Display

The loop timer continues counting during mute if MuteMode=Continuous. 

LED Status

The Mute LED lights up red to indicate the muted state.

Entry Conditions

Press the Mute button from any audible state to enter the muted state. 

Available Actions While Muted

Unmute:

Press the Mute button again. 
Behavior depends on the MuteMode setting:

MuteMode=Start: Loop restarts from the beginning.
MuteMode=Continuous: Loop resumes from its current position. 




Retrigger:

Press the Undo button to retrigger the loop. 
Retriggering uses the opposite value of MuteMode (e.g., if MuteMode=Start, Undo behaves as if MuteMode=Continuous). 


SamplePlay:

Press the Insert button to play the loop once and return to mute.
If Quantize=On, playback starts at the end of the current cycle. 


ReAlign:

Press the Multiply button to execute ReAlign. 
Aligns the loop with external devices or MIDI sync sources.



Long Press Behavior

Holding the Mute button silences the loop output until released. 
The loop continues running internally during the long press, regardless of MuteMode. 


Additional Notes

Quantize affects the timing of actions like SamplePlay and ReAlign.
ReAlign is particularly useful for synchronizing the loop with external sequencers or devices after a stop/restart.


Suggestions for Next Steps

Expand on ReAlign functionality and its interaction with MIDI sync modes. 
Provide implementation details for MuteMode in a web-based emulation.


### 8. **REVERSE** (Reversed Playback State)
- **Characteristics**: Loop plays backwards
- **Display**: "rE" briefly shown when engaged, "Fd" when returning to forward
- **LED Status**: Insert LED indicates reverse state
- **Entry Conditions**: Press Reverse button (InsertMode=Reverse)
- **Available Actions**: Most functions available, Multiple display counts backwards
Updated Description of the REVERSE State
Characteristics

The loop plays backwards, reversing the playback direction of the audio. 
Reverse can be engaged at any time during playback, recording, or other functions. 

Display

The LoopTime Display briefly shows "rE" when Reverse is engaged. 
When returning to forward playback, the display briefly shows "Fd". 

LED Status

The Insert LED lights up to indicate the Reverse state. 

Entry Conditions

Press the Reverse button (or Insert button if InsertMode=Reverse) to toggle Reverse playback. 

Available Actions While Reversed

Overdub:

Overdub works normally during Reverse playback. 
Overdubbed audio plays forward when the loop is toggled back to forward playback. 


Record:

Reverse can be used to end a Record operation, immediately starting reversed playback. 
Useful for live backward audio effects. 


Multiply and Insert:

Both functions work normally during Reverse playback. 
The green Multiple Display counts cycles backward while the loop is reversed. 
Multiply or Insert can be ended with Reverse, rounding off the function and toggling playback direction. 


Undo:

Undo works normally during Reverse playback, but cannot undo past the point where Reverse was engaged.
Record-Undo is possible in Reverse, allowing recovery of the loop state before recording. 



Quantize Effects

If Quantize=Cycle, Loop, or 8th, Reverse playback begins at the end of the current quantize period and proceeds backward. 
If Quantize=Off, Reverse playback begins immediately upon pressing the Reverse button.

MIDI Implementation

Reverse can be controlled via MIDI commands:

VirtualButton ReverseButton: Source# + 13 (short press toggles Reverse; long press engages SUS action).
DirectMIDI Reverse: Source# + 33 (always engages Reverse playback). 
DirectMIDI Forward: Source# + 32 (always engages forward playback). 
DirectMIDI SUSToggleReverse: Source# + 23 (SUS action toggles Reverse while held). 



Advanced Use Cases

Combine Reverse with Overdub for creative effects, such as backward guitar solos or layered loops with mixed playback directions. 
Use Reverse to end Multiply or Insert operations for seamless transitions into backward playback.


### 9. **REPLACE** (Replace State)
- **Characteristics**: Replacing sections of loop without changing length
- **Display**: Normal loop display
- **LED Status**: Insert LED red (when InsertMode=Replace)
- **Entry Conditions**: Press Insert when InsertMode=Replace
- **Available Actions**: End Replace (release Insert button)
Updated Description of the REPLACE State
Characteristics

The Replace state allows users to overwrite sections of the loop without altering its overall length. 
Audio recorded during Replace overwrites the existing loop content in real time. 

Display

The LoopTime Display remains unchanged, showing the normal loop timer during Replace.

LED Status

The Insert LED lights up red to indicate the Replace state when InsertMode=Replace is active. 

Entry Conditions

Press the Insert button when InsertMode=Replace is selected to enter the Replace state. 

Available Actions While Replacing

End Replace:

Release the Insert button to exit the Replace state. 
The loop resumes normal playback with the newly replaced audio seamlessly integrated. 


Undo:

Undo can reverse the Replace operation, restoring the loop to its state before Replace was engaged. 
Undo is limited to the most recent Replace action.


Overdub:

Overdub can be layered on top of the replaced audio after exiting Replace. 
Overdub cannot be used simultaneously with Replace.


Quantize Effects:

If Quantize=Cycle, Loop, or 8th, Replace begins at the end of the current quantize period. 
If Quantize=Off, Replace begins immediately upon pressing the Insert button. 



Advanced Replace Techniques

Replace can be used creatively to overwrite specific sections of the loop, such as replacing a single cycle or a rhythmic phrase. 
Combine Replace with Undo for iterative refinement of loop content.

MIDI Implementation

Replace can be controlled via MIDI commands:

VirtualButton InsertButton: Source# + 14 (short press toggles Replace; long press engages SUS action). 
DirectMIDI Replace: Source# + 34 (always engages Replace). 
DirectMIDI EndReplace: Source# + 35 (ends Replace operation).
DirectMIDI SUSToggleReplace: Source# + 24 (SUS action toggles Replace while held). 



Quantize and Replace

Replace is highly dependent on Quantize settings for precise timing:

Quantize=Cycle: Replace aligns with the end of the current cycle. 
Quantize=Loop: Replace aligns with the loop boundary. 
Quantize=8th: Replace aligns with the nearest eighth note. 
Quantize=Off: Replace begins immediately. 




### 10. **SUBSTITUTE** (Substitute State)
- **Characteristics**: Similar to Replace but with different timing behavior
- **Display**: Normal loop display
- **LED Status**: Insert LED red (when InsertMode=Substitute)
- **Entry Conditions**: Press Insert when InsertMode=Substitute
- **Available Actions**: End Substitute (release Insert button)
Updated Description of the SUBSTITUTE State
Characteristics

Substitute allows replacing sections of the loop while the original playback continues. 
The new audio overlaps with the old audio during the substitution, ensuring continuity. 
On the next repetition, only the new audio remains in the loop, and the old portion is removed. 

Display

The LoopTime Display remains unchanged, showing the normal loop timer during Substitute. 

LED Status

The Insert LED lights up red to indicate the Substitute state when InsertMode=Substitute is active. 

Entry Conditions

Press the Insert button when InsertMode=Substitute is selected to enter the Substitute state. 

Available Actions While Substituting

End Substitute:

Release the Insert button to exit the Substitute state. 
The loop resumes normal playback with the substituted audio seamlessly integrated. 


Undo:


Undo can reverse the Substitute operation, restoring the loop to its state before Substitute was engaged.
Undo is limited to the most recent Substitute action.


Quantize Effects:

If Quantize=Cycle, Loop, or 8th, Substitute begins at the end of the current quantize period. 
If Quantize=Off, Substitute begins immediately upon pressing the Insert button. 



Advanced Substitute Techniques

Substitute can be used creatively to replace specific sections of the loop while maintaining rhythmic precision. 
Combine Substitute with Undo for iterative refinement of loop content.

MIDI Implementation

Substitute can be controlled via MIDI commands:

VirtualButton SubstituteButton: Source# + 10 (short press toggles Substitute; long press engages SUS action). 
DirectMIDI Substitute: Source# + 22 (always engages Substitute).
DirectMIDI EndSubstitute: Source# + 23 (ends Substitute operation). 
DirectMIDI SUSSubstitute: Source# + 22 (SUS action toggles Substitute while held). 



Quantize and Substitute

Substitute is highly dependent on Quantize settings for precise timing:

Quantize=Cycle: Substitute aligns with the end of the current cycle.
Quantize=Loop: Substitute aligns with the loop boundary. 
Quantize=8th: Substitute aligns with the nearest eighth note. 
Quantize=Off: Substitute begins immediately. 



Feedback Control During Substitute

If a Feedback Pedal is connected, the front panel Feedback knob controls feedback specifically for Substitute. 
Feedback settings can range from:

Full Feedback: Existing audio is preserved, creating an overdubbing effect. 
Zero Feedback: Existing audio is completely replaced by the new audio. 
Intermediate Feedback: Allows gradual decay of existing audio during substitution. 



### 11. **REHEARSE** (Rehearse State)
- **Characteristics**: Practice mode before committing to loop
- **Display**: Shows rehearsal progress
- **LED Status**: Insert LED red (when InsertMode=Rehearse)
- **Entry Conditions**: Press Insert when InsertMode=Rehearse
- **Available Actions**: Commit (Insert button), Continue rehearsing
Updated Description of the REHEARSE State
Characteristics

The Rehearse state allows users to practice a part before committing it to the loop. 
Audio played during Rehearse is fed into the loop and repeated exactly once, regardless of the Feedback setting. 
The underlying timing of the cycle continues, enabling seamless rehearsal of ideas. 

Display

The LoopTime Display shows the rehearsal progress, maintaining the normal loop timer. 

LED Status

The Insert LED lights up red to indicate the Rehearse state when InsertMode=Rehearse is active. 

Entry Conditions

Press the Insert button when InsertMode=Rehearse is selected to enter the Rehearse state. 

Available Actions While Rehearsing

Commit:

Press the Insert button again to exit Rehearse mode and commit the rehearsed audio to the loop. 
One cycle’s worth of material prior to the point where Insert was pressed will be kept as the loop. 


Continue Rehearsing:

Continue playing new audio, which will be fed into the loop and repeated once for further practice. 


Undo:


Undo can reverse the Rehearse operation, restoring the loop to its state before Rehearse was engaged. 

Quantize Effects

If Quantize=Cycle, Loop, or 8th, Rehearse begins at the end of the current quantize period.
If Quantize=Off, Rehearse begins immediately upon pressing the Insert button. 

Advanced Rehearse Techniques

Rehearse is ideal for practicing rhythmic or melodic ideas before committing them to the loop. 
Combine Rehearse with Undo for iterative refinement of loop content. 

MIDI Implementation

Rehearse can be controlled via MIDI commands:

VirtualButton InsertButton: Source# + 14 (short press toggles Rehearse; long press engages SUS action).
DirectMIDI Rehearse: Source# + 34 (always engages Rehearse).
DirectMIDI EndRehearse: Source# + 35 (ends Rehearse operation).
DirectMIDI SUSRehearse: Source# + 24 (SUS action toggles Rehearse while held).



Quantize and Rehearse

Rehearse is highly dependent on Quantize settings for precise timing:

Quantize=Cycle: Rehearse aligns with the end of the current cycle.
Quantize=Loop: Rehearse aligns with the loop boundary. 
Quantize=8th: Rehearse aligns with the nearest eighth note. 
Quantize=Off: Rehearse begins immediately. 


### 12. **SAMPLEPLAY** (Sample Play State)
- **Characteristics**: Loop plays once then stops
- **Display**: Normal playback display
- **LED Status**: Varies by access method
- **Entry Conditions**: Mute-Insert, MIDI triggers, BeatSync triggers
- **Available Actions**: Retrigger (Insert), Return to Play (Undo
Updated Description of the SAMPLEPLAY State
Characteristics

The SamplePlay state triggers the loop to play once from its StartPoint and then stops, returning to Mute mode. 
It is ideal for creating stuttering effects or triggering loops in a sampler-like fashion. 

Display

The LoopTime Display shows the normal playback timer during SamplePlay. 

LED Status

LED behavior varies depending on the access method:

Mute-Insert: Insert LED lights up during playback. 
MIDI triggers: LED behavior depends on MIDI configuration. 
BeatSync triggers: LED indicates trigger activity. 



Entry Conditions

SamplePlay can be initiated through multiple methods:

Mute-Insert: Press Mute, then Insert to trigger the loop. 
MIDI Note Triggers: MIDI NoteOn messages corresponding to the loop trigger SamplePlay. 
DirectMIDI SamplePlay Command: MIDI Source# + 36 triggers SamplePlay. 
BeatSync Jack Trigger: External pulse or trigger signal received through the BeatSync Jack initiates SamplePlay. 



Available Actions While in SamplePlay

Retrigger:

Press Insert repeatedly to retrigger the loop for stuttering effects. 
Retriggering starts the loop from the StartPoint each time. 


Return to Play:


Press Undo to seamlessly return to PlayMode, allowing the loop to continue playing instead of stopping at the end. 

Advanced SamplePlay Techniques

Stuttering Effects:

Repeatedly retrigger the loop using Insert or external triggers for rhythmic stuttering. 


Undo Integration:

Use Undo to transition from SamplePlay to continuous playback without interrupting the loop. 


BeatSync Triggering:

Set Sync=In and arm SamplePlay with Mute-Multiply.  External triggers received at the BeatSync Jack will initiate SamplePlay. 



MIDI Implementation

DirectMIDI SamplePlay Command:

Located at Source# + 36, this command triggers SamplePlay directly. 


MIDI Note Triggers:

Loops can be triggered by MIDI NoteOn messages, with the LoopTrig parameter determining the base note for Loop 1. 


BeatSync MIDI Integration:

MIDI BeatSync pulses can retrigger SamplePlay for synchronized stuttering effects. 



Quantize Effects

SamplePlay timing can be influenced by Quantize settings:

Quantize=Cycle, Loop, or 8th: SamplePlay begins at the end of the current quantize period. 
Quantize=Off: SamplePlay begins immediately upon trigger. 


## State Transition Rules

### Universal Transitions
- **From any state**: Long press Record → RESET
- **From any state**: Undo → Cancel current operation (if memory permits)
- **From any state**: Parameter button → Parameter edit mode (not a loop state)

### Quantization Effects on Transitions
- **Quantize=Off**: Transitions happen immediately
- **Quantize=Cycle**: Transitions wait for next cycle boundary
- **Quantize=Loop**: Transitions wait for next loop start
- **Quantize=8th**: Transitions wait for next 8th note subdivision

### Rounding Behavior
- **Multiply/Insert**: Normally round to complete cycles
- **Unrounded**: Force immediate end with Record button
- **RoundMode=Round**: Complete current cycle during rounding
- **RoundMode=Off**: Add silence to complete cycle

State Transition Rules for the Echoplex Digital Pro Plus
General Overview
State transitions in the Echoplex Digital Pro Plus are governed by button presses, MIDI commands, and parameter settings. Each state has specific entry conditions, behaviors, and available actions. The transitions are influenced by factors such as InsertMode, Quantize, and Sync settings. 

State Transition Table
The following table summarizes the key states, their entry conditions, and transitions:













































































StateEntry ConditionsAvailable ActionsExit ConditionsPlayingDefault state after recording or unmutingOverdub, Multiply, Insert, Mute, UndoTransition to Overdub, Multiply, Insert, Mute, or UndoRecordingPress Record button End recording (Record button), Replace (InsertMode=Replace), Reverse (InsertMode=Reverse)Ends with Record button or transitions to Replace/Reverse based on InsertModeOverdubbingPress Overdub button during playback Stop overdubbing (Overdub button), UndoEnds with Overdub button or UndoMultiplyingPress Multiply button during playback End Multiply (Multiply button), UndoEnds with Multiply button or UndoInsertingPress Insert button (InsertMode determines behavior)End Insert (Insert button), UndoEnds with Insert button or UndoReplacingPress Insert button (InsertMode=Replace)End Replace (Insert button), UndoEnds with Insert button or UndoSubstitutingPress Insert button (InsertMode=Substitute) End Substitute (Insert button), Undo Ends with Insert button or UndoMutePress Mute button during playback Unmute (Mute button), Retrigger (Undo button), SamplePlay (Insert button), ReAlign (Multiply button)Ends with Mute button or transitions to other actionsReversePress Reverse button (InsertMode=Reverse) Return to forward playback (Reverse button), UndoEnds with Reverse button or UndoSamplePlayMute-Insert, MIDI triggers, BeatSync triggersRetrigger (Insert button), Return to Play (Undo button)Ends with Undo button or loop completionRehearsePress Insert button (InsertMode=Rehearse)Commit (Insert button), Continue rehearsingEnds with Insert button

Key Transition Rules


Quantize Settings:

If Quantize=Cycle, Loop, or 8th, transitions align with the end of the current quantize period. 
If Quantize=Off, transitions occur immediately upon button press. 



InsertMode Influence:

Replace: Overwrites sections of the loop without changing its length.
Substitute: Replaces sections while the original playback continues; new audio replaces old on the next repetition.
Reverse: Plays the loop backward; toggles back to forward playback with another press.
Rehearse: Allows practice before committing audio to the loop.



Sync Settings:

Sync=In: MIDI clock and sync messages are received but not sent. 
Sync=Out: MIDI clock and sync messages are sent automatically.
Sync=Off: Sync messages are neither sent nor received. 



MIDI Commands:

MIDI commands can trigger state transitions directly (e.g., DirectMIDI Replace, DirectMIDI Reverse).
Sustain actions (e.g., SUSRecord, SUSOverdub) allow transitions to occur while buttons are held.




Advanced Transition Scenarios


Mute-ReAlign:

Press Mute, then Multiply to arm ReAlign.  The loop aligns with the next Global MIDI StartPoint. 
Cancel ReAlign by pressing Multiply again. 




## Parameter Dependencies

### RecordMode
- **Toggle**: Press once to start, once to stop
- **Sustain**: Record only while button held

### OverdubMode
- **Toggle**: Press once to start, once to stop
- **Sustain**: Overdub only while button held

### MuteMode
- **Start**: Unmute restarts from beginning
- **Continuous**: Unmute continues from current position

### InsertMode
- **Insert**: Basic insertion function
- **Replace**: Replace sections without length change
- **Substitute**: Replace with overlap timing
- **Rehearse**: Practice mode before committing
- **Reverse**: Reverse playback function
- **Sustain**: Unrounded sustain-action functions

### SwitchQuant
- **Off**: Immediate loop switching
- **Cycle**: Switch at next cycle boundary
- **Loop**: Switch at next loop start
- **8th**: Switch at next 8th note

## Multi-Loop State Management

### Loop Switching
- **NextLoop**: Move to next loop in sequence
- **PreviousLoop**: Move to previous loop (MIDI only)
- **LoopTriggering**: Direct MIDI access to any loop
- **SUSNextLoop**: Temporary jump to next loop

### MoreLoops Parameter
- **MoreLoops=1**: Single loop mode, NextLoop becomes retrigger
- **MoreLoops>1**: Multiple loops available

### Auto-Functions
- **AutoRecord**: Automatically start recording in new loop
- **LoopCopy**: Copy audio or timing to new loops

## Memory-Dependent Behaviors

### Undo Limitations
- **Ample Memory**: Full undo functionality available
- **Tight Memory**: Limited undo, may not be possible
- **Undo LED**: Green when available, off when not possible

### Overflow Handling
- **Overflow=Stop**: Cancel record operation, reset loop
- **Overflow=Play**: Set loop to available memory, ignore excess

## Synchronization States

### Sync Recording
- **SyncRecord**: Quantized recording with external sync
- **Unquantized Sync**: Immediate start with sync rounding
- **TempoSelect**: Pre-select tempo for synchronized recording

### MIDI Sync Integration
- **Sync=In**: Follow external MIDI clock
- **Sync=Out**: Send MIDI clock to external devices
- **BrotherSync**: Synchronize with other Echoplex units

## Special States and Modes

### Startup State
- **Power-on**: Show available memory, enter Reset
- **LED Flash**: Startup sequence with action button LEDs

### Error States
- **Memory Overflow**: Handled by Overflow parameter
- **Sync Loss**: Maintain internal timing
- **MIDI Errors**: Graceful degradation

## Implementation Notes for WebAudioAPI

### State Machine Structure
```javascript
const LoopStates = {
    RESET: 'reset',
    RECORD: 'record',
    PLAY: 'play',
    OVERDUB: 'overdub',
    MULTIPLY: 'multiply',
    INSERT: 'insert',
    MUTE: 'mute',
    REVERSE: 'reverse',
    REPLACE: 'replace',
    SUBSTITUTE: 'substitute',
    REHEARSE: 'rehearse',
    SAMPLEPLAY: 'sampleplay'
};
```

### State Validation
- Always validate state transitions against current state
- Check parameter dependencies before allowing transitions
- Implement memory checks for undo operations
- Handle quantization delays appropriately

### LED State Management
- Update LED states immediately on state changes
- Implement LED data-hw-state attributes as per project requirements
- Handle LED indicators for tempo, sync, and state feedback

### Memory Management
- Track memory usage for undo functionality
- Implement overflow protection
- Manage multiple loop memory allocation

This state machine analysis provides the foundation for implementing proper Echoplex behavior in the WebAudioAPI version while maintaining compatibility with the original hardware's operational model.