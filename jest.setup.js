class AudioContextMock {
  close() {}
}
class OfflineAudioContextMock extends AudioContextMock {}
global.AudioContext = AudioContextMock
global.OfflineAudioContext = OfflineAudioContextMock

global.localStorage = (function () {
  let store = {}
  return {
    getItem(key) {
      return store[key] || null
    },
    setItem(key, val) {
      store[key] = String(val)
    },
    removeItem(key) {
      delete store[key]
    },
    clear() {
      store = {}
    },
  }
})()
