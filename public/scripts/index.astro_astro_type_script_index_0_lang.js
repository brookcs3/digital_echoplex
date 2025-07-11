let e = null,
  g = !1
document.addEventListener('DOMContentLoaded', () => {
  const t = document.getElementById('power-button'),
    n = document.getElementById('power-status'),
    a = document.getElementById('main-interface')
  t &&
    t.addEventListener('click', async () => {
      try {
        if (
          (t.classList.add('powering'),
          (t.textContent = 'Starting...'),
          (n.textContent = 'Initializing audio system...'),
          !g)
        ) {
          const i = window.AudioContext || window.webkitAudioContext
          ;(await new i().resume(),
            (window.echoplexEngine = new EchoplexAudioEngine()),
            (e = window.echoplexEngine),
            (n.textContent = 'Requesting microphone access...'))
          try {
            ;(await e.initMicrophone(),
              (g = !0),
              console.log('Audio system initialized successfully'))
          } catch (c) {
            ;((n.textContent =
              'Microphone access denied. Please allow microphone access and try again.'),
              (t.textContent = 'Power On'),
              t.classList.remove('powering'),
              console.error('Microphone initialization failed:', c))
            return
          }
        }
        ;((t.textContent = 'Power Off'),
          t.classList.remove('powering'),
          t.classList.add('powered-on'),
          (n.textContent = 'Unit is powered on and ready'),
          a.classList.remove('powered-off'),
          p())
      } catch (i) {
        ;((t.textContent = 'Power On'),
          t.classList.remove('powering'),
          (n.textContent = `Error: ${i.message}. Please try again.`),
          console.error('Initialization error:', i))
      }
    })
})
function p() {
  ;(m(), f(), v(), y(), console.log('UI initialized'))
}
function m() {
  ;(document
    .getElementById('record-button')
    ?.addEventListener('click', async () => {
      if (!e) return
      ;(e.getState().isRecording
        ? await e.stopRecording()
        : await e.startRecording(),
        r())
    }),
    document.getElementById('play-button')?.addEventListener('click', () => {
      if (!e) return
      ;(e.getState().isPlaying ? e.stopLoopPlayback() : e.startLoopPlayback(),
        r())
    }),
    document
      .getElementById('overdub-button')
      ?.addEventListener('click', async () => {
        if (!e) return
        ;(e.getState().isOverdubbing
          ? await e.stopOverdub()
          : await e.startOverdub(),
          r())
      }),
    document
      .getElementById('multiply-button')
      ?.addEventListener('click', async () => {
        if (!e) return
        ;(e.getState().isMultiplying
          ? await e.stopMultiply()
          : e.startMultiply(),
          r())
      }),
    document.getElementById('undo-button')?.addEventListener('click', () => {
      e && (e.undo(), r())
    }))
}
function f() {
  ;(document
    .getElementById('next-loop-button')
    ?.addEventListener('click', () => {
      e && (e.nextLoop(), r())
    }),
    document
      .getElementById('prev-loop-button')
      ?.addEventListener('click', () => {
        e && (e.previousLoop(), r())
      }),
    document.getElementById('reset-button')?.addEventListener('click', () => {
      e && (e.resetLoop(), r())
    }),
    document.getElementById('reverse-button')?.addEventListener('click', () => {
      e && (e.reverseLoop(), r())
    }),
    document
      .getElementById('half-speed-button')
      ?.addEventListener('click', () => {
        e && (e.toggleHalfSpeed(), r())
      }),
    document.getElementById('mute-button')?.addEventListener('click', () => {
      e && (e.toggleMute(), r())
    }))
}
function v() {
  ;(document
    .getElementById('feedback-control')
    ?.addEventListener('input', (t) => {
      if (!e) return
      const n = parseFloat(t.target.value)
      e.updateSettings({ feedback: n })
    }),
    document
      .getElementById('input-gain-control')
      ?.addEventListener('input', (t) => {
        if (!e) return
        const n = parseFloat(t.target.value)
        e.updateSettings({ inputGain: n })
      }),
    document
      .getElementById('output-gain-control')
      ?.addEventListener('input', (t) => {
        if (!e) return
        const n = parseFloat(t.target.value)
        e.updateSettings({ outputGain: n })
      }),
    document.getElementById('mix-control')?.addEventListener('input', (t) => {
      if (!e) return
      const n = parseFloat(t.target.value)
      e.updateSettings({ mix: n })
    }),
    document
      .getElementById('quantize-select')
      ?.addEventListener('change', (t) => {
        if (!e) return
        const n = t.target.value
        e.updateSettings({ quantize: n })
      }),
    document
      .getElementById('interface-mode-select')
      ?.addEventListener('change', (t) => {
        if (!e) return
        const n = t.target.value
        e.updateSettings({ interfaceMode: n })
      }))
}
function y() {
  if (!e) return
  const t = document.getElementById('waveform-canvas')
  if (!t) return
  const n = t.getContext('2d')
  if (!n) return
  function a() {
    const o = t.parentElement
    o && ((t.width = o.clientWidth), (t.height = o.clientHeight))
  }
  ;(a(), window.addEventListener('resize', a))
  function i() {
    if (!n || !e) return
    n.clearRect(0, 0, t.width, t.height)
    const o = e.getWaveformData()
    ;(n.beginPath(), (n.strokeStyle = '#00ff00'), (n.lineWidth = 2))
    const c = t.width / o.length
    let d = 0
    for (let s = 0; s < o.length; s++) {
      const l = (o[s] * t.height) / 2 + t.height / 2
      ;(s === 0 ? n.moveTo(d, l) : n.lineTo(d, l), (d += c))
    }
    ;(n.stroke(), requestAnimationFrame(i))
  }
  i()
}
function r() {
  if (!e) return
  const t = e.getState(),
    n = document.getElementById('record-button')
  n &&
    (n.classList.toggle('active', t.isRecording),
    (n.textContent = t.isRecording ? 'Stop Recording' : 'Record'))
  const a = document.getElementById('play-button')
  a &&
    (a.classList.toggle('active', t.isPlaying),
    (a.textContent = t.isPlaying ? 'Stop' : 'Play'))
  const i = document.getElementById('overdub-button')
  i &&
    (i.classList.toggle('active', t.isOverdubbing),
    (i.textContent = t.isOverdubbing ? 'Stop Overdub' : 'Overdub'))
  const o = document.getElementById('multiply-button')
  o &&
    (o.classList.toggle('active', t.isMultiplying),
    (o.textContent = t.isMultiplying ? 'Stop Multiply' : 'Multiply'))
  const c = document.getElementById('reverse-button')
  if (c) {
    const u = t.loops[t.currentLoopIndex]
    c.classList.toggle('active', u.isReversed)
  }
  const d = document.getElementById('half-speed-button')
  if (d) {
    const u = t.loops[t.currentLoopIndex]
    d.classList.toggle('active', u.isHalfSpeed)
  }
  const s = document.getElementById('mute-button')
  if (s) {
    const u = t.loops[t.currentLoopIndex]
    s.classList.toggle('active', u.isMuted)
  }
  const l = document.getElementById('current-loop-display')
  l && (l.textContent = `Loop ${t.currentLoopIndex + 1}`)
}
