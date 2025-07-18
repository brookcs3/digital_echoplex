
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
