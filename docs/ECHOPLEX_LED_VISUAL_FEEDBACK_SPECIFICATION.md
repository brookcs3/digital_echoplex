# ECHOPLEX DIGITAL PRO PLUS - LED AND VISUAL FEEDBACK SPECIFICATION

## 1. LED STATES AND COLORS

### LED Hardware States
The Echoplex uses the `data-hw-state` attribute system for LED control:

- **`off`** - LED is off (default state)
- **`on`** - LED is on (solid)
- **`blink`** - LED blinks with standard pattern
- **`flash`** - LED flashes briefly

### LED Color System
- **RED** - Recording states, active operations, warnings
- **GREEN** - Completed states, available functions, ready states
- **ORANGE** - Special functions, alternative modes, sync states
- **YELLOW** - Sync indication, tempo functions

## 2. BUTTON LED BEHAVIORS

### Record Button LED
- **OFF** - Normal play state, no loop recorded
- **RED (solid)** - Currently recording a loop
- **GREEN (solid)** - Loop recorded and playing
- **GREEN (blink)** - Loop recorded, in tempo select mode

### Overdub Button LED
- **OFF** - Not overdubbing, no special states
- **RED (solid)** - Currently overdubbing
- **GREEN (solid)** - Available for overdub (loop exists)
- **YELLOW (solid)** - Sync received in Reset state (SyncRecord ready)
- **RED (solid)** - StopSync active (sync reception disabled)

### Multiply Button LED
- **OFF** - Not multiplying, no special states
- **RED (solid)** - Currently multiplying
- **GREEN (solid)** - Available for multiply (loop exists)
- **ORANGE (solid)** - GeneralReset available (in Reset state with multiple loops)
- **RED (solid)** - ReAlign armed (waiting for sync point)

### Insert Button LED
- **OFF** - Not inserting, no special states
- **RED (solid)** - Currently inserting
- **GREEN (solid)** - Available for insert (loop exists)
- **RED (solid)** - HalfSpeed mode active (when InsertMode=HalfSpeed)
- **GREEN (solid)** - FullSpeed mode active (when InsertMode=HalfSpeed)
- **ORANGE (solid)** - Special function in tempo mode

### Mute Button LED
- **OFF** - Not muted, no special states
- **RED (solid)** - Currently muted
- **GREEN (solid)** - Available for mute (loop exists)
- **ORANGE (solid)** - Special function in tempo mode

### Undo Button LED
- **OFF** - No undo available or sync=off
- **RED (solid)** - In tempo select state
- **GREEN (solid)** - Undo available OR tempo select available (sync=out/ous)
- **ORANGE (solid)** - Alternative function available (sync=in, can send StartSong)

### NextLoop Button LED
- **OFF** - Only one loop available
- **GREEN (solid)** - Multiple loops available, can switch
- **ORANGE (solid)** - Quantized loop switch pending
- **GREEN (blink)** - Default state in some contexts

## 3. PARAMETER ROW LEDS

### Parameter Mode Indication
- **ALL OFF** - Play mode (parameterMode = 0)
- **Timing LED (ORANGE)** - P1 mode (parameterMode = 1)
- **Switches LED (ORANGE)** - P2 mode (parameterMode = 2)
- **MIDI LED (ORANGE)** - P3 mode (parameterMode = 3)
- **Loops LED (ORANGE)** - P4 mode (parameterMode = 4)

### Visual Tempo Guide (Play Mode)
- **Timing LED (BLINK)** - Flashes with 8th note subdivisions
- **Switches LED (BLINK)** - Flashes with cycle start points
- **MIDI LED (BLINK)** - Flashes with local loop start points
- **Loops LED (BLINK)** - Context-dependent timing

## 4. DISPLAY FEEDBACK

### Loop Time Display
- **Blank (.)** - No loop recorded (Reset state)
- **Counting up** - Recording/Multiply/Insert in progress
- **Loop time** - Shows current loop length when playing
- **Temporary messages** - Parameter values, status messages, BPM
- **Software version** - Shown briefly on startup
- **Memory amount** - Total memory shown on startup

### Multiple Display
- **Blank** - Single loop or Play mode
- **P1-P4** - Parameter mode indicator
- **Loop number** - Shows current loop number (1-9, A-G)
- **Cycle count** - Shows cycles during Multiply/Insert

### Display Dots and Indicators
- **AutoUndo dot** - Faint blink when AutoUndo occurs (lower right of Loop Display)
- **Sync dot (left)** - Flashes during sync operations
- **Tempo dot (right)** - Flashes with loop start points
- **Cycle indicators** - Flash with timing subdivisions

## 5. STATE-DEPENDENT FEEDBACK

### Reset State
- Record LED: OFF
- All other buttons: OFF
- Display: "." (decimal point only)
- Undo LED: GREEN if tempo select available, OFF otherwise
- Overdub LED: YELLOW if sync received, OFF otherwise

### Recording State
- Record LED: RED (solid)
- Other buttons: OFF or context-dependent
- Display: Counting up time
- Tempo indicators: Active

### Playing State
- Record LED: GREEN (solid)
- Other buttons: GREEN if available, OFF if not
- Display: Loop time
- Tempo indicators: Active (blinking with rhythm)

### Overdubbing State
- Record LED: GREEN (solid)
- Overdub LED: RED (solid)
- Other buttons: Available as appropriate
- Display: Loop time
- Tempo indicators: Active

### Multiplying State
- Record LED: GREEN (solid)
- Multiply LED: RED (solid)
- Display: Counting cycles
- Multiple Display: Shows cycle count

### Inserting State
- Record LED: GREEN (solid)
- Insert LED: RED (solid)
- Display: Shows insert time
- Multiple Display: Shows cycle count

### Muted State
- Mute LED: RED (solid)
- Other buttons: Available as appropriate
- Display: Loop time
- Audio: Muted

### Tempo Select State
- Undo LED: RED (solid)
- Record LED: GREEN (solid)
- Overdub LED: ORANGE (solid)
- Insert LED: ORANGE (solid)
- Mute LED: ORANGE (solid)
- Display: BPM value
- Tempo indicators: Flash to beat

## 6. SPECIAL VISUAL PATTERNS

### Startup LED Flash Sequence
1. **Duration**: 400ms per LED
2. **Stagger**: 80ms between LEDs
3. **Order**: record → overdub → multiply → insert → mute → undo → nextloop
4. **Color**: All LEDs flash GREEN
5. **Purpose**: Hardware self-test and user feedback

### Sync Indication Patterns
- **Sync received**: Overdub LED turns YELLOW in Reset
- **Sync active**: Left tempo dot blinks with external sync
- **Sync disabled**: Overdub LED turns RED (StopSync)

### Memory Warning Indicators
- **Low memory**: Display shows available time
- **Overflow**: Operation may be cancelled or truncated
- **Memory full**: Recording stops automatically

### MIDI Activity Indicators
- **MIDI LED**: Blinks with MIDI activity
- **Sync indicators**: Flash with MIDI clock
- **Data transmission**: Special display patterns during dumps

## 7. IMPLEMENTATION REQUIREMENTS

### data-hw-state Attribute System
```javascript
// Set LED state
led.setAttribute('data-hw-state', 'on');    // Solid on
led.setAttribute('data-hw-state', 'off');   // Off
led.setAttribute('data-hw-state', 'blink'); // Blinking
led.setAttribute('data-hw-state', 'flash'); // Brief flash
```

### LED Color Implementation
```scss
// CSS selectors target data-hw-state attributes
.status-led[data-hw-state="on"] {
    opacity: 1;
    // Color determined by LED type and context
}
```

### Timing Requirements
- **Startup flash**: 400ms on, 80ms stagger between LEDs
- **Tempo blink**: Synchronized to BPM and subdivisions
- **Status flash**: Brief 200-300ms flashes for acknowledgment
- **AutoUndo blink**: Faint, brief blink when AutoUndo occurs

### Priority System
1. **Power state**: Overrides all other LED states when off
2. **Active operations**: Recording, overdubbing take priority
3. **Available functions**: Shown when no active operations
4. **Tempo indicators**: Continuous during play
5. **Special modes**: Parameter mode, tempo select override normal states

### State Transition Smoothness
- **Immediate feedback**: LED changes happen instantly on button press
- **Smooth transitions**: Avoid jarring on/off changes
- **Consistent patterns**: Same operation always shows same LED pattern
- **Context awareness**: LEDs reflect current system state accurately

## 8. VISUAL FEEDBACK DURING STATE TRANSITIONS

### Entering Recording
1. Record LED: OFF → RED (immediately)
2. Display: Current time → Counting up
3. Tempo indicators: Activate if not already active

### Ending Recording
1. Record LED: RED → GREEN (immediately)
2. Display: Final time → Loop time
3. Other buttons: OFF → GREEN (available)

### Loop Switching
1. NextLoop LED: GREEN → ORANGE (if quantized)
2. Display: Updates loop number
3. Button LEDs: Update based on new loop state

### Parameter Mode Entry
1. All action LEDs: Current state → OFF
2. Parameter row LED: OFF → ORANGE
3. Multiple Display: Shows P1-P4
4. Display: Shows parameter value

### Sync State Changes
1. Overdub LED: Changes color based on sync state
2. Tempo indicators: Adjust to external/internal sync
3. Display: May show sync-related messages

## 9. ERROR STATE INDICATORS

### Input Overload
- **Input LED**: RED (digital distortion warning)
- **Display**: May show error message briefly

### Feedback Overload
- **Feedback LED**: RED (loop distortion warning)
- **Audio**: Limiter engagement

### Memory Overflow
- **Display**: Shows available time warning
- **Operation**: May be cancelled or truncated

### Sync Loss
- **Sync indicators**: Stop flashing
- **Display**: May show sync status

## 10. TESTING AND VALIDATION

### LED State Testing
- Verify all LED states work correctly
- Test state transitions and timing
- Validate color accuracy and visibility
- Check startup sequence reliability

### Display Testing
- Verify all display modes work
- Test temporary message system
- Validate timing and transitions
- Check dot/indicator functionality

### Integration Testing
- Test LED states with audio operations
- Verify sync indicator accuracy
- Test parameter mode functionality
- Validate error state handling

This specification provides the complete visual feedback system for implementing proper LED and display behavior in the WebAudioAPI version of the Echoplex Digital Pro Plus.