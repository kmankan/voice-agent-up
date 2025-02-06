# Up Voice Assistant

Using voice agents this project allows users to interact with:

- Up Bank's public facing content;
- Their own personal banking information via the Open Banking API.

## Public Facing Interface

Tasks:

1. Scrape all relevant information from Up Bank's website
2. Store this either in a context file or vector DB
3. Connect this a voice agent - perhaps ElevenLabs

## Customer-Specific Interface

Tasks:

1. Connect API to Up Bank for testing
2. What APIs would I need to enable for full coverage with the llm?
3. What approach are we going to take?
   i.e. Query all information at the begining and store this in state for the LLM to access vs. Allow pathway/agent to query APIs as needed.
