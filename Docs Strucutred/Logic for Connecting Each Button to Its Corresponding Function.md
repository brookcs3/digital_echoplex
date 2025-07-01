# ### Logic for Connecting Each Button to Its Corresponding Function
The Echoplex Digital Pro Plus hardware unit features a set of buttons that perform specific functions, such as Record, Overdub, Multiply, Insert, Mute, Undo, NextLoop, and Parameter. Below is the detailed logic for connecting each button to its corresponding function in the web-based emulation:
### 1. General Button Interaction Logic
**Event Handling**
* **Short Press:** Executes the primary function of the button.
* **Long Press:** Activates alternate functions (e.g., Reset, Undo).
* **Double-Click:** Executes advanced operations like copying loops or stopping recording.
* **Sustain Mode:** Allows holding buttons for continuous operation.

⠀**Implementation**
* Use event listeners (mousedown, mouseup, dblclick, mouseleave) to detect button interactions.
* Implement timers (setTimeout) to differentiate between short and long presses.

⠀2. Button-Specific Logic
**Record Button**
* **Primary Function:** Starts/stops recording loops.
* **Alternate Function:** Resets the loop (long press).
* **Double-Click:** Stops recording without resetting the loop.

⠀**Implementation:**
function handleRecordButton(event) { *AttributionBtn_350c92f5-19e0-482c-9af5-2b29ae18f82b*
    if (event.type === 'mousedown') {
        startRecording();
    } else if (event.type === 'mouseup') {
        stopRecording(); *AttributionBtn_e6296a6b-ae55-4ff5-8444-502093788fd8*
    } else if (event.type === 'dblclick') {
        stopRecordingWithoutReset();
    }
}
**Overdub Button**
* **Primary Function:** Adds layers to the current loop.
* **Alternate Function:** Toggles OverdubMode=SUS (long press).

⠀**Implementation:**
function handleOverdubButton(event) {
    if (event.type === 'mousedown') {
        startOverdub();
    } else if (event.type === 'mouseup') {
        stopOverdub();
    } *AttributionBtn_26cc46f1-0995-43ef-bf61-89be85dc45e9*
}
**Multiply Button**
* **Primary Function:** Extends the loop by repeating cycles.
* **Alternate Function:** GeneralReset (long press).

⠀**Implementation:**
function handleMultiplyButton(event) {
    if (event.type === 'mousedown') {
        startMultiply();
    } else if (event.type === 'mouseup') {
        stopMultiply();
    } else if (event.type === 'longpress') {
        generalReset();
    }
}
**Insert Button**
* **Primary Function:** Inserts audio or reverses playback (depending on InsertMode).
* **Alternate Function:** Toggles HalfSpeed or Substitute (long press).

⠀**Implementation:**
function handleInsertButton(event) {
    if (event.type === 'mousedown') {
        startInsert(); *AttributionBtn_12ff5ba7-e2bf-433c-8662-6b246fed31ee*
    } else if (event.type === 'mouseup') {
        stopInsert();
    } *AttributionBtn_ca49eda5-7c92-4615-8d9d-f0817678db46*
}
**Mute Button**
* **Primary Function:** Silences the loop.
* **Alternate Function:** Retriggers the loop (long press).

⠀**Implementation:**
function handleMuteButton(event) { *AttributionBtn_531dbc92-fedc-40a7-967f-c900536cff70*
    if (event.type === 'mousedown') {
        toggleMute();
    } else if (event.type === 'longpress') { *AttributionBtn_91f32c97-f2bd-4f7b-adcb-23a702c183a4*
        retriggerLoop();
    }
}
**Undo Button**
* **Primary Function:** Reverts the last action.
* **Alternate Function:** Executes LongUndo (long press).

⠀**Implementation:**
function handleUndoButton(event) {
    if (event.type === 'mousedown') {
        shortUndo(); *AttributionBtn_4cbedfc8-b90d-4e2d-ad98-3b62e5e65b44*
    } else if (event.type === 'longpress') {
        longUndo();
    }
}
**NextLoop Button**
* **Primary Function:** Switches between loops.
* **Alternate Function:** Retriggers the current loop when MoreLoops=1.

⠀**Implementation:**
function handleNextLoopButton(event) { *AttributionBtn_cb56fd38-9e21-4f2c-b4a7-22436fa52a4a*
    if (event.type === 'mousedown') {
        switchToNextLoop();
    } else if (event.type === 'longpress') {
        retriggerLoop(); *AttributionBtn_5788aa36-a3e2-44b8-9502-3d976dd544d6*
    }
}
**Parameter Button**
* **Primary Function:** Enters Parameter Editing Mode.
* **Alternate Function:** Resets all parameters to factory defaults (long press during startup).

⠀**Implementation:**
function handleParameterButton(event) {
    if (event.type === 'mousedown') { *AttributionBtn_e2ea222f-794d-400d-9d4a-ac468b1e9d10*
        enterParameterEditingMode(); *AttributionBtn_2fa6e25e-9450-456a-9e5f-a490487028f6*
    } else if (event.type === 'longpress') {
        resetParametersToDefaults(); *AttributionBtn_33d5b6b3-6118-4df5-82ba-75a49901917b*
    }
}
### 3. Visual Feedback Integration
**Status Indicator Lights**
* **Unlit:** Function unavailable.
* **Green:** Button ready for primary function.
* **Red:** Button actively performing its function.
* **Orange:** Button available for alternate functions.

⠀**Implementation:**
function updateLED(buttonId, state) { *AttributionBtn_d16a6a1a-3d13-414b-858f-2d6fac7d0312*
    const ledElement = document.querySelector(`#${buttonId}-led`); *AttributionBtn_10e50902-474e-494f-a72d-e4b409b73e63*
    ledElement.className = `led-${state}`; // e.g., led-green, led-red *AttributionBtn_0e952d40-fe59-4d05-8c74-4006e6d5a0ab*
}
**LoopTime Display**
* Dynamically updates based on button actions (e.g., "Recording...", "Overdubbing...").

⠀**Implementation:**
function updateLoopTimeDisplay(message) { *AttributionBtn_36ead01a-dddd-4e90-b0f4-d34b91821d7c*
    const displayElement = document.querySelector('#loop-time-display'); *AttributionBtn_f4d4ba33-a560-44e5-a33f-182e104f6b39*
    displayElement.textContent = message; *AttributionBtn_adaa7c25-630d-4629-9a0f-9a3533ec8ff2*
}
### 4. Synchronization
**Quantized Actions**
* Ensure button actions align with loop timing and quantization settings.

⠀**Implementation:**
function executeQuantizedAction(action) { *AttributionBtn_b9f2cd08-01ca-4fdf-943d-facab72999f1*
    if (quantizeEnabled) { *AttributionBtn_355aa0f0-db22-4368-afc1-c0c0ae2a8b16*
        setTimeout(action, quantizePeriod);
    } else {
        action();
    }
}
### 5. Performance Considerations
* Optimize button event handling for low-latency response.
* Use requestAnimationFrame for smooth visual updates.

⠀Next Steps
1 I can provide detailed implementation notes for optimizing the visual feedback system.
2 I can outline the MIDI integration for button actions and synchronization.
