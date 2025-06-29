# ### *D 14 SUSRecord Sustain Action Record
### D# 15 SUSOverdub Sustain Action Overdub
### E 16 SUSRoundMultiply Sustain Action Rounded Multiply
### F 17 SUSRoundedInsert Sustain Action Rounded Insert
### F# 18 SUSMute Sustain Action Mute
### G 19 ShortUndo Immediately execute the ShortUndo function (Undo to end)
### G# 20 SUSNextLoop Sustain Action NextLoop (NoteOn = NextLoop, NoteOff = PreviousLoop)
### A 21 SUSReplace Sustain Action Replace
### A# 22 SUSSubstitute Sustain Action Substitute*
# *MIDI Command List*
# *Continued*
## *Reference - MIDI Control 7-5*
### *B 23 SUSToggleReverse Sustain Action Reverse
### C 24 SUSToggleSpeed Sustain Action HalfSpeed
### C# 25 Reset Immediately reset current loop
### D 26 GeneralReset Immediately reset all loops
### D# 27 Exit Parameters Exit Parameter editing and return to Play state
### E 28 SUSUnroundedMultiply Sustain Action Unrounded Multiply
### F 29 SUSUnroundedInsert Sustain Action Unrounded Insert
### F# 30 SUSMute-Retrigger Sustain Action Mute-Retrigger (NoteOn = Mute, NoteOff=Retrig.)
### G 31 LongUndo Immediately execute the LongUndo function
### G# 32 Forward Go into Forward
### A 33 Reverse Go into Reverse
### A# 34 FullSpeed Go into FullSpeed
### B 35 HalfSpeed Go into HalfSpeed
### C 36 SamplePlay Immediately restart the loop and play once
### C# 37 ReTrigger Immediately restart the loop and play forever
### D 38 ReAlign Restart the loop at next Global MIDI StartPoint
### D# 39 MuteReAlign Immediately Mute and restart the loop at next Global MIDI StartPoint
### E 40 QuantMIDIStartSong Wait to next Local Loop StartPoint and then send a StartSong
### F 41 MuteQuantMIDIStartSong Immediately Mute, then wait to next StartPoint and send StartSong
### F# 42 StartPoint Set the StartPoint to the current spot in the loop
### G 43 QuantStartPoint Wait to next Global MIDI StartPoint and then set the local StartPoint there
### G# 44 BeatTriggerSample Mute and wait for BeatSync, then trigger loop to play once. Repeated BeatSyncs
### retrigger the loop.
### A 45 MIDIBeatSync Virtually send a BeatSync pulse by MIDI*

# *VirtualButtons*Immediate Action
Play Mode
# *Midi Commands can be used to emulate the Front Panel
# Buttons*
*A set of MIDI commands in the Echoplex are called* *MIDI VirtualButtons,*
*because they behave exactly the same way the corresponding front
panel buttons do.
With* *MIDI VirtualButtons* *you can press the front panel buttons virtually
by MIDI, and do things like long presses and short presses and cross
functions.
If the* *ControlSource* *parameter is set to* *Notes,* *then a NoteOn message is
the same as pressing the button, and a NoteOff message is the same as
releasing the button. If the* *ControlSource* *Parameter is set to* *Continuous
Controllers,* *a controller with a positive value is the same as pressing a
button, and a controller message with a value of 0 is the same as
releasing the button.
This press and release concept is important to remember when
programming a MIDI controller. When using* *VirtualButtons* *you have to
make sure you send both the NoteOn and the NoteOff, so that you both
press and release the button!
The* *VirtualButtons* *emulate the front panel interface in MIDI. However,
there are more* *VirtualButtons* *than front panel buttons because we offer
all the* *InsertMode* *options simultaneously from MIDI as if they were
separate buttons. The* *MIDIInsertButton* *is the exception, it still does what
is selected in* *InsertMode* *for consistency.*
*VirtualButtons* *allow you to use MIDI to take advantage of the economical
design of the front panel interface, which lets you get a lot of
functionality out of a few buttons.
See the Source# section in the Parameters chapter for the command list
and specific note or controllers needed for each* *VirtualButton.*
# *Plug in your instrument, mixer send, or microphone.*
*This back-panel jack accepts 1/4” phone plugs carrying the audio signal
to be recorded or delayed. It is a high-impedance input designed to
accept a wide range of audio levels, including high-impedance
microphone outputs, signals from electric guitars and basses (with
either passive or active electronics), and line-level signals from
electronic instruments and mixers.*
# *Indicates the current Loop.*
*The* *Loop Display* *shows the current Loop selected. This is mainly
meaningful when more than one loop has been set up using the*
*MoreLoops* *parameter.
The Echoplex can have its memory divided into as many as 16 different
loops. In order to save front panel space and use a single digit for the*
*Loop Display**, some of the loops are labeled with letters instead of
numbers. If you set up 16 loops, you will see they are labeled* *1 - 9,*
*followed by* *A, b, C, d, E, F, G.*# *Loops LED*
# *Front Panel*
# *Indicates the Loops Row of the Parameter Matrix is selected.*
*The* *Loops LED* *is illuminated when the Loops Row of the* *Parameter
Matrix* *has been selected for editing with the* *Parameter Button**. The*
*Multiple Display* *will also show* *P4* *when this row is selected in the*
*Parameter Editing Mode**.
The Loops Row consists of the* *Parameters* *related to multiple loops.
These are* *MoreLoops, AutoRecord, LoopCopy, SwitchQuant, LoopTrig,
Velocity,* *and* *SamplerStyle.*
*The* *Loops LED* *is not used in* *Play Mode**.*
### *See also: Parameter Button, Multiple Display, Parameter Matrix*
# *LoopTime*'## *V**OLUME* C*ONTINUOUS* C*ONTROLLER* D*ISPLAY*
### *When the MIDI continuous controller for*Loop Output Volume is sent to
the Echoplex, the value appears on the LoopTime Display in the same
way as with Feedback.
## *C**OMMAND* D*ISPLAY*
### *Several functions that do not have their own obvious LED indicator are
### displayed briefly with some letters on the red*LoopTime Display.
These are:
*Display Command
rE Reverse
Fd Forward
H.SP HalfSpeed
F.SP FullSpeed
S.Un Short Undo
L.Un Long Undo
AL ReAlign
St.S QuantMIDIStartSong
S.Pt StartPoint sent
cS.P QuantStartPoint
Pr.E Preset Editor
P n Preset Change received
LOA Load Preset
SAF Save Preset
RES Revert Preset to default*
## *M**EMORY* S*IZE* D*ISPLAY*
*The size of the memory is only shown for a short time after startup and
after* *GeneralReset**. To see it again, just do a* *Short-Press Multiply* *in*
*Reset* *and it will appear briefly on the* *LoopTime Display**.*
## *P**ARAMETER* E*DITING* D*ISPLAY*
*When you are editing parameters, the value of the current parameter is
displayed in the* *LoopTime Display**.*
## *Q**UANTIZING* D*ISPLAY* - *OOO*
*When* *Quantize=Cycle, Loop, or 8th**, most command actions are*
*Quantized,* *meaning the wait until a designated point before they
execute. During the* *Quantize Period* *while it is waiting to execute, the*
*LoopTime Display* *will change to* *“ooo”* *to indicate we are waiting.
Similarly, if we are waiting for a Sync event to start Recording, the*
*LoopTime Display* *will show* *“ooo”.*
*If* *Threshold* *is set to something other than 0,* *Record* *will wait until an
audio signal reaches the threshold before it will start recording. During
this wait time the* *LoopTime Display* *will also show* *“ooo”.*
## *S**WITCH*Q*UANTIZE* D*ISPLAY*
*When* *SwitchQuantize = Cycle, Loop, Confirm, ConfirmCycle,* *or*
*ConfirmLoop**, the Echoplex waits for the designated point or action
before switching loops after* *NextLoop* *is pressed or a* *MIDI
LoopTrigger* *is received.
During this waiting period the* *LoopTime Display* *changes to show
which loop we are about to switch in to. It will display this as* *“L 1”, “L 2”,
“L 3”,* *etc. Additional presses of* *NextLoop* *or received* *MIDI
LoopTriggers* *will update the display to show the target Loop.*
*9-16 Echoplex Digital Pro Plus User’s Manual*
# *LoopTime Display*
# *Continued*
## *P**RESET* D*ISPLAY*
*When you are in the* *Preset Editor**, the* *LoopTime Display* *shows the*
*Preset* *number as* *“Pr #”.* *No dot after* *“Pr”* *indicates that this* *Preset* *is
the last one that has been loaded into the playing state* *Preset 0**. If there
is a dot after* *“Pr”,* *it is not the one currently loaded. When the display
shows* *“PrE”* *it means that the* *Preset 0* *parameter settings have been
modified since the preset was loaded to them.
With the display indicators it should be easy to tell in the editor which*
*Preset* *you are currently using, and if there are new changes made that
you may want to save.
When a* *MIDI Program Change* *command is received or when you use the
front panel buttons to select a* *Preset,* *the* *LoopTime Display* *briefly
changes to show the preset you are selecting. It displays it as* *“P n”,*
*where* *n* *is the preset number.
See the Preset section for more details.*
### *See also: Record, Multiply, Insert, Sync, Feedback, FeedBkCont, VolumeCont, Parameter
### Button, Quantize, SwitchQuantize, NextLoop, Presets*
# *MIDI*
# *G*LOBAL CLOCKS AND LOOP
# *S*WITCHING
*The* *Timing LED* *for 8th note* *Sub-Cycles* *counts on 8th notes
determined by the global clock. The* *Switches LED* *for* *Cycles**, on the
other hand, blinks at the local* *StartPoints* *based on the local clock.
If multiple loops are used and the loops are switched* *Unquantized,* *it is
possible to see these move out of alignment with each other. This can be
a little disconcerting, but it can also be helpful as a reference of where
the* *Global Clock* *is in relation to your* *Local Cycle StartPoints* *as you switch
loops.*
# *T*EMPO LIMITS
*If the tempo is above 400 BPM, the 8th note* *Sub-Cycle LED* *stops
blinking since it becomes useless as a visual indicator at such speeds.
This is also the point where* *MIDI clock* *is no longer sent for similar
reasons. You can still make loops as short as you like.*
# *V*ISUAL BEAT MATCHING INDICATOR
*The* *Multiple Left Dot LED* *showing the* *Sync* *correction can be useful
for tuning the tempo on a sequencer to match with an existing loop on
the Echoplex. By watching the frequency and intensity of this LED you
can quickly speed or slow the tempo of the sequencer to match the loop
in the Echoplex, at which point the dot stops blinking. This technique**allows you to start a loop without the sequencer, then start the
sequencer and tune its tempo to match.*