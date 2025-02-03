'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Settings } from 'lucide-react';

// Style constants to match Up's exact colors
const styles = {
  upCoral: '#ff705c',
  upYellow: '#ffee52',
};

const VoiceBankingAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState('');
  const [mode, setMode] = useState('general');

  const handleListen = () => {
    setIsListening(!isListening);
    // Voice recognition logic would go here
  };

  return (
    <div style={{ backgroundColor: styles.upCoral }} className="min-h-screen p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-xl">
        <CardHeader style={{ backgroundColor: styles.upYellow }}>
          <CardTitle className="flex justify-between items-center">
            <span style={{ color: styles.upCoral }} className="text-2xl font-bold">
              Up Voice Assistant
            </span>
            <Button variant="ghost" size="icon">
              <Settings style={{ color: styles.upCoral }} className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Button
                onClick={handleListen}
                size="lg"
                className="rounded-full p-8"
                style={{
                  backgroundColor: isListening ? styles.upCoral : styles.upYellow,
                  color: isListening ? 'white' : styles.upCoral
                }}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
            </div>

            <div
              className="rounded-lg p-6 min-h-32 border"
              style={{
                backgroundColor: styles.upYellow + '20',
                borderColor: styles.upYellow,
                color: styles.upCoral
              }}
            >
              {response || "Try asking about Up's features or your account..."}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                className="px-6 py-2 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor: mode === 'general' ? styles.upCoral : styles.upYellow,
                  color: mode === 'general' ? 'white' : styles.upCoral
                }}
                onClick={() => setMode('general')}
              >
                General Info
              </Button>
              <Button
                className="px-6 py-2 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor: mode === 'personal' ? styles.upCoral : styles.upYellow,
                  color: mode === 'personal' ? 'white' : styles.upCoral
                }}
                onClick={() => setMode('personal')}
              >
                My Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VoiceBankingAssistant;