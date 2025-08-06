import React, { useState, useEffect } from "react";

// NOTE: I've renamed the component to "RatingCounter" for clarity. 
// Make sure to update the import in your main App file from './ratingcount' to './RatingCounter'.

// --- Helper Hooks (No changes needed here) ---
function useCountUp(from = 0, to: number, duration = 1200, loopDelay = 2000) {
  const [count, setCount] = useState(from);
  useEffect(() => {
    let start = from; const increment = to / (duration / 16); let frame: number; let timeout: NodeJS.Timeout;
    function animate() {
      start += increment;
      if (start < to) {
        setCount(Math.floor(start)); frame = requestAnimationFrame(animate);
      } else {
        setCount(to); timeout = setTimeout(() => { setCount(from); start = from; animate(); }, loopDelay);
      }
    }
    animate();
    return () => { cancelAnimationFrame(frame); clearTimeout(timeout); };
  }, [to, from, duration, loopDelay]);
  return count;
}
function useCountUp2(from = 0, to: number, duration = 1200, decimals = 1, loopDelay = 2000) {
  const [count, setCount] = useState(from);
  useEffect(() => {
    let start = from; const increment = (to - from) / (duration / 16); let frame: number; let timeout: NodeJS.Timeout;
    function animate() {
      start += increment;
      if ((increment > 0 && start < to) || (increment < 0 && start > to)) {
        setCount(Number(start.toFixed(decimals))); frame = requestAnimationFrame(animate);
      } else {
        setCount(Number(to.toFixed(decimals))); timeout = setTimeout(() => { setCount(from); start = from; animate(); }, loopDelay);
      }
    }
    animate();
    return () => { cancelAnimationFrame(frame); clearTimeout(timeout); };
  }, [from, to, duration, decimals, loopDelay]);
  return count;
}
// --- End Helper Hooks ---


const RatingCounter: React.FC = () => {
  const servicesCount = useCountUp(300, 1000);
  const satisfaction = useCountUp(50, 97);
  const rating = useCountUp2(3.5, 4.3);

  return (
    // **THE FIX:**
    // 1. `flex-col sm:flex-row`: Stack vertically on mobile, go horizontal on screens > 640px.
    // 2. `gap-4 sm:gap-8`: Use a smaller gap on mobile.
    // 3. `text-center sm:text-left`: Center text when stacked vertically.
    <div className="w-full flex flex-col sm:flex-row justify-center items-center text-center sm:text-left gap-4 sm:gap-8 bg-gradient-to-r from-green-500/60 to-green-200/20 text-gray-600 p-4 lg:p-10 font-medium text-sm md:text-base">
      
      {/* Item 1: Total Services */}
      <span className="transition-transform duration-700 scale-100 animate-fade-in">
        <span className="text-xl md:text-2xl text-gray-800 font-bold">{servicesCount}</span>
        <span className="ml-2">Total Services Completed</span>
      </span>
      
      {/* Item 2: Average Rating */}
      <span className="flex items-center justify-center transition-transform duration-700 scale-100 animate-fade-in">
        <span className="text-xl md:text-2xl text-yellow-500 mr-1">★</span>
        <span className="text-gray-800 text-xl md:text-2xl font-bold">{rating} / 5</span>
        <span className="ml-2">Average Customer Rating</span>
      </span>
      
      {/* Item 3: Satisfaction Rate */}
      <span className="transition-transform duration-700 scale-100 animate-fade-in">
        <span className="text-xl md:text-2xl text-gray-800 font-bold">{satisfaction}%</span>
        <span className="ml-2">Satisfaction Rate</span>
      </span>

    </div>
  );
}

export default RatingCounter;