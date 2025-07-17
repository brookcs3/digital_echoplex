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
