# Up Bank Assistant

## Overview

Up Bank Assistant is an AI-powered tool that enhances the banking experience by leveraging the [Up Bank API](https://developer.up.com.au/). This project explores how AI tools and voice agents can improve day-to-day interactions with banking applications.

**Backend Repository**: The backend for this project can be found at [https://github.com/kmankan/up-agent-backend](https://github.com/kmankan/up-agent-backend)

## Features

### Information Assistant

- **Chat Interface**: Ask questions about Up Bank and get accurate answers based on Up Bank website content.
- **Voice Agent**: Receive a phone call from an AI assistant with a natural Australian accent that can answer questions about Up Bank products and services

### Account Explorer

- **Transaction Visualization**: View and analyze your Up Bank transactions
- **Natural Language Interface**: Have conversations about your financial data in plain English
- **Secure API Integration**: End-to-end encrypted handling of your Up Bank API key

## Screenshots

### Landing Page

<img src="https://mkan.xyz/Pasted-image-20250218152814.png" alt="Up Bank Assistant Landing Page" width="700"/>

### Chat Interface

<img src="https://mkan.xyz/Pasted-image-20250218153314.png" alt="Up Bank Assistant Chat Interface" width="700"/>

### Calling Interface

<img src="https://ci3.googleusercontent.com/mail-img-att/AGAZnRp-dMpSCvnkXTl2WbiclgWO-lefuE56VcdUikRmICGIy9Ul74yVQQGmPLhn6uZ5lLIO4dqvxwmSSP_sLGr4QdETIdRJ1PaLLQjE3tyYzSel_QY5HHX9_77R6ztxeiujkJrqulCQKSoCXEK72LuSM28owC0vOfEyWkmT-iu4-gUm3tkNEV6J3zPfHzE-b214qLBfpJ7Gi0pW-vkm2AB7G5h1qKuRT8Qa8JNnKnDB3UQS6A3QRprL1J-N5XeS3DsslMbRAx2FCPE9hL39x0n04Ic1JQj8jT9o5mXPyNHACMn_Xd_f-NYvfT_fBpmtFZkeOxycCb8hhNqJDwZEAQj3yey2dK12EpGRP7_oCMu-O9XoJH-46H4NsYhlbdTWiQtqbci40lcbNNnSfHLLho401vzQYiu99-J_UGGB6ZCXsI3guxxjm_fOEIk7HX8mvivGxfdavbXWzfK56xeSN8smHKrUomhmowm5nyj40vQDLOhMc3NXBVOvhd2bkaxGiANbukxAKuFW3WzvepII6qqX7E2fkYqDP31oft9ag8VyzVnA44u7R9oQXYyN46JO0Xww3zzkX5u3PQ5QWqRXalggCi1BxVrH5sPuoWas64ALwRcm6NV-9QG1TrZUD2-vvKZSyW7ah51kWu5MidNOe7u665tv_f2gM__YervYT56sMGPl01yO1Z0nAHI343QXngPtvIon_M1GVxmR7dVkPTQP9apjCB6y8IEeovNYXxNXNkoetWR0GDYsEZA-FRBeHD9vy3zdgwCeIFOqag0VvOxtyU1wCpV502q4U2h9hQXqo31sFws5lC6QuGVt9YWtEgfQZgHDa343Bk0hJkIu1IlV5rIRGlltDKtF71Ur59KqxvTKUASzzGFPAgJqJTrIbQ0M0JKfDqzhjzdkrR1I--Rpo3EfCRtoqv8Co3bl_AzilbKTnk4aQsvY4TtybhMtxiw7QCKoS3NPwwVj8dBpuCVGknozFo4t0ANnd1RFbrfVhQxxMlqgLysIkhsk4788cvYk4-Q-QxgFCVIgxgJC1mFzdb4xb93XB10shokfhH4aB3AZg8Jbsw2oABXzUeA32cMNcbsNBHm1E018yfXaQQQXt_PlEwRRSqELp_OhFrKqsBu_SFTpGX-AlGNrk4hOOmJmqEOaeA=s0-l75-ft" alt="Up Bank Assistant Voice Calling Interface" width="400"/>

### Account Explorer Interface

<img src="https://mkan.xyz/Pasted-image-20250218160324.png" alt="Up Bank Assistant Account Explorer" width="700"/>

## Technical Architecture

### Frontend

- Built with TypeScript, Next.js, and Tailwind CSS
- Uses Zustand for state management
- Implements client-side encryption for sensitive data

### Backend

- Node.js server handling API requests
- Implements secure key management with public-private key encryption
- Uses JWT for authentication
- Vector database for storing embedded information about Up Bank

### AI Integration

- OpenAI Deep Research for comprehensive information gathering
- Google's Gemini-Flash-1.5 for efficient large context processing
- Bland AI for voice agent capabilities

## Security Considerations

**IMPORTANT SECURITY DISCLAIMER**: This project implements several security measures for handling API keys:

- End-to-end encryption of API keys
- Keys are only decrypted momentarily on the backend when needed
- No plain text storage of keys
- No logging or storing of transaction information
- Personal information is anonymized before being sent to LLMs

However, this is a demonstration project that hasn't undergone comprehensive security review. For maximum security, it's recommended to clone the repository and run it locally.

## Getting Started

### Prerequisites

- Node.js (v16+)
- Up Bank account with API access
- Environment variables (see setup section)

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/up-bank-assistant.git
   cd up-bank-assistant
   ```

2. Install dependencies for both frontend and backend

   ```
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Configure environment variables

   ```
   # Create .env files in both frontend and backend directories
   # See .env.example for required variables
   ```

4. Start the development servers

   ```
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm run dev
   ```

## Usage

1. **Information Assistant**: Access the chat interface to ask questions about Up Bank, or request a call from the voice agent
2. **Account Explorer**: Securely provide your Up Bank API key to unlock account visualization and natural language querying

## Limitations

- This is a demonstration project
- The security implementation, while thorough, has not been independently audited
- Voice agent functionality requires a working phone number

## Links

- [Up Bank API Documentation](https://developer.up.com.au/)
- [Frontend Repository](https://github.com/yourusername/up-bank-assistant/frontend)
- [Backend Repository](https://github.com/yourusername/up-bank-assistant/backend)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
