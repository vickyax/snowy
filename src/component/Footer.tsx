"use client";

export default function Footer() {

  return (
    <footer className="bg-white">
      <div className="container mx-auto px-8">
        <div className="w-full flex flex-col md:flex-row py-6">
          <div className="flex-1 mb-6 text-black"></div>

          <div className="flex-1">
            <p className="uppercase text-gray-500 md:mb-6">link</p>
            <ul className="list-reset mb-6">
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                FAQs
                </a>
              </li>
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                  help
                </a>
              </li>
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1">
            <p className="uppercase text-gray-500 md:mb-6">Legal</p>
            <ul className="list-reset mb-6">
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                  terms
                </a>
              </li>
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                Privacy
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1">
            <p className="uppercase text-gray-500 md:mb-6">Social</p>
            <ul className="list-reset mb-6">
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                  Facebook
                </a>
              </li>
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                  LinkedIn
                </a>
              </li>
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1">
            <p className="uppercase text-gray-500 md:mb-6">Company</p>
            <ul className="list-reset mb-6">
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                  Offers
                </a>
              </li>
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                  About
                </a>
              </li>
              <li className="mt-2 md:mr-0">
                <a href="#" className="no-underline hover:underline text-gray-800 hover:text-pink-500">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
