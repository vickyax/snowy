"use client";
import React, { useState, useRef, useEffect } from "react";
import Nav from "./Nav";
import Feature2 from "./Feature2";
import Features from "./Features";
import Counter from "./ratingcount";
import CallToAction from "./CallToAction";
import Cat from "./categories/Cat";
import Footer from "./Footer";
import Most from "./Mostordered";
import Scroller from "./components/Scroller";
import Chat from "../component/Chatbot";
import Small from "./Small";

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true); // NEW: loading screen state

  // Handle clicks outside chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsChatOpen(false);
      }
    };

    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]);

  // Simulate loading until window fully loaded
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 1500); // 1.5s fade out after load
    };
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <video
            src="/logoload3.mp4" // put your loading video here
            autoPlay
            muted
            playsInline
            onEnded={() => setLoading(false)}
            className="w-[150px] h-[150px] rounded-[50%]  lg:w-[200px] lg:h-[200px] object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`w-full leading-normal tracking-normal bg-gradient-to-r from-cyan-50 to-blue-100 transition-opacity duration-700 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
      >
        <Nav />
        <Small />
        <Scroller />
        <Cat />
        <Most />
        <Counter />
        <Feature2 />
        <Features />
        <CallToAction />
        <Footer />

        {/* Chatbot Icon */}
        {!isChatOpen && (
          <button
            onClick={toggleChat}
            className="fixed bottom-18 right-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-105"
            aria-label="Open chat"
          >
            <img src="/chatlogo3.png" alt="Chat icon" className="w-16 h-16" />
          </button>
        )}

        {/* Chatbot Overlay */}
        {isChatOpen && (
          <div ref={chatRef} className="fixed bottom-8 right-8 z-50">
            <Chat />
          </div>
        )}
      </div>
    </>
  );
};

export default App;
