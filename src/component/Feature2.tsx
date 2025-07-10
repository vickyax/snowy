"use client";

import { useRouter } from "next/navigation";
export default function ServicesSection() {
  const router = useRouter();
  return (
    <section className="bg-gradient-to-r from-cyan-200/60 border-b py-8 transition-all duration-700 ease-in-out">
      <div className="container max-w-5xl mx-auto m-8">
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
        </div>
        <div className="flex flex-wrap items-center">
          <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center">
            <h3 className="text-4xl font-bold text-gray-800 leading-tight mb-3 text-center sm:text-left">
              Expert Repairs, Right When You Need Them
            </h3>
            <h2 className="text-xl text-gray-700 mb-8 text-center sm:text-left">
              Certified Technicians, Just a Click Away
            </h2>
            <button
              onClick={() => router.push('/technicians')}
              className="flex text-center justify-center items-center mx-auto sm:mx-0 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out text-lg"
            >
              Book a Call
            </button>
            <p className="text-gray-800 mb-8 text-lg font-semibold text-center sm:text-left">
              We ensure you get your devices fixed at the most affordable price.
            </p>
          </div>
          <div className="w-full sm:w-1/2 p-6">
            <img className="w-full object-cover rounded-lg shadow" src="/pic2.jpg" alt="Technician at work" />
          </div>
        </div>

        <div className="flex flex-wrap flex-col-reverse sm:flex-row items-center">
          <div className="w-full sm:w-1/2 p-3 mt-3">
            <img className="w-full object-cover rounded-lg shadow" src="/pic1.jpg" alt="Service process" />
          </div>
          <div className="w-full sm:w-1/2 p-3 mt-3 flex flex-col justify-center">
            
            <p className="text-gray-800 font-bold  text-center sm:text-left text-lg">
              All our technicians are certified and background-checked.<br /><br />

            </p>
          </div>
        </div>
      </div>
    </section>
  );
}