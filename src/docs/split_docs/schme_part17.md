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
