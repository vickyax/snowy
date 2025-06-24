'use client';

import React, { useRef, useEffect, useState, useCallback } from "react";
import Card from "./Scrollcard"; // Your Card component
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Install react-icons if you haven't: npm install react-icons

const ScrollableCards = () => {
  const containerRef = useRef(null);
  var services=require('./services.json');
  const [visibleCards, setVisibleCards] = useState(new Set());
  // Auto-scroll effect
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollAmount = container.offsetWidth * 0.8;
    let direction = "right";

    const interval = setInterval(() => {
      if (!container) return;
      // If at the end, scroll back to start
      if (
        direction === "right" &&
        container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10
      ) {
        direction = "left";
      } else if (direction === "left" && container.scrollLeft <= 0) {
        direction = "right";
      }
if (direction === "right") {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }, 3000); // Change interval as needed

    return () => clearInterval(interval);
  }, [services]);
  // Intersection Observer for card visibility
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
        root: containerRef.current, // Observe within the scroll container
        rootMargin: '0px',
        threshold: 0.5, // Trigger when 50% of the card is visible
      }
    );

    const cards = containerRef.current?.querySelectorAll('.scroll-card-item');
    cards?.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      cards?.forEach((card) => {
        observer.unobserve(card);
      });
      observer.disconnect();
    };
  }, [services]); // Re-run if services change

  const scroll = useCallback((direction) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth * 0.8; // Scroll by 80% of container width
      if (direction === 'left') {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }, []);


  return (
    <div className="relative  bg-amber-100 border-amber-300/60 py-1">
      {/* Scroll Arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-amber200/30 text-amber-900 p-3 rounded-full shadow-lg z-10 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label="Scroll left"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-300 text-amber-900 p-3 rounded-full shadow-lg z-10 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label="Scroll right"
      >
        <FaChevronRight size={20} />
      </button>

      <div
        ref={containerRef}
        className="flex space-x-5 px-4 py-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar" // Added snap classes and custom scrollbar hide
        style={{
          scrollBehavior: "smooth",
          whiteSpace: "nowrap",
        }}
      >
        {services.map((card, idx) => (
          <div
            key={card.id || idx}
            data-card-id={card.id || idx} // Add data-card-id for Intersection Observer
            className={`scroll-card-item flex-shrink-0 snap-center
                       transition-all duration-700 ease-out transform
                       ${visibleCards.has(card.id || idx) ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'}`
                     }
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
       {/* Optional: Add a simple scroll indicator */}
       <div className="flex justify-center mt-4">
        {services.map((_, idx) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full mx-1 ${
              // This is a simplified indicator; for true "active" state, you'd track scroll position
              // and visible card index more accurately.
              // For now, it just shows up if at least one card is visible.
              visibleCards.size > 0 ? 'bg-violet-500' : 'bg-blue-300'
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ScrollableCards;