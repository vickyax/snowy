'use client';

import React, { useRef, useEffect, useState, useCallback } from "react";
import Card from "./Scrollcard";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ScrollableCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const services = require('./services.json').slice(0, 8);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
  const [isHovering, setIsHovering] = useState(false);

  // Calculate max scroll position
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setMaxScroll(
          containerRef.current.scrollWidth - 
          containerRef.current.clientWidth
        );
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Auto-scroll logic with pause on interaction
  useEffect(() => {
    if (isHovering || scrollPosition >= maxScroll) return;
    
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      
      containerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovering, scrollPosition, maxScroll]);

  // Track scroll position
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollLeft);
      }
    }, 100);
  }, []);

  // Manual scroll with boundaries
  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const scrollAmount = containerRef.current.clientWidth * 0.8;
    let newPosition = containerRef.current.scrollLeft;
    
    if (direction === 'left') {
      newPosition = Math.max(0, newPosition - scrollAmount);
    } else {
      newPosition = Math.min(maxScroll, newPosition + scrollAmount);
    }
    
    containerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  }, [maxScroll]);

  // Mobile touch support
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startX: number;
    let scrollLeft: number;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].pageX;
      scrollLeft = container.scrollLeft;
      container.style.scrollBehavior = 'auto';
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX) return;
      const x = e.touches[0].pageX;
      const walk = (x - startX) * 2; // Scroll sensitivity
      container.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
      container.style.scrollBehavior = 'smooth';
      handleScroll();
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div 
      className="relative w-full bg-transparent py-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Scroll Arrows */}
      <div className="hidden md:flex absolute inset-y-0 left-0 items-center z-10">
        <button 
          onClick={() => scroll('left')}
          disabled={scrollPosition <= 0}
          className={`bg-white bg-opacity-80 rounded-full p-2 shadow-lg transition-all ${
            scrollPosition <= 0 ? 'opacity-30' : 'hover:bg-opacity-100 hover:scale-110'
          }`}
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-blue-600" />
        </button>
      </div>
      
      <div className="hidden md:flex absolute inset-y-0 right-0 items-center z-10">
        <button 
          onClick={() => scroll('right')}
          disabled={scrollPosition >= maxScroll}
          className={`bg-white bg-opacity-80 rounded-full p-2 shadow-lg transition-all ${
            scrollPosition >= maxScroll ? 'opacity-30' : 'hover:bg-opacity-100 hover:scale-110'
          }`}
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-blue-600" />
        </button>
      </div>
      
      {/* Scroll Shadows */}
      <div className={`absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-green-300/50 to-transparent z-0 transition-opacity ${
        scrollPosition > 0 ? 'opacity-100' : 'opacity-0'
      }`} />
      <div className={`absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-green-300/50 to-transparent z-0 transition-opacity ${
        scrollPosition < maxScroll ? 'opacity-100' : 'opacity-0'
      }`} />

      {/* Cards Container */}
      <div
        ref={containerRef}
        className="flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-4 md:px-8"
        onScroll={handleScroll}
      >
        {services.map((card: any) => (
          <div
            key={card.id}
            className="scroll-card-item flex-shrink-0 snap-center transition-transform duration-300 hover:scale-[1.02]"
          >
            <Card
              image={card.image}
              content1={card.content1}
              content2={card.content2}
              link={card.link}
            />
          </div>
        ))}
      </div>
      
      {/* Mobile Scroll Indicators */}
      <div className="flex justify-center mt-4 space-x-2 md:hidden">
        {services.map((_:any, index:any) => {
          const isActive = index === Math.round(
            (scrollPosition / (maxScroll || 1)) * (services.length - 1)
          );
          
          return (
            <span
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                isActive ? 'bg-blue-600 scale-125' : 'bg-gray-300'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ScrollableCards;