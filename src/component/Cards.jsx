"use client";
import Card from "./components/Card";
import Search from "./components/Search";
const ServiceSection= () => {
  var services=require('./components/services.json');

  return (
    <section className=" bg-gradient-to-r from-cyan-200/60  border-b py-8 transition-all duration-700 ease-in-out transform">
      <div className="container mx-auto flex flex-wrap pt-4 pb-12">
        {/* Flex row for heading and search */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between mb-6 mt-10">
          <h1 className="items-center ml-6 my-1 mt-6 text-4xl font-bold leading-tight text-gray-800 text-center md:text-left">
            Our Services
          </h1>
          <Search />
        </div>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
        </div>
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
    </section>
  );
};

export default ServiceSection;
