# Voice Assistant Streaming Architecture

## Overview
This document details the real-time streaming architecture for the Up Bank voice assistant, based on the system diagram provided and technical requirements.

## Components

### 1. Audio Streaming Pipeline

#### Client-Side Audio Handling
```typescript
// Audio Recording
const startRecording = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.ondataavailable = (e) => {
        socket.emit('audioData', e.data)
      }
      mediaRecorder.start(100) // Stream in 100ms chunks
    })
}

// Audio Playback
const playResponse = (audioBlob: Blob) => {
  const audio = new Audio(URL.createObjectURL(audioBlob))
  audio.play()
}
```

### 2. WebSocket Communication

#### Socket.io Events
```typescript
// Client Setup
const socket = io('wss://your-backend.railway.app', {
  transports: ['websocket'],
  reconnection: true
})

// Server Setup (ElysiaJS)
import { Elysia } from 'elysia'
import { Server } from 'socket.io'

const app = new Elysia()
const io = new Server()

io.on('connection', (socket) => {
  socket.on('audioData', handleAudioStream)
  socket.on('bankingQuery', handleBankingQuery)
})
```

### 3. Stream Processing Pipeline

#### Speech-to-Text (Groq Whispr)
```typescript
const handleAudioStream = async (audioChunk: Buffer) => {
  const transcription = await groqClient.audio.transcriptions.create({
    file: audioChunk,
    model: "whisper-large-v3-turbo"
  })
  return transcription.text
}
```

#### Text Processing (OpenRouter)
```typescript
const processText = async (text: string, context: ConversationContext) => {
  const completion = await openRouter.chat.completions.create({
    messages: [
      { role: 'system', content: getSystemPrompt(context) },
      { role: 'user', content: text }
    ],
    stream: true
  })
  
  return completion
}
```

#### Text-to-Speech (Cartesia/ElevenLabs)
```typescript
const generateSpeech = async (text: string) => {
  const audioStream = await elevenlabs.generate({
    text,
    voiceId: process.env.VOICE_ID,
    streamResponse: true
  })
  
  return audioStream
}
```

## Stream Processing Flow

1. **Audio Input**
   - Client captures audio in chunks
   - Streams via Socket.io to backend
   - Handles microphone permissions and recording states

2. **Real-time Processing**
   - Backend receives audio chunks
   - Processes through Groq Whispr for transcription
   - Routes text to appropriate handler (brand or banking)

3. **Response Generation**
   - Processes text through OpenRouter
   - Generates audio response with ElevenLabs
   - Streams response back to client

4. **Banking Integration**
   - Parallel processing of banking queries
   - Secure API key handling
   - Real-time account data fetching

## Error Handling

```typescript
const handleStreamError = (error: Error, socket: Socket) => {
  if (error.name === 'AudioStreamError') {
    socket.emit('error', {
      type: 'audio',
      message: 'Audio streaming failed. Please try again.'
    })
  } else if (error.name === 'ProcessingError') {
    socket.emit('error', {
      type: 'processing',
      message: 'Could not process your request.'
    })
  }
  // Log error for debugging
  console.error('Stream Error:', error)
}
```

## Performance Considerations

1. **Chunk Size**
   - Audio chunks: 100ms
   - Text streaming: Character-by-character
   - Response buffering: 500ms

2. **Reconnection Strategy**
   - Automatic reconnection enabled
   - Exponential backoff
   - Maximum 3 retry attempts

3. **Resource Management**
   - Audio stream cleanup
   - Socket connection pooling
   - Memory usage monitoring

## Security Notes

While this is a demonstration project, basic security measures are implemented:

1. WebSocket connection over WSS only
2. Basic rate limiting on audio streams
3. No permanent storage of sensitive data
4. API keys transmitted securely

## Testing Strategy

1. **Unit Tests**
   - Audio processing functions
   - Stream handling
   - API integrations

2. **Integration Tests**
   - End-to-end audio pipeline
   - Banking query flow
   - Error recovery

3. **Manual Testing**
   - Voice interaction
   - Response quality
   - Latency checking