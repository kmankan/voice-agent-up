'use client'

import { useState } from 'react';

export default function AgentCall() {
  const [callId, setCallId] = useState<string | null>(null);

  const handleMakeCall = async () => {
    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.call_id) {
        setCallId(data.call_id);
      }
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button
        className={`px-4 py-2 rounded-md text-white ${callId ? 'bg-gray-500' : 'bg-orange-500'}`}
        onClick={handleMakeCall}
        disabled={callId ? true : false}
      >
        {callId ? 'Call Initiated' : 'Call Me'}
      </button>

    </div>
  )
}