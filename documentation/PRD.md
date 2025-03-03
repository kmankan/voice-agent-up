# Up Bank Voice Assistant PRD

## Project Overview

A dual-purpose voice assistant that showcases technical capabilities while demonstrating deep integration with Up Bank's ecosystem. The assistant combines a brand ambassador role (using scraped Up content) with personal banking features (using Up's Open Banking API).

### Project Goals

- Create a functional voice assistant that impresses Up Bank's technical team
- Demonstrate modern tech stack expertise
- Showcase effective use of multiple AI services
- Implement real banking features using Up's API

## Core Features

### 1. Up Assistant Mode

The assistant should be able to:

- Via a chat interface, engage in natural conversations about Up Bank's products and services.
- Answer questions using pre-scraped website content.
- Maintain context throughout the conversation.
- Use Bland AI to hold a realistic phone conversation with the user about Up Bank products and services.

### 2. Account Explorer Mode

The assistant should:

- Authenticate with Up's API using user-provided API key
- Provide basic account information (balances, recent transactions)
- Provide insights about the users account and transactions.
- Maintain user privacy and security

## Technical Architecture

### Frontend (Next.js on Vercel)

Components:

- Mode switching (Up/Account Explorer)
- Simple API key input form
- Account information display
- Real-time conversation history
