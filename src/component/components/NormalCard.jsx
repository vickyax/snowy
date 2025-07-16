import React from "react";
import { useState } from "react";
import Image from "next/image"; // Importing Image from next/image for optimized image loading
const Card = ({ content1, content2,image,bgcol }) => {
    const [selected, setSelected] = useState(false);
  return (
    <>
    {content1?(<div className="font-bold text-xl text-gray-800  animate-fade-in-delay-400">
      {content1}
    </div>):""}
    <button
      onClick={() => setSelected(!selected)}
      className={`w-full min-h-[120px] h-[120px] border-2 border-gray-950 cursor-pointer hover:shadow-[0px_3px_7px_0px_#2d63c2] text-[10px] p-6 flex flex-col items-center justify-center font-arial transition-transform duration-500 ease-out scale-100 hover:scale-105 animate-fade-in bg-white`}
      >
      
        {image?(<Image
                    src={'/'+image||'/placeholder-image.png'}
                    width={128}  // ~32px × 4 (tailwind's lg:w-32)
                    height={128}
                    className=" rounded mr-4 object-cover flex-shrink-0"
                    alt=""
                    loading="lazy"
                  />):"" }
    
    
    <p className="text-gray-800 text-base mt-2  animate-fade-in-delay-600">
      {content2}
    </p>

    </button>
  </>
  );
};

export default Card;
