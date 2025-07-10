"use client";
import Card from "../components/Card";
const ServiceSection= () => {
  var services=require('../components/services.json');
  // Filter services to only include those with category "Home"
  const homeServices = services.filter(service =>
    Array.isArray(service.category)
      ? service.category.map(cat => cat.toLowerCase()).includes("electronics")
      : String(service.category).toLowerCase() === "electronics"
  );

  return (
    <section className=" bg-gradient-to-r from-cyan-200/60   border-b lg:py-8 sm:py-2 transition-all duration-700 ease-in-out ">
      <div className="">
        {/* Flex row for heading and search */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between mb-6 ">
          <h1 className="items-center flex flex-col md:flex-row ml-6 my-1 justify-between mt-6 text-3xl font-bold leading-tight text-gray-800 text-center md:text-left">
            Electronics Services
          </h1>
        </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {homeServices.map((card, idx) => (
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
