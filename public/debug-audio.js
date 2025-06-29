// Debug script for audio recording issues
console.log('=== Audio Debug Script Loaded ===');

// Check browser support
console.log('MediaDevices supported:', !!navigator.mediaDevices);
console.log('getUserMedia supported:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
console.log('MediaRecorder supported:', typeof MediaRecorder !== 'undefined');

// Override getUserMedia to log calls
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    
    navigator.mediaDevices.getUserMedia = async function(constraints) {
        console.log('getUserMedia called with constraints:', constraints);
        try {
            const stream = await originalGetUserMedia(constraints);
            console.log('getUserMedia success! Stream tracks:', stream.getTracks().map(t => ({
                kind: t.kind,
                label: t.label,
                enabled: t.enabled,
                muted: t.muted,
                readyState: t.readyState
            })));
            return stream;
        } catch (error) {
            console.error('getUserMedia failed:', error.name, error.message);
            throw error;
        }
    };
}

// Override MediaRecorder to log activity
if (typeof MediaRecorder !== 'undefined') {
    const OriginalMediaRecorder = MediaRecorder;
    
    window.MediaRecorder = function(stream, options) {
        console.log('MediaRecorder created with options:', options);
        const recorder = new OriginalMediaRecorder(stream, options);
        
        // Log state changes
        const originalStart = recorder.start.bind(recorder);
        recorder.start = function(timeslice) {
            console.log('MediaRecorder.start() called, timeslice:', timeslice);
            return originalStart(timeslice);
        };
        
        const originalStop = recorder.stop.bind(recorder);
        recorder.stop = function() {
            console.log('MediaRecorder.stop() called');
            return originalStop();
        };
        
        // Log data availability
        const originalOnDataAvailable = recorder.ondataavailable;
        recorder.ondataavailable = function(event) {
            console.log('MediaRecorder data available, size:', event.data.size);
            if (originalOnDataAvailable) {
                originalOnDataAvailable.call(this, event);
            }
        };
        
        return recorder;
    };
}

console.log('=== Debug script setup complete ===');