'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Nav';
type Message = {
  id: number;
  type: 'user' | 'bot';
  content: string;
  time: string;
  image?: string;
};

const ChatPage = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your Appliance Repair Assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() && !uploadedImage) return;

    setIsLoading(true);
    setError(null);

    // Add user message(s)
    const newMessages: Message[] = [];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (userInput.trim()) {
      newMessages.push({
        id: messages.length + 1,
        type: 'user',
        content: userInput,
        time
      });
    }

    if (uploadedImage) {
      newMessages.push({
        id: messages.length + 2,
        type: 'user',
        content: '[Appliance Image Uploaded]',
        image: uploadedImage,
        time
      });
    }

    setMessages(prev => [...prev, ...newMessages]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput, image: uploadedImage }),
      });
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'bot',
          content: data.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
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
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center border-b relative">
      <img 
        src="/chatlogo3.png" 
        alt="Appliance Repair" 
        className="w-12 h-12 mr-3"
      />
      <div>
        <h1 className="text-xl font-bold text-gray-800">Appliance Repair Assistant</h1>
        <p className="text-sm text-gray-600">24/7 Repair Guidance</p>
      </div>
      <a
        href="/"
        className="absolute right-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm flex items-center"
      >
        <span className="mr-2">🏠</span> Home
      </a>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-100 ml-12' 
                      : 'bg-gray-100 mr-12'
                  }`}
                >
                  {message.image && (
                    <img 
                      src={message.image} 
                      alt="Uploaded appliance" 
                      className="mb-2 rounded-lg max-w-xs border"
                    />
                  )}
                  {/* Render multi-line bot content */}
                  <p className="text-gray-800 text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex justify-center">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your appliance problem..."
                className="text-black not-only:flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                disabled={isLoading}
              />
              <label className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer text-sm">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden"
                />
                📎 Image
              </label>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-sm"
                disabled={isLoading || (!userInput.trim() && !uploadedImage)}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
            {uploadedImage && (
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <span className="mr-2">Image ready to send:</span>
                <img 
                  src={uploadedImage} 
                  alt="Preview" 
                  className="w-12 h-12 rounded border object-cover"
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;