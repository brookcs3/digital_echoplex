
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
