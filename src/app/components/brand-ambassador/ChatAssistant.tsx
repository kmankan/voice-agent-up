'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, MessageSquare, Phone } from 'lucide-react';

// Declare the custom element type for TypeScript
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

// Style constants to match Up's exact colors
const styles = {
  upCoral: '#ff705c',
  upYellow: '#ffee52',
  upTeal: '#489b98',
  upDarkTeal: '#305555',
  upPink: '#ff8bd1'
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Update the type to remove 'voice' option
type ChatMode = 'text' | 'agent';

const VoiceBankingAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('text');
  const [messages, setMessages] = useState<Message[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      // automatically adjusts it to show the bottom of the content.
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log('Data available event:', e.data.type, e.data.size);
          audioChunks.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        console.log('Recording stopped, chunks:', audioChunks.current.length);
        const audioBlob = new Blob(audioChunks.current, {
          type: 'audio/webm'
        });
        console.log('Created blob:', audioBlob.type, audioBlob.size);
        audioChunks.current = [];
        handleRecordingComplete(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start(1000);
      setIsListening(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsListening(false);
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/transcribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/webm',
          'Accept': 'application/json',
        },
        body: audioBlob,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('transcribed', data)
      await handleSubmit(undefined, data.transcript);
    } catch (error) {
      console.error('Transcription failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListen = () => {
    if (!isListening) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleSubmit = async (e?: React.FormEvent, transcript?: string) => {
    if (e) e.preventDefault();

    // Use transcript if provided, otherwise use question state
    const messageContent = transcript || question;
    if (!messageContent.trim()) return;

    // Add user message immediately
    const userMessage: Message = { role: 'user', content: messageContent };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history: messages
        }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  const handleCallAgent = async () => {
    // This is a placeholder function - implement actual agent connection logic here
    // phone number validation
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      alert('Please enter a valid phone number with international prefix (e.g. +61...)');
      return;
    }

    console.log('Calling agent...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bland/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: phoneNumber
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate call');
    }

    // Handle successful response
    const data = await response.json();
    console.log('Bland call created:', data);
  };

  const handleModeChange = (mode: 'text' | 'agent') => {
    setChatMode(mode);
    setMessages([]); // Reset messages when changing modes
    setQuestion(''); // Reset any pending question
    if (isListening) {
      stopRecording(); // Stop any ongoing recording
    }
  };

  const renderInputMethod = () => {
    if (chatMode === 'text') {
      return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Button
            onClick={handleListen}
            className={`w-12 h-12 rounded-full transition-all duration-200 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-[#ff705c] hover:bg-[#e65a47]'
              }`}
            style={{
              boxShadow: isListening ? '0 0 0 4px rgba(255, 112, 92, 0.3)' : 'none',
            }}
            type="button"
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </Button>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
                setQuestion('');
              }
            }}
            className="flex-1 p-2 border rounded-lg bg-white opacity-80"
            placeholder="Type your question here..."
            rows={2}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="flex px-6 py-2 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: styles.upCoral,
              color: 'white'
            }}
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </Button>
        </form>
      );
    } else if (chatMode === 'agent') {
      return null;
    }
  };

  // Replace the existing display div with this chat display
  const renderChatHistory = () => (
    <div
      ref={chatContainerRef}
      className="space-y-4 mb-4 p-1 max-h-[500px] overflow-y-auto rounded-lg"
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className="flex"
          style={{
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
          }}
        >
          <div
            className={`p-4 rounded-lg max-w-[80%] inline-block ${message.role === 'user'
              ? `bg-[#489b98] border-b-[3px] border-l-[3px] border-r border-t border-[#ff705c]`
              : `bg-[#ff8bd1] border-b-[3px] border-r-[3px] border-l border-t border-[#ff705c]`
              }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: styles.upCoral }} className="flex justify-center items-start min-h-screen p-24">
      <Card className="w-full max-w-2xl mx-auto bg-[#ffee52] border-2 border-black overflow-hidden p-2">
        <CardHeader style={{ backgroundColor: styles.upYellow }}>
          <div className="flex flex-col items-center space-y-4">
            <CardTitle className="flex justify-center items-center w-full">
              <span style={{ color: styles.upCoral }} className="text-2xl font-bold">
                Up Voice Assistant
              </span>
            </CardTitle>

            <div className="flex bg-neutral-100 rounded-full p-1 shadow-sm">
              <Button
                variant="ghost"
                className={`rounded-full px-6 transition-colors 
                  ${chatMode === 'text'
                    ? 'bg-[#ff705c] text-white hover:bg-[#ff705c]/90 hover:text-white'
                    : 'text-[#ff705c] hover:bg-[#ff705c]/10 hover:text-[#ff705c]'
                  }`}
                onClick={() => handleModeChange('text')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Text Chat
              </Button>
              <Button
                variant="ghost"
                className={`rounded-full px-6 transition-colors 
                  ${chatMode === 'agent'
                    ? 'bg-[#ff705c] text-white hover:bg-[#ff705c]/90 hover:text-white'
                    : 'text-[#ff705c] hover:bg-[#ff705c]/10 hover:text-[#ff705c]'
                  }`}
                onClick={() => handleModeChange('agent')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Talk to an Agent
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-6">
            {messages.length === 0 ? (
              <div
                className="rounded-lg p-6 min-h-32 border"
                style={{
                  backgroundColor: chatMode === 'agent' ? styles.upTeal : styles.upYellow,
                  borderColor: styles.upCoral,
                  color: chatMode === 'agent' ? 'black' : styles.upCoral
                }}
              >
                {chatMode === 'agent' ? 'Enter your full phone number to immediately connect with an agent:' : 'Ask me anything about Up Bank...'}
                {chatMode === 'agent' && (
                  <div className="flex items-center mt-2">
                    <input
                      type="tel"
                      className="h-10 w-1/2 rounded-lg p-2 bg-neutral-100"
                      placeholder="+61412345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Button
                      className='h-10 m-1'
                      onClick={handleCallAgent}>
                      <Phone className='w-4 h-4' />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              renderChatHistory()
            )}
            {renderInputMethod()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VoiceBankingAssistant;