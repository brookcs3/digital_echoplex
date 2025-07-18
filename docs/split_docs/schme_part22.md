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
