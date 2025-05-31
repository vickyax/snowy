import React from "react";

interface CardProps {
  content1: string;
  content2: string;
  link?: string;
  image?: string;
}

const Card: React.FC<CardProps> = ({ content1, content2,link, image }) => {
  return (
    <button
    
      className="w-full cursor-pointer text-[10px] md:w-1/3 p-6 flex flex-col flex-grow flex-shrink font-arial"

      >
      <a href={`/TechService/${link}`} className="no-underline hover:no-underline">
        <div
          className="bg-white rounded shadow p-4 flex items-start transform transition duration-300 hover:shadow-[0px_3px_7px_0px_#2d63c2] hover:scale-105 animate-fade-in"
        >
          <img
            src={image}
            className="h-32 w-32 rounded mr-4 transition-transform duration-500 ease-out scale-95 hover:scale-100"
            alt=""
          />
          <div className="flex flex-col justify-start text-center flex-1">
            <div className="font-bold text-xl text-gray-800  animate-fade-in-delay-400">
              {content1}
            </div>
            <p className="text-gray-800 text-base mt-2  animate-fade-in-delay-600">
              {content2}
            </p>
           
          </div>
        </div>
      </a>
    </button>
  );
};

export default Card;
