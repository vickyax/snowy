"use client";
import React from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import Feature2 from "./Feature2";
import Features from "./Features";
import HomeAppliances from "./categories/HomeAppliances";
import Counter from './ratingcount';
import Installation from "./categories/Installation";
import Electronics from "./categories/Electronics";
import CallToAction from "./CallToAction";
import Footer from "./Footer";
import Most from './Mostordered';
import Scroller from "./components/Scroller";
import { useState, useRef, useEffect } from "react";
import Chat from "../component/Chatbot";
import Small from "./Small";
const App: React.FC = () => {

   const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null); // Ref for the chat component
   // Handle clicks outside the chat window to close it
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

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div
      className="w-full leading-normal tracking-normal bg-gradient-to-r from-cyan-200/60  p-2"
      style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
    >
      <Nav />
      <Small />
      <Scroller />
      <HomeAppliances />
      <Installation />
      <Electronics />
      <Counter />
      <Most/>
      {/* <Hero /> */}
      <Feature2 />
      <Features />
      <CallToAction />
      <Footer />
       {/* Chatbot Icon */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-18 right-5 bg-blue-600 hover:bg-blue-700 text-white  rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-105"
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
  );

};

export default App;
