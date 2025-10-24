# MP3 Transcription API Guide

This guide provides comprehensive documentation for frontend developers on how to use the MP3 transcription endpoints in the Meeting Agent API.

## Overview

The MP3 transcription service allows you to upload audio files and receive text transcriptions using OpenAI's Whisper AI model. This service supports multiple audio formats and provides detailed metadata about the transcription process.

## Base URL

```
http://localhost:8000/audio/mp3-transcription
```

## Authentication

Currently, no authentication is required. Ensure your OpenAI API key is configured in the backend environment variables.

## Endpoints

### 1. Transcribe Audio File

**Endpoint:** `POST /audio/mp3-transcription/transcribe`

**Description:** Upload an audio file and receive a text transcription.

#### Request

**Content-Type:** `multipart/form-data`

**Parameters:**
- `file` (required): Audio file to transcribe

**Supported Formats:**
- MP3 (.mp3)
- MP4 (.mp4)
- MPEG (.mpeg)
- MPGA (.mpga)
- M4A (.m4a)
- WAV (.wav)
- WEBM (.webm)

**File Size Limit:** 25MB (OpenAI Whisper API limit)

#### Response

**Success (200):**
```json
{
  "transcription": "Hello, this is a sample transcription of the audio file.",
  "duration_seconds": null,
  "file_size_mb": 2.45,
  "processing_time_seconds": 3.21,
  "error": null
}
```

**Error (400 - Unsupported Format):**
```json
{
  "detail": "Unsupported file format. Supported formats: mp3, mp4, mpeg, mpga, m4a, wav, webm"
}
```

**Error (413 - File Too Large):**
```json
{
  "detail": "File too large. Maximum size: 25MB"
}
```

**Error (500 - Processing Error):**
```json
{
  "transcription": "",
  "duration_seconds": null,
  "file_size_mb": 2.45,
  "processing_time_seconds": 1.23,
  "error": "Transcription failed: [error details]"
}
```

### 2. Get Supported Formats

**Endpoint:** `GET /audio/mp3-transcription/supported-formats`

**Description:** Retrieve list of supported audio formats and file size limits.

#### Response

```json
{
  "supported_formats": ["mp3", "mp4", "mpeg", "mpga", "m4a", "wav", "webm"],
  "max_file_size_mb": 25,
  "description": "Supported audio formats for transcription using OpenAI Whisper"
}
```

### 3. Health Check

**Endpoint:** `GET /audio/mp3-transcription/health`

**Description:** Check if the transcription service is operational.

#### Response

```json
{
  "status": "healthy",
  "service": "mp3-transcription",
  "description": "Audio transcription service using OpenAI Whisper API"
}
```

## Frontend Implementation Examples

### JavaScript/Fetch API

```javascript
async function transcribeAudio(audioFile) {
  const formData = new FormData();
  formData.append('file', audioFile);

  try {
    const response = await fetch('http://localhost:8000/audio/mp3-transcription/transcribe', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('Transcription failed:', error);
    throw error;
  }
}

// Usage example
const fileInput = document.getElementById('audioFile');
const file = fileInput.files[0];

transcribeAudio(file)
  .then(result => {
    console.log('Transcription:', result.transcription);
    console.log('Processing time:', result.processing_time_seconds + 's');
    console.log('File size:', result.file_size_mb + 'MB');
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

### React Hook Example

```jsx
import { useState } from 'react';

const useAudioTranscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const transcribe = async (file) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/audio/mp3-transcription/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Transcription failed');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { transcribe, isLoading, error, result };
};

// Component usage
const AudioTranscriber = () => {
  const { transcribe, isLoading, error, result } = useAudioTranscription();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await transcribe(file);
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".mp3,.mp4,.mpeg,.mpga,.m4a,.wav,.webm"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      
      {isLoading && <p>Transcribing audio...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      {result && (
        <div>
          <h3>Transcription Result:</h3>
          <p>{result.transcription}</p>
          <small>
            Processing time: {result.processing_time_seconds}s | 
            File size: {result.file_size_mb}MB
          </small>
        </div>
      )}
    </div>
  );
};
```

### File Validation Function

```javascript
async function validateAudioFile(file) {
  // Check if file exists
  if (!file) {
    throw new Error('No file selected');
  }

  // Get supported formats
  const response = await fetch('http://localhost:8000/audio/mp3-transcription/supported-formats');
  const formatInfo = await response.json();

  // Check file size (25MB limit)
  const maxSizeBytes = formatInfo.max_file_size_mb * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File too large. Maximum size: ${formatInfo.max_file_size_mb}MB`);
  }

  // Check file format
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!formatInfo.supported_formats.includes(fileExtension)) {
    throw new Error(`Unsupported format. Supported: ${formatInfo.supported_formats.join(', ')}`);
  }

  return true;
}
```

## Error Handling

### Common Error Scenarios

1. **File too large (413)**
   - Check file size before upload
   - Implement client-side validation
   - Provide user feedback about size limits

2. **Unsupported format (400)**
   - Validate file extension on client-side
   - Use the `/supported-formats` endpoint for dynamic validation
   - Provide clear error messages to users

3. **No file provided (400)**
   - Ensure file input is not empty
   - Validate file selection before submission

4. **OpenAI API errors (500)**
   - Handle network timeouts gracefully
   - Implement retry logic for temporary failures
   - Display user-friendly error messages

### Best Practices

1. **File Validation:**
   - Always validate files on the client-side before upload
   - Use the `/supported-formats` endpoint for dynamic validation
   - Provide real-time feedback during file selection

2. **User Experience:**
   - Show upload progress if possible
   - Display processing time estimates
   - Provide clear error messages and resolution steps

3. **Performance:**
   - Consider compressing large audio files before upload
   - Implement client-side file size checks
   - Show loading states during transcription

4. **Security:**
   - Validate file types on both client and server
   - Implement rate limiting if needed
   - Don't expose sensitive error details to users

## Integration with Other Services

The MP3 transcription service can be combined with other API endpoints:

1. **Meeting Agent Integration:**
   - Transcribe recorded meeting audio
   - Use `/agent/analyze` to check transcriptions for triggers
   - Use `/agent/question` to ask questions about transcribed content

2. **Document Analysis Integration:**
   - Transcribe audio meeting notes
   - Generate GitHub Copilot prompts from transcribed content

## Rate Limits and Considerations

- OpenAI Whisper API has usage limits based on your plan
- Large files take longer to process
- Consider implementing queuing for multiple file uploads
- Monitor API usage to avoid exceeding quotas

## Testing

Test the API using curl:

```bash
# Test transcription
curl -X POST "http://localhost:8000/audio/mp3-transcription/transcribe" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample.mp3"

# Test supported formats
curl -X GET "http://localhost:8000/audio/mp3-transcription/supported-formats" \
  -H "accept: application/json"

# Test health check
curl -X GET "http://localhost:8000/audio/mp3-transcription/health" \
  -H "accept: application/json"
```

## Interactive API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger documentation where you can:
- Test endpoints directly in the browser
- See detailed request/response schemas
- Download OpenAPI specification
- Access example requests and responses
