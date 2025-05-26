import React, { useState } from "react";
import Card from "./SearchCard"; // Your Card component

const cardsData = [
  { image: "laptop.jpg", content1: "Laptop and PC", content2: "Screen replacement, Virus removal",link:"Laptop%20and%20PC" },
  { image: "acimage.jpg", content1: "Air Conditioning Repair", content2: "Gas refill, compressor failure issues",link:"AC%20Repair" },
  { image: "fridge.png", content1: "Refrigerator Emergency Care", content2: "Cooling failure, frost buildup, door seal leaks",link: "Refrigerator"},
  { image: "smarttv.png", content1: "TV, Smart Tv Repair", content2: "flickering screens, audio delays",link:"Tv%20Repair" },
  { image: "washingmachine.png", content1: "Washing Machine Repair", content2: "Draining problems, Washer not turning on",link: "Washing%20Machine"},
  { image: "wifi.png", content1: "Wifi Router", content2: "slow connection, frequent drops, Overheating",link: "Wifi%20Router" },
];

const SearchCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] = useState(cardsData);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filterCards = (term) => {
    const filtered = cardsData.filter(
      (card) =>
        card.content1.toLowerCase().includes(term.toLowerCase()) ||
        card.content2.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCards(filtered);
    setShowSuggestions(term.length > 0 && filtered.length > 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterCards(value);
  };

  const selectCard = (card) => {
    setSearchTerm(card.content1);
    setShowSuggestions(false);
  };

  return (
    <div className="search-container relative mt-12 lg:mt-8 md:mt-15 sm:mt-16 ">
      <input
        className="w-[300px] mt-2 lg:mt-0 sm:mt-2 border border-gray-300 rounded-lg p-2 text-black"
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {showSuggestions && (
        <div className="suggestions absolute bg-white border border-gray-300 rounded-lg shadow-md mt-1 z-10 w-[300px]">
          {filteredCards.map((card, index) => (
            <button
              key={index}
              type="button"
              className="suggestion-card text-left w-full"
              onClick={() => selectCard(card)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") selectCard(card);
              }}
              aria-label={`Select ${card.content1}`}
            >
              <Card image={card.image} content1={card.content1} content2={card.content2} link={link} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCards;
