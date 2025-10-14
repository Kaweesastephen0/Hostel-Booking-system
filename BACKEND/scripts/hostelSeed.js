import mongoose from 'mongoose';
import Hostel from '../../models/Hostel.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleHostels = [
  {
    name: "Sun ways Hostel",
    description: "A comfortable and secure hostel located in the heart of Wandegeya, perfect for students.",
    address: "Wandegeya kikoni off Western gate",
    price: 400000, 
    image: "https://images.pexels.com/photos/20237982/pexels-photo-20237982.jpeg",
    images: [
      "https://images.pexels.com/photos/20237982/pexels-photo-20237982.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["wifi", "security", "water", "electricity", "parking"],
    distance: "0.5 km",
    contact: "0709167919", // Uganda format without +256
    email: "info@sunwayshostel.com",
    location: "Wandegeya",
    roomTypes: {
      single: 5,
      double: 8,
      shared: 12
    },
    rating: {
      average: 4.5,
      count: 24
    },
    featured: true,
    owner: "John Mugisha"
  },
  {
    name: "Modern Living Apartments",
    description: "Modern apartments with all amenities included, located near the main gate.",
    address: "Kikoni Street, Near Main Gate",
    price: 500000, // Divisible by 1000 ✓
    image: "https://images.pexels.com/photos/18153132/pexels-photo-18153132.jpeg",
    images: [
      "https://images.pexels.com/photos/18153132/pexels-photo-18153132.jpeg",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
    ],
    amenities: ["wifi", "security", "water", "electricity", "parking", "laundry"],
    distance: "0.3 km",
    contact: "0701234567", // Fixed phone format
    email: "modernliving@apartments.com",
    location: "Kikoni",
    roomTypes: {
      single: 3,
      double: 10,
      shared: 15
    },
    rating: {
      average: 4.8,
      count: 32
    },
    featured: true,
    owner: "Sarah Namutebi"
  },
  {
    name: "Student Paradise",
    description: "Affordable and comfortable accommodation for students on a budget.",
    address: "Makerere University Road",
    price: 350000, // Divisible by 1000 ✓
    image: "https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg",
    images: [
      "https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg"
    ],
    amenities: ["wifi", "security", "water", "electricity"],
    distance: "0.7 km",
    contact: "0712345678", // Fixed phone format
    email: "paradise@studenthostel.com",
    location: "Wandegeya",
    roomTypes: {
      single: 2,
      double: 6,
      shared: 20
    },
    rating: {
      average: 4.2,
      count: 18
    },
    featured: false,
    owner: "David Ochieng"
  },
  {
    name: "Campus Heights",
    description: "Luxury student accommodation with premium amenities and great views.",
    address: "Wandegeya Main Street",
    price: 450000, // Divisible by 1000 ✓
    image: "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg",
    images: [
      "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg",
      "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg"
    ],
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym", "study room"],
    distance: "0.4 km",
    contact: "0723456789", // Fixed phone format
    email: "campusheights@luxury.com",
    location: "Wandegeya",
    roomTypes: {
      single: 8,
      double: 12,
      shared: 10
    },
    rating: {
      average: 4.7,
      count: 45
    },
    featured: true,
    owner: "Maria Nalwanga"
  },
  {
    name: "University Residence",
    description: "Comfortable residence with a homely atmosphere for students.",
    address: "Kikoni Zone 3",
    price: 380000, // Divisible by 1000 ✓
    image: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
    images: [
      "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg"
    ],
    amenities: ["wifi", "security", "water", "electricity", "common room"],
    distance: "0.6 km",
    contact: "0734567890", // Fixed phone format
    email: "universityresidence@hostel.com",
    location: "Kikoni",
    roomTypes: {
      single: 4,
      double: 8,
      shared: 16
    },
    rating: {
      average: 4.3,
      count: 22
    },
    featured: false,
    owner: "Robert Ssemakula"
  },
  {
    name: "Scholar's Place",
    description: "Quiet and conducive environment for serious students.",
    address: "Makerere Hill View",
    price: 420000, // Divisible by 1000 ✓
    image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg",
    images: [
      "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg"
    ],
    amenities: ["wifi", "security", "water", "electricity", "study room", "library"],
    distance: "0.8 km",
    contact: "0745678901", // Fixed phone format
    email: "scholarsplace@academic.com",
    location: "Nankulabye", // Fixed to match schema enum
    roomTypes: {
      single: 6,
      double: 8,
      shared: 14
    },
    rating: {
      average: 4.6,
      count: 28
    },
    featured: true,
    owner: "Dr. James Kato"
  },
  {
    name: "Elite Student Residence",
    description: "Premium accommodation with all modern facilities for discerning students.",
    address: "Makerere Main Campus",
    price: 550000, // Divisible by 1000 ✓
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg"
    ],
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym", "cafeteria", "hot shower"],
    distance: "0.2 km",
    contact: "0756789012", // Fixed phone format
    email: "elite@studentresidence.com",
    location: "Wandegeya",
    roomTypes: {
      single: 10,
      double: 15,
      shared: 5
    },
    rating: {
      average: 4.9,
      count: 56
    },
    featured: true,
    owner: "Elite Properties Ltd"
  },
  {
    name: "Comfort Suites",
    description: "Affordable comfort with all basic amenities for student living.",
    address: "Near Makerere Hospital",
    price: 390000, // Divisible by 1000 ✓
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    images: [
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
    ],
    amenities: ["wifi", "security", "water", "electricity", "laundry"],
    distance: "0.9 km",
    contact: "0767890123", // Fixed phone format
    email: "comfortsuites@hostel.com",
    location: "Ntinda",
    roomTypes: {
      single: 3,
      double: 7,
      shared: 18
    },
    rating: {
      average: 4.1,
      count: 15
    },
    featured: false,
    owner: "Comfort Hostels Group"
  }
];

const seedHostels = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB and ready to seed');

    // Clear existing hostels
    await Hostel.deleteMany({});
    console.log('Cleared existing hostels');

    // Insert sample hostels
    const insertedHostels = await Hostel.insertMany(sampleHostels);
    console.log(`Successfully inserted ${insertedHostels.length} hostels`);

    // Display inserted hostels
    insertedHostels.forEach(hostel => {
      console.log(`- ${hostel.name} (${hostel.location}) - UGX ${hostel.price.toLocaleString()}`);
    });

  } catch (error) {
    console.error('Error seeding hostels:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedHostels();