'use client';

import React, { useRef, useEffect, useState, useCallback } from "react";
import Card from "./Scrollcard"; // Your Card component
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ScrollableCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const services = require('./services.json');
  const [visibleCards, setVisibleCards] = useState(new Set());

  // Auto-scroll effect (no changes needed here)
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollAmount = container.offsetWidth * 0.8;
    let direction = "right";

    const interval = setInterval(() => {
        if (!container) return;
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
    }, 3000);

    return () => clearInterval(interval);
  }, [services]);

  // Intersection Observer (no changes needed here)
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

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth * 0.8;
      if (direction === 'left') {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <>
    <div className="relative w-full max-w-full bg-[#00BFFF]/30  py-1">
      {/* Scroll Arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-300/20 p-3  text-white rounded-full shadow-sm z-10  focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label="Scroll left"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-300/20  text-white p-3 rounded-full shadow-sm z-10  focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label="Scroll right"
      >
        <FaChevronRight size={20} />
      </button>

      <div
        ref={containerRef}
        className="flex space-x-3 mt-2 sm:space-x-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full"
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
      {/* Optional: Add a simple scroll indicator */}
      <div className="flex justify-center mt-4">
        {services.map((_: any, idx: number) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full mx-1 ${
              visibleCards.size > 0 ? 'bg-blue-500' : 'bg-blue-300'
            }`}
          ></span>
        ))}
      </div>
    </div>
    </>
  );
};

export default ScrollableCards;