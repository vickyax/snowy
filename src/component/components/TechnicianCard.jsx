import React from 'react';

const TechnicianCard = ({ tech }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start">
        <img
          src={tech.profilePhoto || '/default-avatar.png'}
          alt={tech.name}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">{tech.name}</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              {tech.availableNow ? 'Available Now' : 'Available Soon'}
            </span>
          </div>

          <div className="mt-1 flex items-center">
            <div className="flex text-yellow-400">
              {Array(5).fill(0).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 fill-current ${
                    i < Math.floor(tech.rating) ? '' : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({tech.reviews} reviews)
            </span>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Expertise:</span> {tech.expertise.length>1?tech.expertise.join(', '):tech.expertise[0]}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Rate:</span> ₹{tech.hourlyRate}/hour
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Distance:</span> {tech.distance} km
            </p>
          </div>

          <div className="mt-4 flex space-x-4">
            <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Book Now
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianCard;
