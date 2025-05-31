import React, { useState } from "react";
import Card from "./SearchCard"; // Your Card component
import { useServices } from "@/lib/ServiceContext";


const SearchCards = () => {
  const { services, loading } = useServices();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] = useState(services);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filterCards = (term) => {
    const filtered = services.filter(
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
            <div
              key={index}
              type="button"
              className="suggestion-card text-left w-full"
              onClick={() => selectCard(card)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") selectCard(card);
              }}
              aria-label={`Select ${card.content1}`}
            >
              <Card image={card.image} content1={card.content1} content2={card.content2} link={card.link} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCards;
