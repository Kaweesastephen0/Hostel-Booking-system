import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hostel from '../models/Hostel.js';

// Load environment variables
dotenv.config();

const sampleHostels = [
  {
    name: "Kampala City Backpackers",
    description: "A vibrant hostel in the heart of Kampala, perfect for young travelers looking to explore Uganda's capital. Our modern facilities and friendly staff make this the ideal base for your city adventure. Located near major attractions and transport hubs.",
    location: {
      address: "123 Kampala Road",
      city: "Kampala",
      state: "Central Region",
      zipCode: "256",
      coordinates: {
        latitude: 0.3476,
        longitude: 32.5825
      }
    },
    amenities: ["Free WiFi", "Common Room", "Kitchen", "Laundry", "24/7 Reception", "Luggage Storage", "Airport Shuttle", "Tour Booking"],
    roomTypes: [
      {
        type: "dormitory",
        price: 25000,
        capacity: 6,
        available: 2
      },
      {
        type: "double",
        price: 60000,
        capacity: 2,
        available: 1
      },
      {
        type: "single",
        price: 45000,
        capacity: 1,
        available: 3
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
        alt: "Kampala City Backpackers exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
        alt: "Common room"
      }
    ],
    rating: 4.2,
    reviews: [],
    contact: {
      phone: "+256 700 123 456",
      email: "info@kampalabackpackers.com",
      website: "www.kampalabackpackers.com"
    },
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      petPolicy: "Pets not allowed"
    }
  },
  {
    name: "Mukono Garden Hostel",
    description: "Nestled in the beautiful Mukono district with stunning views of Lake Victoria, this cozy hostel offers a peaceful retreat for nature lovers. Perfect for those seeking tranquility away from the city bustle.",
    location: {
      address: "456 Mukono Road",
      city: "Mukono",
      state: "Central Region",
      zipCode: "256",
      coordinates: {
        latitude: 0.3533,
        longitude: 32.7553
      }
    },
    amenities: ["Free WiFi", "Lake Views", "Garden", "Fireplace", "Outdoor Seating", "Parking", "Bicycle Rental", "Fishing"],
    roomTypes: [
      {
        type: "dormitory",
        price: 20000,
        capacity: 8,
        available: 4
      },
      {
        type: "suite",
        price: 85000,
        capacity: 4,
        available: 1
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
        alt: "Mukono Garden Hostel lake view"
      }
    ],
    rating: 4.7,
    reviews: [],
    contact: {
      phone: "+256 700 234 567",
      email: "stay@mukonogarden.com",
      website: "www.mukonogarden.com"
    },
    policies: {
      checkIn: "2:00 PM",
      checkOut: "10:00 AM",
      cancellation: "Free cancellation up to 48 hours before check-in",
      petPolicy: "Pets welcome with additional fee"
    }
  },
  {
    name: "Jinja Adventure Hostel",
    description: "Located near the source of the Nile River, this adventure-focused hostel offers the perfect base for water sports and outdoor activities. Enjoy white water rafting, kayaking, and amazing river views right outside your door.",
    location: {
      address: "789 Nile Crescent",
      city: "Jinja",
      state: "Eastern Region",
      zipCode: "256",
      coordinates: {
        latitude: 0.4244,
        longitude: 33.2042
      }
    },
    amenities: ["Free WiFi", "Nile River Access", "Adventure Tours", "Kayak Rental", "BBQ Area", "Swimming Pool", "Bungee Jumping", "White Water Rafting"],
    roomTypes: [
      {
        type: "dormitory",
        price: 30000,
        capacity: 4,
        available: 1
      },
      {
        type: "double",
        price: 70000,
        capacity: 2,
        available: 2
      },
      {
        type: "suite",
        price: 110000,
        capacity: 6,
        available: 1
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500",
        alt: "Jinja Adventure Hostel Nile view"
      }
    ],
    rating: 4.5,
    reviews: [],
    contact: {
      phone: "+256 700 345 678",
      email: "hello@jinjaadventure.com",
      website: "www.jinjaadventure.com"
    },
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      petPolicy: "Pets not allowed"
    }
  },
  {
    name: "Gulu Cultural Hostel",
    description: "Experience the rich culture of Northern Uganda in this beautifully designed hostel. Rich in Acholi culture and history, perfect for cultural enthusiasts and those wanting to learn about local traditions.",
    location: {
      address: "321 Cultural Lane",
      city: "Gulu",
      state: "Northern Region",
      zipCode: "256",
      coordinates: {
        latitude: 2.7806,
        longitude: 32.2992
      }
    },
    amenities: ["Free WiFi", "Cultural Center", "Library", "Garden", "Cultural Tours", "Local Crafts", "Traditional Music", "Museum Access"],
    roomTypes: [
      {
        type: "single",
        price: 35000,
        capacity: 1,
        available: 2
      },
      {
        type: "double",
        price: 65000,
        capacity: 2,
        available: 1
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500",
        alt: "Gulu Cultural Hostel facade"
      }
    ],
    rating: 4.3,
    reviews: [],
    contact: {
      phone: "+256 700 456 789",
      email: "reservations@gulucultural.com",
      website: "www.gulucultural.com"
    },
    policies: {
      checkIn: "2:00 PM",
      checkOut: "10:00 AM",
      cancellation: "Free cancellation up to 48 hours before check-in",
      petPolicy: "Pets not allowed"
    }
  },
  {
    name: "Kampala Tech Hub Hostel",
    description: "Modern hostel designed for digital nomads and tech-savvy travelers in Uganda's tech capital. High-speed internet, co-working spaces, and a vibrant tech community atmosphere in the heart of Kampala.",
    location: {
      address: "555 Innovation Street, Nakawa",
      city: "Kampala",
      state: "Central Region",
      zipCode: "256",
      coordinates: {
        latitude: 0.3476,
        longitude: 32.5825
      }
    },
    amenities: ["High-Speed WiFi", "Co-working Space", "Tech Events", "Gaming Room", "Coffee Bar", "Meeting Rooms", "Startup Networking", "Coding Bootcamps"],
    roomTypes: [
      {
        type: "dormitory",
        price: 40000,
        capacity: 4,
        available: 2
      },
      {
        type: "single",
        price: 70000,
        capacity: 1,
        available: 1
      },
      {
        type: "suite",
        price: 130000,
        capacity: 2,
        available: 1
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
        alt: "Kampala Tech Hub Hostel co-working space"
      }
    ],
    rating: 4.6,
    reviews: [],
    contact: {
      phone: "+256 700 567 890",
      email: "info@kampalatechhub.com",
      website: "www.kampalatechhub.com"
    },
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      petPolicy: "Pets welcome"
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uganda-hostel-booking');
    console.log('✅ Connected to MongoDB');

    // Clear existing hostels
    await Hostel.deleteMany({});
    console.log('🗑️ Cleared existing hostels');

    // Insert sample hostels
    const insertedHostels = await Hostel.insertMany(sampleHostels);
    console.log(`✅ Successfully seeded ${insertedHostels.length} hostels`);

    // Display summary
    console.log('\n📊 Seeded Uganda Hostels Summary:');
    insertedHostels.forEach(hostel => {
      console.log(`🏨 ${hostel.name} - ${hostel.location.city}, ${hostel.location.state} (Rating: ${hostel.rating})`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('🚀 You can now start the application and browse hostels!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
