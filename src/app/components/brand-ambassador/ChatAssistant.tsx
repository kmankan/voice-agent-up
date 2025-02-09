'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Settings, MessageSquare } from 'lucide-react';
import Conversation from './ElevenLabsCall';

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id': string;
      };
    }
  }
}

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3010';

// Style constants to match Up's exact colors
const styles = {
  upCoral: '#ff705c',
  upYellow: '#ffee52',
  upTeal: '#489b98',
  upDarkTeal: '#305555'
};

const VoiceBankingAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState('');
  const [mode, setMode] = useState('general');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [chatMode, setChatMode] = useState<'text' | 'voice'>('text');
  const fullResponseRef = useRef('');

  const handleListen = () => {
    setIsListening(!isListening);
    // Voice recognition logic would go here
  };

  const simulateStreaming = (text: string) => {
    let index = 0;
    fullResponseRef.current = text;
    setDisplayedResponse('');

    const interval = setInterval(() => {
      if (index < text.length) {
        const chunk = text.slice(index, index + 3); // Adjust chunk size as needed
        setDisplayedResponse(prev => prev + chunk);
        index += 3;
      } else {
        clearInterval(interval);
      }
    }, 0);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;
    console.log('server', process.env.SERVER_URL)
    setIsLoading(true);
    try {
      console.log('question:', question);
      const response = await fetch(`${SERVER_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();
      if (data.response) {
        simulateStreaming(data.response);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  const renderInputMethod = () => {
    if (chatMode === 'text') {
      return (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="flex-1 p-2 border rounded-lg"
            placeholder="Type your question here..."
            rows={2}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: styles.upCoral,
              color: 'white'
            }}
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </Button>
        </form>
      );
    }

    return (
      <div className="flex justify-center">
        <Button
          onClick={handleListen}
          className={`w-16 h-16 rounded-full transition-all duration-200 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-[#ff705c] hover:bg-[#e65a47]'
            }`}
          style={{
            boxShadow: isListening ? '0 0 0 4px rgba(255, 112, 92, 0.3)' : 'none',
          }}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white animate-pulse" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: styles.upCoral }} className="min-h-screen p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-xl">
        <CardHeader style={{ backgroundColor: styles.upYellow }}>
          <div className="flex flex-col items-center space-y-4">
            <CardTitle className="flex justify-between items-center w-full">
              <span style={{ color: styles.upCoral }} className="text-2xl font-bold">
                Up Voice Assistant
              </span>
              <Button variant="ghost" size="icon">
                <Settings style={{ color: styles.upCoral }} className="h-5 w-5" />
              </Button>
            </CardTitle>

            <div className="flex bg-white rounded-full p-1 shadow-sm">
              <Button
                variant="ghost"
                className={`rounded-full px-6 transition-colors ${chatMode === 'text' ? 'bg-[#ff705c] text-white' : 'text-[#ff705c]'
                  }`}
                onClick={() => setChatMode('text')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Text Chat
              </Button>
              <Button
                variant="ghost"
                className={`rounded-full px-6 transition-colors ${chatMode === 'voice' ? 'bg-[#ff705c] text-white' : 'text-[#ff705c]'
                  }`}
                onClick={() => setChatMode('voice')}
              >
                <Mic className="w-4 h-4 mr-2" />
                Voice Chat
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div
              className="rounded-lg p-6 min-h-32 border"
              style={{
                backgroundColor: styles.upYellow + '20',
                borderColor: styles.upYellow,
                color: styles.upCoral
              }}
            >
              {displayedResponse || 'Ask me anything about Up Bank...'}
            </div>

            {renderInputMethod()}
          </div>
        </CardContent>
      </Card>
      <elevenlabs-convai agent-id="WHNNSSM163qXbSMw9Efe"></elevenlabs-convai>
      <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
    </div>
  );
}

export default VoiceBankingAssistant;