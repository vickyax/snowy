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
    <button className="cursor-pointer w-72 sm:w-60 md:w-80 flex-shrink-0 pt-3 font-arial overflow-hidden">
      <a href={`/TechService/${link}`} className="no-underline hover:no-underline block h-full">
        <div
          className="bg-transparent rounded shadow pt-5 flex items-start h-full min-h-[10rem] transition duration-300 hover:shadow-[0px_3px_7px_0px_#2d63c2] hover:scale-105 hover:bg-gray-200"
        >
          <Image
            src={'/'+image||'/placeholder-image.png'}
            width={128}  // ~32px × 4 (tailwind's lg:w-32)
            height={128}
            className=" rounded mr-4 object-cover flex-shrink-0"
            alt=""
            loading="lazy"
          />
          <div className="flex overflow-y-auto text-wrap flex-col text-base text-gray-600 ml-2 justify-start break-words text-left w-full">
  <span className="font-bold text-[15px]  lg:text-[18] animate-fade-in-delay-400">
    {content1}
  </span>
  <span className="mt-2 text-[12px]  lg:text-[13px] animate-fade-in-delay-600 break-words w-full block">
    {content2}
  </span>
</div>
        </div>
      </a>
    </button>
  );
};

export default Card;
