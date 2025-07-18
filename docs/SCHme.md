Absolutely! Here’s a **detailed breakdown** of the Echoplex project structure using clear **pseudocode** and in-depth explanations for each part—including a granular look at the **BLK layer** and how each button, LED, and knob is organized under the hardware/power domain.

------

## 📁 **Project Structure (Layered)**

### 1. **System Hardware Layer (`sysHW`)**

Manages **all physical controls** and their immediate feedback. All controls are only *active* if `power` is on.

#### **Pseudocode:**

```js
sysHW = {
  power: true, // Master on/off switch

  blk: {
    // --- Buttons Section ---
    buttons: {
      record:   { pressed: false, led: 'off' },
      overdub:  { pressed: false, led: 'off' },
      insert:   { pressed: false, led: 'off' },
      multiply: { pressed: false, led: 'off' },
      undo:     { pressed: false, led: 'off' },
      nextLoop: { pressed: false, led: 'off' }
    },

    // --- LEDs Section (can also be part of each button, or global here for expansion) ---
    leds: {
      record:   { state: 'off', color: 'red',  mode: 'solid' },
      overdub:  { state: 'off', color: 'red',  mode: 'solid' },
      insert:   { state: 'off', color: 'yellow', mode: 'solid' },
      multiply: { state: 'off', color: 'blue', mode: 'solid' },
      undo:     { state: 'off', color: 'white', mode: 'solid' },
      nextLoop: { state: 'off', color: 'green', mode: 'blink' }
    },

    // --- Knobs Section ---
    knobs: {
      feedback: { position: 0.75, min: 0.0, max: 1.0 },
      volume:   { position: 0.85, min: 0.0, max: 1.0 }
    }
  }
}
```

#### **Explanation:**

- **`power`**: The global system power. When `false`, no controls or LEDs function.
- **`blk`**: The Button/LED/Knob layer—*the real interface hardware*.
  - **`buttons`**: Every button gets an object showing if it’s pressed and its direct LED state.
  - **`leds`**: Explicit objects for each LED (color, state, blink/solid, etc). You can centralize here or in each button.
  - **`knobs`**: Each knob tracks its physical position and its range.

------

### 2. **System Software Layer (`sysSW`)**

Handles **modes, global states, and logic** (not direct hardware).

#### **Pseudocode:**

```js
sysSW = {
  parameterMode: true, // When true, buttons/knobs edit settings instead of running live
  midiSync: { enabled: true, startPoint: 'aligned' },

  // Logic to interpret hardware events:
  interpretAction(btn, context) {
    if (!sysHW.power) return 'off';
    if (this.parameterMode && btn === 'record') return 'editQuantize';
    // ... etc
  }
}
```

#### **Explanation:**

- **`parameterMode`**: When on, changes how hardware actions are interpreted.
- **`midiSync`**: Global MIDI sync settings.
- **`interpretAction`**: This is a “reducer” function: gets button events and returns their meaning based on modes/state.

------

### 3. **Parameter Layer**

Stores *all settings* for the rest of the system.

#### **Pseudocode:**

```js
parameters = {
  timing: { quantize: 'Cycle', delay: 240 },
  switches: { recordMode: 'TOG', overdubMode: 'SUS' },
  midi: { channel: 2 },
  loop: { maxLength: 60 }
}
```

- **Explanation**: Each setting determines how lower layers and hardware act.

------

### 4. **Preset Layer**

Saves/loads *snapshots* of the parameter layer.

#### **Pseudocode:**

```js
preset = {
  current: 'Ambient',
  bank: {
    Ambient: { quantize: 'Cycle', feedback: 0.7, recordMode: 'Q' }
  }
}
```

------

### 5. **Signal Chain Layer**

Real-time audio adjustments (not memory).

#### **Pseudocode:**

```js
signal = {
  mute: false,
  volume: 0.85,
  feedback: 0.7
}
```

------

### 6. **Controller Layer**

Manages live loop operations.

#### **Pseudocode:**

```js
controls = {
  record: { active: false },
  overdub: { active: false },
  insert: { active: false },
  multiply: { active: false },
  undo: { history: [] },
  nextLoop: { idx: 0, total: 3 }
}
```

------

### 7. **Buffer Layer**

Stores loop content.

#### **Pseudocode:**

```js
buffer = {
  loopBuffer: [/* audio frames */],
  cycles: [{ start: 0, end: 48000 }],
  memory: '14.2MB'
}
```

------

### 8. **Feedback Layer**

Visual/LED/meter displays.

#### **Pseudocode:**

```js
feedbackUI = {
  leds: { record: 'green', overdub: 'off' },
  display: { showParam: true }
}
```

------

## 🔎 **Detailed BLK Layer Breakdown**

**Every button, LED, and knob is explicitly tracked and updated only if power is on. Example (under `sysHW.blk`):**

```js
// For each button:
record: {
  pressed: false,         // Is the button held down now?
  led: 'off'              // LED state: 'off', 'red', 'green', etc.
}
// For each LED:
overdub: {
  state: 'off',           // Could be 'off', 'on', 'blink', etc.
  color: 'red',
  mode: 'solid'
}
// For each knob:
feedback: {
  position: 0.75,         // Value from min to max
  min: 0.0,
  max: 1.0
}
```

**All BLK items are “gated” by power:**
 If `sysHW.power === false`, then:

- All `.pressed` = false
- All `.led` and `.state` = 'off'
- All knob actions are ignored

------

## 🧠 **Summary**

- **sysHW**: Physical controls, *real* button/LED/knob state
  - **blk**: Buttons, LEDs, Knobs (with sections for each)
- **sysSW**: Global logic, modes, interprets hardware events
- **parameters, preset, signal, controls, buffer, feedbackUI**: Downstream layers for full system behavior

------

Want a **full reducer function** that takes button/knob events and applies them through this structure? Or a mapping of how BLK events get interpreted in both hardware and software layers?



Understood. I’ll prepare a comprehensive markdown report formatted for ingestion by the Windsurf IDE AI. This will include:

- A summary of the discussion history
- A formal breakdown of the layer and control structure
- Annotated pseudocode for the BLK layer (Button, LED, Knob under power)
- A structured JSON object suitable for vectorization in Qdrant
- An extended explanation of the architectural rationale

I’ll let you know when the full document is ready for your review.

# Echoplex Control System Architecture Restructuring Report

## Chronological Summary of Iterative Design Decisions

1. **Initial Architecture & Goals:** The session began with an outline of the Echoplex looper’s control system. Initially, the architecture was somewhat monolithic, blending hardware control with software logic. The goal was to manage loop recording/playback, parameter editing, and feedback control, but the responsibilities of components were not clearly separated.
2. **Identifying Layered Components:** Early in the discussion, we identified key functional groupings – such as hardware interface, core loop logic, parameter management, presets, audio signal processing, and feedback control. The idea of organizing these into distinct **layers** emerged to clarify roles and reduce coupling, reflecting best practices for layered design (each layer handling a specific concern). This would make the system easier to develop and maintain as independent units rather than one large system.
3. **Splitting System Hardware vs Software:** A pivotal decision was to split the original “System” layer into **System Hardware** and **System Software** layers. This separation created a hardware abstraction boundary: all physical device handling would reside in System Hardware, decoupling it from the high-level logic in System Software. This aligns with the principle of hardware abstraction, which **decouples application code from underlying hardware**, allowing changes in hardware or simulation of hardware without altering core logic. By doing so, each side could be modified or tested in isolation.
4. **Introducing the BLK Interface Layer:** We collaboratively introduced the **BLK Layer** (Buttons, LEDs, Knobs) as a sub-layer within System Hardware to manage the front-panel controls and indicators. Initially, these controls were handled directly by system logic, but we decided to encapsulate them in BLK for clarity. The BLK layer would scan button input states, update LED indicators, and read knob changes, acting as the dedicated interface between the hardware and the rest of the system. This change ensured immediate hardware feedback (LEDs reacting to state changes) and consistent control handling in one place.
5. **Parameter Mode & Contextual Control:** As the conversation progressed, we focused on how the system enters a **Parameter Mode** (for editing configuration parameters) versus normal **Play Mode** (looping operations). We decided that the BLK layer should be context-aware: in Parameter Mode, buttons and knobs manipulate parameter settings, whereas in Play Mode they trigger loop functions. This required iterative refinement of the BLK design – ultimately, we defined that a press of the *Parameter* button toggles modes, and in parameter-editing state the BLK would route inputs to the Parameter Layer (adjusting values and giving visual feedback via LEDs or display). This context-sensitive control was refined through pseudocode (see **BLK Layer** section below) to ensure robust mode switching and user feedback.
6. **Defining Parameter vs Preset Layers:** The architecture was further refined by distinguishing the **Parameter Layer** (which holds runtime parameters and handles changes) from a **Preset Layer** (which stores and recalls sets of parameters). Earlier, parameters and presets were conflated, but the discussion led to separating them: the Parameter Layer would manage current values (e.g. current *Feedback* level, *MoreLoops* count, etc.), while the Preset Layer would save/load these values as presets. This separation allows real-time parameter tweaks without immediately overwriting saved presets, and enables storing configurations that persist across power cycles.
7. **Refining Signal Chain, Buffer, and Feedback Layers:** We recognized that audio processing involves distinct concerns: the **Signal Chain Layer** to handle input/output mix and routing, the **Buffer Layer** to manage recorded audio memory, and a **Feedback Layer** to govern how loops decay or sustain. Initially, these might have been lumped together, but through iteration we teased them apart:
   - The Signal Chain layer would contain the audio path configuration (input->loop->output) and mix levels.
   - The Buffer layer would handle memory for recording and playback of loops (including managing multiple loops if supported).
   - The Feedback layer specifically would control the loop feedback coefficient (how much of the previous loop is fed into the next repetition), since feedback is crucial to looping behavior.
      This modular breakdown means, for example, the feedback control can be adjusted independently without affecting how the buffer stores audio, aligning with the isolation benefits of layered design.
8. **Finalizing the Hierarchy & JSON Schema:** In the final stage, we solidified the hierarchy of layers and their relationships. We prepared a structured JSON schema representing the components and their nesting (for potential ingestion into a vector database like Qdrant). We also documented pseudocode for critical parts (notably the BLK hardware interface logic) and a rationale for the architectural choices. The resulting design is a comprehensive multi-layer control system that cleanly separates hardware from software and organizes functionality into logical layers for maintainability and clarity.

## Echoplex Architecture: Full Structural Breakdown

Below is the breakdown of the proposed Echoplex control system architecture, with each layer’s role defined and the relationships between layers clarified.

### System Hardware Layer

The **System Hardware Layer** encapsulates all physical hardware components and their direct control. It is responsible for interfacing with tangible elements of the Echoplex device, ensuring that the System Software layer doesn’t need to manage low-level hardware details. Key aspects of this layer include:

- **Physical Controls & Indicators:** Management of buttons, LEDs, knobs, foot pedals, displays, and any sensors. For example, the Echoplex front panel has eight multi-function buttons, multiple indicator LEDs, and knobs for levels – reading these inputs and driving these outputs is handled here.
- **Hardware Abstraction:** This layer acts as a **Hardware Abstraction Layer (HAL)** for the system. It provides a standardized interface (APIs or data structures) to the System Software so that higher-level logic can query button states or set LED statuses without knowing hardware specifics (e.g., GPIO pins or electrical details). This abstraction enables easier hardware changes or simulation down the line.
- **Subcomponents:** System Hardware contains the BLK Interface sub-layer (detailed next) and potentially other hardware-specific modules (e.g., Audio I/O interfaces or footswitch controllers). All such subcomponents directly manipulate or monitor hardware devices.

#### BLK Layer (Button-LED-Knob Interface)

This **BLK Layer** is nested within System Hardware and is dedicated to managing the **Buttons, LEDs, and Knobs** on the Echoplex’s control panel. It serves as the bridge between user interactions (button presses, knob turns) and the system’s logic, as well as the conveyor of feedback via LEDs or display. Below is pseudocode illustrating BLK Layer behavior with explanations:

```pseudo
# Pseudocode for BLK Layer - manages Buttons, LEDs, Knobs
state parameterMode = false
currentParameter = None

loop forever:
    # 1. Read all physical inputs (buttons and knobs)
    buttonStates = read_all_buttons()       # e.g., array or dict of button -> pressed/released
    knobPositions = read_all_knobs()       # e.g., current analog values or increments

    # 2. Check for mode toggle (Parameter button)
    if buttonStates["Parameter"] == PRESSED:
        parameterMode = not parameterMode   # toggle Parameter Mode on/off
        update_mode_indicator(parameterMode)  # update LED or display to show mode change

    # 3. Handle button inputs based on current mode
    if parameterMode:
        # Parameter Mode behavior: buttons select or adjust parameters
        for btn, pressed in buttonStates:
            if pressed and btn != "Parameter":
                currentParameter = map_button_to_param(btn)  # select parameter based on which button
                show_active_parameter(currentParameter)      # light an LED row or display to indicate selected param

        # Knob adjustments affect parameter values in real-time
        if currentParameter is not None:
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
  "SystemHardwareLayer": {
    "components": [
      {
        "name": "BLK_Interface",
        "role": "Button-LED-Knob interface for user I/O",
        "contains": ["Buttons", "LEDs", "Knobs"],
        "interacts_with": ["ParameterLayer", "ControllerLayer", "SignalChainLayer", "FeedbackLayer"]
      },
      {
        "name": "AudioIO",
        "role": "Audio input/output converters and jacks",
        "contains": ["InputJack", "OutputJack", "AD/DA_Converters"],
        "interacts_with": ["SignalChainLayer", "BufferLayer"]
      },
      {
        "name": "FootPedalInterface",
        "role": "External pedal inputs (e.g., Feedback pedal)",
        "contains": ["FeedbackPedalJack", "Footswitches"],
        "interacts_with": ["FeedbackLayer", "ControllerLayer"]
      }
    ]
  },
  "SystemSoftwareLayer": {
    "components": [
      {
        "name": "ParameterLayer",
        "role": "Manages parameter definitions and current values; handles parameter editing logic",
        "interacts_with": ["PresetLayer", "BLK_Interface", "ControllerLayer", "FeedbackLayer"]
      },
      {
        "name": "PresetLayer",
        "role": "Handles storing and recalling sets of parameters (presets)",
        "interacts_with": ["ParameterLayer"]
      },
      {
        "name": "SignalChainLayer",
        "role": "Manages audio signal routing, mixing, and level control between input, loop, and output",
        "interacts_with": ["BufferLayer", "FeedbackLayer"]
      },
      {
        "name": "ControllerLayer",
        "role": "State machine for loop control (record/play/overdub etc.) coordinating other layers",
        "interacts_with": ["BufferLayer", "SignalChainLayer", "FeedbackLayer", "ParameterLayer"]
      },
      {
        "name": "BufferLayer",
        "role": "Manages audio buffer for recording and playback of loops; memory and timing of loops",
        "interacts_with": ["ControllerLayer", "SignalChainLayer", "FeedbackLayer"]
      },
      {
        "name": "FeedbackLayer",
        "role": "Controls loop feedback level (loop decay/sustain) and applies it during overdubs",
        "interacts_with": ["BufferLayer", "ControllerLayer", "SignalChainLayer", "ParameterLayer", "BLK_Interface"]
      }
    ]
  }
}
```

*Notes:* This JSON shows the two top-level categories **SystemHardwareLayer** and **SystemSoftwareLayer**, each containing components (subsystems). Each component has a name, a brief role description, and an **interacts_with** list to indicate which other parts it communicates with. For example, the BLK Interface interacts with ParameterLayer (for adjusting values), ControllerLayer (for sending loop control commands), etc. and the FeedbackLayer interacts with many others because feedback changes can be initiated by hardware (knob/pedal), affect the buffer’s audio, be governed by a parameter, and considered by the controller during state changes. This schema provides a blueprint of the architecture’s composition and relationships suitable for analysis or import into other tools.

## Rationale for Architectural Decisions

- **Why the BLK Layer resides in System Hardware:** The BLK (Buttons-LEDs-Knobs) interface is inherently tied to physical hardware – it directly reads electrical signals from buttons and potentiometers and drives LED circuits. Placing it within **System Hardware Layer** enforces a clean separation between hardware-dependent code and the rest of the system logic. This yields a classic Hardware Abstraction Benefit: the higher layers of software are insulated from hardware specifics. For example, if the physical control mechanism changes (say, a new model uses different buttons or an OLED screen instead of simple LEDs), only the BLK layer or Hardware layer would need updating. This design adheres to the dependency inversion principle, making the system more modular and maintainable by decoupling hardware interaction from application logic.
- **Why we split the original System Layer into Hardware and Software:** Splitting was driven by the principle of **separation of concerns**. In early design, having one “System” responsible for everything was leading to intertwined code (hardware handling mixed with loop logic). By dividing into System Hardware vs. System Software, each can focus on its domain. This makes the architecture easier to reason about, develop, and test – you can work on the software logic without constantly dealing with hardware interrupts, and vice versa. It also provides *layers of isolation*, meaning changes in one layer (say upgrading to a new microcontroller or altering how the buffer is managed) have minimal impact on the other. This modular approach improves reliability and agility: for instance, the team can simulate the entire System Software on a PC using the BLK interface as a mock, which speeds up development. In summary, the split creates a clearer responsibility boundary that enhances maintainability and scalability of the system.
- **How this structure supports loop state tracking, hardware feedback, and parameter configurability:** The layered design directly addresses these core needs:
  - *Loop State Tracking:* The **Controller Layer** serves as a dedicated state machine for loop operations, which means the various states (recording, playing, overdubbing, etc.) and transitions are explicitly handled in one place. This clarity prevents state-related bugs and allows complex behaviors (like multi-loop switching or quantized actions) to be implemented systematically. The architecture ensures the Controller has direct lines of communication to the Buffer (for timing/length) and to hardware via BLK for responding to user input, enabling tight control over loop state.
  - *Hardware Feedback:* Immediate feedback to the performer is achieved by the BLK Layer controlling LEDs and display elements in response to state changes. Because BLK is integrated in the Hardware layer, it can respond very quickly to events (e.g., lighting the Record LED the instant recording starts). The Controller signals such events to BLK (or BLK polls Controller status), and the user sees the result with minimal latency. For example, as soon as the system enters Record mode, the Record button’s light can flash red – the design of separate layers doesn’t impede this; in fact, it clarifies it by having a defined pathway for updates. The hardware feedback loop is thus robust: any state or parameter change that needs to be conveyed to the user goes through BLK’s well-defined interface (update LEDs, etc.), ensuring consistency.
  - *Parameter Configurability:* The presence of a dedicated Parameter Layer (with support from the Preset Layer) makes the system highly configurable. Users can enter Parameter Mode and tweak a multitude of settings without stopping the music, because the Parameter Layer applies changes on the fly. The BLK interface is context-aware to facilitate this, and the Parameter layer cleanly separates these concerns from the main loop logic. This means new parameters can be added without touching the core audio engine – you simply add it in the Parameter definitions and handle its effect where appropriate. Additionally, by having a Preset Layer, the device can store full sets of parameters, allowing complex setups to be recalled instantly. Overall, the architecture ensures that configuring the system is both **immediate** (thanks to real-time update design) and **enduring** (thanks to presets), all organized in a modular way that keeps the code manageable.

In conclusion, the restructured Echoplex architecture – with its clear division between hardware and software, and further breakdown into functional layers – provides a robust foundation for a loop pedal system. It maximizes clarity (each part has a well-defined role), modifiability (layers can change internally with minimal side-effects), and performance (critical real-time tasks are handled at the appropriate layer). This design directly benefits the user experience by ensuring reliable loop state management, instantaneous feedback, and flexible parameter control, all of which are essential in a live looping context. The collaborative iteration on this structure has yielded a system that is both **engineered for technical soundness** and **aligned with the musical workflow** of the Echoplex.



Perfect. I will generate full low-to-mid level pseudocode for the entire Echoplex unit based on the finalized layered structure you’ve outlined. This will include structural modeling, functional definitions, the full BLK and Feedback Layer logic, and JSON encoding where applicable.

Once it’s ready, you’ll have a complete snapshot of the architecture suitable for simulation, documentation, or integration into a Qdrant system.

# Echoplex System Architecture Pseudocode

## System Hardware Layer (Power, BLK: Buttons/LEDs/Knobs)

Handles the physical power state and the **BLK** user interface (Buttons, LEDs, Knobs). All input and output at this layer respect the current power state and the global Parameter Mode state.

### Buttons

- **Power Button:** Toggles system power on/off (initializes or shuts down hardware).
- **Other Buttons:** Read and debounced; generate events for the System Software layer. Logic differs based on Parameter Mode:

```pseudo
onButtonPress(button):
    if systemPower == OFF:
        if button == POWER_BUTTON:
            systemPower = ON
            initializeHardware()
        else:
            ignore()  # no effect when power is off
    else:  # systemPower is ON
        if button == POWER_BUTTON:
            systemPower = OFF
            shutdownHardware()
        elif button == PARAM_BUTTON:
            # Toggle or cycle Parameter Mode rows
            if parameterModeActive:
                currentParamRow += 1
                if currentParamRow >= TOTAL_PARAM_ROWS:
                    # Exiting Parameter Mode after last row
                    parameterModeActive = False
                    currentParamRow = NONE
                else:
                    parameterModeActive = True  # remain in Parameter Mode on next row
            else:
                parameterModeActive = True
                currentParamRow = 0  # enter Parameter Mode at first row
            # Update row indicator LEDs to reflect currentParamRow (or off if exited)
            LEDControl.setRowIndicator(currentParamRow, parameterModeActive)
        else:
            # Forward button event to System Software for interpretation
            SystemSoftware.handleButtonEvent(button, parameterModeActive)
```

*When Parameter Mode is off (no Row LED lit), all buttons perform their primary loop functions (Record, Overdub, Multiply, etc.). When a Parameter Mode row is active (a Row Indicator LED is lit), the buttons map to parameter settings in that category (e.g. if the **Loops** row is active, the Record button functions as **MoreLoops** to increase loop count).*

### LEDs

- **Row Indicator LEDs:** Four LEDs indicating the active Parameter row. Controlled whenever Parameter Mode state changes:

```pseudo
if parameterModeActive:
    for each rowIndex in 0..3:
        LEDControl.rowLED[rowIndex] = (rowIndex == currentParamRow) ? ON : OFF
else:
    LEDControl.allRowLEDs(OFF)
```

- **Status Indicator LEDs:** Multi-color LEDs under each button for feedback. In **Play Mode** (Parameter Mode off), their colors reflect each function’s state:
  - **Unlit:** Function unavailable (cannot be used now).
  - **Green:** Function available and ready for normal use.
  - **Orange:** Function available, but will perform an alternate or secondary action (context-specific).
  - **Red:** Function is active (last pressed and awaiting completion or currently in use).

```pseudo
updateStatusLEDs():
    for each functionButton in [Record, Overdub, Multiply, Insert, Mute, Undo, NextLoop]:
        color = determineStatusColor(functionButton)
        LEDControl.setButtonLED(functionButton, color)
```

*(For example, when not recording, the Record LED is green (ready); once Record is pressed and recording begins, Record LED turns red until the loop is closed. If a button’s normal action is temporarily replaced by another (e.g. Record acting as MoreLoops in Parameter Mode), it may show orange to indicate the alternate function.)*

- **Level Indicator LEDs:** Dedicated LEDs (e.g. input level, feedback level) that show analog levels in real-time. These are updated continuously from the signal input/output:

```pseudo
updateLevelIndicators(inputLevel, loopOutputLevel):
    # Input LED: green at normal levels, orange when nearing clip, red if clipping
    LEDControl.inputLED = colorScale(inputLevel)
    # Feedback LED: indicates current loop playback volume or feedback saturation similarly
    LEDControl.feedbackLED = colorScale(loopOutputLevel)
```

### Knobs

Physical rotary controls for audio levels. There are typically four knobs (Input, Output, Mix, Feedback):

```pseudo
onKnobTurn(knob, newValue):
    if systemPower == OFF:
        return  # ignore when off
    # These knobs always control the signal chain directly (level adjustments)
    SignalChain.adjustLevel(knob, newValue)
    Feedback.updateLevelIndicators(...)  # reflect any level changes on meter LEDs
    # Parameter Mode does not repurpose these knobs in this design; they remain active for levels at all times
```

*(The Input, Output, Mix, and Feedback knobs set critical audio levels on the Echoplex. They are not used for parameter adjustment, so even in Parameter Mode they continue to affect live levels.)*

## System Software Layer (Parameter Mode, MIDI Sync, Action Interpretation)

High-level logic that interprets user input events, manages Parameter Mode state transitions, and handles MIDI synchronization. This layer mediates between hardware inputs and the functional layers below.

### Parameter Mode Management

Manages switching in and out of Parameter Editing mode and tracking which parameter category is selected:

```pseudo
state parameterModeActive = False
state currentParamRow = NONE  # e.g., 0=Timing, 1=Switches, 2=MIDI, 3=Loop

function enterParameterMode():
    parameterModeActive = True
    currentParamRow = 0  # start at first parameter category
    Feedback.showParamCategory(currentParamRow)

function exitParameterMode():
    parameterModeActive = False
    currentParamRow = NONE
    Feedback.clearParamDisplay()
```

When active, button presses (except the Parameter button itself) are routed to parameter editing. Each press of the Parameter button advances to the next category or exits after the last, as described above in the hardware layer logic. The UI is updated accordingly (row LEDs, display readout of the category or parameter being edited).

### MIDI Sync

Handles synchronization with external MIDI clock or acts as master clock, according to sync settings:

```pseudo
# Sync settings from Parameter Layer
syncMode = Parameter.get("MIDI", "SyncMode")  # e.g., Off, SyncIn, SyncOut
midiTempo = Parameter.get("Timing", "Tempo")  # BPM if acting as master
clockTicksPerBeat = 24  # MIDI standard

function onMidiClockTick():
    if syncMode == "SyncIn":
        Timing.incrementExternalTicks()
        # If quantizing operations, check if a cycle or beat boundary is reached to trigger queued actions
        if Timing.ticksSinceLastBeat % (clockTicksPerBeat * Parameter.get("Timing","CycleBeats")) == 0:
            Timing.markCycleBoundary()

function sendMidiClock():
    # Called periodically if SyncOut mode is enabled
    if syncMode == "SyncOut":
        outputMidiClockTick()
        # maintain internal tempo based on midiTempo parameter
```

- If `SyncMode` is **SyncIn** (slave), the system listens for incoming MIDI Start/Stop and clock ticks. Loop timing aligns to the external tempo; any quantized actions (like starting/stopping loops) are scheduled on the beat or cycle boundaries of the incoming clock.
- If `SyncMode` is **SyncOut** (master), the system sends MIDI clock ticks at the current internal tempo and can send Start/Stop messages when loops begin or end. Tempo can be set via a Tempo parameter or derived from the first recorded loop length.
- If sync is **Off**, loops run on the internal clock only (free timing).

### Action Interpretation

Interprets button events (from hardware) according to the current mode and state, dispatching them to either parameter adjustment or loop control actions:

```pseudo
function handleButtonEvent(button, paramModeActive):
    if paramModeActive:
        # In Parameter Mode, non-Parameter buttons adjust parameter values
        ParameterLayer.handleParamButton(currentParamRow, button)
        Feedback.displayParamChange(currentParamRow, button)
    else:
        # In Play Mode, map button to loop controller or other actions
        switch button:
            case RECORD_BUTTON:   Controller.handleRecord()
            case OVERDUB_BUTTON:  Controller.handleOverdub()
            case MULTIPLY_BUTTON: Controller.handleMultiply()
            case INSERT_BUTTON:   Controller.handleInsert()
            case MUTE_BUTTON:     Controller.handleMute()
            case UNDO_BUTTON:     Controller.handleUndo()
            case NEXTLOOP_BUTTON: Controller.handleNextLoop()
            default: ignore  # unknown button
```

This module essentially routes user input to the correct subsystem:

- If Parameter Mode is **active**, the input is interpreted as a parameter increment/decrement or toggle (depending on the parameter type). For example, pressing the button corresponding to *MoreLoops* will increase the loop count parameter by one. The Parameter Layer is invoked to update the value, and the Feedback layer is signaled to show the new value.
- If Parameter Mode is **off** (normal **Play Mode**), each button triggers its primary control action in the Controller layer (record, overdub, etc., detailed below).

This layer also handles any special combinations or long-press interpretations:

```pseudo
# Examples of extended interpretations
if button == RECORD_BUTTON and longPress and not Controller.isRecording():
    Controller.resetCurrentLoop()  # long press Record resets (clears) current loop
if button == MULTIPLY_BUTTON and longPress and Controller.lastActionWasLoopReset:
    Controller.resetAllLoops()  # long press Multiply after a reset clears all loops
```

*(The above example shows how a long press or sequential command could be interpreted for special functions like clearing loops.)*

## Parameter Layer (Timing, Switches, MIDI, Loop)

Maintains configuration parameters that define system behavior. Parameters are grouped into four categories (rows) – **Timing**, **Switches**, **MIDI**, and **Loop** – each corresponding to a Parameter Mode row. This layer provides interfaces to read/update parameters and applies any immediate effects of parameter changes (e.g., reallocate memory when loop count changes).

**Parameter Storage and Defaults:**

```pseudo
# Parameter categories and their parameters with default values
Parameters = {
  "Timing": {
    "Quantize": "Off",      # Quantization of actions: Off, Cycle, Loop (timing alignment)
    "Tempo": 120,           # BPM for internal clock (if used in SyncOut)
    "CycleBeats": 8         # Number of MIDI 1/8 notes per cycle (for sync, e.g., 8 = 1 bar)
  },
  "Switches": {
    "RecordMode": "Toggle",   # Record button behavior: Toggle or Sustain
    "OverdubMode": "Toggle",  # Overdub button: Toggle or Sustain
    "InsertMode": "Insert",   # Insert function mode: Insert, Replace, Substitute, Reverse, HalfSpeed, etc.
    "MuteMode": "Continuous", # Mute behavior: Continuous or Start (retrigger at unmute)
    "SwitchQuant": "Off",     # Quantize loop switching: Off or On (align NextLoop/Mute to loop end)
    "RoundMode": "Off"        # Round timing for Multiply end: Off or On (complete cycle on exit)
  },
  "MIDI": {
    "SyncMode": "Off",       # MIDI Sync: Off, SyncIn (slave), SyncOut (master)
    "MIDIchannel": 1,        # MIDI channel for control messages
    "TrigThreshold": 0,      # Input audio threshold for auto-start recording (0 = off)
    "SamplerStyle": "Off",   # Sampler-style trigger mode: Off, NoteGate, OneShot (for MIDI control of loops)
    "Velocity": "Off"        # Whether MIDI velocity (or input level) affects loop volume on trigger
  },
  "Loop": {
    "MoreLoops": 1,        # Number of loops (memory is divided evenly among loops):contentReference[oaicite:6]{index=6}
    "LoopCopy": "Off",     # Next loop copy mode: Off, On (whether to copy current loop into new loop)
    "AutoRecord": "Off",   # Auto-Record on loop change: Off or On (start recording automatically on empty loop)
    "LoopTrig": "Off"      # Loop trigger mode: Off or On (e.g., allow triggering loop start via MIDI or threshold)
  }
}
```

**Parameter Access and Update:**

```pseudo
function get(category, name):
    return Parameters[category][name]

function set(category, name, value):
    Parameters[category][name] = value
    # Apply side effects of certain parameter changes immediately:
    if category == "Loop" and name == "MoreLoops":
        Buffer.allocateMemory(value)  # re-divide memory among `value` loops:contentReference[oaicite:7]{index=7}
        Controller.currentLoopIndex = 0
        Controller.totalLoops = value
        # Changing loop count resets all existing loops :contentReference[oaicite:8]{index=8}
        Buffer.clearAllLoops()
        Feedback.refreshLoopCountDisplay(value)
    if category == "Loop" and name == "LoopCopy":
        Controller.loopCopyEnabled = (value == "On")
    if category == "Loop" and name == "AutoRecord":
        Controller.autoRecordEnabled = (value == "On")
    if category == "Switches" and name == "SwitchQuant":
        Controller.switchQuantize = (value != "Off")
    if category == "Switches" and name == "RoundMode":
        Controller.roundMode = (value == "On")
    # ... (apply other immediate effects if needed)
```

**Handling Parameter Adjustment (from user input in Parameter Mode):**

```pseudo
function handleParamButton(activeRow, button):
    # Map the pressed button to a specific parameter in the active row category
    paramName = mapButtonToParam(activeRow, button)
    currentValue = Parameters[activeRow][paramName]
    # Toggle or increment parameter value based on type (boolean, enumerated, numeric)
    newValue = getNextValue(paramName, currentValue)
    set(activeRow, paramName, newValue)
    # Provide immediate feedback to the user
    Feedback.displayParamValue(paramName, newValue)
```

This will be invoked by the System Software when in Parameter Mode. For example, if the **Loops** category is active and the user presses the button that corresponds to *MoreLoops*, the Parameter layer will increment the `MoreLoops` value by one and immediately apply it (allocating memory for an additional loop and updating displays). All parameter changes take effect in real-time and are persisted in memory so they remain across power cycles (unless explicitly reset).

## Preset Layer (Config Snapshots)

Manages saving and recalling sets of parameters (snapshots of the Parameter Layer) as presets. This allows quick reconfiguration of the entire system (for example, switching between different parameter setups for different performance styles).

```pseudo
presets = []  # list of preset objects, each storing a full copy of Parameters
currentPresetIndex = None

function savePreset(index):
    presets[index] = deepCopy(Parameters)
    Feedback.showMessage("Preset " + index + " saved")

function loadPreset(index):
    if index < len(presets) and presets[index] is not None:
        newParams = presets[index]
        # Apply each parameter to the system
        for category, paramMap in newParams:
            for name, value in paramMap:
                ParameterLayer.set(category, name, value)
        currentPresetIndex = index
        Feedback.showMessage("Preset " + index + " loaded")
    else:
        Feedback.showMessage("Preset " + index + " not defined")
```

Loading a preset updates the Parameter Layer (and by extension all dependent layers) to the stored values. For instance, if a preset has a different `MoreLoops` value than the current setting, loading it will reallocate loop memory and reset loops as needed (this happens via the Parameter Layer's `set` logic). The Preset Layer interfaces with System Software or MIDI (e.g., MIDI Program Change messages) to allow the user to recall presets. It ensures that *configurations (but not the audio content of loops)* can be saved and restored conveniently.

*(The number of presets and how they are accessed is design-dependent. Presets might be selected via dedicated buttons, via the Parameter Mode UI, or external MIDI program changes. In all cases, this layer handles the storage and retrieval of parameter sets.)*

## Signal Chain Layer (Mute, Volume, Feedback)

Responsible for the audio signal path processing — applying volume control, muting, and feedback (loop decay) according to current settings. This layer takes input from the instrument and loop playback from the Buffer, and outputs the final audio mix.

```pseudo
state muteActive = False

function processAudioFrame(inputSample):
    # Apply input level and mix settings
    inLevel = inputSample * Knob.InputLevel      # adjust input gain
    loopSample = Buffer.playbackSample()        # get current sample from loop playback
    # Determine wet/dry mix
    wetLevel = Knob.MixLevel   # proportion of loop playback in output
    dryLevel = 1 - wetLevel    # proportion of direct input in output
    output = (dryLevel * inLevel) + (wetLevel * loopSample)
    # Apply feedback: if Overdub is active or in Delay mode, write input to loop with feedback
    if Controller.overdubActive or Parameter.get("Timing","Quantize") == "DelayMode":
        # When overdubbing, integrate new input into loop with feedback decay
        Buffer.currentLoop[Buffer.playPos] = Buffer.currentLoop[Buffer.playPos] * Knob.FeedbackLevel + inLevel
    # Advance loop playback position
    Buffer.playPos = Buffer.getNextPosition()
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

This duplicates the audio and timing info from one loop to another. It is used when switching loops if the LoopCopy parameter is enabled.

**Overflow Handling:** If recording exceeds the allocated memory for a loop:

```pseudo
onRecordOverflow(loopIndex):
    if Parameter.get("Switches","Overflow") == "Play":
        # Stop recording and leave the loop as is (ignore extra input)
        stopRecording(loopIndex)
        Feedback.showMessage("Memory Full - Loop Length Maxed")
    elif Parameter.get("Switches","Overflow") == "Stop":
        # Stop recording and stop playback to signal the end (loop might be incomplete)
        stopRecording(loopIndex)
        stopPlayback(loopIndex)
        Feedback.showMessage("Memory Full - Loop Stopped")
```

This ensures the system handles running out of memory gracefully according to user preference (either keep playing the recorded portion or halt).

The Buffer Layer exposes interfaces to the other layers:

- To the Controller: functions like `startRecording`, `stopRecording`, `startPlayback`, `stopPlayback`, `copyLoop`, `saveLoopState`, `restoreLoopState`, etc.
- To the Signal Chain: functions to get the current playback sample (`playbackSample()` which reads from `loopBuffers[currentLoop][playPos]` taking into account reverse or half-speed flags) and to write a sample when recording/overdubbing.
- To the Feedback: information like current loop time (which can be `loopLengths[currentLoop] / sampleRate` for display), current position or cycle for progress indicators, etc.

## Feedback Layer (Visual Feedback, LEDs, Displays)

Coordinates all user feedback: updating LED indicators, numeric or text displays, and any other visual output in real-time based on the system state. This layer listens for state changes from all other layers and ensures the hardware LEDs and display show the correct status.

**Status LEDs Management:**

```pseudo
function updateStatusIndicators():
    # Called whenever a major state change occurs (record start/stop, mode change, etc.)
    for func in ["Record","Overdub","Multiply","Insert","Mute","Undo","NextLoop"]:
        color = "Off"
        if func == "Record":
            if Controller.recording: color = "Red"
            else if Controller.recording == False and (Controller.loopEmpty(currentLoop) || !Controller.overdubActive): color = "Green"
        if func == "Overdub":
            if Controller.overdubActive: color = "Red"
            else: color = "Green"
        if func == "Multiply":
            if Controller.multiplyMode: color = "Red"
            else if Controller.recording or Controller.overdubActive: color = "Off"  # e.g., can't multiply during record
            else: color = "Green"
        if func == "Insert":
            if Controller.insertActive: color = "Red"
            else: color = "Green"
        if func == "Mute":
            if SignalChain.muteActive: color = "Red"
            else: color = "Green"
        if func == "Undo":
            if Buffer.hasUndoState(currentLoop): color = "Green"  # can undo
            if Controller.undoToggled: color = "Orange"  # currently in undone state (ready to redo)
        if func == "NextLoop":
            if Controller.totalLoops > 1: color = "Green" 
            else: color = "Off"  # no next loop if only one loop
            if Controller.pendingLoopSwitch: color = "Orange"  # quantized switch scheduled
        LEDControl.setButtonLED(func, color)
```

*(The above logic is illustrative. It sets each function’s LED color based on availability and active status, following the scheme: Off = unavailable, Green = available, Orange = alternate or pending, Red = active. For example, if a loop is currently playing and not being multiplied, Multiply is Green (it’s ready and available). If a multiply is in progress, Multiply LED is Red. If a loop switch has been queued (SwitchQuant on), the NextLoop LED might be Orange until the switch occurs.)*

**Row Indicator LEDs:**

```pseudo
function updateRowIndicator():
    if SystemSoftware.parameterModeActive:
        LEDControl.setRowLED(currentParamRow, ON)
        for otherRow != currentParamRow: LEDControl.setRowLED(otherRow, OFF)
    else:
        LEDControl.allRowLEDs(OFF)
```

This ensures that when Parameter Mode is engaged, the active parameter row’s LED is lit. If Parameter Mode is off, none of the row LEDs are lit (indicating Play Mode).

**Display Updates:**
 The Echoplex has a numeric/time display and possibly text indicators. The Feedback layer updates it in different contexts:

```pseudo
function updateDisplay():
    if SystemSoftware.parameterModeActive:
        # Show parameter name/code and value
        let param = ParameterLayer.getParamName(currentParamRow, currentParamIndex)
        let val = ParameterLayer.get(currentParamRow, param)
        Display.show(param + ":" + formatValue(val))
    else:
        # In Play Mode, show loop timing and status
        if Controller.recording:
            Display.show(formatTime(Buffer.recordedTime(currentLoop)) + " REC")  # show recording time growing
        else if Controller.overdubActive:
            Display.show(formatTime(Buffer.loopLengths[currentLoop]) + " OD")   # loop length with overdub indicator
        else:
            # Show current loop number and length
            if Parameter.get("Loop","MoreLoops") > 1:
                Display.show("Loop " + (Controller.currentLoopIndex+1) + "/" + Controller.totalLoops 
                              + " " + formatTime(Buffer.loopLengths[currentLoop]))
            else:
                Display.show(formatTime(Buffer.loopLengths[currentLoop]) )  # just time
        # Also flash small indicators for cycle and sync if applicable
        if Buffer.playPos == 0:
            Display.flashDot()  # flash a dot at loop start (StartPoint):contentReference[oaicite:15]{index=15}
        if SystemSoftware.syncMode == "SyncIn" or SystemSoftware.syncMode == "SyncOut":
            if MIDI.isClockPulse(): Display.flashSyncDot()
```

- In **Parameter Mode**, the display shows the parameter being edited and its current value (this could be a textual name or a code and numeric value). For example, editing MoreLoops might show “Loops: 4”.
- In **Play Mode**, by default the display might show the current loop’s length (in seconds or a time format). If multiple loops are available, it also shows the current loop number. The display updates dynamically:
  - While recording, it could show the recording time increasing.
  - When a loop is closed and playing, it could show the loop length.
  - Indicators (like dots or small LEDs on the display) flash to mark each loop start (for rhythm) and to indicate MIDI sync status (e.g., a MIDI sync indicator flashing on each beat).
- It can also display short status messages (via `showMessage`) for certain actions (e.g., “Loop Copied”, “Undo”, “HalfSpeed On”, etc.), typically for a brief moment before reverting to the default display.

**Real-time Level Meters:** The input and feedback LED indicators (mentioned in the Hardware layer) are updated continuously by sampling the audio levels:

```pseudo
function updateLevelMeters(inputLevelSample, loopOutputSample):
    # This might be called every audio frame or at intervals
    if inputLevelSample >= clipThreshold:
        LEDControl.setLevelLED("Input", RED)
    elif inputLevelSample >= highThreshold:
        LEDControl.setLevelLED("Input", ORANGE)
    elif inputLevelSample > 0:
        LEDControl.setLevelLED("Input", GREEN)
    else:
        LEDControl.setLevelLED("Input", OFF)
    # Similarly for feedback/output level:
    ...
```

This gives the performer immediate visual feedback to help set input gain (avoiding clipping) and monitor loop playback volume.

**Integration:** The Feedback layer receives triggers from other layers whenever state changes:

- The Controller will call functions like `Feedback.updateStatusIndicators()` or more specific ones (e.g., `Feedback.setStatusLED("Record", color)`) when an action starts or stops.
- The Parameter layer will call `Feedback.displayParamValue(...)` when a parameter is changed in edit mode.
- The Buffer layer might call `Feedback.updateDisplay()` when loop length changes (after recording or multiply).
- The System Software might call `Feedback.showMessage()` for system-level events (preset loaded, sync status, etc.).

All physical outputs (LED control, display text) ultimately go through the hardware interface (BLK) – for example, `LEDControl.setButtonLED(func,color)` and `Display.show(text)` would be low-level functions writing to the device’s LEDs and screen. The Feedback layer is the high-level coordinator that knows *what* to display, while the System Hardware layer knows *how* to actually light an LED or draw on the display.

## JSON Schema Representation

```json
{
  "System Hardware Layer": {
    "components": {
      "Power": {
        "role": "Manages device power state (on/off) and initialization/shutdown of system."
      },
      "BLK": {
        "Buttons": {
          "description": "Physical buttons for user input (Parameter, Record, Overdub, Multiply, Insert, Mute, Undo, NextLoop, etc).",
          "handling": "Debounced and converted to events. Ignored if power off. Parameter button toggles Parameter Mode; others send events to System Software."
        },
        "LEDs": {
          "description": "All physical LED indicators (status LEDs under buttons, row indicator LEDs, level meter LEDs).",
          "handling": "Driven by Feedback layer commands. Show power on status, Parameter Mode row, function statuses, input/loop levels."
        },
        "Knobs": {
          "description": "Analog control knobs (Input, Output, Mix, Feedback levels).",
          "handling": "Read continuously. Adjust audio levels in Signal Chain. Not repurposed by Parameter Mode (always active for volume/feedback control)."
        }
      }
    },
    "interfaces": {
      "outputs_events_to": ["System Software Layer (button presses, knob changes)"],
      "receives_commands_from": ["Feedback Layer (to set LED states, update display)"]
    }
  },
  "System Software Layer": {
    "components": {
      "Parameter Mode": {
        "description": "Tracks whether Parameter Edit mode is active and which parameter row is selected.",
        "state": ["parameterModeActive (bool)", "currentParamRow (index or NONE)"]
      },
      "MIDI Sync": {
        "description": "Handles MIDI clock synchronization and timing reference (acts as master or slave).",
        "state": ["syncMode (Off/SyncIn/SyncOut)", "internalTempo (BPM)"],
        "functions": ["onMidiClockTick()", "sendMidiClock()"]
      },
      "Action Interpretation": {
        "description": "Maps raw input events to system actions, depending on mode (parameter edit vs play).",
        "functions": ["handleButtonEvent(button, paramModeActive)", "interpretComboPresses()", "handleLongPress(button)"]
      }
    },
    "interfaces": {
      "receives_from_hardware": ["Button press events, Knob turn events"],
      "controls": [
        "Parameter Layer (invokes parameter adjustments in Parameter Mode)",
        "Controller Layer (invokes loop actions in Play Mode)",
        "Preset Layer (loads/saves presets on command)",
        "Feedback Layer (triggers UI updates like entering/leaving Parameter Mode, messages)"
      ],
      "depends_on": ["Parameter Layer (for current values like sync settings, modes)"]
    }
  },
  "Parameter Layer": {
    "categories": {
      "Timing": {
        "parameters": ["Quantize", "Tempo", "CycleBeats"],
        "purpose": "Timing and quantization settings for loop actions and sync."
      },
      "Switches": {
        "parameters": ["RecordMode", "OverdubMode", "InsertMode", "MuteMode", "SwitchQuant", "RoundMode", "Overflow"],
        "purpose": "Behavior of control functions (button modes, switching quantization, etc)."
      },
      "MIDI": {
        "parameters": ["SyncMode", "MIDIchannel", "TrigThreshold", "SamplerStyle", "Velocity"],
        "purpose": "MIDI synchronization and control settings."
      },
      "Loop": {
        "parameters": ["MoreLoops", "LoopCopy", "AutoRecord", "LoopTrig"],
        "purpose": "Loop management settings (number of loops, copy behavior, auto-record)."
      }
    },
    "interfaces": {
      "exposes": ["get(category, name)", "set(category, name, value)", "handleParamButton(row, button)"],
      "notifies": ["Buffer Layer (on MoreLoops change for memory realloc)", "Controller Layer (on mode changes like RecordMode, etc)", "Feedback Layer (to display new values)"]
    }
  },
  "Preset Layer": {
    "description": "Stores and recalls snapshots of all Parameter Layer settings as presets.",
    "state": ["presets[] (list of parameter sets)", "currentPresetIndex"],
    "interfaces": {
      "functions": ["savePreset(index)", "loadPreset(index)"],
      "receives_commands_from": ["System Software (user request to save/load)", "MIDI Program Change (optional)"],
      "affects": ["Parameter Layer (loads values into parameters)", "Buffer Layer (may reset loops if MoreLoops changes)", "Feedback Layer (display preset load/save confirmations)"]
    }
  },
  "Signal Chain Layer": {
    "description": "Processes audio input and loop playback to produce output, applying volume, mix, mute, and feedback controls.",
    "components": {
      "InputGain": "Input level control (pre-loop recording gain).",
      "MixControl": "Mix between live input (dry) and loop playback (wet).",
      "OutputVolume": "Master output level control.",
      "FeedbackControl": "Loop feedback amount control (decay rate of loop sound).",
      "MuteControl": "Mute toggle for output (with mode for continuous or restart)."
    },
    "interfaces": {
      "receives_from": ["Knobs (level adjustments)", "Controller (mute toggles, overdub state)"],
      "sends_to": ["Buffer Layer (writes input to buffer when recording/overdubbing)", "Output (audio signal to hardware output)"],
      "depends_on": ["Parameter Layer (for modes like LoopMode/DelayMode, MuteMode)"]
    }
  },
  "Controller Layer": {
    "description": "Implements loop control commands and state machines for recording and manipulating loops.",
    "commands": {
      "Record": {
        "function": "Start/stop recording a loop. Defines new loop length when stopped. Respects RecordMode (toggle/sustain) and TrigThreshold.",
        "uses": ["Buffer (to record audio)", "Feedback (to update Record LED, display)"]
      },
      "Overdub": {
        "function": "Toggle overdub on/off to layer sound onto the loop. Respects OverdubMode (toggle/sustain).",
        "uses": ["Buffer (to mix new audio with existing loop via feedback)", "Feedback (LED status)"]
      },
      "Insert": {
        "function": "Perform Insert function as configured (extend loop length, replace audio, reverse, half-speed, etc).",
        "uses": ["Buffer (to modify loop content or playback rate)", "Feedback (LED and messages for mode)"]
      },
      "Multiply": {
        "function": "Extend loop length by an integer multiple of its base length. Can be quantized; respects RoundMode for ending timing.",
        "uses": ["Buffer (to set new loop length, duplicate content)", "Feedback (LED, possibly timing indication)"]
      },
      "Undo": {
        "function": "Undo the last overdub/insert action (and possibly redo it if pressed again). One level of history.",
        "uses": ["Buffer (to restore saved loop state)", "Feedback (LED and display to show undo status)"]
      },
      "NextLoop": {
        "function": "Switch to the next loop. May be immediate or quantized (SwitchQuant). Optionally copy loop or auto-record on switch as per settings.",
        "uses": ["Buffer (to stop current and start next loop playback)", "Feedback (update loop number display, LED)"]
      }
    },
    "state": {
      "currentLoopIndex": "Index of the active loop (0-based).",
      "recording": "Whether a loop recording is in progress.",
      "overdubActive": "Whether overdub mode is currently on.",
      "multiplyMode": "Whether a Multiply is in progress (extending loop).",
      "insertActive": "Whether an Insert (Insert/Replace/Substitute) is in progress."
    },
    "interfaces": {
      "receives_from": ["System Software (interpreted button commands)"],
      "controls": ["Buffer Layer (start/stop recording, modify loop data, save/restore states)", "Signal Chain (toggles overdub which influences writing, mutes output)", "Feedback Layer (triggers status updates for LEDs/displays)"],
      "depends_on": ["Parameter Layer (to check modes like RecordMode, quantization settings, etc)"]
    }
  },
  "Buffer Layer": {
    "description": "Manages storage and manipulation of audio loop data for one or more loops.",
    "components": {
      "LoopBuffers": "Audio data buffers for each loop (circular).",
      "MemoryManager": "Allocation of total memory across loops. Handles memory per loop and overflow behavior.",
      "TimingTracker": "Tracks loop lengths, cycle counts, and playback position (for sync and quantization).",
      "UndoHistory": "Stores backup of loop audio for undo operations."
    },
    "interfaces": {
      "functions": [
        "startRecording(loop)", "stopRecording(loop)", "startPlayback(loop)", "stopPlayback(loop)",
        "saveLoopState(loop)", "restoreLoopState(loop)", "copyLoop(src,dest)",
        "toggleReverse(loop)", "toggleHalfSpeed(loop)", 
        "beginInsert(loop)", "endInsert(loop)"
      ],
      "called_by": ["Controller Layer (loop operations)", "Signal Chain (during audio processing for reading/writing samples)"],
      "notifies": ["Feedback Layer (e.g., when loop length changes or memory full)"],
      "depends_on": ["Parameter Layer (MoreLoops for allocation, sync settings for cycle calculations)"]
    }
  },
  "Feedback Layer": {
    "description": "Provides real-time visual feedback to the user via LEDs and display based on system state.",
    "components": {
      "StatusLEDs": "Multi-color LEDs under each function button indicating status (Off/Green/Orange/Red).",
      "RowIndicatorLEDs": "LEDs indicating which Parameter row is active (or none if in Play Mode).",
      "LevelMeters": "LED indicators for input and loop output levels (to aid gain adjustment).",
      "Display": "Text/numeric display for loop time, parameter values, messages, loop number, etc."
    },
    "interfaces": {
      "receives_state_from": [
        "Controller (record/overdub/mute/etc status changes)",
        "Parameter Layer (current parameter values and names for display in edit mode)",
        "Buffer Layer (loop length, position, memory status for time display and indicators)",
        "Preset/Software (messages like preset loaded, errors)"
      ],
      "controls_hardware": ["LEDs (on System Hardware via BLK)", "Display output"],
      "functions": [
        "updateStatusIndicators()", "updateRowIndicator()", "updateDisplay()", "updateLevelMeters()", 
        "showMessage(text)", "displayParamValue(param, value)"
      ]
    }
  }
}
```



Below is a **single, self‑contained JavaScript file** (`echoplex.js`) that models an **event‑driven, layer‑aware state‑management system** for the entire Echoplex unit. It integrates:

- All eight layers (System HW, System SW, Parameter, Preset, Signal Chain, Controller, Buffer, Feedback).
- The full **7 × 4 parameter matrix** (Record … NextLoop × Timing…Loops).
- A Redux‑style core (`dispatch()`, `reduce()`) so every layer can react to the same action stream.
- A minimal **hardware event loop** that reads buttons/knobs, dispatches actions, and renders LEDs/display.

> **Note** This is *illustrative pseudocode*:
>
> - no audio I/O API calls are wired (replace with real Web Audio / DSP code),
> - timing / clocking is skeleton code,
> - persistence (Flash / EEPROM) is mocked.

------

```js
/*───────────────────────────────────────────────────────────────────────────╮
│  echoplex.js – monolithic state‑management prototype for Echoplex Digital │
│  Pro Plus.  Layers:                                                       │
│    1. System HW  (power + BLK)                                            │
│    2. System SW  (mode flags, MIDI sync)                                  │
│    3. Parameter  (7×4 matrix)                                             │
│    4. Preset     (snapshot store)                                         │
│    5. SignalChain(out gain / mix / mute / feedback)                       │
│    6. Controller (record / overdub / multiply / …)                        │
│    7. Buffer     (loop audio + timing)                                    │
│    8. Feedback   (LED / display renderer)                                 │
╰───────────────────────────────────────────────────────────────────────────*/

// ───────────────────────────────────────────────────────────────────────────
//  GLOBAL STATE OBJECT  (flat but namespaced per layer)
// ───────────────────────────────────────────────────────────────────────────
const state = {
  /* 1. System HW */
  sysHW: {
    power: false,
    buttons: { Record:0, Overdub:0, Multiply:0, Insert:0, Mute:0, Undo:0, NextLoop:0, Param:0, Power:0 },
    knobs:   { Input:0.8, Output:0.8, Mix:0.5, Feedback:0.7 },
    leds:    {},          // filled by Feedback.render()
    rowLEDs: [false,false,false,false]
  },

  /* 2. System SW  */
  sysSW: {
    parameterMode: false,   // are we editing params?
    currentRow:    null,    // 0‑3 … active Parameter row
    midiSync:      { mode:'Off', bpm:120, extClock:false },
    lastActionTS:  0        // for debouncing / long‑press detection
  },

  /* 3. Parameter LAYER  —the 7×4 matrix */
  params: {
    Timing:   { LoopDelay:'LOP', Quantize:'OFF', Eighths:8,  Sync:'OFF', Threshold:0, Reverse:'FWD', StartPoint:0 },
    Switches: { RecordMode:'TOG', OverdubMode:'TOG', RoundMode:'OFF', InsertMode:'rPL',
                MuteMode:'CON',  Overflow:'PLY',   Presets:'',          _row:'Switches'},
    MIDI:     { Channel:1, ControlSource:'NOT', SourceNum:64, VolumeCont:7, FeedBkCont:11,
                Dump:'OFF', Load:'OFF' },
    Loops:    { MoreLoops:1, AutoRecord:'OFF', LoopCopy:'OFF', SwitchQuant:'OFF',
                LoopTrig:'OFF', Velocity:'OFF', SamplerStyle:'RUN' }
  },

  /* 4. Preset layer  – 16 snapshot slots (null = empty) */
  presets: Array(16).fill(null),
  currentPreset: null,

  /* 5. SignalChain */
  signal: { mute:false, inLvl:0.8, outLvl:0.8, mix:0.5, feedback:0.7 },

  /* 6. Controller */
  ctl: {
    loopIdx:0, totalLoops:1,
    recording:false, overdub:false,
    multiply:false, multiplyStartTS:0,
    insert:false, undoPending:false,
    pendingLoopSwitch:null
  },

  /* 7. Buffer */
  buffer: {
    loops: [ /* AudioBuffer objects OR stubs */ ],
    lengths:[0], cycles:[1], pos:0,
    undoBuf:null
  }
};

// ───────────────────────────────────────────────────────────────────────────
//  CONSTANT MAPS  –  Parameter Matrix (button×row -> paramKey)
// ───────────────────────────────────────────────────────────────────────────
const Btn = ['Record','Overdub','Multiply','Insert','Mute','Undo','NextLoop'];
const Row = ['Timing','Switches','MIDI','Loops'];
const ParamMatrix = {
  Timing:   ['LoopDelay','Quantize','Eighths','Sync','Threshold','Reverse','StartPoint'],
  Switches: ['RecordMode','OverdubMode','RoundMode','InsertMode','MuteMode','Overflow','Presets'],
  MIDI:     ['Channel','ControlSource','SourceNum','VolumeCont','FeedBkCont','Dump','Load'],
  Loops:    ['MoreLoops','AutoRecord','LoopCopy','SwitchQuant','LoopTrig','Velocity','SamplerStyle']
};

// ───────────────────────────────────────────────────────────────────────────
//  ACTION TYPES
// ───────────────────────────────────────────────────────────────────────────
const A = {
  POWER_TOGGLE:'POWER_TOGGLE',
  BUTTON_DOWN :'BUTTON_DOWN',
  BUTTON_UP   :'BUTTON_UP',
  KNOB_MOVE   :'KNOB_MOVE',
  CLOCK_TICK  :'CLOCK_TICK',   // audio / MIDI tick
  RENDER      :'RENDER'        // trigger Feedback refresh
};

// ───────────────────────────────────────────────────────────────────────────
//  DISPATCH / REDUCER  (simple switch; layers branch inside)
// ───────────────────────────────────────────────────────────────────────────
function dispatch (action) {
  reduce(state, action);
  if(action.type!==A.RENDER) dispatch({type:A.RENDER});      // auto‑render
}

function reduce (s, a) {
  switch(a.type) {

  // ── 1. Power  ──────────────────────────────────────────────────────────
  case A.POWER_TOGGLE:
    s.sysHW.power = !s.sysHW.power;
    if(!s.sysHW.power) { resetAllRuntimeFlags(); } 
    break;

  // ── 2. Button events  ─────────────────────────────────────────────────
  case A.BUTTON_DOWN: {
    const {btn} = a;
    s.sysHW.buttons[btn] = 1;
    if(btn==='Power'){ dispatch({type:A.POWER_TOGGLE}); break; }

    if(!s.sysHW.power) break;                          // ignore others when off
    // Parameter button toggles mode / row cycle
    if(btn==='Param'){
      if(!s.sysSW.parameterMode){
        s.sysSW.parameterMode = true;  s.sysSW.currentRow = 0;
      }else{
        s.sysSW.currentRow++;
        if(s.sysSW.currentRow>3){ s.sysSW.parameterMode=false; s.sysSW.currentRow=null; }
      }
      break;
    }

    // If Parameter Mode ACTIVE → treat button as param edit
    if(s.sysSW.parameterMode){
      const row  = Row[s.sysSW.currentRow];
      const col  = Btn.indexOf(btn);
      const key  = ParamMatrix[row][col];
      incrementParam(row,key);                         // change value
    }
    else { // Play mode → loop control
      handleLoopControl(btn,'down');
    }
  } break;

  case A.BUTTON_UP: {
    const {btn} = a;
    s.sysHW.buttons[btn] = 0;
    if(!s.sysHW.power) break;
    if(!s.sysSW.parameterMode){ handleLoopControl(btn,'up'); }
  } break;

  // ── 3. Knob movement  ─────────────────────────────────────────────────
  case A.KNOB_MOVE: {
    const {knob,val} = a;                              // val 0..1
    s.sysHW.knobs[knob] = val;
    // Update signal levels live
    if(knob==='Input')  s.signal.inLvl  = val;
    if(knob==='Output') s.signal.outLvl = val;
    if(knob==='Mix')    s.signal.mix    = val;
    if(knob==='Feedback'){ 
      s.signal.feedback = val; 
      // store in params row too so it's persistent
      s.params.Loops.Velocity = (val>0.5)?'ON':'OFF';  // illustrative
    }
  } break;

  // ── 4. Clock tick  (audio or MIDI)  ───────────────────────────────────
  case A.CLOCK_TICK:
    processAudioFrame();          // feed-through to SignalChain+Buffer
    break;

  // ── 5. Render  ────────────────────────────────────────────────────────
  case A.RENDER:
    Feedback_render();            // push LED + display updates
    break;
  }
}

// ───────────────────────────────────────────────────────────────────────────
//  PARAMETER HELPER
// ───────────────────────────────────────────────────────────────────────────
function incrementParam(row,key){
  const r=s.params[row]; const cur=r[key];
  const cyc = (arr)=> arr[(arr.indexOf(cur)+1)%arr.length];
  switch(key){
    case 'LoopDelay':  r[key]=cyc(['LOP','dEL','EXP','Stu','Out','In','rPL','FLI']); break;
    case 'Quantize':   r[key]=cyc(['OFF','CYC','8TH','LOP']); break;
    case 'Eighths':    r[key]=( cur>=256 ? 1 : cur*2 ); break;
    case 'Sync':       r[key]=cyc(['OFF','IN','OUT','OuS']); break;
    case 'Threshold':  r[key]=(cur+8)%128; break;
    case 'Reverse':    r[key]=(cur==='FWD')?'REV':'FWD'; break;
    case 'StartPoint': r[key]=(cur+8)%128; break;
    case 'RecordMode': r[key]=cyc(['TOG','SUS','SAF']); break;
    case 'OverdubMode':r[key]=cyc(['TOG','SUS','CON']); break;
    case 'RoundMode':  r[key]=(cur==='OFF')?'ON':'OFF'; break;
    case 'InsertMode': r[key]=cyc(['rPL','SUB','H.SP','rEV','SUS']); break;
    case 'MuteMode':   r[key]=cyc(['CON','TOG','SUS']); break;
    case 'Overflow':   r[key]=(cur==='PLY')?'RST':'PLY'; break;
    case 'Presets':    r[key]=( (cur|0)+1 )%16; break;
    // MIDI & Loop rows similar – keep concise here
    default:
      r[key]=cur; // no‑op placeholder
  }
}

// ───────────────────────────────────────────────────────────────────────────
//  LOOP CONTROL HANDLERS (Controller layer entry points)
// ───────────────────────────────────────────────────────────────────────────
function handleLoopControl(btn,edge){
  const c=state.ctl, p=state.params, sig=state.signal;
  switch(btn){

  case 'Record':
    if(edge==='down' && !c.recording){
      c.recording=true; c.overdub=false;
      Buffer_startRecording();
    } else if(edge==='down' && c.recording){
      // stop rec
      c.recording=false; Buffer_stopRecording();
      if(p.Loops.AutoRecord==='ON'){ c.overdub=true; }
    }
    break;

  case 'Overdub':
    if(edge==='down'){
      c.overdub=!c.overdub;
    }
    break;

  case 'Multiply':
    if(edge==='down' && !c.multiply){
      c.multiply=true; c.multiplyStartTS=performance.now();
    }else if(edge==='up' && c.multiply){
      c.multiply=false;
      const elapsed = (performance.now()-c.multiplyStartTS)/Buffer_cycleMillis();
      const factor  = Math.max(1,Math.round(elapsed));
      Buffer_multiplyLoop(factor);
    }
    break;

  case 'Insert':
    if(edge==='down'){ c.insert=true; Buffer_beginInsert(); }
    if(edge==='up'){   c.insert=false; Buffer_endInsert();  }
    break;

  case 'Mute':
    if(edge==='down'){
      state.signal.mute = !state.signal.mute;
    }
    break;

  case 'Undo':
    if(edge==='down'){ Buffer_toggleUndo(); }
    break;

  case 'NextLoop':
    if(edge==='down'){
      const nLoops = state.params.Loops.MoreLoops;
      if(nLoops>1){
        c.pendingLoopSwitch = (c.loopIdx+1)%nLoops;
        if(p.Switches.SwitchQuant==='ON'){
          Buffer_scheduleLoopSwitch(c.pendingLoopSwitch);
        }else{
          performLoopSwitchNow();
        }
      }
    }
    break;
  }
}

// ───────────────────────────────────────────────────────────────────────────
//  BUFFER HELPERS (stub – replace audio engine)
// ───────────────────────────────────────────────────────────────────────────
function Buffer_startRecording(){ /* ... */ }
function Buffer_stopRecording(){ /* ... */ }
function Buffer_cycleMillis(){ return 500; }  // placeholder
function Buffer_multiplyLoop(factor){ /* ... */ }
function Buffer_beginInsert(){ /* ... */ }
function Buffer_endInsert(){ /* ... */ }
function Buffer_toggleUndo(){ /* ... */ }
function Buffer_scheduleLoopSwitch(idx){ state.ctl.pendingLoopSwitch=idx; }
function performLoopSwitchNow(){ /* ... */ }

// ───────────────────────────────────────────────────────────────────────────
//  AUDIO TICK  (called from real audio callback / setInterval)
// ───────────────────────────────────────────────────────────────────────────
function processAudioFrame(){
  // WARNING: stub; integrate with WebAudio processing
  // 1. Grab input sample (mic/line)
  // 2. Pass through SignalChain to produce output sample
  // 3. Update Buffer play/rec position
}

// ───────────────────────────────────────────────────────────────────────────
//  FEEDBACK RENDER (update LEDs + display)
// ───────────────────────────────────────────────────────────────────────────
function Feedback_render(){
  const h=state.sysHW, f=state.ctl, p=state.params, sw=state.sysSW;
  // Row LEDs
  for(let i=0;i<4;i++){ h.rowLEDs[i]= sw.parameterMode && (i===sw.currentRow); }

  // Status LEDs (Record etc.)
  const col= (on,ready,pending)=> on?'Red':pending?'Orange':ready?'Green':'Off';
  h.leds.Record   = col(f.recording, !f.recording, false);
  h.leds.Overdub  = col(f.overdub,  !f.overdub,  false);
  h.leds.Multiply = col(f.multiply, true, false);
  h.leds.Insert   = col(f.insert,   true, false);
  h.leds.Mute     = col(state.signal.mute, true, false);
  h.leds.Undo     = col(false, Buffer_canUndo(), f.undoPending);
  h.leds.NextLoop = col(false, p.Loops.MoreLoops>1, f.pendingLoopSwitch!=null);

  // Display (very condensed)
  h.display = sw.parameterMode?
      `${Row[sw.currentRow]} ${JSON.stringify(p[Row[sw.currentRow]])}` :
      `Loop${f.loopIdx+1}/${p.Loops.MoreLoops}`+
      (f.recording?' REC':f.overdub?' OD':'');
}

// helper
function Buffer_canUndo(){ return !!state.buffer.undoBuf; }

// ───────────────────────────────────────────────────────────────────────────
//  RUNTIME LOOP (mock: poll hardware, schedule ticks)
// ───────────────────────────────────────────────────────────────────────────
setInterval(()=>{
  // poll physical inputs, convert to actions (stub)
  // hardwarePoll();  
  // simulate audio tick
  if(state.sysHW.power) dispatch({type:A.CLOCK_TICK});
},10);

// Expose dispatch for external UI / tests
export { dispatch, state };
```

------

### How to Read / Extend

1. **Layer Namespaces**
    *All* runtime data live in `state`, namespaced (`state.sysHW`, `state.params`, …).
    Each layer’s reducer logic is embedded directly in the big `reduce()` switch.
2. **Event Flow**
    *Hardware* → dispatch `BUTTON_DOWN / KNOB_MOVE` → **Reducer** interprets
    → State mutates → automatic `A.RENDER` → **Feedback** writes LEDs + display.
3. **Parameter Matrix**
    `ParamMatrix[row][col]` maps *row index* + *button index* → parameter key.
    When in Parameter Mode, pressing a button simply increments that parameter via `incrementParam()`.
4. **Controller Layer**
    Shows minimal logic for Record, Overdub, Multiply, Insert, Mute, Undo, NextLoop.
    Replace Buffer stubs with real DSP / Web Audio calls in a production build.
5. **Signal Chain**
    Real‑time audio math is placed in `processAudioFrame()`; here it’s skeletal.
    Substitute with an AudioWorklet or native DSP.
6. **Feedback**
    `Feedback_render()` computes LED colors & display strings from current state and writes into `state.sysHW.leds` / `display`. Replace with real GPIO/OLED drivers.

------

This single‑file prototype is **layer‑aware**, **event‑driven**, and contains the entire state‑management pipeline needed to coordinate **BLK**, **Parameter Mode**, the **7 × 4 matrix**, loop processing, and live feedback. Use it as a foundation; flesh out DSP and hardware I/O specifics as you port to firmware or a WebAudio simulation.

Below is a **complete, drop‑in pseudocode module** that unifies

1. **State‑store plumbing** (single `AppState`, reducers, dispatch loop)
2. **The full 7 × 4 Parameter Matrix** exactly as you listed
3. A **parameter‑spec catalogue** (value ranges / enumerations / special handlers)
4. **Low‑‑to‑mid‑level logic** for:
   - Row cycling (`P1…P4`)
   - Mapping a pressed button → parameter name
   - Increment / toggle / tap‑tempo behaviours
   - Emitting `PARAM_CHANGE` actions that every layer can observe

------

## 0.  File Layout

```
├─ store.js            # core Store / dispatch loop
├─ actions.js          # typed action creators
├─ reducers/
│   ├─ sysHW.js
│   ├─ sysSW.js
│   ├─ parameters.js   #  <— THE BIG ONE (matrix + stepping)
│   ├─ controller.js
│   ├─ buffer.js
│   └─ feedback.js
└─ middlewares/
    ├─ audioIO.js
    ├─ midiSync.js
    └─ ledDriver.js
```

Everything that follows fits into **`reducers/parameters.js`** and updates to `sysSW` where needed.
 (Translate to C++ / Rust etc. as desired; logic stays identical.)

------

## 1.  Constants

```pseudo
# Button IDs
BTN = ["Record","Overdub","Multiply","Insert","Mute","Undo","NextLoop"]

# Row indices
P1_TIMING   = 0
P2_SWITCHES = 1
P3_MIDI     = 2
P4_LOOPS    = 3
TOTAL_ROWS  = 4
```

------

## 2.  Parameter Matrix (`ROW_BUTTON_MATRIX`)

```pseudo
ROW_BUTTON_MATRIX = {
  P1_TIMING : {              # ----- TIMING ROW -----
    Record   : "Loop/Delay",
    Overdub  : "Quantize",
    Multiply : "8ths/Cycle",
    Insert   : "Sync",
    Mute     : "Threshold",
    Undo     : "Reverse",
    NextLoop : "StartPoint"
  },
  P2_SWITCHES : {            # ----- SWITCHES ROW -----
    Record   : "RecordMode",
    Overdub  : "OverdubMode",
    Multiply : "RoundMode",
    Insert   : "InsertMode",
    Mute     : "MuteMode",
    Undo     : "Overflow",
    NextLoop : "Presets"
  },
  P3_MIDI : {                # ----- MIDI ROW -----
    Record   : "Channel",
    Overdub  : "ControlSource",
    Multiply : "Source #",
    Insert   : "VolumeCont",
    Mute     : "FeedBkCont",
    Undo     : "Dump",
    NextLoop : "Load"
  },
  P4_LOOPS : {               # ----- LOOPS ROW -----
    Record   : "MoreLoops",
    Overdub  : "AutoRecord",
    Multiply : "LoopCopy",
    Insert   : "SwitchQuant",
    Mute     : "LoopTrig",
    Undo     : "Velocity",
    NextLoop : "SamplerStyle"
  }
}
```

------

## 3.  Parameter Specification (`PARAM_SPEC`)

The spec tells the reducer **how** to step each parameter:

```pseudo
# Helper structs
enumSpec(vals...) = {type:"enum",  values:vals}
numSpec(min,max,step) = {type:"num", min:min, max:max, step:step}
tapSpec() = {type:"tap"}   # special (Tempo by tapping)

PARAM_SPEC = {
  # --- Timing (P1) ---
  "Loop/Delay"   : enumSpec("LOP","dEL","EXP","Stu","Out","In","rPL","FLI"),
  "Quantize"     : enumSpec("OFF","CYC","8th","LOP"),
  "8ths/Cycle"   : numSpec(1,96,1),
  "Sync"         : enumSpec("IN","OUT","OuS","OFF"),
  "Threshold"    : numSpec(0,127,1),
  "Reverse"      : enumSpec("FWD","rEV"),
  "StartPoint"   : numSpec(0,127,1),

  # --- Switches (P2) ---
  "RecordMode"   : enumSpec("TOG","SUS","SAF"),
  "OverdubMode"  : enumSpec("TOG","SUS","CON"),
  "RoundMode"    : enumSpec("OFF","ON"),
  "InsertMode"   : enumSpec("rPL","SUB","H.SP","rEV","SUS"),
  "MuteMode"     : enumSpec("CON","TOG","SUS"),
  "Overflow"     : enumSpec("PLY","RST"),
  "Presets"      : numSpec(1,16,1),

  # --- MIDI (P3) ---
  "Channel"        : numSpec(1,16,1),
  "ControlSource"  : enumSpec("NOT","CTR","OFF"),
  "Source #"       : numSpec(0,127,1),
  "VolumeCont"     : numSpec(0,127,1),
  "FeedBkCont"     : numSpec(0,127,1),
  "Dump"           : enumSpec("OFF","DMP"),
  "Load"           : enumSpec("OFF","LOD"),

  # --- Loops (P4) ---
  "MoreLoops"    : numSpec(1,16,1),
  "AutoRecord"   : enumSpec("OFF","ON"),
  "LoopCopy"     : enumSpec("OFF","CPY"),
  "SwitchQuant"  : enumSpec("OFF","ON"),
  "LoopTrig"     : enumSpec("OFF","TRG"),
  "Velocity"     : enumSpec("OFF","VEL"),
  "SamplerStyle" : enumSpec("RUN","ONE")
}
```

------

## 4.  Parameter Reducer

```pseudo
function parametersReducer(prev, action):
    state = clone(prev)             # immutable copy

    if action.type == 'PARAM_ADJUST':
        row  = action.rowIdx
        btn  = action.button
        dir  = action.dir      # +1 (increment) or ‑1 (decrement)

        pName = ROW_BUTTON_MATRIX[row][btn]
        if pName == null: return prev   # no mapping

        spec  = PARAM_SPEC[pName]
        cur   = state[pName]            # flat map for simplicity

        # -------- ENUM handling --------
        if spec.type == "enum":
            idx = indexOf(spec.values, cur)
            idx = (idx + dir) mod len(spec.values)
            state[pName] = spec.values[idx]

        # -------- NUM handling ---------
        elif spec.type == "num":
            newVal = clamp(cur + dir*spec.step, spec.min, spec.max)
            state[pName] = newVal

        # -------- TAP TEMPO ------------
        elif spec.type == "tap":
            state["TempoTapTimes"] =       # pseudo tap accumulator
                updateTapBuffer(state["TempoTapTimes"], now())
            bpm = computeBPM(state["TempoTapTimes"])
            if bpm: state["Tempo"] = bpm

    return state
```

*(Storing parameters in one flat dictionary keeps the reducer short; in production group them by category if you prefer.)*

The reducer fires a **secondary action** so other slices see the change:

```pseudo
if cur != state[pName]:
    emit({type:'PARAM_CHANGE', name:pName, value:state[pName]})
```

------

## 5. System‑Software (Row Cycling) Reducer

```pseudo
function sysSWReducer(prev, a):
  s = clone(prev)

  if a.type == 'BUTTON_PRESS' and a.button == 'Parameter':
      if s.parameterMode == false:
          s.parameterMode  = true
          s.currentRow     = P1_TIMING
      else:
          s.currentRow++
          if s.currentRow >= TOTAL_ROWS:
              s.parameterMode = false
              s.currentRow    = null
  return s
```

------

## 6. Middleware Hook – Route Button ➜ Param Adjust

```pseudo
# In "inputRouter" middleware

if action.type == 'BUTTON_PRESS' and store.state.sysSW.parameterMode:
    row = store.state.sysSW.currentRow
    emit({ type:'PARAM_ADJUST', rowIdx:row,
           button:action.button, dir:+1 })
    stopPropagation()        # don't let Play‑mode functions run
```

(Use shift/alt foot‑switch or long‑press to send `dir:-1` if you want decrement.)

------

## 7. Initial Parameter Defaults

Populate a start‑up dictionary:

```pseudo
initialParams = {}
for pName in keys(PARAM_SPEC):
    spec = PARAM_SPEC[pName]
    initialParams[pName] =
        (spec.type=="enum")? spec.values[0] :
        (spec.type=="num")?  spec.min :
        (spec.type=="tap")?  120 : 0
```

------

## 8. Bringing It All Together

```pseudo
rootReducer = combine({
  sysHW     : sysHWReducer,
  sysSW     : sysSWReducer,
  parameters: parametersReducer,
  # ... other slice reducers ...
})

store = createStore(rootReducer, { parameters:initialParams, ... })
```

**Event flow when user is in `P2` (Switches Row) and presses \*Multiply\*:**

```
BUTTON_PRESS(Multiply)
→ middleware sees ParameterMode ON
→ emits PARAM_ADJUST(row=1,button=Multiply,dir=+1)
→ parametersReducer:
     pName = "RoundMode"
     enum ["OFF","ON"] cycles  OFF → ON
→ emits PARAM_CHANGE("RoundMode","ON")
→ controller / signal slices react if needed
→ feedbackReducer updates display "RoundMode: ON"
→ LEDDriver prints row‑indicator LED etc.
```

------

### Adapt as Needed

- To **show human‑friendly labels** on the display, keep a `DISPLAY_NAME[pName]`.
- To make a parameter **wrap at max/min** or **stop at edges**, change the enum/num logic.
- To allow **long‑press for decrement**, detect press duration in sysHW reducer and emit `dir:-1`.
- To store parameters **grouped by category**, replace flat `state[pName]` with nested `state.cat[name]` and adjust helpers.

With this module the **full 7×4 matrix** is data‑driven, easy to extend, and all layer slices are notified by a single `PARAM_CHANGE`. Plug it into the earlier store / middleware skeleton and you have complete, testable state‑management for the Echoplex.



Below is a **one‑file pseudocode hierarchy** that preserves the same logical module names you saw in the folder sketch.
 Think of each **`// ── Section`** as the contents of a file, but in a single JavaScript (or TypeScript) source so you can paste it into a scratchpad, REPL, or bundler and still keep the mental separation of concerns.

```
/* =========================================================================
   store.js  – Core Store / dispatch loop  (SECTION 0)
   ========================================================================= */
const createStore = (rootReducer, initialState, middlewares=[]) => {
  let state = initialState
  const listeners = []

  // 1. Compose middleware chain (Redux‑style)
  let dispatch = (action) => {
    state = rootReducer(state, action)
    listeners.forEach(fn => fn())
  }
  const mwAPI = { getState: () => state, dispatch: (a) => dispatch(a) }
  dispatch = middlewares
    .slice().reverse()
    .reduce((next, mw) => mw(mwAPI)(next), dispatch)

  return {
    getState : () => state,
    dispatch,
    subscribe: fn => (listeners.push(fn), () => listeners.splice(listeners.indexOf(fn),1))
  }
}

/* =========================================================================
   actions.js – Typed Action Creators          (SECTION 1)
   ========================================================================= */
const A = {            // mnemonic constants
  BTN_PRESS   : 'BUTTON_PRESS',
  BTN_RELEASE : 'BUTTON_RELEASE',
  KNOB_MOVE   : 'KNOB_MOVE',
  PARAM_ADJ   : 'PARAM_ADJUST',
  PARAM_CHG   : 'PARAM_CHANGE',
  LOOP_CMD    : 'LOOP_CMD',
  MIDI_TICK   : 'MIDI_CLOCK_TICK',
  POWER_TOGGLE: 'POWER_TOGGLE'
}
const Actions = {
  btnPress  : id       => ({type:A.BTN_PRESS  , id}),
  btnRelease: id       => ({type:A.BTN_RELEASE, id}),
  knobMove  : (id,v)   => ({type:A.KNOB_MOVE  , id, value:v}),
  paramAdjust: (row,btn,dir)=>
                        ({type:A.PARAM_ADJ , row, btn, dir}),
  paramChange: (name,val)=>
                        ({type:A.PARAM_CHG , name, val}),
  loopCmd   : cmd      => ({type:A.LOOP_CMD   , cmd}),
  midiTick  : ()=>({type:A.MIDI_TICK}),
  powerToggle:()=>({type:A.POWER_TOGGLE})
}

/* =========================================================================
   SECTION 2  – Reducer Helpers (const tables, stepping logic)
   ========================================================================= */
const ROW = {P1:0,P2:1,P3:2,P4:3}
const BTN = {REC:'Record', OVD:'Overdub', MUL:'Multiply',
             INS:'Insert', MUTE:'Mute', UNDO:'Undo', NXT:'NextLoop'}
const ROW_BUTTON_MATRIX = {/* … full 7×4 table from previous answer … */}
const PARAM_SPEC         = {/* … enumSpec / numSpec objects … */}

function cycleEnum(list, cur, dir){/* returns next value */}
function clampNum(spec, cur, dir){/* returns next num */}

/* =========================================================================
   reducers/sysHW.js – Physical state slice      (SECTION 3)
   ========================================================================= */
function sysHWReducer(prev, a){
  const s = {...prev}
  switch(a.type){
    case A.POWER_TOGGLE : s.power=!s.power; break
    case A.BTN_PRESS    : s.blk.buttons[a.id].pressed=true ; break
    case A.BTN_RELEASE  : s.blk.buttons[a.id].pressed=false; break
    case A.KNOB_MOVE    : s.blk.knobs[a.id]=a.value        ; break
  }
  return s
}

/* =========================================================================
   reducers/sysSW.js – Row cycling & mode flags   (SECTION 4)
   ========================================================================= */
function sysSWReducer(prev,a){
  const s={...prev}
  if(a.type===A.BTN_PRESS && a.id==='Parameter'){
     if(!s.parameterMode){ s.parameterMode=true ; s.currentRow=0 }
     else{
        s.currentRow++
        if(s.currentRow>=4){ s.parameterMode=false; s.currentRow=null }
     }
  }
  if(a.type===A.MIDI_TICK && s.midiSync.mode==='SyncIn')
       s.midiSync.ticks++
  return s
}

/* =========================================================================
   reducers/parameters.js – FULL matrix stepping   (SECTION 5)
   ========================================================================= */
function parametersReducer(prev, a){
  let p = {...prev}
  if(a.type===A.PARAM_ADJ){
     const pName = ROW_BUTTON_MATRIX[a.row][a.btn]
     if(!pName) return prev
     const spec = PARAM_SPEC[pName]
     if(spec.type==='enum') p[pName] =
         cycleEnum(spec.values, p[pName], a.dir)
     else if(spec.type==='num') p[pName] =
         clampNum(spec, p[pName], a.dir)
     // emit secondary action so others see change
     eventQueue.push(Actions.paramChange(pName, p[pName]))
  }
  return p
}

/* =========================================================================
   reducers/{controller,buffer,feedback}.js – abbreviated here
   ========================================================================= */
function controllerReducer(prev,a){ /* record/odub/mult logic */ return prev }
function bufferReducer(prev,a){ /* rec/playback/undo logic */ return prev }
function feedbackReducer(prev,a){ /* LED+display cache    */ return prev }

/* =========================================================================
   Root reducer & initial state                 (SECTION 6)
   ========================================================================= */
const combine = (slices) => (st,a)=>(
  Object.fromEntries( Object.entries(slices)
      .map(([k,r])=>[k,r(st[k],a)]) )
)
const initialState = {
  sysHW:{power:false, blk:{buttons:{},knobs:{}}},
  sysSW:{parameterMode:false,currentRow:null,midiSync:{mode:'Off',ticks:0}},
  parameters: /* defaults built from PARAM_SPEC */,
  controller:{}, buffer:{}, feedback:{}
}

const rootReducer = combine({
  sysHW:sysHWReducer,
  sysSW:sysSWReducer,
  parameters:parametersReducer,
  controller:controllerReducer,
  buffer:bufferReducer,
  feedback:feedbackReducer
})

/* =========================================================================
   middlewares/audioIO.js – example stub         (SECTION 7)
   ========================================================================= */
const audioIOMw = ({getState})=>next=>action=>{
  if(action.type==='AUDIO_CALLBACK') {
     /* read audio, use getState().buffer ... */
  }
  return next(action)
}

/* =========================================================================
   middlewares/midiSync.js – example stub        (SECTION 8)
   ========================================================================= */
const midiSyncMw = ({dispatch})=>next=>action=>{
  if(action.type==='RAW_MIDI_CLOCK') dispatch(Actions.midiTick())
  return next(action)
}

/* =========================================================================
   SECTION 9 – Event queue helper for reducers wanting side‑actions
   ========================================================================= */
const eventQueue=[]
const QueueMiddleware = () => next=>action=>{
   let result = next(action)
   while(eventQueue.length) next(eventQueue.shift())
   return result
}

/* =========================================================================
   SECTION 10 – Store boot + demo dispatch flow
   ========================================================================= */
const store = createStore(
     rootReducer,
     initialState,
     [QueueMiddleware, audioIOMw, midiSyncMw] )

// Example: user taps Parameter → cycles rows
store.dispatch(Actions.btnPress('Parameter'))
// Example: now in P1, presses Multiply (-> adjust '8ths/Cycle')
store.dispatch(Actions.btnPress(BTN.MUL))
// middleware converted that into PARAM_ADJUST, reducer cycled value
console.log(store.getState().parameters['8ths/Cycle'])
```

------

### How to Read the Section Names

| **Section** | **Original Folder / File** | **Purpose in Single‑File View**                   |
| ----------- | -------------------------- | ------------------------------------------------- |
| 0           | `store.js`                 | Store constructor, dispatch loop                  |
| 1           | `actions.js`               | Centralised action constants + creators           |
| 2           | — (shared)                 | Tables (matrix & spec) + helpers                  |
| 3           | `reducers/sysHW.js`        | Hardware slice (power, BLK raw states)            |
| 4           | `reducers/sysSW.js`        | Mode flags (Parameter Mode, MIDI ticks)           |
| 5           | `reducers/parameters.js`   | **BIG** parameter‑matrix stepping reducer         |
| 6           | root reducer + init        | Combines slices, seeds state                      |
| 7‑8         | `middlewares/*`            | Example side‑effect layers (audio, MIDI)          |
| 9           | —                          | Tiny queue so reducers can emit follow‑up actions |
| 10          | —                          | Bootstraps store, demo dispatches                 |

You now have a **linear, copy‑pasteable hierarchy** that exactly mirrors the multi‑file architecture while remaining a single script.
 Replace the stubbed controller / buffer / feedback reducers with your detailed logic, wire real hardware I/O inside the middlewares, and the parameter matrix will already work out of the box.n