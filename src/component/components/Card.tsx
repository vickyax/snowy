// components/Card.tsx or components/Card.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link"; // Using Next.js Link for better navigation

interface CardProps {
  content1: string;
  content2: string;
  link?: string;
  image?: string;
}

const Card: React.FC<CardProps> = ({ content1, content2, link, image }) => {
  // Define the destination URL, providing a fallback if the link is not present.
  const href = link ? `/TechService/${link}` : '#';

  return (
    // Use Next.js Link for client-side routing, which is more performant.
    // The 'legacyBehavior' prop allows the 'a' tag to be nested.
    <Link href={href} passHref legacyBehavior>
      {/* The anchor tag becomes the main clickable element.
          'group' is used to apply styles to child elements on hover. */}
      <a className="block w-full h-full group no-underline">
        <div
          className="
            flex flex-col         
            h-full               
            bg-transparent         
            rounded-xl             
            p-2       
            overflow-hidden         
            transition-all duration-300 ease-in-out
            hover:shadow-xl       
            hover:-translate-y-1   
          "
        >
          {/* Image Container */}
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={'/' + (image || "default-image.png")}
              alt={content1 || "Service Image"} // Use content1 for a more descriptive alt text
               width={128}  // ~32px × 4 (tailwind's lg:w-32)
            height={150}
              className="
                object-cover    
                transition-transform duration-500 ease-out
                group-hover:scale-105 
              "
              loading="lazy"
             
            />
          </div>

          {/* Text Content Container */}
          <div className="flex flex-col flex-grow py-4">
            <h3 className="font-bold text-[16px] text-gray-800 ">
              {content1}
            </h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-grow">
              {content2}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
