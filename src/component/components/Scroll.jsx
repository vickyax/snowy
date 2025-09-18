'use client';

import React, { useRef, useEffect, useState, useCallback } from "react";
// import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ScrollableCards = ({ group,img, numcards = 5 }) => {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  // Track scroll position and active card
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
      setScrollPosition(scrollLeft);
      // Determine the active card based on the scroll position
      const cardWidth = scrollWidth / numcards;
      const newActiveCard = Math.round(scrollLeft / cardWidth);
      setActiveCard(newActiveCard);
    }
  }, [numcards]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateMaxScroll = () => {
      setMaxScroll(container.scrollWidth - container.clientWidth);
    };

    // Initial calculation and event listeners
    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    container.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', updateMaxScroll);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Scroll left/right
  const scroll = useCallback((direction) => {
    if (!containerRef.current) return;

    const scrollAmount = containerRef.current.clientWidth*1.05 ;
    let newPosition = containerRef.current.scrollLeft;

    newPosition = direction === 'left'
      ? Math.max(0, newPosition - scrollAmount)
      : Math.min(maxScroll, newPosition + scrollAmount);

    containerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  }, [maxScroll]);

  return (
    <div className="relative w-full bg-transparent py-4">
      {/* Arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center z-10 md:flex">
        <button
          onClick={() => scroll('left')}
          disabled={scrollPosition <= 0}
          className={`bg-white/70 bg-opacity-60 rounded-full p-3 shadow-sm transition-all ${
            scrollPosition <= 0 ? 'opacity-30' : 'hover:bg-opacity-80 hover:scale-110'
          }`}
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-blue-600" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center z-10 md:flex">
        <button
          onClick={() => scroll('right')}
          disabled={scrollPosition >= maxScroll}
          className={`bg-white/70 bg-opacity-60 rounded-full p-3 shadow-sm transition-all ${
            scrollPosition >= maxScroll ? 'opacity-30' : 'hover:bg-opacity-80 hover:scale-110'
          }`}
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-blue-600" />
        </button>
      </div>

      {/* Cards */}
      <div
        ref={containerRef}
        className="flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-2 md:px-8"
        onScroll={handleScroll}
      >
        {Array.from({ length: numcards }, (_, i) => (
          <img
            key={i}
            src={`https://qgwnbursfgkzjvwapfcn.supabase.co/storage/v1/object/public/Public_images/${group}${i + 1}.${img==='jpeg'?'jpeg':'jpg'}`}
            className="h-80 w-full lg:h-120 lg:w-150 overflow-hidden m-2 object-cover flex-shrink-0"
            alt=""
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: numcards }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              activeCard === i ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollableCards;