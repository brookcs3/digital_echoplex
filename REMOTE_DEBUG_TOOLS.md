# Remote Debug Tools Installation Guide

## Overview
This guide shows how to install and use the built-in debugging tools for the Echoplex Digital Pro Plus emulation.

## What Gets Installed
- **Real-time debug console** in the browser
- **Automated testing suite** that runs diagnostics
- **Error tracking and logging** system
- **Export functionality** to share debug reports

## Installation Steps

### 1. Debug System is Already Installed
The debug tools are automatically added to `src/pages/index.astro` and will appear when you refresh the page.

### 2. Using the Debug Panel

#### Visual Debug Panel
- **Location**: Top-right corner of the browser window
- **Appearance**: Green text on black background (hacker-style)
- **Auto-updates**: Shows real-time logs, errors, and test results

#### Available Functions

```javascript
// In browser console, you can use:
window.echoplexDebug.log('Custom message');           // Add log entry
window.echoplexDebug.error('Error message', error);   // Add error entry  
window.echoplexDebug.runDiagnostics();               // Run full test suite
window.echoplexDebug.exportLogs();                   // Copy debug report
window.echoplexDebug.clear();                        // Clear all logs
```

### 3. What the Diagnostics Test

#### Basic Dependencies
- ✅ Tone.js library loaded
- ✅ EchoplexDigitalPro class available
- ✅ DOM elements present

#### Echoplex Instance
- ✅ Instance created successfully
- ✅ Audio system status
- ✅ Power state (ON/OFF)
- ✅ Current loop time

#### Audio System
- ✅ Audio context state
- ✅ Sample rate
- ✅ MIDI system status

#### Browser Capabilities
- ✅ Web Audio support
- ✅ MIDI API support
- ✅ Media devices availability

### 4. Using Debug Features

#### Button Actions in Debug Panel
- **🔬 Run Full Diagnostics**: Tests all systems
- **📋 Copy Debug Info**: Exports complete report to clipboard
- **🧹 Clear**: Clears all logs and test results

#### Right-Click Power Button
- Right-click the Echoplex power button to run additional diagnostics

### 5. Sharing Debug Reports

1. Click **📋 Copy Debug Info** in the debug panel
2. Paste the JSON report in a message/email
3. Report contains:
   - Timestamp and browser info
   - All logs and errors
   - Test results
   - Current Echoplex state

### 6. Debug Report Example

```json
{
  "timestamp": "2025-06-27T22:15:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "logs": [
    "[2025-06-27T22:15:00.000Z] DOM loaded, checking dependencies...",
    "[2025-06-27T22:15:00.001Z] ✅ Echoplex Digital Pro Plus ready!"
  ],
  "errors": [],
  "tests": [
    "✅ Tone.js Available: PASS - Loaded",
    "✅ Power Button: PASS - Found",
    "❌ Audio System: FAIL - Not Ready"
  ],
  "echoplexState": {
    "power": false,
    "loopTime": 0,
    "isRecording": false
  }
}
```

## Troubleshooting

### Debug Panel Not Showing
- Refresh the page
- Check browser console for errors
- Ensure JavaScript is enabled

### Tests Failing
- Each test shows specific failure reason
- Use the detailed logs to identify issues
- Export and share the debug report

### Performance Impact
- Debug tools are lightweight
- Can be disabled by removing the debug panel creation code
- No impact on core Echoplex functionality

## For Developers

### Adding Custom Tests
```javascript
window.echoplexDebug.test('My Test', () => {
  // Test logic here
  return someValue ? 'Success' : null;
});
```

### Adding Custom Logs
```javascript
window.echoplexDebug.log('Custom diagnostic info');
window.echoplexDebug.error('Something went wrong', errorObject);
```

### Integration with Echoplex Code
The debug system automatically hooks into:
- Initialization process
- Power button clicks  
- Error handling
- State changes

## Benefits

✅ **No more "it doesn't work" messages**  
✅ **Clear diagnostic information**  
✅ **Automated testing**  
✅ **Easy error reporting**  
✅ **Real-time status monitoring**  
✅ **Professional debugging workflow**  

## Next Steps

1. Refresh the Echoplex page
2. Look for the debug panel in the top-right
3. Click "🔬 Run Full Diagnostics"
4. If issues occur, click "📋 Copy Debug Info" and share the report

This replaces manual testing with automated diagnostics that give instant visibility into what's working and what isn't!