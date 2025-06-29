class SamplePlayer {
  constructor() {
    this.audioContext = null;
    this.audioBuffer = null;
    this.source = null;
    this.isPlaying = false;
    this.startTime = 0;
    this.pauseTime = 0;
    this.playheadPosition = 0;
    this.canvas = null;
    this.canvasContext = null;
    this.animationId = null;
    this.initialized = false;
    
    if (this.initializeElements()) {
      this.setupEventListeners();
      this.initialized = true;
    } else {
      console.error('Sample player initialization failed - required elements not found');
    }
  }
  
  initializeElements() {
    this.playerElement = document.getElementById('sample-player');
    this.fileInput = document.getElementById('audio-file-input');
    this.playBtn = document.getElementById('sample-play-btn');
    this.stopBtn = document.getElementById('sample-stop-btn');
    this.loadBtn = document.getElementById('sample-load-btn');
    this.canvas = document.getElementById('sample-waveform');
    this.playhead = document.getElementById('sample-playhead');
    this.recordSourceRadios = document.querySelectorAll('input[name="record-source"]');
    
    // Verify critical elements exist
    const requiredElements = [
      { element: this.playerElement, name: 'sample-player' },
      { element: this.fileInput, name: 'audio-file-input' },
      { element: this.playBtn, name: 'sample-play-btn' },
      { element: this.canvas, name: 'sample-waveform' }
    ];
    
    for (const { element, name } of requiredElements) {
      if (!element) {
        console.error(`Required element not found: ${name}`);
        return false;
      }
    }
    
    if (this.canvas) {
      this.canvasContext = this.canvas.getContext('2d');
      if (!this.canvasContext) {
        console.error('Could not get 2D context from canvas');
        return false;
      }
      this.resizeCanvas();
    }
    
    return true;
  }
  
  setupEventListeners() {
    if (!this.initialized) return;
    
    if (this.fileInput) this.fileInput.addEventListener('change', this.handleFileLoad.bind(this));
    if (this.playBtn) this.playBtn.addEventListener('click', this.togglePlayback.bind(this));
    if (this.stopBtn) this.stopBtn.addEventListener('click', this.stopPlayback.bind(this));
    if (this.loadBtn) this.loadBtn.addEventListener('click', this.loadSample.bind(this));
    
    // Playhead scrubbing
    if (this.canvas) this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    if (this.playhead) this.playhead.addEventListener('mousedown', this.startPlayheadDrag.bind(this));
    
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }
  
  resizeCanvas() {
    if (!this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    if (this.audioBuffer) {
      this.drawWaveform();
    }
  }
  
  async handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      if (!this.audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          throw new Error('Web Audio API not supported in this browser');
        }
        this.audioContext = new AudioContextClass();
      }
      
      // Handle autoplay policy
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      const arrayBuffer = await file.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.drawWaveform();
      this.loadBtn.disabled = false;
      this.playBtn.disabled = false;
      
      console.log('Sample loaded:', file.name, 'Duration:', this.audioBuffer.duration);
    } catch (error) {
      console.error('Error loading audio file:', error);
      alert('Error loading audio file. Please try a different file.');
    }
  }
  
  drawWaveform() {
    if (!this.audioBuffer || !this.canvasContext) return;
    
    const canvas = this.canvas;
    const ctx = this.canvasContext;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const channelData = this.audioBuffer.getChannelData(0);
    const samplesPerPixel = Math.floor(channelData.length / width);
    
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
      const start = x * samplesPerPixel;
      const end = start + samplesPerPixel;
      let min = 0;
      let max = 0;
      
      for (let i = start; i < end && i < channelData.length; i++) {
        const sample = channelData[i];
        if (sample < min) min = sample;
        if (sample > max) max = sample;
      }
      
      const yMin = ((min + 1) / 2) * height;
      const yMax = ((max + 1) / 2) * height;
      
      if (x === 0) {
        ctx.moveTo(x, height / 2);
      }
      
      ctx.lineTo(x, yMax);
      ctx.lineTo(x, yMin);
    }
    
    ctx.stroke();
  }
  
  togglePlayback() {
    if (this.isPlaying) {
      this.pausePlayback();
    } else {
      this.startPlayback();
    }
  }
  
  startPlayback() {
    if (!this.audioBuffer || !this.audioContext) return;
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer;
    
    // Connect to Echoplex input like an instrument
    if (window.echoplexPro && window.echoplexPro.audioSystem && window.echoplexPro.audioSystem.sampleInput) {
      this.source.connect(window.echoplexPro.audioSystem.sampleInput);
      console.log('Sample player connected to Echoplex input chain');
    } else {
      // Fallback to direct output if Echoplex not ready
      this.source.connect(this.audioContext.destination);
      console.warn('Sample player using fallback direct output - Echoplex not connected');
    }
    
    const offset = this.pauseTime;
    this.source.start(0, offset);
    this.startTime = this.audioContext.currentTime - offset;
    this.isPlaying = true;
    
    this.playBtn.textContent = 'Pause';
    this.playBtn.classList.add('active');
    
    this.source.onended = () => {
      this.stopPlayback();
    };
    
    // Also start echoplex sample playback if connected
    if (typeof window !== 'undefined' && 
        window.echoplexEngine && 
        typeof window.echoplexEngine.startSamplePlayback === 'function') {
      try {
        window.echoplexEngine.startSamplePlayback();
      } catch (error) {
        console.error('Error starting echoplex sample playback:', error);
      }
    }
    
    this.startPlayheadAnimation();
  }
  
  pausePlayback() {
    if (this.source) {
      this.source.stop();
      this.source = null;
    }
    
    this.pauseTime = this.audioContext.currentTime - this.startTime;
    this.isPlaying = false;
    
    this.playBtn.textContent = 'Play';
    this.playBtn.classList.remove('active');
    
    this.stopPlayheadAnimation();
  }
  
  stopPlayback() {
    if (this.source) {
      this.source.stop();
      this.source = null;
    }
    
    this.isPlaying = false;
    this.pauseTime = 0;
    this.playheadPosition = 0;
    
    this.playBtn.textContent = 'Play';
    this.playBtn.classList.remove('active');
    
    this.stopPlayheadAnimation();
    this.updatePlayheadPosition();
  }
  
  handleCanvasClick(event) {
    if (!this.audioBuffer) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const position = x / rect.width;
    
    this.pauseTime = position * this.audioBuffer.duration;
    this.playheadPosition = position;
    this.updatePlayheadPosition();
    
    if (this.isPlaying) {
      this.pausePlayback();
      this.startPlayback();
    }
  }
  
  startPlayheadDrag(event) {
    event.preventDefault();
    
    // Store references for cleanup
    const handleMouseMove = (e) => {
      if (!this.audioBuffer) return;
      
      const rect = this.canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const position = x / rect.width;
      
      this.pauseTime = position * this.audioBuffer.duration;
      this.playheadPosition = position;
      this.updatePlayheadPosition();
      
      if (this.isPlaying) {
        this.pausePlayback();
        this.startPlayback();
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Clear drag state
      this.isDragging = false;
    };
    
    // Set drag state
    this.isDragging = true;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
  
  // Add cleanup method for memory management
  dispose() {
    if (this.source) {
      this.source.stop();
      this.source = null;
    }
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    
    // Remove window event listener
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
    
    this.initialized = false;
  }
  
  startPlayheadAnimation() {
    const animate = () => {
      if (this.isPlaying && this.audioBuffer) {
        const currentTime = this.audioContext.currentTime - this.startTime;
        this.playheadPosition = currentTime / this.audioBuffer.duration;
        this.updatePlayheadPosition();
        
        if (this.playheadPosition >= 1) {
          this.stopPlayback();
          return;
        }
      }
      
      if (this.isPlaying) {
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }
  
  stopPlayheadAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  updatePlayheadPosition() {
    if (this.playhead && this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      const x = this.playheadPosition * rect.width;
      this.playhead.style.left = `${x}px`;
    }
  }
  
  loadSample() {
    // Connect the loaded sample to the echoplex engine's channel 2
    if (!this.audioBuffer) {
      alert('Please load an audio file first.');
      return;
    }
    
    // Get the echoplex engine instance
    if (typeof window !== 'undefined' && 
        window.echoplexEngine && 
        typeof window.echoplexEngine.connectSamplePlayer === 'function') {
      try {
        window.echoplexEngine.connectSamplePlayer(this.audioBuffer);
        if (this.loadBtn) {
          this.loadBtn.textContent = 'Loaded';
          this.loadBtn.disabled = true;
        }
        console.log('Sample loaded into Echoplex Channel 2');
      } catch (error) {
        console.error('Error connecting sample to echoplex:', error);
        alert('Error loading sample into echoplex. Check console for details.');
      }
    } else {
      alert('Echoplex engine not initialized. Please power on first.');
    }
  }
  
  show() {
    this.playerElement.classList.add('visible');
  }
  
  hide() {
    this.playerElement.classList.remove('visible');
  }
  
  // Get current audio for recording
  getCurrentAudio() {
    if (!this.audioBuffer) return null;
    
    // Return the audio buffer for use in echoplex recording
    return {
      buffer: this.audioBuffer,
      currentTime: this.pauseTime,
      isPlaying: this.isPlaying
    };
  }
}

// Browser compatibility check
function checkBrowserSupport() {
  const requirements = [
    { feature: 'AudioContext', check: () => !!(window.AudioContext || window.webkitAudioContext) },
    { feature: 'MediaRecorder', check: () => !!window.MediaRecorder },
    { feature: 'getUserMedia', check: () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) },
    { feature: 'File API', check: () => !!(window.File && window.FileReader && window.FileList && window.Blob) }
  ];
  
  const unsupported = requirements.filter(req => !req.check());
  
  if (unsupported.length > 0) {
    console.error('Unsupported browser features:', unsupported.map(r => r.feature));
    return false;
  }
  
  return true;
}

// Initialize sample player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (checkBrowserSupport()) {
    try {
      window.samplePlayer = new SamplePlayer();
      console.log('Sample player initialized successfully');
    } catch (error) {
      console.error('Failed to initialize sample player:', error);
    }
  } else {
    console.error('Browser does not support required features for sample player');
  }
});