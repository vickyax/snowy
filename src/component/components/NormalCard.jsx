import React from "react";
import { useState } from "react";
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
      
        {image?(<img
    src={image}
    className="h-32 w-32 rounded mr-4 transition-transform duration-500 ease-out scale-80 group-hover:scale-110"
    alt=""
  />):"" }
    
    
    <p className="text-gray-800 text-base mt-2  animate-fade-in-delay-600">
      {content2}
    </p>

    </button>
  </>
  );
};

export default Card;
