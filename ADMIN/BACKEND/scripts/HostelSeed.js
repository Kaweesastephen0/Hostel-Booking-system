import mongoose from 'mongoose';
import Hostel from '../models/HostelModel.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleHostels = [
  {
    name: "Sun ways Hostel",
    description: "A comfortable and secure hostel located in the heart of Wandegeya, perfect for students.",
    address: "Wandegeya kikoni off Western gate",
    image: "https://images.pexels.com/photos/20237982/pexels-photo-20237982.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking"],
    HostelGender: "male", // Added required field
    distance: "0.5 km",
    location: "Wandegeya",
    availability: true,
    rating: {
      average: 4.5,
      count: 24
    },
    featured: true
  },
  {
    name: "Modern Living Apartments",
    description: "Modern apartments with all amenities included, located near the main gate.",
    address: "Kikoni Street, Near Main Gate",
    image: "https://images.pexels.com/photos/18153132/pexels-photo-18153132.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "laundry"],
    HostelGender: "female", // Added required field
    distance: "0.3 km",
    location: "Kikoni",
    availability: true,
    rating: {
      average: 4.8,
      count: 32
    },
    featured: true
  },
  {
    name: "Student Paradise",
    description: "Affordable and comfortable accommodation for students on a budget.",
    address: "Makerere University Road",
    image: "https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg",
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "male", // Added required field
    distance: "0.7 km",
    location: "Wandegeya",
    availability: true,
    rating: {
      average: 4.2,
      count: 18
    },
    featured: false
  },
  {
    name: "Campus Heights",
    description: "Luxury student accommodation with premium amenities and great views.",
    address: "Wandegeya Main Street",
    image: "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym", "study room"],
    HostelGender: "female", // Added required field
    distance: "0.4 km",
    location: "Wandegeya",
    availability: true,
    rating: {
      average: 4.7,
      count: 45
    },
    featured: true
  },
  {
    name: "University Residence",
    description: "Comfortable residence with a homely atmosphere for students.",
    address: "Kikoni Zone 3",
    image: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "common room"],
    HostelGender: "male", // Added required field
    distance: "0.6 km",
    location: "Kikoni",
    availability: true,
    rating: {
      average: 4.3,
      count: 22
    },
    featured: false
  },
  {
    name: "Scholar's Place",
    description: "Quiet and conducive environment for serious students.",
    address: "Makerere Hill View",
    image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "study room", "library"],
    HostelGender: "female", // Added required field
    distance: "0.8 km",
    location: "Nankulabye",
    availability: true,
    rating: {
      average: 4.6,
      count: 28
    },
    featured: true
  },
  {
    name: "Elite Student Residence",
    description: "Premium accommodation with all modern facilities for discerning students.",
    address: "Makerere Main Campus",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym", "cafeteria", "hot shower"],
    HostelGender: "male", // Added required field
    distance: "0.2 km",
    location: "Wandegeya",
    availability: true,
    rating: {
      average: 4.9,
      count: 56
    },
    featured: true
  },
  {
    name: "Comfort Suites",
    description: "Affordable comfort with all basic amenities for student living.",
    address: "Near Makerere Hospital",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "laundry"],
    HostelGender: "female", // Added required field
    distance: "0.9 km",
    location: "Ntinda",
    availability: true,
    rating: {
      average: 4.1,
      count: 15
    },
    featured: false
  }
];

const seedHostels = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB and ready to seed Sir Sam');

    // Clear existing hostels
    await Hostel.deleteMany({});
    console.log('Cleared existing hostels');

    // Insert sample hostels
    const insertedHostels = await Hostel.insertMany(sampleHostels);
    console.log(`Successfully inserted ${insertedHostels.length} hostels`);

    // Display inserted hostels
    insertedHostels.forEach(hostel => {
      console.log(`- ${hostel.name} (${hostel.location}) - ${hostel.HostelGender}`);
    });

  } catch (error) {
    console.error('Error seeding hostels:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};
seedHostels()