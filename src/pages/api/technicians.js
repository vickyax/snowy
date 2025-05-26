// pages/api/technicians.js
export default async function handler(req, res) {
  const { location, service } = req.query;

  // Simulate database query - Replace this with actual DB logic
  const mockTechnicians = 
    [
  {
    "name": "John Doe",
    "profilePhoto": "https://randomuser.me/api/portraits/men/1.jpg",
    "availableNow": true,
    "rating": 4.5,
    "reviews": 25,
    "expertise": ["AC Repair", "Plumbing"],
    "hourlyRate": 500,
    "distance": 10,
    "location":"Coimbatore"
  },
  {
    "name": "Jane Smith",
    "profilePhoto": "https://randomuser.me/api/portraits/women/2.jpg",
    "availableNow": false,
    "rating": 4.0,
    "reviews": 15,
    "expertise": ["Carpentry", "Painting"],
    "hourlyRate": 600,
    "distance": 5,
    "location":"Coimbatore"
  },
  {
    "name": "Mike Johnson",
    "profilePhoto": "https://randomuser.me/api/portraits/men/3.jpg",
    "availableNow": true,
    "rating": 3.8,
    "reviews": 10,
    "expertise": ["Washing Machine", "Electrical"],
    "hourlyRate": 700,
    "distance": 20,
    "location":"Coimbatore"
  },
  {
    "name": "Emily Davis",
    "profilePhoto": "https://randomuser.me/api/portraits/women/4.jpg",
    "availableNow": true,
    "rating": 5.0,
    "reviews": 30,
    "expertise": ["Plumbing", "Landscaping"],
    "hourlyRate": 550,
    "distance": 15,
    "location":"Chennai"
  },
  {
    "name": "Chris Brown",
    "profilePhoto": "https://randomuser.me/api/portraits/men/5.jpg",
    "availableNow": false,
    "rating": 4.2,
    "reviews": 20,
    "expertise": ["Masonry", "Roofing"],
    "hourlyRate": 650,
    "distance": 8,
    "location":"Coimbatore"
  }

,
  {
    "name": "Arjun Kumar",
    "profilePhoto": "https://randomuser.me/api/portraits/men/45.jpg",
    "availableNow": true,
    "rating": 4.8,
    "reviews": 52,
    "expertise": ["Laptop and PC"],
    "hourlyRate": 600,
    "distance": 8,
    "location": "Bangalore"
  },
  {
    "name": "Neha Sharma",
    "profilePhoto": "https://randomuser.me/api/portraits/women/67.jpg",
    "availableNow": false,
    "rating": 4.6,
    "reviews": 47,
    "expertise": ["AC Repair"],
    "hourlyRate": 450,
    "distance": 12,
    "location": "Chennai"
  },
  {
    "name": "Ravi Singh",
    "profilePhoto": "https://randomuser.me/api/portraits/men/22.jpg",
    "availableNow": true,
    "rating": 4.3,
    "reviews": 34,
    "expertise": ["Refrigerator"],
    "hourlyRate": 520,
    "distance": 6,
    "location": "Hyderabad"
  },
  {
    "name": "Sneha Iyer",
    "profilePhoto": "https://randomuser.me/api/portraits/women/12.jpg",
    "availableNow": true,
    "rating": 4.7,
    "reviews": 40,
    "expertise": ["Tv Repair"],
    "hourlyRate": 480,
    "distance": 7,
    "location": "Mumbai"
  },
  {
    "name": "Amit Patel",
    "profilePhoto": "https://randomuser.me/api/portraits/men/33.jpg",
    "availableNow": false,
    "rating": 4.4,
    "reviews": 29,
    "expertise": ["Washing Machine"],
    "hourlyRate": 500,
    "distance": 15,
    "location": "Ahmedabad"
  },
  {
    "name": "Priya Desai",
    "profilePhoto": "https://randomuser.me/api/portraits/women/24.jpg",
    "availableNow": true,
    "rating": 4.9,
    "reviews": 58,
    "expertise": ["Wifi Router"],
    "hourlyRate": 400,
    "distance": 9,
    "location": "Pune"
  }


  ];

  const filtered = mockTechnicians.filter(
    tech =>(
      (!location || tech.location.toLowerCase().includes(location.toLowerCase())) &&
      (!service || tech.expertise.some(exp => exp.toLowerCase().includes(service.toLowerCase())))
    )
  );

  res.status(200).json(filtered);
}
