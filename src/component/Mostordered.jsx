"use client";
import Card from "./components/Card";
const ServiceSection= () => {
  var services=require('./components/services.json');
  services=services.slice(8,15);
  return (
    <section className=" bg-transparent transition-all duration-700 ease-in-out ">
      <div>
        {/* Flex row for heading and search */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between mb-6 ">
          <h1 className="items-center flex flex-col md:flex-row ml-6  justify-between pt-6 text-4xl font-bold leading-tight text-gray-800 text-center md:text-left">
            Most ordered Services
          </h1>
        </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {services.map((card, idx) => (
          <Card
            key={card.id||idx}
            image={card.image}
            content1={card.content1}
            link={card.link}
          />
        ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
