#!/usr/bin/env node

// Echoplex Debug CLI Monitor
// Run with: node debug-cli.js

const fs = require('fs');
const path = require('path');

const DEBUG_LOG = path.join(__dirname, 'debug.log');
const BROWSER_LOG = path.join(__dirname, 'browser-debug.json');

console.log('🔍 Echoplex Debug CLI Monitor');
console.log('📁 Debug log:', DEBUG_LOG);
console.log('📁 Browser data:', BROWSER_LOG);
console.log('');

// Watch the debug log file
if (fs.existsSync(DEBUG_LOG)) {
  console.log('📖 Watching debug log...');
  fs.watchFile(DEBUG_LOG, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
      console.log('📝 Log updated:', new Date().toISOString());
      // Show last few lines
      const content = fs.readFileSync(DEBUG_LOG, 'utf8');
      const lines = content.split('\n');
      console.log(lines.slice(-3).join('\n'));
      console.log('---');
    }
  });
} else {
  console.log('⚠️  Debug log not found, creating...');
  fs.writeFileSync(DEBUG_LOG, `# Debug log started at ${new Date().toISOString()}\n`);
}

// Function to read browser debug data
function readBrowserDebug() {
  if (fs.existsSync(BROWSER_LOG)) {
    try {
      const data = JSON.parse(fs.readFileSync(BROWSER_LOG, 'utf8'));
      console.log('🌐 Browser Debug Data:');
      console.log('  Timestamp:', data.timestamp);
      console.log('  Errors:', data.errors.length);
      console.log('  Tests:', data.tests.length);
      console.log('  Power State:', data.echoplexState?.power || 'Unknown');
      console.log('  Audio Ready:', data.echoplexState?.isAudioReady || 'Unknown');
      console.log('');
    } catch (error) {
      console.error('❌ Failed to read browser debug data:', error.message);
    }
  }
}

// Commands
process.stdin.setEncoding('utf8');
console.log('💻 Commands:');
console.log('  "status" - Show current debug status');
console.log('  "browser" - Read browser debug data');
console.log('  "clear" - Clear debug log');
console.log('  "quit" - Exit monitor');
console.log('');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    const command = chunk.trim().toLowerCase();
    
    switch (command) {
      case 'status':
        console.log('📊 Debug Status:');
        console.log('  Log file exists:', fs.existsSync(DEBUG_LOG));
        console.log('  Browser data exists:', fs.existsSync(BROWSER_LOG));
        console.log('  Current time:', new Date().toISOString());
        break;
        
      case 'browser':
        readBrowserDebug();
        break;
        
      case 'clear':
        fs.writeFileSync(DEBUG_LOG, `# Debug log cleared at ${new Date().toISOString()}\n`);
        console.log('🧹 Debug log cleared');
        break;
        
      case 'quit':
      case 'exit':
        console.log('👋 Exiting debug monitor');
        process.exit(0);
        break;
        
      default:
        console.log('❓ Unknown command:', command);
        break;
    }
  }
});

console.log('✅ Debug monitor ready. Type commands or watch for log updates...');