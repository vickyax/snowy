"use client";
import Image from "next/image";

export default function RegisterTechnician() {
  return (
    <>
   
      <section className="bg-gradient-to-r from-cyan-200/60 border-b py-2">
        <div className="container max-w-5xl mx-auto m-1">
          <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
            Join Our Network of Trusted Technicians
          </h1>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
          </div>
          <div className="flex flex-wrap">
            <div className="w-5/6 sm:w-1/2 p-6">
              <h3 className="text-3xl text-gray-700 font-bold leading-none mb-3">
                Easy Registration, Endless Opportunities
              </h3>
              <p className="text-gray-600 mb-8">
                Showcase your skills and connect with thousands of customers.
                <br />
                <button className="flex text-center justify-center items-center mx-auto lg:mx-0 hover:underline bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-110 duration-300 ease-in-out text-lg">
                  Get Started
                </button>
                <br />
                Our team will guide you through every step of the registration process.
                <br />
                <br />
                Need help? <a className="text-pink-500 " href="https://">
                  Learn more here
                </a>
              </p>
            </div>
            <div className="w-full sm:w-1/2 p-6">
              <Image className="w-full object-cover  " src="/repair_works.png" alt="Technician at work" width={500} height={300} />
            </div>
          </div>

          <div className="flex flex-wrap flex-col-reverse sm:flex-row">
            <div className="w-full sm:w-1/2 p-6 mt-6">
              <Image className="w-full object-cover rounded-lg shadow" src="/earn.jpg" alt="Earn as a technician" width={500} height={300} />
            </div>
            <div className="w-full sm:w-1/2 p-6 mt-6">
              <div className="align-middle">
                <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
                  Get Certified, Start Earning Today!
                </h3>
                <p className="text-gray-600 mb-8">
                  Obtain your service license and unlock new earning opportunities.
                  <br />
                  <br />
                  For more information <a className="text-pink-500 " href="https://">
                    click here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}