# Meeting Agent API Client Guide

This guide provides complete instructions for integrating with the Meeting Agent API from any client application.

## 🚀 Getting Started

### Prerequisites
- Meeting Agent API server running on `http://localhost:8000`
- Valid OpenAI API key and Pushbullet API key configured in the server's `.env` file
- HTTP client capable of making REST API calls

### Base URL
```
http://localhost:8000
```

## 📋 API Endpoints Overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Server health check |
| POST | `/agent/start` | Start audio recording session |
| POST | `/agent/stop` | Stop audio recording session |
| GET | `/agent/status` | Get current session status |
| GET | `/agent/transcript` | Get transcript and alerts |
| POST | `/agent/analyze` | Analyze text without recording |

## 🔧 Detailed API Reference

### 1. Health Check
**GET /**

Check if the API server is running.

**Response:**
```json
{
  "message": "Meeting Agent API",
  "version": "1.0.0",
  "endpoints": {
    "start": "POST /agent/start - Start recording session",
    "stop": "POST /agent/stop - Stop recording session",
    "status": "GET /agent/status - Get session status",
    "transcript": "GET /agent/transcript - Get transcript and alerts",
    "analyze": "POST /agent/analyze - Analyze text for triggers"
  }
}
```

### 2. Start Recording Session
**POST /agent/start**

Begin audio recording and real-time analysis.

**Request Body:**
```json
{
  "user_name": "Tomás",
  "chunk_duration": 20,
  "sample_rate": 16000
}
```

**Parameters:**
- `user_name` (optional, default: "Tomás") - Name of the person to monitor
- `chunk_duration` (optional, default: 20) - Audio chunk duration in seconds
- `sample_rate` (optional, default: 16000) - Audio sample rate in Hz

**Response:**
```json
{
  "status": "success",
  "message": "Meeting agent started successfully",
  "error": null
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Session already running",
  "error": "Detailed error description"
}
```

### 3. Stop Recording Session
**POST /agent/stop**

Stop the current audio recording session.

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "status": "success",
  "message": "Meeting agent stopped successfully",
  "error": null
}
```

### 4. Get Session Status
**GET /agent/status**

Check if a recording session is currently active.

**Response:**
```json
{
  "status": "active",
  "message": "Session is active",
  "error": null
}
```

**Status Values:**
- `"active"` - Recording session is running
- `"inactive"` - No active recording session
- `"error"` - Error occurred

### 5. Get Transcript and Alerts
**GET /agent/transcript**

Retrieve the complete transcript and all generated alerts.

**Response:**
```json
{
  "transcript": "Complete meeting transcript content...",
  "alerts": "## 🚨 Alert at 2025-08-26 14:30:15\n\n**Summary:** Tomás was asked a question...",
  "error": null
}
```

**Response Fields:**
- `transcript` - Complete meeting transcript (markdown format)
- `alerts` - All alerts with timestamps and suggested responses (markdown format)
- `error` - Error message if any issues occurred

### 6. Analyze Text (Without Recording)
**POST /agent/analyze**

Analyze a text snippet for triggers without starting a full recording session.

**Request Body:**
```json
{
  "text": "Tomás, can you prepare the presentation for tomorrow?",
  "user_name": "Tomás"
}
```

**Response:**
```json
{
  "trigger": true,
  "summary": "Tomás was assigned a task to prepare a presentation",
  "response": "I can help prepare the presentation for tomorrow. What specific topics should be covered?",
  "error": null
}
```

## 🔄 Client Implementation Examples

### Python Client Example
```python
import requests
import time

class MeetingAgentClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
    
    def start_session(self, user_name="Tomás"):
        response = requests.post(f"{self.base_url}/agent/start", 
                               json={"user_name": user_name})
        return response.json()
    
    def stop_session(self):
        response = requests.post(f"{self.base_url}/agent/stop", json={})
        return response.json()
    
    def get_status(self):
        response = requests.get(f"{self.base_url}/agent/status")
        return response.json()
    
    def get_transcript(self):
        response = requests.get(f"{self.base_url}/agent/transcript")
        return response.json()
    
    def analyze_text(self, text, user_name="Tomás"):
        response = requests.post(f"{self.base_url}/agent/analyze",
                               json={"text": text, "user_name": user_name})
        return response.json()

# Usage
client = MeetingAgentClient()
client.start_session("John")
time.sleep(60)  # Let it record for a minute
transcript = client.get_transcript()
client.stop_session()
```

### JavaScript/Node.js Client Example
```javascript
class MeetingAgentClient {
    constructor(baseUrl = 'http://localhost:8000') {
        this.baseUrl = baseUrl;
    }
    
    async startSession(userName = 'Tomás') {
        const response = await fetch(`${this.baseUrl}/agent/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_name: userName })
        });
        return await response.json();
    }
    
    async stopSession() {
        const response = await fetch(`${this.baseUrl}/agent/stop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        return await response.json();
    }
    
    async getStatus() {
        const response = await fetch(`${this.baseUrl}/agent/status`);
        return await response.json();
    }
    
    async getTranscript() {
        const response = await fetch(`${this.baseUrl}/agent/transcript`);
        return await response.json();
    }
}

// Usage
const client = new MeetingAgentClient();
await client.startSession('John');
const transcript = await client.getTranscript();
```

### cURL Examples
```bash
# Start session
curl -X POST http://localhost:8000/agent/start \
  -H "Content-Type: application/json" \
  -d '{"user_name": "Tomás"}'

# Get transcript
curl http://localhost:8000/agent/transcript

# Stop session
curl -X POST http://localhost:8000/agent/stop \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 📝 File-Based Monitoring

The API also writes real-time data to files:

### Transcript File: `meeting_log.md`
- Contains the complete meeting transcript
- Updates in real-time as audio is processed
- Plain text format with timestamps

### Alerts File: `meeting_alerts.md`
- Contains only the important alerts
- Formatted in markdown with:
  - Timestamp of each alert
  - Summary of what triggered the alert
  - AI-suggested response

### File Monitoring Example
```python
import time
import os

def monitor_files():
    transcript_file = "meeting_log.md"
    alerts_file = "meeting_alerts.md"
    
    last_transcript_size = 0
    last_alerts_size = 0
    
    while True:
        # Check transcript file
        if os.path.exists(transcript_file):
            current_size = os.path.getsize(transcript_file)
            if current_size > last_transcript_size:
                with open(transcript_file, 'r') as f:
                    content = f.read()
                    # Process new transcript content
                last_transcript_size = current_size
        
        # Check alerts file
        if os.path.exists(alerts_file):
            current_size = os.path.getsize(alerts_file)
            if current_size > last_alerts_size:
                with open(alerts_file, 'r') as f:
                    content = f.read()
                    # Process new alerts
                last_alerts_size = current_size
        
        time.sleep(5)  # Check every 5 seconds
```

## ⚡ Real-Time Integration Patterns

### 1. Polling Pattern
Poll the `/agent/transcript` endpoint every 30-60 seconds:

```python
import time

def poll_transcript():
    while session_active:
        transcript = client.get_transcript()
        if transcript['transcript']:
            process_transcript(transcript['transcript'])
        if transcript['alerts']:
            handle_alerts(transcript['alerts'])
        time.sleep(30)
```

### 2. File Watching Pattern
Monitor the markdown files for real-time updates:

```python
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class TranscriptHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith('meeting_log.md'):
            # Process new transcript content
            pass
        elif event.src_path.endswith('meeting_alerts.md'):
            # Handle new alerts
            pass
```

### 3. Hybrid Pattern
Combine API calls with file monitoring for optimal performance.

## 🚨 Error Handling

### Common Error Scenarios
1. **Server not running**: Connection refused
2. **Session already active**: Starting when already started
3. **No active session**: Trying to stop when not started
4. **API key issues**: Invalid OpenAI or Pushbullet keys
5. **Audio device issues**: Microphone not available

### Error Response Format
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "error": "Detailed technical error description"
}
```

### Recommended Error Handling
```python
try:
    response = client.start_session()
    if response['status'] == 'error':
        print(f"Error: {response['message']}")
        # Handle specific error cases
except requests.exceptions.ConnectionError:
    print("Server is not running")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## 🔒 Security Considerations

1. **API Keys**: Ensure OpenAI and Pushbullet keys are properly configured
2. **Network**: API runs on localhost by default (secure for local use)
3. **Audio Privacy**: Audio is processed locally, not stored permanently
4. **File Permissions**: Ensure proper read/write access to log files

## 📊 Performance Notes

- **Audio Processing**: 20-second chunks by default (configurable)
- **API Response Time**: Typically < 100ms for status/transcript calls
- **Transcription Delay**: 2-5 seconds per audio chunk
- **Memory Usage**: Moderate (depends on transcript length)
- **File Growth**: Transcript files grow continuously during sessions

## 🔧 Configuration Options

When starting a session, you can customize:

```json
{
  "user_name": "Your Name",
  "chunk_duration": 30,     // 10-60 seconds recommended
  "sample_rate": 16000      // 16000 or 44100 Hz
}
```

**Chunk Duration Guidelines:**
- **10-15 seconds**: More responsive, higher API usage
- **20-25 seconds**: Balanced (recommended)
- **30-60 seconds**: Less responsive, lower API usage
