
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
