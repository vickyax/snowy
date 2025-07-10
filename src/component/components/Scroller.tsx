'use client';

import React, { useRef, useEffect, useState, useCallback } from "react";
import Card from "./Scrollcard"; // Your Card component
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ScrollableCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Use a ref to hold the interval ID so it can be cleared from anywhere
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  var services = require('./services.json');
   services=services.slice(0,8)
  const [visibleCards, setVisibleCards] = useState(new Set());

  // Function to start the auto-scroll behavior
  const startAutoScroll = useCallback(() => {
    // Prevent multiple intervals from running
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      // A more reliable way to check if scrolled to the end
      const atEnd = Math.ceil(container.scrollLeft + container.offsetWidth) >= container.scrollWidth;

      if (atEnd) {
        // For a seamless loop, scroll back to the start
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Continue scrolling to the right
        container.scrollBy({ left: container.offsetWidth * 0.8, behavior: "smooth" });
      }
    }, 3000);
  }, []);

  // Function to stop the auto-scroll
  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Start auto-scrolling when the component mounts
  useEffect(() => {
    startAutoScroll();
    // Clear the interval when the component unmounts
    return () => stopAutoScroll();
  }, [startAutoScroll]);

  // Intersection Observer for card animations (no changes needed here)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = entry.target.getAttribute('data-card-id');
          if (cardId) {
            setVisibleCards((prev) => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) {
                newSet.add(cardId);
              } else {
                newSet.delete(cardId);
              }
              return newSet;
            });
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    const cards = containerRef.current?.querySelectorAll('.scroll-card-item');
    cards?.forEach((card) => observer.observe(card));

    return () => {
      cards?.forEach((card) => observer.unobserve(card));
      observer.disconnect();
    };
  }, [services]);

  // The manual scroll function, now with auto-scroll interruption
  const scroll = useCallback((direction: 'left' | 'right') => {
    // **KEY FIX**: Stop auto-scrolling when the user clicks a button
    stopAutoScroll();

    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth * 0.8;
      const newScrollLeft = direction === 'left'
        ? containerRef.current.scrollLeft - scrollAmount
        : containerRef.current.scrollLeft + scrollAmount;
      
      containerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative  w-full max-w-full bg-gradient-to-r from-cyan-200/60  py-1">
      {/* Scroll Arrows */}
      

      <div
        ref={containerRef}
        className="flex space-x-3 mt-2 sm:space-x-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full"
        // Pause auto-scroll on mouse hover for better UX
        onMouseEnter={stopAutoScroll}
        // Resume auto-scroll when mouse leaves
        onMouseLeave={startAutoScroll}
        style={{
          scrollBehavior: "smooth",
          whiteSpace: "nowrap",
        }}
      >
        {services.map((card: any, idx: number) => (
          <div
            key={card.id || idx}
            data-card-id={card.id || idx}
            className={`scroll-card-item flex-shrink-0 snap-center
                        transition-all duration-700 ease-out transform
                        ${visibleCards.has(String(card.id || idx)) ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'}`}
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
      
      {/* Scroll indicator */}
      {/* <div className="flex justify-center mt-4">
        {services.map((_: any, idx: number) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full mx-1 ${
              visibleCards.has(String(idx)) ? 'bg-blue-500' : 'bg-blue-300'
            }`}
          ></span>
        ))}
      </div> */}
    </div>
  );
};

export default ScrollableCards;