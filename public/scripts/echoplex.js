// Digital Echo Plex initialization script
// This script handles the power-on sequence, permission requests, and system checks

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Digital Echo Plex: DOM loaded, initializing UI');
  
  // Initialize UI components that don't require audio context
  initializeUIComponents();
  
  // Set up power button event listener
  setupPowerButton();
});

// Initialize basic UI components that don't require audio context
function initializeUIComponents() {
  // Make sure all required script dependencies are loaded
  if (typeof window.EchoplexAudioEngine === 'undefined') {
    console.error('Error: EchoplexAudioEngine not loaded. Check script dependencies.');
    showErrorMessage('Script loading error. Please refresh the page and try again.');
    return;
  }
  
  console.log('Digital Echo Plex: UI components initialized');
}

// Set up power button event listener
function setupPowerButton() {
  const powerButton = document.getElementById('power-button');
  const powerStatus = document.getElementById('power-status');
  
  if (!powerButton || !powerStatus) {
    console.error('Error: Power button or status element not found');
    return;
  }
  
  powerButton.addEventListener('click', handlePowerButtonClick);
  console.log('Digital Echo Plex: Power button initialized');
}

// Handle power button click
async function handlePowerButtonClick() {
  const powerButton = document.getElementById('power-button');
  const powerStatus = document.getElementById('power-status');
  const mainInterface = document.getElementById('main-interface');
  
  if (!powerButton || !powerStatus || !mainInterface) {
    console.error('Error: Required UI elements not found');
    return;
  }
  
  // Check if already powered on
  if (powerButton.classList.contains('powered-on')) {
    // Power off
    powerOff();
    return;
  }
  
  // Start power on sequence
  powerButton.classList.add('powering');
  powerButton.textContent = 'Starting...';
  powerStatus.textContent = 'Initializing system...';
  
  try {
    // Run system checks
    await runSystemChecks(powerStatus);
    
    // Initialize audio context
    await initializeAudioContext(powerStatus);
    
    // Request microphone permissions
    await requestMicrophonePermissions(powerStatus);
    
    // Initialize Echo Plex engine
    await initializeEchoPlex(powerStatus);
    
    // Power on successful
    powerOnComplete(powerButton, powerStatus, mainInterface);
    
  } catch (error) {
    // Handle initialization errors
    handlePowerOnError(error, powerButton, powerStatus);
  }
}

// Run system checks
async function runSystemChecks(statusElement) {
  statusElement.textContent = 'Running system checks...';
  
  // Check browser compatibility
  const isCompatible = checkBrowserCompatibility();
  if (!isCompatible) {
    throw new Error('Browser not compatible with Web Audio API. Please use Chrome, Firefox, or Edge.');
  }
  
  // Simulate 1 second of system checks
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Digital Echo Plex: System checks passed');
  return true;
}

// Check browser compatibility
function checkBrowserCompatibility() {
  // Check for Web Audio API support
  if (!window.AudioContext && !window.webkitAudioContext) {
    console.error('Web Audio API not supported');
    return false;
  }
  
  // Check for getUserMedia support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('getUserMedia not supported');
    return false;
  }
  
  return true;
}

// Initialize audio context
async function initializeAudioContext(statusElement) {
  statusElement.textContent = 'Initializing audio system...';
  
  try {
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Resume audio context (needed for some browsers)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Simulate 1 second of audio initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Digital Echo Plex: Audio context initialized');
    return audioContext;
    
  } catch (error) {
    console.error('Error initializing audio context:', error);
    throw new Error('Failed to initialize audio system. Please check your browser settings.');
  }
}

// Request microphone permissions
async function requestMicrophonePermissions(statusElement) {
  statusElement.textContent = 'Requesting microphone access...';
  
  try {
    // Request microphone access with explicit user feedback
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0.01
      }
    });
    
    // Simulate 1 second of permission processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Digital Echo Plex: Microphone access granted');
    return stream;
    
  } catch (error) {
    console.error('Error requesting microphone access:', error);
    throw new Error('Microphone access denied. Please allow microphone access and try again.');
  }
}

// Initialize Echo Plex engine
async function initializeEchoPlex(statusElement) {
  statusElement.textContent = 'Initializing Echo Plex engine...';
  
  try {
    // Create Echo Plex engine instance
    window.echoplexEngine = new window.EchoplexAudioEngine();
    
    // Initialize microphone
    await window.echoplexEngine.initMicrophone();
    
    // Simulate 1 second of engine initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Digital Echo Plex: Engine initialized');
    return window.echoplexEngine;
    
  } catch (error) {
    console.error('Error initializing Echo Plex engine:', error);
    throw new Error('Failed to initialize Echo Plex engine. Please refresh and try again.');
  }
}

// Power on complete
function powerOnComplete(powerButton, statusElement, mainInterface) {
  powerButton.textContent = 'Power Off';
  powerButton.classList.remove('powering');
  powerButton.classList.add('powered-on');
  statusElement.textContent = 'Unit is powered on and ready';
  mainInterface.classList.remove('powered-off');
  
  // Initialize UI controls
  initializeControls();
  
  // Start waveform visualization
  startWaveformVisualization();
  
  // Start timer updates
  startTimerUpdates();
  
  console.log('Digital Echo Plex: Power on sequence complete');
}

// Handle power on error
function handlePowerOnError(error, powerButton, statusElement) {
  powerButton.textContent = 'Power On';
  powerButton.classList.remove('powering');
  
  // Display error message
  statusElement.textContent = `Error: ${error.message}`;
  statusElement.classList.add('error');
  
  console.error('Digital Echo Plex: Power on failed:', error);
}

// Power off
function powerOff() {
  const powerButton = document.getElementById('power-button');
  const powerStatus = document.getElementById('power-status');
  const mainInterface = document.getElementById('main-interface');
  
  if (!powerButton || !powerStatus || !mainInterface) return;
  
  // Update UI
  powerButton.textContent = 'Power On';
  powerButton.classList.remove('powered-on');
  powerStatus.textContent = 'Unit is powered off';
  powerStatus.classList.remove('error');
  mainInterface.classList.add('powered-off');
  
  // Stop timer updates
  stopTimerUpdates();
  
  // Dispose of audio resources
  if (window.echoplexEngine) {
    window.echoplexEngine.dispose();
    window.echoplexEngine = null;
  }
  
  console.log('Digital Echo Plex: Powered off');
}

// Show error message
function showErrorMessage(message) {
  const powerStatus = document.getElementById('power-status');
  if (powerStatus) {
    powerStatus.textContent = `Error: ${message}`;
    powerStatus.classList.add('error');
  }
}

// Initialize UI controls
function initializeControls() {
  if (!window.echoplexEngine) return;
  
  // Set up transport controls
  setupTransportControls();
  
  // Set up loop controls
  setupLoopControls();
  
  // Set up parameter controls
  setupParameterControls();
  
  // Set up function button
  setupFunctionButton();
  
  // Set up record mode selector
  setupRecordModeSelector();
  
  console.log('Digital Echo Plex: Controls initialized');
}

// Set up transport controls
function setupTransportControls() {
  // Record button
  const recordButton = document.getElementById('record-button');
  if (recordButton) {
    // For SWITCH mode
    recordButton.addEventListener('click', async () => {
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.recordMode === 'SWITCH') {
        if (state.isRecording) {
          await window.echoplexEngine.stopRecording();
        } else {
          await window.echoplexEngine.startRecording();
        }
      }
      
      updateUIState();
    });
    
    // For TOGGLE mode
    recordButton.addEventListener('mousedown', async () => {
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.recordMode === 'TOGGLE' && !state.isRecording) {
        await window.echoplexEngine.startRecording();
        updateUIState();
      }
    });
    
    recordButton.addEventListener('mouseup', async () => {
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.recordMode === 'TOGGLE' && state.isRecording) {
        await window.echoplexEngine.stopRecording();
        updateUIState();
      }
    });
    
    // Handle touch events for mobile
    recordButton.addEventListener('touchstart', async (e) => {
      e.preventDefault(); // Prevent default touch behavior
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.recordMode === 'TOGGLE' && !state.isRecording) {
        await window.echoplexEngine.startRecording();
        updateUIState();
      }
    });
    
    recordButton.addEventListener('touchend', async (e) => {
      e.preventDefault(); // Prevent default touch behavior
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.recordMode === 'TOGGLE' && state.isRecording) {
        await window.echoplexEngine.stopRecording();
        updateUIState();
      }
    });
  }
  
  // Play/Stop button
  const playButton = document.getElementById('play-button');
  if (playButton) {
    playButton.addEventListener('click', () => {
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.isPlaying) {
        window.echoplexEngine.stopLoopPlayback();
      } else {
        window.echoplexEngine.startLoopPlayback();
      }
      
      updateUIState();
    });
  }
  
  // Overdub button (defaults to TOGGLE mode)
  const overdubButton = document.getElementById('overdub-button');
  if (overdubButton) {
    // For SWITCH mode
    overdubButton.addEventListener('click', async () => {
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.settings.overdubMode === 'SWITCH') {
        if (state.isOverdubbing) {
          await window.echoplexEngine.stopOverdub();
        } else {
          await window.echoplexEngine.startOverdub();
        }
        
        updateUIState();
      }
    });
    
    // For TOGGLE mode (default)
    overdubButton.addEventListener('mousedown', async () => {
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.settings.overdubMode === 'TOGGLE' && !state.isOverdubbing) {
        await window.echoplexEngine.startOverdub();
        updateUIState();
      }
    });
    
    overdubButton.addEventListener('mouseup', async () => {
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.settings.overdubMode === 'TOGGLE' && state.isOverdubbing) {
        await window.echoplexEngine.stopOverdub();
        updateUIState();
      }
    });
    
    // Handle touch events for mobile
    overdubButton.addEventListener('touchstart', async (e) => {
      e.preventDefault();
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.settings.overdubMode === 'TOGGLE' && !state.isOverdubbing) {
        await window.echoplexEngine.startOverdub();
        updateUIState();
      }
    });
    
    overdubButton.addEventListener('touchend', async (e) => {
      e.preventDefault();
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      
      if (state.settings.overdubMode === 'TOGGLE' && state.isOverdubbing) {
        await window.echoplexEngine.stopOverdub();
        updateUIState();
      }
    });
  }
  
  // Multiply button
  const multiplyButton = document.getElementById('multiply-button');
  if (multiplyButton) {
    multiplyButton.addEventListener('mousedown', () => {
      if (!window.echoplexEngine) return;
      
      window.echoplexEngine.startMultiply();
      updateUIState();
    });
    
    multiplyButton.addEventListener('mouseup', async () => {
      if (!window.echoplexEngine) return;
      
      await window.echoplexEngine.stopMultiply();
      updateUIState();
    });
    
    // Handle touch events for mobile
    multiplyButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!window.echoplexEngine) return;
      
      window.echoplexEngine.startMultiply();
      updateUIState();
    });
    
    multiplyButton.addEventListener('touchend', async (e) => {
      e.preventDefault();
      if (!window.echoplexEngine) return;
      
      await window.echoplexEngine.stopMultiply();
      updateUIState();
    });
  }
  
  // Undo button
  const undoButton = document.getElementById('undo-button');
  if (undoButton) {
    undoButton.addEventListener('click', () => {
      if (!window.echoplexEngine) return;
      
      window.echoplexEngine.undo();
      updateUIState();
    });
  }
}

// Set up loop controls
function setupLoopControls() {
  // Next Loop button
  const nextLoopButton = document.getElementById('next-loop-button');
  if (nextLoopButton) {
    nextLoopButton.addEventListener('click', () => {
      if (!window.echoplexEngine) return;
      
      window.echoplexEngine.nextLoop();
      updateUIState();
    });
  }
  
  // Previous Loop button
  const prevLoopButton = document.getElementById('prev-loop-button');
  if (prevLoopButton) {
    prevLoopButton.addEventListener('click', () => {
      if (!window.echoplexEngine) return;
      
      window.echoplexEngine.previousLoop();
      updateUIState();
    });
  }
  
  // Reset button
  const resetButton = document.getElementById('reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (!window.echoplexEngine) return;
      
      window.echoplexEngine.resetLoop();
      updateUIState();
    });
  }
  
  // Reverse button
  const reverseButton = document.getElementById('reverse-button');
  if (reverseButton) {
    reverseButton.addEventListener('click', () => {
      if (!window.echoplexEngine) return;
      
      // Check if function mode is active
      const state = window.echoplexEngine.getState();
      if (!state.isFunctionActive) {
        window.echoplexEngine.reverseLoop();
        updateUIState();
      }
    });
  }
  
  // Half-Speed button
  const halfSpeedButton = document.getElementById('half-speed-button');
  if (halfSpeedButton) {
    halfSpeedButton.addEventListener('click', () => {
      if (!window.echoplexEngine) return;
      
      window.echoplexEngine.toggleHalfSpeed();
      updateUIState();
    });
  }
  
  // Mute button
  const muteButton = document.getElementById('mute-button');
  if (muteButton) {
    muteButton.addEventListener('click', () => {
      if (!window.echoplexEngine) return;
      
      window.echoplexEngine.toggleMute();
      updateUIState();
    });
  }
  
  // Insert button
  const insertButton = document.getElementById('insert-button');
  if (insertButton) {
    insertButton.addEventListener('mousedown', async () => {
      if (!window.echoplexEngine) return;
      
      await window.echoplexEngine.startInsert();
      updateUIState();
    });
    
    insertButton.addEventListener('mouseup', async () => {
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      if (state.isReplacing) {
        await window.echoplexEngine.stopInsert();
        updateUIState();
      }
    });
    
    // Handle touch events for mobile
    insertButton.addEventListener('touchstart', async (e) => {
      e.preventDefault();
      if (!window.echoplexEngine) return;
      
      await window.echoplexEngine.startInsert();
      updateUIState();
    });
    
    insertButton.addEventListener('touchend', async (e) => {
      e.preventDefault();
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      if (state.isReplacing) {
        await window.echoplexEngine.stopInsert();
        updateUIState();
      }
    });
  }
  
  // Window button
  const windowButton = document.getElementById('window-button');
  if (windowButton) {
    let windowStartPosition = null;
    
    windowButton.addEventListener('mousedown', () => {
      if (!window.echoplexEngine) return;
      
      const state = window.echoplexEngine.getState();
      if (state.isPlaying) {
        windowStartPosition = window.echoplexEngine.getCurrentPlaybackPosition();
        windowButton.classList.add('active');
      }
    });
    
    windowButton.addEventListener('mouseup', () => {
      if (!window.echoplexEngine || windowStartPosition === null) return;
      
      const state = window.echoplexEngine.getState();
      if (state.isPlaying) {
        const windowEndPosition = window.echoplexEngine.getCurrentPlaybackPosition();
        window.echoplexEngine.setLoopWindow(windowStartPosition, windowEndPosition);
        windowStartPosition = null;
        windowButton.classList.remove('active');
        updateUIState();
      }
    });
  }
}

// Set up parameter controls
function setupParameterControls() {
  // Feedback control
  const feedbackControl = document.getElementById('feedback-control');
  if (feedbackControl) {
    feedbackControl.addEventListener('input', (e) => {
      if (!window.echoplexEngine) return;
      
      const value = parseFloat(e.target.value);
      window.echoplexEngine.updateSettings({ feedback: value });
    });
  }
  
  // Input gain control
  const inputGainControl = document.getElementById('input-gain-control');
  if (inputGainControl) {
    inputGainControl.addEventListener('input', (e) => {
      if (!window.echoplexEngine) return;
      
      const value = parseFloat(e.target.value);
      window.echoplexEngine.updateSettings({ inputGain: value });
    });
  }
  
  // Output gain control
  const outputGainControl = document.getElementById('output-gain-control');
  if (outputGainControl) {
    outputGainControl.addEventListener('input', (e) => {
      if (!window.echoplexEngine) return;
      
      const value = parseFloat(e.target.value);
      window.echoplexEngine.updateSettings({ outputGain: value });
    });
  }
  
  // Mix control
  const mixControl = document.getElementById('mix-control');
  if (mixControl) {
    mixControl.addEventListener('input', (e) => {
      if (!window.echoplexEngine) return;
      
      const value = parseFloat(e.target.value);
      window.echoplexEngine.updateSettings({ mix: value });
    });
  }
  
  // Quantize select
  const quantizeSelect = document.getElementById('quantize-select');
  if (quantizeSelect) {
    quantizeSelect.addEventListener('change', (e) => {
      if (!window.echoplexEngine) return;
      
      const value = e.target.value;
      window.echoplexEngine.updateSettings({ quantize: value });
    });
  }
  
  // Interface mode select
  const interfaceModeSelect = document.getElementById('interface-mode-select');
  if (interfaceModeSelect) {
    interfaceModeSelect.addEventListener('change', (e) => {
      if (!window.echoplexEngine) return;
      
      const value = e.target.value;
      window.echoplexEngine.updateSettings({ interfaceMode: value });
    });
  }
  
  // Overdub mode select
  const overdubModeSelect = document.getElementById('overdub-mode-select');
  if (overdubModeSelect) {
    overdubModeSelect.addEventListener('change', (e) => {
      if (!window.echoplexEngine) return;
      
      const value = e.target.value;
      window.echoplexEngine.updateSettings({ overdubMode: value });
    });
  }
}

// Set up function button
function setupFunctionButton() {
  // Function button
  const functionButton = document.getElementById('function-button');
  if (functionButton) {
    functionButton.addEventListener('click', () => {
      if (!window.echoplexEngine) return;
      
      const isFunctionActive = window.echoplexEngine.toggleFunctionMode();
      functionButton.classList.toggle('active', isFunctionActive);
      
      // Update UI to show function mode is active
      document.body.classList.toggle('function-active', isFunctionActive);
    });
  }
}

// Set up record mode selector
function setupRecordModeSelector() {
  const recordModeRadios = document.querySelectorAll('input[name="record-mode"]');
  if (recordModeRadios.length > 0) {
    recordModeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (!window.echoplexEngine) return;
        
        window.echoplexEngine.setRecordMode(e.target.value);
      });
    });
  }
}

// Start waveform visualization
function startWaveformVisualization() {
  if (!window.echoplexEngine) return;
  
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Resize canvas to match container
  function resizeCanvas() {
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
  }
  
  // Initial resize
  resizeCanvas();
  
  // Resize on window resize
  window.addEventListener('resize', resizeCanvas);
  
  // Animation loop for waveform visualization
  function drawWaveform() {
    if (!ctx || !window.echoplexEngine) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get waveform data
    const waveformData = window.echoplexEngine.getWaveformData();
    
    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    
    const sliceWidth = canvas.width / waveformData.length;
    let x = 0;
    
    for (let i = 0; i < waveformData.length; i++) {
      const y = (waveformData[i] * canvas.height / 2) + canvas.height / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.stroke();
    
    // Draw playhead if playing
    const state = window.echoplexEngine.getState();
    if (state.isPlaying) {
      const currentLoop = state.loops[state.currentLoopIndex];
      const loopStart = currentLoop.windowStart !== null ? currentLoop.windowStart : currentLoop.startPoint;
      const loopEnd = currentLoop.windowEnd !== null ? currentLoop.windowEnd : currentLoop.endPoint;
      const loopDuration = loopEnd - loopStart;
      
      if (loopDuration > 0) {
        const playbackPosition = window.echoplexEngine.getCurrentPlaybackPosition();
        const relativePosition = (playbackPosition - loopStart) / loopDuration;
        const playheadX = relativePosition * canvas.width;
        
        // Draw playhead
        ctx.beginPath();
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, canvas.height);
        ctx.stroke();
      }
    }
    
    // Continue animation loop
    requestAnimationFrame(drawWaveform);
  }
  
  // Start animation loop
  drawWaveform();
}

// Timer variables
let timerInterval = null;

// Start timer updates
function startTimerUpdates() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  const recordingTimeElement = document.getElementById('recording-time');
  const loopLengthElement = document.getElementById('loop-length');
  
  if (!recordingTimeElement || !loopLengthElement || !window.echoplexEngine) return;
  
  // Update timer immediately
  updateTimerDisplay();
  
  // Update timer every 100ms
  timerInterval = setInterval(updateTimerDisplay, 100);
  
  function updateTimerDisplay() {
    if (!window.echoplexEngine) return;
    
    const state = window.echoplexEngine.getState();
    
    // Update recording time
    if (state.isRecording || state.isOverdubbing) {
      const recordingTime = window.echoplexEngine.getCurrentRecordingTime();
      recordingTimeElement.textContent = recordingTime.toFixed(1);
      
      // Add warning class when approaching max recording time
      const maxTime = window.echoplexEngine.MAX_RECORDING_TIME;
      if (recordingTime > maxTime * 0.9) {
        recordingTimeElement.classList.add('warning');
      } else {
        recordingTimeElement.classList.remove('warning');
      }
      
      // Add recording-active class to container
      document.body.classList.add('recording-active');
    } else {
      recordingTimeElement.textContent = '0.0';
      recordingTimeElement.classList.remove('warning');
      document.body.classList.remove('recording-active');
    }
    
    // Update loop length
    const loopDuration = window.echoplexEngine.getLoopDuration();
    loopLengthElement.textContent = loopDuration.toFixed(1);
  }
}

// Stop timer updates
function stopTimerUpdates() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Update UI state based on engine state
function updateUIState() {
  if (!window.echoplexEngine) return;
  
  const state = window.echoplexEngine.getState();
  
  // Update transport controls
  const recordButton = document.getElementById('record-button');
  if (recordButton) {
    recordButton.classList.toggle('active', state.isRecording);
    recordButton.textContent = state.isRecording ? 'Stop Recording' : 'Record';
  }
  
  const playButton = document.getElementById('play-button');
  if (playButton) {
    playButton.classList.toggle('active', state.isPlaying);
    playButton.textContent = state.isPlaying ? 'Stop' : 'Play';
  }
  
  const overdubButton = document.getElementById('overdub-button');
  if (overdubButton) {
    overdubButton.classList.toggle('active', state.isOverdubbing);
    overdubButton.textContent = state.isOverdubbing ? 'Stop Overdub' : 'Overdub';
  }
  
  const multiplyButton = document.getElementById('multiply-button');
  if (multiplyButton) {
    multiplyButton.classList.toggle('active', state.isMultiplying);
  }
  
  // Update loop controls
  const reverseButton = document.getElementById('reverse-button');
  if (reverseButton) {
    const currentLoop = state.loops[state.currentLoopIndex];
    reverseButton.classList.toggle('active', currentLoop.isReversed);
  }
  
  const halfSpeedButton = document.getElementById('half-speed-button');
  if (halfSpeedButton) {
    const currentLoop = state.loops[state.currentLoopIndex];
    halfSpeedButton.classList.toggle('active', currentLoop.isHalfSpeed);
  }
  
  const muteButton = document.getElementById('mute-button');
  if (muteButton) {
    const currentLoop = state.loops[state.currentLoopIndex];
    muteButton.classList.toggle('active', currentLoop.isMuted);
  }
  
  // Update loop selector
  const loopDisplay = document.getElementById('current-loop-display');
  if (loopDisplay) {
    loopDisplay.textContent = `Loop ${state.currentLoopIndex + 1}`;
  }
  
  // Update function button
  const functionButton = document.getElementById('function-button');
  if (functionButton) {
    functionButton.classList.toggle('active', state.isFunctionActive);
  }
  
  // Update record mode selector
  const recordModeRadios = document.querySelectorAll('input[name="record-mode"]');
  if (recordModeRadios.length > 0) {
    recordModeRadios.forEach(radio => {
      radio.checked = radio.value === state.recordMode;
    });
  }
}
