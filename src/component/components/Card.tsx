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
    
      className="w-full cursor-pointer lg:text-[20px] sm:text-[5px] md:w-1/3 p-6 flex flex-col flex-shrink font-arial rounded-lg border-2 transition-all duration-700 ease-in-out transform"

      >
      <a href={`/TechService/${link}`} className="no-underline hover:no-underline">
        <div
  className="bg-white hover:bg-gray-200 rounded shadow p-4 flex items-start transform transition  hover:shadow-[5px_3px_7px_0px_#2d63c2] group hover:scale-110 animate-fade-in duration-500"
>
  <img
    src={image}
    className="h-32 w-32 rounded mr-4 transition-transform duration-500 ease-out scale-100 group-hover:scale-110"
    alt=""
  />
  <div className="flex flex-col justify-start text-center flex-1 break-words">
    <div className="font-bold  text-gray-800  animate-fade-in-delay-400">
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
