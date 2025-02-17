'use client';

import { useRef, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import type { Message, TransactionResponse } from '@/lib/types';

interface InsightPanelProps {
  anonymisedSummary: TransactionResponse | null;
}

export function InsightPanel({ anonymisedSummary }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputMessage.trim();
    if (!message) return;
    setInputMessage('');

    const newMessages = [...messages, { role: 'user' as const, content: message }];
    setMessages(newMessages);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/up/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          anonymisedSummary
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.answer }]);
      scrollToBottom();
    } catch (error) {
      console.error('❌ Error fetching insights:', error);
      setError('Failed to fetch insights');
    }
  };

  return (
    <div className="h-[83vh] md:h-[85vh] border-2 border-white rounded-lg py-2 px-1 md:px-2 flex flex-col">
      <h2 className="text-2xl font-circular font-bold mb-6 text-[#ffee52]">
        Insights
      </h2>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${message.role === 'assistant'
              ? 'ml-auto bg-[#489b98] text-white'
              : 'bg-gray-200 text-black'
              }`}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-1">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about transactions..."
          className="flex-1 px-1 py-1 text-xs md:text-base rounded-lg bg-neutral-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffee52] focus:border-transparent resize-none"
        />
        <button
          type="submit"
          className="px-3 md:px-4 ml-1 py-2 bg-[#ffee52] text-[#ff705c] rounded-lg hover:bg-[#3a7c7a] transition-colors active:transform active:scale-95 active:bg-[#ffdd00]"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
} 