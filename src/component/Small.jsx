"use client";
import Image from "next/image";

const Small = () => {
  const array = [
    "/img1.png", "/img2.png", "/img3.png", "/img4.png",
    "/img5.png", "/img6.png", "/img7.png", "/img8.png"
  ];
  const cat = [
    "Home Appliances", "Electronics", "Installations", "Handyman",
    "Software", "Maintenance", "Office Services", "Plumbing"
  ];

  return (
    <div className="w-full py-3 mt-[200px] ">
      <div className="flex flex-row gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent px-2">
        {array.map((img, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center min-w-[90px] max-w-[100px] bg-white rounded-lg shadow-md p-2 mx-1"
          >
            <div className="w-14 h-14 relative mb-2">
              <Image
                src={img}
                alt={cat[idx] || `Category ${idx + 1}`}
                fill
                className="object-contain rounded-md"
                sizes="56px"
                priority={idx < 2}
              />
            </div>
            <span className="text-xs text-center font-medium text-gray-700">{cat[idx] || ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Small;