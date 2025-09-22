"use client";
import Card from "../components/Card";
const ServiceSection= ({category,catname,content}) => {
  var services=require('../components/services.json');
  // Filter services to only include those with category "Home"
  const homeServices = services.filter(service =>
    Array.isArray(service.category)
      ? service.category.map(cat => cat.toLowerCase()).includes(category)
      : String(service.category).toLowerCase() === category
  );

  return (
    <section id={category} className=" bg-gradient-to-r from-cyan-50 to-blue-100 overflow-hidden scroll-mt-24 lg:py-6 sm:py-2 transition-all duration-700 ease-in-out ">
      <div className="">
        {/* Flex row for heading and search */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between mb-6 ">
          <h1 className="items-center flex flex-col md:flex-row ml-6 my-1 justify-between mt-6 text-3xl font-bold leading-tight text-gray-800 text-center md:text-left">
            {catname}
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-center text-lg text-gray-600">
            {/* Expert repairs and maintenance for all your home appliances. */}
            {content}
          </p>
        </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
       <div className="justify-center items-center overflow-hidden  h-[10px] bg-blue-700 rounded-t-md" />
    </section>
  );
};
const displayService=()=>{
  const map={
  home: "Home Appliances",
  install: "Installation Services",
  electronics: "Electronics Repair",
  maintenance: "Maintenance Services",
  handy: "Handyman Services",
  office: "Office Related Services",
  software: "Software Support Services",
  annualmain: "Annual Maintenance"
};
return (
    <div>
       <div className=" h-[10px] bg-blue-700 rounded-t-md" />
      {Object.entries(map).map(([key, value]) => (
        <ServiceSection 
          key={key} 
          category={key} 
          catname={value} 
        content={key=="home"? `Explore our Home Appliance Services to keep your ${value.toLowerCase()} in top shape.`:"" }
        />
      ))}
    </div>
  );

}
export default displayService;
