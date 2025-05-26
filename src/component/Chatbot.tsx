'use client';

import { useState } from 'react';
import React from 'react';
type Message = { type: 'user' | 'bot'; content: string };

const Chat = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() && !uploadedImage) return;

    setIsLoading(true);
    setError(null);

    const newMessages = [...messages];
    if (userInput.trim()) newMessages.push({ type: 'user', content: userInput });
    if (uploadedImage) newMessages.push({ type: 'user', content: '[Image uploaded]' });
    setMessages(newMessages);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput, image: uploadedImage }),
      });
      const data = await res.json();

      setMessages((prev) => [...prev, { type: 'bot', content: data.message }]);
    } catch (err) {
      setError('Failed to get response.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setUserInput('');
      setUploadedImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-blue-100 rounded-xl shadow">
      <h1 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <img src="/chatlogo3.png" alt="chatbot" className="w-10 h-10" />
        Appliance Repair Assistant
      </h1>

      <div className="bg-white rounded-lg p-3 h-64 overflow-y-auto mb-4 border border-gray-200">
        {messages.map((msg, idx) => (
  <div key={idx} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
    <div className={`inline-block px-3 py-2 rounded-lg shadow-sm text-sm
                  ${msg.type === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>
      {msg.content.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < msg.content.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  </div>
))}
        {isLoading && <p className="text-sm text-gray-600">Analyzing your appliance issue...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe your appliance problem..."
            className="flex-1 px-3 text-black py-2 text-sm border rounded-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
        <label className=" text-gray-600 cursor-pointer">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          📎 Attach Image
        </label>
      </form>
    </div>
  );
};

export default Chat;
