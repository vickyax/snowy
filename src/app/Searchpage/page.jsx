"use client";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/component/Nav';
// --- Data: In a real app, you would import this from a JSON file. ---
// For example: import servicesData from './services.json';
const servicesData = require('@/component/components/services.json')

// --- Helper function to calculate Levenshtein distance ---
const levenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator,
      );
    }
  }
  return matrix[b.length][a.length];
};

// --- Reusable Components ---

const ServiceCard = ({ service }) => (
    <a href={`/TechService/${service.link}`}>
  <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
    <img src={service.image} alt={service.content1} className="w-full h-50 object-cover" />
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-800 truncate">{service.content1}</h2>
      <p className="text-sm text-gray-600 mt-1">{service.content2}</p>
    </div>
  </div>
  </a>
);

const NoResults = ({ searchTerm, services }) => {
  const findClosestMatch = (term) => {
    if (!term) return null;
    let minDistance = Infinity;
    let closestService = null;
    services.forEach(service => {
      const distance = levenshteinDistance(term.toLowerCase(), service.content1.toLowerCase());
      if (distance < minDistance) {
        minDistance = distance;
        closestService = service;
      }
    });
    return closestService;
  };

  const closestMatch = findClosestMatch(searchTerm);

  return (
    <div className="col-span-full bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
      <div className="flex">
        <div className="py-1">
          <svg className="h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">No services found</p>
          {searchTerm && closestMatch ? (
            <p className="text-sm">
              Did you mean: <span className="font-semibold">{closestMatch.content1}</span>?
            </p>
          ) : (
            <p className="text-sm">Try adjusting your search or filter criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ categories, selectedCategories, onCategoryChange, isOpen, setIsOpen }) => (
    <>
        {/* Overlay for mobile */}
        <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform md:relative md:w-60 md:h-auto md:shadow-none md:translate-x-0 md:bg-gray-50 md:rounded-lg ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Categories</h3>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-gray-800">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-2">
                    {categories.map(category => (
                        <label key={category} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-100">
                            <input
                                type="checkbox"
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={onCategoryChange}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 capitalize">{category}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    </>
);


// --- Main App Component ---
export default function App() {
        let searchParams;
  let initialSearch = '';
  try {
    searchParams = useSearchParams();
    initialSearch = searchParams.get('search') || '';
  } catch (e) {
    // If not in a Suspense boundary, fallback to default redirect
    initialSearch = '';
  }
  const [searchTerm, setSearchTerm] = React.useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Memoize category list creation to avoid recalculating on every render
  const categories = React.useMemo(() => {
    const allCategories = new Set();
    servicesData.forEach(service => {
      if (service.category) {
        Array.isArray(service.category) 
          ? service.category.forEach(cat => allCategories.add(cat))
          : allCategories.add(service.category);
      }
    });
    return Array.from(allCategories).sort();
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories(prev =>
      checked ? [...prev, value] : prev.filter(cat => cat !== value)
    );
  };

  // Memoize the filtered results to avoid re-filtering on every render
  const filteredServices = React.useMemo(() => {
    return servicesData.filter(service => {
      const termMatch = `${service.content1} ${service.content2}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      if (selectedCategories.length === 0) {
        return termMatch;
      }
      
      const serviceCategories = Array.isArray(service.category) ? service.category : [service.category];
      const categoryMatch = selectedCategories.some(selCat => serviceCategories.includes(selCat));
      
      return termMatch && categoryMatch;
    });
  }, [searchTerm, selectedCategories]);

  return (
    <>
    <Navbar />
    <div className="bg-gray-100 text-black min-h-screen pt-[200px] pb-[100px]  font-sans">
        
      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          
          {/* Sidebar */}
          <Sidebar 
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
          />

          {/* Main Content */}
          <main className="flex-1">
            <header className="mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">Find a Service</h1>
              <p className="text-gray-600">Search for repairs, installations, and more.</p>
              <div className="relative mt-4 flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search for 'AC Repair', 'Plumbing'..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="md:hidden bg-white p-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 10h12M3 16h6" />
                    </svg>
                </button>
              </div>
            </header>
            
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <NoResults searchTerm={searchTerm} services={servicesData} />
            )}
          </main>
        </div>
      </div>
    </div>
    </>
  );
}
