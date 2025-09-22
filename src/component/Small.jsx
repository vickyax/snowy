"use client";
import Image from "next/image";

const categories = [
  { img: "/img1.png", label: "Home Appliances", id: "home" },
  { img: "/img2.png", label: "Electronics", id: "electronics" },
  { img: "/img3.png", label: "Installations", id: "installations" },
  { img: "/img4.png", label: "Handyman", id: "handy" },
  { img: "/img5.png", label: "Software", id: "software" },
  { img: "/img6.png", label: "Maintenance", id: "maintenance" },
  { img: "/img7.png", label: "Office Services", id: "office" },
  { img: "/img8.png", label: "Annual Maintanance", id: "annualmain" },
];

const Small = () => (
  <div className="w-full py-3 pt-[200px]">
    <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 hide-scrollbar scrollbar-track-transparent px-2">
      {categories.map(({ img, label,id }, idx) => (
        <a href={`#${id}`} key={label} className="no-underline">
          <div
          key={id}
            className="flex flex-col items-center min-w-[120px] pb-2 max-w-[150px] bg-white rounded-lg shadow-md p-2 mx-1 cursor-pointer hover:bg-blue-50 transition"
          >
            <div className="w-14 h-14 relative mb-2">
              <Image
                src={img}
                alt={label}
                fill
                className="object-contain rounded-md"
                sizes="56px"
              />
            </div>
            <span className="text-xs text-center font-medium text-gray-700">{label}</span>
          </div>
        </a>
      ))}
    </div>
  </div>
);

export default Small;
