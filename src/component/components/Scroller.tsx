import React, { useRef } from "react";
import Card from "./Scrollcard"; // Your Card component

const ScrollableCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
        <Card image={"laptop.jpg"} content1={"Laptop and PC"} content2={"Screen replacement,Virus removal"} link={"Laptop%20and%20PC"}/>

        <Card image={"acimage.jpg"} content1={"Air Conditioning Repair"} content2={"Gas refill, compressor failure issues"} link={"AC%20Repair"}/>

        <Card image={"fridge.png"} content1={"Refrigerator Emergency Care"} content2={"Cooling failure, frost buildup, door seal leaks"} link={"Refrigerator"}/>

        <Card image={"smarttv.png"} content1={"TV, Smart Tv Repair"} content2={"flickering screens, audio delays"} link={"Tv%20Repair"}/>

        <Card image={"washingmachine.png"} content1={"Washing Machine Repair"} content2={"Draining problems Washer not turning on"} link={"Washing%20Machine"}/>

        <Card image={"wifi.png"} content1={"Wifi Router"} content2={"slow connection, frequent drops, Overheating"}link={"Wifi%20Router"}/>
      </div>
    </div>
  );
};

export default ScrollableCards;
