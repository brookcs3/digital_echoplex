# ORIGINAL WORKING STYLES BACKUP

## ⚠️ CRITICAL: These are the WORKING styles from index.astro that made the interface look correct

**DO NOT LOSE THESE VALUES - They are the source of truth for all styling**

Extract actual values from here to replace SCSS placeholders.

---

## Power Button Styling
```css
#power-button {
  position: absolute;
  width: 2.14%; /* 30px / 1400px - proper percentage of background */
  height: 17.14%;
  background: linear-gradient(to bottom, #800, #400);
  border: 2px solid #600;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0,0,0,0.5);
  pointer-events: auto !important;
  z-index: 1000;
  transition: all 0.3s;
}

#power-button:hover {
  background: linear-gradient(to bottom, #900, #500);
  box-shadow: 0 4px 12px rgba(0,0,0,0.7);
}

#power-button.powered-on {
  background: linear-gradient(to bottom, #0f0, #080);
  box-shadow: 0 0 15px #0f0;
}

.power-button {
  position: absolute;
  width: 2.14%; /* 30px / 1400px */
  height: 17.14%; /* 60px / 350px */
  background: linear-gradient(to bottom, #800, #400);
  border: 2px solid #600;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0,0,0,0.5);
  pointer-events: auto !important;
  z-index: 1000;
}

.power-button.on {
  background: linear-gradient(to bottom, #f00, #800);
  box-shadow: 0 0 15px #f00;
}
```

## Knob Styling
```css
.knob {
  position: absolute;
  width: 2.86%;
  height: 11.43%;
  border-radius: 50%;
  cursor: grab;
}

.knob:active {
  cursor: grabbing;
}

.knob-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, #666, #222);
  border-radius: 50%;
  box-shadow: 
    0 5px 15px rgba(0,0,0,0.8),
    inset 0 -2px 5px rgba(0,0,0,0.5),
    inset 0 2px 2px rgba(255,255,255,0.2);
  transform-origin: center center;
  pointer-events: none;
}

.knob-indicator {
  position: absolute;
  width: 3px;
  height: 40%;
  background: #fff;
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
  box-shadow: 0 0 3px rgba(255,255,255,0.5);
  pointer-events: none;
}
```

## Button Styling
```css
.button {
  transition: all 0.1s;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.button:active {
  transform: scale(0.95);
}

.button-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #f8f8f8, #d0d0d0);
  border: 1px solid #888;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0,0,0,0.5);
  pointer-events: none;
}

/* ECHOPLEX HARDWARE FIX: Disable hover effects on hardware buttons */
.control.button:hover {
  /* No hover effect for authentic hardware feel */
  background: none !important;
  transform: none !important;
  box-shadow: none !important;
  filter: none !important;
  opacity: 1 !important;
}

.control.button {
  transition: none !important; /* Disable any transitions on hardware buttons */
}
```

## Main Container
```css
.echoplex-container {
  position: relative;
  width: 95%;
  max-width: 1400px;
  aspect-ratio: 1400 / 162;
  border: 2px solid #111;
  user-select: none;
  background: url('https://i.ibb.co/0jtXdtfz/axa.png') no-repeat center;
  background-size: cover;
  margin: 20px auto;
}
```

## Display Section
```css
.display-section {
  position: absolute;
  left: 40%;
  top: 28%;
  width: 30%;
  height: 25%;
  background: #111;
  border: 2px solid #333;
  border-radius: 5px;
  padding: 1%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loop-display {
  font-family: 'Orbitron', monospace;
  font-size: 2.8vw;
  color: #f00;
  text-shadow: 0 0 10px #f00;
  letter-spacing: -0.08em;
  background: #000;
  padding: 0.5% 1%;
  border-radius: 3px;
  min-width: 60%;
  text-align: center;
}

.left-display {
  font-family: 'Orbitron', monospace;
  font-size: 1.2vw;
  color: #0f0;
  text-shadow: 0 0 8px #0f0;
  background: #000;
  padding: 0.5% 1%;
  border-radius: 3px;
  min-width: 15%;
  text-align: center;
}

.multiple-display {
  font-family: 'Orbitron', monospace;
  font-size: 1.2vw;
  color: #0f0;
  text-shadow: 0 0 8px #0f0;
  background: #000;
  padding: 0.5% 1%;
  border-radius: 3px;
  min-width: 15%;
  text-align: center;
}
```

## LED States
```css
.status-led {
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 8px;
  height: 8px;
}

.status-led.recording {
  background-color: #ff0000;
  box-shadow: 0 0 8px #ff0000, inset 0 0 4px #ff4444;
  animation: recording-blink 0.5s infinite;
}

.status-led.overdubbing {
  background-color: #ff8800;
  box-shadow: 0 0 8px #ff8800, inset 0 0 4px #ffaa44;
  animation: overdub-shimmer 1s infinite;
}

.status-led.playing {
  background-color: #00ff00;
  box-shadow: 0 0 6px #00ff00, inset 0 0 3px #44ff44;
}

.status-led.muted {
  background-color: #ffff00;
  box-shadow: 0 0 6px #ffff00;
  animation: mute-blink 1s infinite;
}
```

## Button States
```css
.button.recording {
  background-color: #ff3333 !important;
  box-shadow: 0 0 10px #ff3333;
  animation: recording-pulse 1s infinite;
}

.button.overdubbing {
  background-color: #ff8800 !important;
  box-shadow: 0 0 10px #ff8800;
  animation: overdub-pulse 0.8s infinite;
}

.button.playing {
  background-color: #00ff00 !important;
  box-shadow: 0 0 8px #00ff00;
}

.button.muted {
  background-color: #666 !important;
  opacity: 0.5;
  animation: mute-flash 2s infinite;
}
```

## Parameter Matrix
```css
.parameter-matrix {
  position: absolute;
  left: 53%;
  bottom: 13%;
  width: 39%;
  height: 22%;
  background: rgba(34, 34, 34, 0.26);
  border: 1px solid rgba(68, 68, 68, 0.29);
  border-radius: 3px;
  padding: 0.5%;
}

.matrix-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25%;
  color: #666;
  font-size: 0.6vw;
}
```

## All Animation Keyframes
```css
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

@keyframes recording-pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes overdub-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
}

@keyframes recording-blink {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

@keyframes overdub-shimmer {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

@keyframes mute-flash {
  0% { opacity: 1; }
  25% { opacity: 0.3; }
  50% { opacity: 1; }
  75% { opacity: 0.3; }
  100% { opacity: 1; }
}

@keyframes mute-blink {
  0% { opacity: 1; }
  50% { opacity: 0.2; }
  100% { opacity: 1; }
}

@keyframes error-flash {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

@keyframes clipping-flash {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
```

---

## IMPORTANT NOTES:

1. **Sacred Positioning Values**: All the percentage values for positioning are SACRED and must never be changed
2. **Background Image**: `url('https://i.ibb.co/0jtXdtfz/axa.png')` 
3. **No Hover Effects**: Hardware buttons explicitly disable hover effects for authentic feel
4. **Exact Gradients**: All gradients and shadows must match exactly
5. **Font**: Uses 'Orbitron' monospace for displays
6. **Aspect Ratio**: Container uses `aspect-ratio: 1400 / 162`

**Use these exact values to replace ALL placeholders in the SCSS files.**