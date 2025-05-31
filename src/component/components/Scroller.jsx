import React, { useRef } from "react";
import Card from "./Scrollcard"; // Your Card component
import { useServices } from "@/lib/ServiceContext";
const ScrollableCards = () => {
  const containerRef = useRef(null);
  const { services, loading } = useServices();
  return (

    <div className="my-5 overflow-x-auto bg-white">
      <div
        ref={containerRef}
        className="flex space-x-5 px-4 py-4"
        style={{
          width: "100%",
          overflowX: "auto",
          scrollBehavior: "smooth",
          whiteSpace: "nowrap"
        }}
      >
        {services.map((card, idx) => (
                  <Card
                    key={card.id||idx}
                    image={card.image}
                    content1={card.content1}
                    content2={card.content2}
                    link={card.link}
                  />
                ))}
      </div>
    </div>
  );
};

export default ScrollableCards;
