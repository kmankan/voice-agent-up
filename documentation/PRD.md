# Up Bank Voice Assistant PRD

## Project Overview

A dual-purpose voice assistant that showcases technical capabilities while demonstrating deep integration with Up Bank's ecosystem. The assistant combines a brand ambassador role (using scraped Up content) with personal banking features (using Up's Open Banking API).

### Project Goals

- Create a functional voice assistant that impresses Up Bank's technical team
- Demonstrate modern tech stack expertise (Next.js, ElysiaJS, Socket.io)
- Showcase effective use of multiple AI services
- Implement real banking features using Up's API

### Timeline

- 2-3 days total development time
- Day 1: Core infrastructure and basic voice pipeline
- Day 2: Banking integration and UI
- Day 3: Polish and testing

## Core Features

### 1. Brand Ambassador Mode

The assistant should be able to:

- Engage in natural conversations about Up Bank's products and services
- Answer questions using pre-scraped website content
- Maintain context throughout the conversation
- Respond with a friendly, on-brand voice

### 2. Banking Assistant Mode

The assistant should:

- Authenticate with Up's API using user-provided API key
- Provide basic account information (balances, recent transactions)
- Handle simple banking queries through voice
- Maintain user privacy and security

## Technical Architecture

### Frontend (Next.js on Vercel)

Components:

- Voice recording and playback interface
- Real-time transcription display
- Mode switching (Brand/Banking)
- Simple API key input form
- Account information display
- Real-time conversation history

### Backend (ElysiaJS/Bun on Railway)

Services:

- Socket.io server for real-time communication
- Speech-to-text processing (Groq Whispr)
- LLM orchestration (OpenRouter)
- Text-to-speech generation (Cartesia/ElevenLabs)
- Up API integration
- Vector database queries (NeonDB/pgvector)

### Data Storage (NeonDB)

Schema:

- Conversation history
- Vector embeddings of Up content
- User session management
- (No permanent storage of banking credentials)

## Implementation Phases

### Day 1: Core Infrastructure

1. Set up project scaffolding

   - Next.js frontend with basic UI
   - ElysiaJS backend with Socket.io
   - Database connection

2. Implement voice pipeline
   - Audio recording/streaming
   - STT integration
   - Basic LLM response
   - TTS playback

### Day 2: Banking Integration

1. Up API integration

   - API key management
   - Basic banking queries
   - Account information display

2. Conversation flows
   - Brand ambassador responses
   - Banking command recognition
   - Error handling

### Day 3: Polish

1. UI/UX improvements
2. Testing and bug fixes
3. Performance optimization
4. Documentation

## Technical Requirements

### Frontend

- Real-time audio streaming
- WebSocket connection management
- Responsive design
- Error state handling
- Loading states and feedback

### Backend

- Stream processing
- API rate limiting
- Error handling
- Session management
- Service orchestration

### APIs and Services

- Groq Cloud API (Whispr-Large-v3)
- OpenRouter API
- Cartesia/ElevenLabs API
- Up Banking API
- Socket.io
- NeonDB with pgvector

## MVP Features vs Nice-to-Have

### MVP (Must Have)

- Voice input/output
- Basic Up Bank information queries
- Account balance checking
- Recent transaction listing
- Simple brand-related questions

### Nice-to-Have

- Context-aware conversations
- Multi-turn dialogues
- Transaction categorization
- Spending insights
- Voice authentication

## Success Metrics

- Functional voice interaction
- Accurate response to banking queries
- Sub-2 second response time
- Proper error handling
- Clean, professional UI

## Known Limitations

- Limited testing time
- Basic security implementation
- Limited conversation context
- Potential API rate limits
- Limited error recovery

## Documentation Requirements

- Basic setup instructions
- API key configuration
- Example queries/commands
- Architecture overview
- Future improvement suggestions

This PRD prioritizes features that can be realistically implemented in 2-3 days while still creating an impressive demonstration of technical capabilities and Up Bank integration.
