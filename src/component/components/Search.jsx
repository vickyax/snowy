import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./SearchCard";
import SearchIcon from '@mui/icons-material/Search';
import "./Search.css"; // Import the new CSS file

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

  // Conditionally apply the 'nav-float' class
  const searchWrapperClass = `search-input-wrapper ${navFloat ? "nav-float" : ""}`;

  return (
    <div className="search-container">
      <div className={searchWrapperClass}>
        <SearchIcon className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {showSuggestions && (
        <div className="suggestions-container">
          {filteredCards.map((card, index) => (
            <div
              key={index}
              role="button"
              className="suggestion-item"
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