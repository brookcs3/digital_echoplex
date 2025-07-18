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
