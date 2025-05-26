import Card from "./components/Card";
import Search from "./components/Search";
const ServiceSection: React.FC = () => {

  return (
    <section className="bg-white border-b py-8">
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
        <Card image={"laptop.jpg"} content1={"Laptop and PC"} content2={"Screen replacement,Virus removal"} link={"Laptop%20and%20PC"}/>

        <Card image={"acimage.jpg"} content1={"Air Conditioning Repair"} content2={"Gas refill, compressor failure issues"} link={"AC%20Repair"}/>

        <Card image={"fridge.png"} content1={"Refrigerator Emergency Care"} content2={"Cooling failure, frost buildup, door seal leaks"} link={"Refrigerator"}/>

        <Card image={"smarttv.png"} content1={"TV, Smart Tv Repair"} content2={"flickering screens, audio delays"} link={"Tv%20Repair"}/>

        <Card image={"washingmachine.png"} content1={"Washing Machine Repair"} content2={"Draining problems Washer not turning on"} link={"Washing%20Machine"}/>

        <Card image={"wifi.png"} content1={"Wifi Router"} content2={"slow connection, frequent drops, Overheating"}link={"Wifi%20Router"}/>
      </div>
    </section>
  );
};

export default ServiceSection;
