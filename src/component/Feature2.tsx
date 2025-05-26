"use client";

export default function ServicesSection() {
  return (
    <section className="bg-white border-b py-8">
      <div className="container max-w-5xl mx-auto m-8">
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
        </div>
        <div className="flex flex-wrap">
          <div className="w-5/6 sm:w-1/2 p-6">
            <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
            Fixing made simple
            </h3>
            <h1 className="text-gray-800 mb-8">Technicians always at reach</h1>

            <button className="flex text-center justify-center items-center mx-auto lg:mx-0 hover:underline bg-green-700 text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-110 duration-300 ease-in-out">
              Book a Call
            </button>
            <h1 className="text-black mb-8 text-xl font-bold">
              <br />
              We ensure you get your devices fixed at the most affordable Price.
            </h1>
          </div>
          <div className="w-full sm:w-1/2 p-6">
            <img className="w-full object-cover" src="/pic2.jpg" alt="hero" />
          </div>
        </div>

        <div className="flex flex-wrap flex-col-reverse sm:flex-row">
          <div className="w-full sm:w-1/2 p-6 mt-6">
            <img className="w-full object-cover" src="/pic1.jpg" alt="hero" />
          </div>
          <div className="w-full sm:w-1/2 p-6 mt-6">
            <div className="align-middle">
              <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
                Explore Services
              </h3>
              <p className="text-gray-600 mb-8">
              Technicians need to obtain their service licence
                <br />
                <br />
                  For more information <a className="text-pink-500 underline" href="https://">link</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
