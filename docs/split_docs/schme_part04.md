            delta = knobPositions["ParameterKnob"].delta()   # get knob movement delta (or absolute position)
            ParameterLayer.adjust(currentParameter, delta)   # update the parameter value
            FeedbackLayer.apply_if("Feedback", currentParameter, delta)  # e.g., if feedback param changed, update feedback system
            # (ParameterLayer will internally ensure the change propagates to relevant system parts)
    else:
        # Play/Loop Mode behavior: buttons trigger loop functions, knobs adjust live levels
        if buttonStates["Record"] == PRESSED:
            ControllerLayer.handle_event("Record")           # trigger record function in controller state machine
        if buttonStates["Overdub"] == PRESSED:
            ControllerLayer.handle_event("Overdub")          # etc. for other loop controls...
        # ... (similar for other loop function buttons: Play, Stop, Undo, etc.)
        # Knobs controlling real-time levels (input, output, mix, feedback)
        AudioInLevel.set(knobPositions["InputLevel"])        # adjust input gain
        AudioOutLevel.set(knobPositions["OutputLevel"])      # adjust output volume
        MixLevel.set(knobPositions["MixLevel"])              # adjust dry vs loop signal mix
        FeedbackLayer.setLevel(knobPositions["FeedbackLevel"])  # update loop feedback amount immediately

    # 4. Update LED indicators for feedback and status
    for led in all_status_leds:
        led.update( ControllerLayer.getStatus(led.associatedFunction) )
    # E.g., flash record LED if recording, or reflect parameter selection in Parameter Mode
end loop
```

*Explanation:* The BLK loop continuously reads button and knob inputs. In **Parameter Mode**, enabled by toggling the *Parameter* button, the BLK layer repurposes the controls: each of the multi-function buttons corresponds to selecting a parameter, and turning a knob adjusts the current parameter’s value. For example, if the *Loops* parameter row is active, pressing the button that normally triggers *Record* might select the *MoreLoops* parameter instead. The pseudocode reflects this by mapping a pressed button to a `currentParameter` and then adjusting it via the Parameter Layer. Crucially, changes are applied in real-time – as soon as a knob is turned, the system parameter updates immediately (consistent with the Echoplex behavior where *“all changes to parameters are active as soon as you make them”*).

In **Play Mode** (normal operation), the BLK layer routes button presses to the Controller Layer, which manages loop state transitions (e.g., entering Record, Play, Overdub states). Knobs in this mode control live levels such as input/output volume, mix, and feedback. The Echoplex has dedicated knobs for Input, Output, Mix, and Feedback levels on its front panel, so turning those will directly invoke setting functions in the Signal Chain or Feedback layers (e.g., adjusting the feedback knob immediately changes the loop feedback level). LED updates occur in both modes: the BLK layer drives LED feedback so the user knows the status (for instance, a recording LED might blink when recording, or parameter indicators light up in Parameter Mode to show which row is active).

Overall, the BLK Layer ensures **immediate and context-aware interaction**: in Parameter Mode it interfaces heavily with the Parameter Layer to tweak settings (while giving visual cues via row indicator LEDs), and in Loop Mode it interfaces with the Controller/Signal/Feedback layers to execute looping operations and reflect their status via LEDs.

### System Software Layer

The **System Software Layer** contains the high-level logic and state management for the Echoplex. It is the portion of the system that runs on the device’s processor aside from direct hardware control. This layer is entirely decoupled from direct hardware specifics – it interacts with hardware only through defined interfaces (like the BLK Layer’s API calls). Responsibilities of the System Software Layer include:

- **Coordinating Subsystems:** It houses all the other logical layers (Parameter, Preset, Signal Chain, Controller, Buffer, Feedback) and orchestrates their interaction. For example, when the BLK layer signals that a *Record* button was pressed, the System Software’s Controller layer changes the state and might notify the Buffer layer to start recording audio.
- **System State Management:** It keeps track of global system state (e.g., whether the system is in play mode or parameter edit mode, which loop number is active, etc.) and ensures consistency across subsystems. It can be thought of as the operating firmware of the Echoplex, dealing with timing, event handling, and inter-layer communication.
- **Isolation from Hardware:** Because of the split architecture, System Software can be modified or extended (e.g., adding new features or adjusting algorithms) without needing to alter how buttons or knobs are read. This makes the system more modular and testable – for instance, one could simulate button presses in software for testing the logic, which is a direct benefit of having the hardware abstracted.

### Parameter Layer

The **Parameter Layer** is responsible for managing all configurable parameters of the system. These parameters define the behavior and options of the Echoplex (for example: loop count limits, quantization settings, MIDI sync settings, etc., in addition to continuous parameters like Feedback level or Decay rate). Key functions of this layer:

- **Parameter Definitions:** It holds a registry of all parameters (name, current value, allowable range, and possibly metadata like units or descriptive text). Each parameter might correspond to a setting accessible via the front panel when in Parameter Mode (e.g., *MoreLoops*, *Quantize*, *Tempo*, *MIDISync*, etc.).
- **Real-time Updates:** The Parameter Layer exposes methods to adjust parameter values on the fly. When a user turns a knob or presses a parameter-select button in Parameter Mode, the BLK Layer calls into the Parameter Layer to increment/decrement or set a new value. These changes take effect immediately in the system’s behavior. For example, changing the *Feedback* parameter via the knob instantly changes the loop feedback coefficient in the Feedback Layer’s logic.
- **Notification of Changes:** Upon a parameter update, this layer can notify other parts of the system that rely on that parameter. For instance, if *MoreLoops* (which determines how many separate loops the system can hold) is changed, the Parameter Layer might inform the Buffer/Controller layers to allocate or limit loop memory accordingly. This ensures consistency between configuration and operation.
- **Persistence Delegation:** While the Parameter Layer holds current values, it defers long-term storage to the Preset Layer. When parameters change, they remain volatile unless saved as part of a preset (this prevents accidental tweaks from permanently altering saved configurations until the user explicitly saves).

### Preset Layer

The **Preset Layer** handles the storage and recall of user presets – named or numbered collections of all parameter settings. Its responsibilities include:

- **Saving Presets:** It can capture the current state of all relevant parameters (from the Parameter Layer) and store them into non-volatile memory (such as EEPROM or flash) under a preset slot. This might occur when the user issues a “Save Preset” command (possibly via a button combination or a dedicated preset interface).
- **Loading Presets:** Conversely, it retrieves stored parameter sets and applies them to the Parameter Layer (and thus to the system). This allows quick reconfiguration of the Echoplex to predefined states.
- **Preset Management:** It may provide functionality to list available presets, rename them (if applicable), or reset to factory defaults. Essentially, it acts as the interface to configuration memory.
- **Integration:** The Preset Layer works closely with the Parameter Layer – for example, when leaving Parameter Mode or at power-down, the system might automatically engage the Preset Layer to persist any changes (the Echoplex is known to store changed parameters to memory when you exit the parameter editing mode). However, the design can allow for explicit user control over what gets saved, to differentiate between temporary tweaks and intentionally stored settings.

### Signal Chain Layer

The **Signal Chain Layer** manages the audio path through the Echoplex, effectively controlling how input, output, and the loop audio are routed and mixed. It ensures that the looper’s audio processing is correctly structured. Key points:

- **Audio Routing:** This layer defines how the audio flows: from input to the loop recorder, from loop playback to output, and how much dry (direct) signal vs. wet (looped) signal is in the output mix. It manages components like input preamps, output volume control, mix level between input and loop, etc.
- **Level Controls:** The Echoplex hardware includes four front-panel knobs for Input level, Output level, Mix, and Feedback. The Signal Chain layer covers at least the first three of these (Input, Output, Mix), adjusting digital attenuators or gains in response to knob movements (as received via BLK). For example, if the user lowers the input knob, the Signal Chain layer reduces the recording input gain; if the mix knob is changed, it adjusts the ratio of dry vs. loop signal heard.
- **Effects and Processing:** If the Echoplex applies any signal processing (such as analog-to-digital conversion, filtering, or output limiting), this layer would handle those details. It essentially encapsulates anything related to the audio signal itself, aside from the looping buffer content. Think of it as the virtual “wiring and mixer” inside the unit.
- **Integration with Buffer:** The Signal Chain interfaces with the Buffer Layer by sending input audio into the buffer (when recording) and taking playback audio out of the buffer (when playing loops) to mix with the direct signal. However, it doesn’t decide *when* to record or play – that’s the Controller’s job. The Signal Chain just ensures the pathways and levels are set correctly for whatever the Controller dictates.

### Controller Layer

The **Controller Layer** is effectively the brains of loop control – a state machine that manages loop recording, playback, overdubbing, and other operational logic. It interprets user commands (usually via BLK from button presses) and controls the Buffer and other layers to execute those commands. Its responsibilities include:

- **Loop State Machine:** The Controller maintains the current mode of the looper (e.g., Idle/Play, Record, Overdub, Multiply, Mute, etc.). When a relevant button event comes from the BLK layer (such as Record pressed), the Controller transitions states and triggers the appropriate actions (e.g., if idle, enter Record mode and tell Buffer Layer to start capturing audio; if recording and Record is pressed again, exit Record and go to Play mode, closing the loop). The Echoplex manual refers to these as modes like *Record mode, Mute mode, Insert mode*, and the Controller layer governs those modes.
- **Timing & Synchronization:** It handles loop timing – marking loop start/end points, syncing to tempo or MIDI clock if required, and quantization of actions if the quantize parameter is on. The state machine ensures operations happen at musically correct times when sync/quantize parameters are active.
- **Coordinating Layers:** The Controller signals the Buffer Layer when to start/stop recording or when to playback, and might also inform the Feedback Layer when overdubs are happening (since feedback might be temporarily adjusted during overdub, as the Echoplex reduces feedback slightly during overdub to avoid saturation). It also interacts with the Signal Chain to possibly mute outputs or cross-fade when entering/exiting certain states (for seamless transitions).
- **Multi-Loop Management:** If multiple loops are supported (Echoplex Digital Pro had a *MoreLoops* parameter to have multiple loops in memory), the Controller manages switching between loops, selecting the current loop, etc. It ensures the Buffer Layer is reading/writing from the correct loop memory and updates the system state (display, indicators) to show the active loop number.
- **Undo/Redo and Other Functions:** Complex functions like Undo (removing the last overdub layer) or Multiply (extending loop length) are implemented here by coordinating buffer operations and state transitions. The Controller Layer essentially encodes the operational rules of the looper.

### Buffer Layer

The **Buffer Layer** manages the low-level audio data storage – this is where the actual recording and playback of audio loops happen in memory. It deals with the allocation and timing of the loop audio buffer. Key points:

- **Memory Management:** It allocates memory for audio loops. If only one loop is used, it manages a single circular buffer of a certain length. If multiple loops are allowed (as per a parameter), it might allocate several buffers or one large buffer partitioned into segments for each loop slot.
- **Recording & Playback Control:** When the Controller signals to record, the Buffer Layer starts writing incoming audio data (from the Signal Chain) into the buffer from the current position. When loop recording is ended, it marks the loop length and from then on, during playback mode, it continuously reads from the buffer (looping around at the loop end). Overdubbing means continuing to write new audio into the buffer while also reading it (which combined with Feedback Layer’s effect, results in layering sound).
- **Timing and Positioning:** This layer keeps track of the read/write heads within the buffer, ensuring that the loop wraps around correctly. It likely generates timing cues or interrupts for the Controller (e.g., to notify when the loop point is reached, which can trigger certain actions like ending a Multiply or syncing to an external clock).
- **Data Integrity:** It is responsible for handling cases like buffer overflow (if recording longer than available memory) or managing *Insert* operations (which might splice new audio into the middle of a loop). In those cases, it cooperates with the Controller to implement the user-intended outcome (e.g., truncating or doubling loop length as needed).
- **Interface:** The Buffer Layer provides methods like `startRecording()`, `stopRecording()`, `readAudioFrame()`, etc., which the Controller calls. It’s largely an internal engine that doesn’t interact with the user directly, but its proper function is crucial for the looper to actually capture and reproduce sound.

### Feedback Layer

The **Feedback Layer** manages the loop feedback control – essentially, how much of the existing loop is carried over when new audio is overdubbed. Feedback dictates whether loops fade out over time or repeat indefinitely. In the Echoplex architecture, it’s treated as a distinct layer because it involves both a user-controlled parameter and an audio signal processing aspect:

- **Feedback Parameter:** This layer monitors the current *Feedback* level setting (0% to 100%). A 100% feedback means the loop plays back without decay (infinite repeat), whereas less than 100% causes the loop to gradually fade out as overdubs occur (each pass loses some volume). The user can adjust this via the feedback knob or an expression pedal. In fact, the Echoplex allows the feedback value to be controlled by various inputs – *“the feedback value can be controlled by MIDI, by the Feedback knob on the front panel, or by a volume pedal connected to the Feedback jack”*. The Feedback Layer aggregates these control inputs to update the effective feedback level in real time.
- **Application in Audio Path:** During overdub or loop playback, the Feedback layer applies the feedback factor to the audio from the buffer. Technically, this might occur by scaling the audio data that is being written back into the buffer. For example, when overdubbing, the new audio is added on top of the existing loop audio which is first multiplied by the feedback factor (e.g., at 100% the old audio is written back unchanged, at 50% it is written back at half volume so it will die out over successive repetitions). The layer ensures this calculation is done at the correct point in the signal chain (typically at loop wrap or during the mix of old+new audio).
- **Real-Time Knob Response:** Because feedback is often adjusted live (it’s a creative control for performers to let loops evolve or decay), the Feedback Layer is tuned for real-time adjustments. When the user twists the feedback knob, the BLK layer sends the new value to the Feedback Layer which instantly uses it for subsequent audio cycles. As noted earlier, parameter changes are immediate on the Echoplex, and feedback is no exception – the system does not wait for a loop to finish to apply a new feedback value (though the *audible effect* of a drastic feedback change might be heard at the next loop cycle boundary).
- **Interaction with Other Layers:** The Feedback Layer is influenced by the Parameter Layer (since feedback setting is a parameter that can be saved/loaded) and provides input to the Buffer/Signal Chain when mixing audio. It might also interact with a dedicated hardware jack for an expression pedal, which is part of System Hardware. By isolating this logic, any changes to how feedback is computed (for example, implementing an alternative decay algorithm) would not affect the high-level Controller or other parts.

## Control System Schema (JSON Representation)

The following JSON object encodes the hierarchical schema of the Echoplex control system and key relationships between components. This structured representation can be used for indexing or vectorization in systems like Qdrant, capturing the layered architecture in a machine-readable form:

```json
{
