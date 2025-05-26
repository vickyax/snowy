import React from "react";
import Button from "./Button";

interface CardProps {
  content1: string;
  content2: string;
  btn?: string;
  link?: string;
  image: string;
}

const Card: React.FC<CardProps> = ({ content1, content2, btn, link, image }) => {
  return (
    <button className="cursor-pointer w-72 sm:w-60 md:w-80 flex-shrink-0 p-4 font-arial">
      <a href={`/TechService/${link}`} className="no-underline hover:no-underline block h-full">
        <div
          className="bg-white rounded shadow p-4 flex items-start h-full min-h-[10rem] transition duration-300 hover:shadow-[0px_3px_7px_0px_#2d63c2] hover:scale-105"
        >
          <img
            src={image}
            className="h-32 w-32 rounded mr-4 object-cover flex-shrink-0"
            alt=""
          />
          <div className="flex flex-col justify-start flex-1 text-left overflow-hidden">
            <div className="font-bold text-xl text-gray-800 break-words truncate">
              {content1}
            </div>
            <p className="text-gray-800 text-base mt-2 break-words line-clamp-3">
              {content2}
            </p>
          </div>
        </div>
      </a>
    </button>
  );
};

export default Card;
