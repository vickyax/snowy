import React from "react";
import Button from "./Button";
import Image from "next/image";
interface CardProps {
  content1: string;
  content2: string;
  btn?: string;
  link?: string;
  image: string;
}

const Card: React.FC<CardProps> = ({ content1, content2, btn, link, image }) => {
  return (
    <button className="cursor-pointer w-[350px] h-[200px] transition duration-300 hover:shadow-[0px_3px_7px_0px_#2d63c2] hover:scale-105 hover:bg-green-200  bg-green-300/50 rounded-lg   pt-3 font-arial overflow-hidden">
      <a href={`/TechService/${link}`} className="no-underline hover:no-underline block h-full">
          <span className="font-bold text-[16px]  lg:text-[18] text-gray-800 flex-col  animate-fade-in-delay-400">
    {content1}
  </span>
        <div
          className="bg-transparent rounded shadow pt-3 flex items-start h-full min-h-[10rem] "
        >
          <Image
            src={'/'+image||'/placeholder-image.png'} 
            width={128}  // ~32px × 4 (tailwind's lg:w-32)
            height={128}
            className=" rounded m-4 object-cover flex-shrink-0"
            alt=""
            loading="lazy"
          />
          <div className="flex overflow-auto p-2 text-wrap flex-col text-base text-gray-600 ml-2 justify-start break-words text-left w-full">
  
  <span className="mt-2 text-[15px]  lg:text-[13px] animate-fade-in-delay-600 break-words w-full block">
    {content2}
  </span>
</div>
        </div>
      </a>
    </button>
  );
};

export default Card;
