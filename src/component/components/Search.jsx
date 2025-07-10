import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./SearchCard";
import SearchIcon from '@mui/icons-material/Search';

const SearchCards = ({ navFloat }) => {
  var services = require('./services.json');
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] = useState(services);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

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
    router.push(`/Searchpage?search=${encodeURIComponent(card.content1)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      router.push(`/Searchpage?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="search-container bg-transparent block">
      <div className={ `items-center ${navFloat?"w-[260px]":"w-[320px]"} lg:w-[400px] mt-2 lg:mt-0 sm:mt-2 border bg-white/90 rounded-lg p-2`}>
        <SearchIcon className="text-gray-500 mr-2" />
        <input
          className="flex-1 bg-transparent outline-none text-black"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
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
              tabIndex={0}
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