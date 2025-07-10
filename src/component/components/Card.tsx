// components/Card.tsx or components/Card.jsx
import React from "react";

interface CardProps {
  content1: string;
  content2: string;
  link?: string;
  image?: string;
}

const Card: React.FC<CardProps> = ({ content1, content2, link, image }) => {
  return (
    <div
      className="
        cursor-pointer
        p-2 sm:p-4
        flex flex-col
        font-arial
        rounded-lg
        border-2
        transition-all duration-300 ease-in-out transform
        bg-transparent
        hover:scale-102 
        hover:shadow-[5px_3px_3px_0px_#2d63c2] 
      "
    >
      <a href={`/TechService/${link}`} className="no-underline hover:no-underline flex-1 "> {/* flex-1 here helps the link take available space */}
        <div
          className="
            flex items-start
            hover:bg-gray-200 rounded 
            group animate-fade-in duration-300
          "
        >
          <img
            src={image}
            className="
              w-20 h-20 sm:w-20 sm:h-20 lg:h-32 lg:w-32 md:w-32 
              rounded 
              transition-transform duration-500 ease-out
              scale-100 group-hover:scale-110
              
            "
            alt=""
          />
          <div className="flex flex-col text-base text-[13px]  lg:text-[20px] text-gray-600 ml-2 justify-start break-words text-left"> {/* Aligned text to left, removed text-center */}
            <span className="font-bold  animate-fade-in-delay-400"> {/* Responsive font sizes */}
              {content1}
            </span>
            <span className=" mt-2 animate-fade-in-delay-600"> {/* Responsive font sizes */}
              {content2}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Card;