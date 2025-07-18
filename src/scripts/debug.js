// ECHOPLEX DEBUG AND DIAGNOSTICS SYSTEM
// Comprehensive debugging interface for the Digital Echoplex

// Dynamic Level LED Color Calculator
function updateLevelLED(ledElement, level) {
  if (!ledElement) return;
  
  // Clamp level between 0 and 1.2 (allow some headroom)
  level = Math.max(0, Math.min(1.2, level));
  
  let r, g, b, intensity;
  
  if (level < 0.05) {
    // Off/Dark
    ledElement.style.backgroundColor = '#333';
    ledElement.style.boxShadow = 'none';
    return;
  }
  
  if (level <= 0.3) {
    // Pure green range
    r = 0;
    g = 255;
    b = 0;
    intensity = level / 0.3;
  } else if (level <= 0.6) {
    // Green to Yellow transition
    const t = (level - 0.3) / 0.3;
    r = Math.floor(255 * t);
    g = 255;
    b = 0;
    intensity = 0.8 + (t * 0.2);
  } else if (level <= 0.8) {
    // Yellow to Orange transition  
    const t = (level - 0.6) / 0.2;
    r = 255;
    g = Math.floor(255 - (100 * t));
    b = 0;
    intensity = 1.0;
  } else if (level <= 1.0) {
    // Orange to Red transition
    const t = (level - 0.8) / 0.2;
    r = 255;
    g = Math.floor(155 - (155 * t));
    b = 0;
    intensity = 1.0 + (t * 0.3);
  } else {
    // Clipping - Pure red with flash
    r = 255;
    g = 0; 
    b = 0;
    intensity = 1.5;
    ledElement.style.animation = 'clipping-flash 0.1s infinite';
  }
  
  const color = `rgb(${r}, ${g}, ${b})`;
  const glowSize = Math.floor(4 + (intensity * 4));
  
  ledElement.style.backgroundColor = color;
  ledElement.style.boxShadow = `0 0 ${glowSize}px ${color}`;
  
  if (level <= 1.0) {
    ledElement.style.animation = 'none';
  }
}

// Main Debug System
window.echoplexDebug = {
  logs: [],
  errors: [],
  tests: [],
  state: {},
  
  log: function(msg) {
    const entry = `[${new Date().toISOString()}] ${msg}`;
    this.logs.push(entry);
    console.log('🔍 DEBUG:', msg);
    
    // Send to CLI if in development
    if (window.location.hostname === 'localhost') {
      this.sendToCLI('LOG', msg);
    }
    
    this.updateDebugDisplay();
  },
  
  error: function(msg, error) {
    let entry = `[${new Date().toISOString()}] ERROR: ${msg}`;
    if (error) entry += ` - ${error.message}`;
    this.errors.push(entry);
    console.error('❌ DEBUG ERROR:', msg, error);
    
    // Send to CLI if in development
    if (window.location.hostname === 'localhost') {
      this.sendToCLI('ERROR', `${msg}${error ? ` - ${error.message}` : ''}`);
    }
    
    this.updateDebugDisplay();
  },
  
  test: function(name, fn) {
    try {
      const result = fn();
      const entry = `✅ ${name}: PASS${result ? ` - ${result}` : ''}`;
      this.tests.push(entry);
      console.log('🧪 TEST:', entry);
    } catch (error) {
      const entry = `❌ ${name}: FAIL - ${error.message}`;
      this.tests.push(entry);
      console.error('🧪 TEST:', entry);
    }
    this.updateDebugDisplay();
  },
  
  updateDebugDisplay: function() {
    const debugPanel = document.getElementById('debug-panel');
    if (debugPanel) {
      const isMinimized = debugPanel.classList.contains('minimized');
      
      if (isMinimized) {
        debugPanel.innerHTML = `
          <div>
            <span>🔍 Debug (${this.errors.length} errors)</span>
            <button onclick="window.echoplexDebug.toggleMinimize()">⬆️</button>
          </div>
        `;
      } else {
        debugPanel.innerHTML = `
          <div>
            <h3>🔍 Debug Console</h3>
            <button onclick="window.echoplexDebug.toggleMinimize()">⬇️</button>
          </div>
          <div class="debug-section">
            <div>Recent: ${this.logs.slice(-2).map(l => `<div>${l.substring(0, 50)}...</div>`).join('')}</div>
          </div>
          <div class="debug-section">
            <div>Errors: ${this.errors.length > 0 ? this.errors.slice(-1)[0].substring(0, 40) + '...' : 'None'}</div>
          </div>
          <div class="debug-actions">
            <button onclick="window.echoplexDebug.runDiagnostics()">🔬 Test</button>
            <button onclick="window.echoplexDebug.exportLogs()">📋 Copy</button>
            <button onclick="window.echoplexDebug.clear()">🧹 Clear</button>
            <button onclick="window.echoplexDebug.hide()">✖️ Hide</button>
          </div>
        `;
      }
    }
  },
  
  toggleMinimize: function() {
    const debugPanel = document.getElementById('debug-panel');
    if (debugPanel) {
      debugPanel.classList.toggle('minimized');
      if (debugPanel.classList.contains('minimized')) {
        debugPanel.style.maxHeight = '30px';
      } else {
        debugPanel.style.maxHeight = '200px';
      }
      this.updateDebugDisplay();
    }
  },
  
  hide: function() {
    const debugPanel = document.getElementById('debug-panel');
    if (debugPanel) {
      debugPanel.style.display = 'none';
    }
    console.log('🔍 Debug panel hidden. To show: window.echoplexDebug.show()');
  },
  
  show: function() {
    const debugPanel = document.getElementById('debug-panel');
    if (debugPanel) {
      debugPanel.style.display = 'block';
      this.updateDebugDisplay();
    }
  },
  
  runDiagnostics: function() {
    this.log('Starting comprehensive diagnostics...');
    
    // Test 1: Basic Dependencies
    this.test('Tone.js Available', () => typeof Tone !== 'undefined' ? 'Loaded' : null);
    this.test('EchoplexDigitalPro Class', () => typeof EchoplexDigitalPro !== 'undefined' ? 'Loaded' : null);
    
    // Test 2: DOM Elements
    this.test('Power Button', () => document.getElementById('power-button') ? 'Found' : null);
    this.test('Main Interface', () => document.querySelector('.main-interface') ? 'Found' : null);
    this.test('Loop Display', () => document.querySelector('.timer-display') ? 'Found' : null);
    
    // Test 3: Echoplex Instance
    if (window.echoplexPro) {
      this.test('Echoplex Instance', () => 'Active');
      this.test('Audio System', () => window.echoplexPro.isAudioReady ? 'Ready' : 'Not Ready');
      this.test('Power State', () => window.echoplexPro.state?.power ? 'ON' : 'OFF');
      this.test('Loop Time', () => `${window.echoplexPro.state?.loopTime || 0}s`);
      
      // Test 4: Audio Context
      if (window.echoplexPro.audioContext) {
        this.test('Audio Context State', () => window.echoplexPro.audioContext.state);
        this.test('Sample Rate', () => `${window.echoplexPro.audioContext.sampleRate}Hz`);
      }
      
      // Test 5: MIDI System
      this.test('MIDI Clock System', () => window.echoplexPro.midiClockSystem ? 'Initialized' : 'Missing');
      this.test('Clock Receiver', () => window.echoplexPro.clockReceiver ? 'Initialized' : 'Missing');
    } else {
      this.test('Echoplex Instance', () => null);
    }
    
    // Test 6: Browser Capabilities
    this.test('Web Audio Support', () => 'AudioContext' in window || 'webkitAudioContext' in window ? 'Supported' : null);
    this.test('MIDI Support', () => 'requestMIDIAccess' in navigator ? 'Supported' : 'Not Supported');
    this.test('Media Devices', () => navigator.mediaDevices ? 'Available' : 'Not Available');
    
    this.log('Diagnostics complete');
  },
  
  exportLogs: function() {
    const report = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      logs: this.logs,
      errors: this.errors,
      tests: this.tests,
      echoplexState: window.echoplexPro?.state || null,
      audioContext: window.echoplexPro?.audioContext ? {
        state: window.echoplexPro.audioContext.state,
        sampleRate: window.echoplexPro.audioContext.sampleRate
      } : null
    };
    
    // Save to file for CLI access (if on localhost)
    if (window.location.hostname === 'localhost') {
      try {
        // Try to save debug data that CLI can read
        fetch('/api/debug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report)
        }).catch(() => {
          // Fallback: save to localStorage
          localStorage.setItem('echoplex_debug_export', JSON.stringify(report, null, 2));
          console.log('💾 Debug data saved to localStorage (CLI can read)');
        });
      } catch (error) {
        localStorage.setItem('echoplex_debug_export', JSON.stringify(report, null, 2));
      }
    }
    
    const reportText = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(reportText).then(() => {
      alert('Debug report copied to clipboard! Also saved for CLI access.');
    });
  },
  
  clear: function() {
    this.logs = [];
    this.errors = [];
    this.tests = [];
    this.updateDebugDisplay();
  },

  sendToCLI: function(type, message) {
    // This could be expanded to send to a CLI debug endpoint
    // For now, just console output
    console.log(`[CLI-${type}]`, message);
  }
};

// Initialize debug system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.echoplexDebug.log('DOM loaded, checking dependencies...');
  window.echoplexDebug.log(`Tone.js available: ${typeof Tone !== 'undefined'}`);
  window.echoplexDebug.log(`EchoplexDigitalPro class available: ${typeof EchoplexDigitalPro !== 'undefined'}`);
  
  // Initialize Echoplex if not already done
  if (typeof window.echoplexPro === 'undefined') {
    try {
      window.echoplexDebug.log('Creating Echoplex Digital Pro Plus instance...');
      window.echoplexPro = new EchoplexDigitalPro();
      window.echoplexDebug.log('✅ Echoplex Digital Pro Plus ready!');
      
      // Immediately test the power button connection
      const powerButton = document.getElementById('power-button');
      if (powerButton) {
        window.echoplexDebug.log('Power button found and connected');
        
        // Add diagnostic button for testing
        powerButton.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          window.echoplexPro.runDiagnostics();
        });
        
        // Test power button click manually
        powerButton.addEventListener('click', () => {
          window.echoplexDebug.log(`Power button clicked! Current state: ${window.echoplexPro.state.power}`);
        });
      } else {
        window.echoplexDebug.error('❌ Power button not found!');
      }
      
    } catch (error) {
      window.echoplexDebug.error('❌ Failed to initialize Echoplex', error);
      // Show error to user
      const powerButton = document.getElementById('power-button');
      if (powerButton) {
        powerButton.addEventListener('click', () => {
          alert(`Echoplex initialization failed:\n${error.message}\n\nPlease refresh the page and ensure:\n- Microphone permissions\n- Audio is not muted\n- Browser supports Web Audio`);
        });
      }
    }
  }
  
  // Add debug panel to interface
  setTimeout(() => {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      width: 300px;
      max-height: 200px;
      background: rgba(0,0,0,0.8);
      color: #0f0;
      font-family: monospace;
      font-size: 10px;
      padding: 5px;
      border: 1px solid #0f0;
      border-radius: 3px;
      overflow-y: auto;
      z-index: 10000;
      opacity: 0.7;
      transition: opacity 0.3s;
    `;
    
    // Make it less intrusive - fade out after a few seconds
    debugPanel.addEventListener('mouseenter', () => debugPanel.style.opacity = '1');
    debugPanel.addEventListener('mouseleave', () => debugPanel.style.opacity = '0.7');
    document.body.appendChild(debugPanel);
    window.echoplexDebug.updateDebugDisplay();
    window.echoplexDebug.runDiagnostics();
  }, 100);
});

// Export for module use
export { updateLevelLED };