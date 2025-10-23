import mongoose from 'mongoose';
import Hostel from '../models/HostelModel.js';
import Room from '../models/roomModel.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleHostels = [
  {
    name: "Sun ways Hostel",
    description: "A comfortable and secure hostel located in the heart of Wandegeya, perfect for students.",
    image: "https://images.pexels.com/photos/20237982/pexels-photo-20237982.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking"],
    HostelGender: "male",
    distance: "0.5 km",
    location: "Wandegeya",
    availability: true,
    rating: {
      average: 4.5,
      count: 24
    },
    featured: true,
    rooms: [] // Initialize empty rooms array
  },
  {
    name: "Modern Living Apartments",
    description: "Modern apartments with all amenities included, located near the main gate.",
    image: "https://images.pexels.com/photos/18153132/pexels-photo-18153132.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "laundry"],
    HostelGender: "female",
    distance: "0.3 km",
    location: "Kikoni",
    availability: true,
    rating: {
      average: 4.0,
      count: 32
    },
    featured: true,
    rooms: []
  },
  {
    name: "Student Paradise",
    description: "Affordable and comfortable accommodation for students on a budget.",
    image: "https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg",
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "male",
    distance: "0.7 km",
    location: "Wandegeya",
    availability: true,
    rating: {
      average: 4.2,
      count: 18
    },
    featured: false,
    rooms: []
  },
  {
    name: "Campus Heights",
    description: "Luxury student accommodation with premium amenities and great views.",
    image: "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym", "study room"],
    HostelGender: "female",
    distance: "0.4 km",
    location: "Wandegeya",
    availability: true,
    rating: {
      average: 4.7,
      count: 45
    },
    featured: true,
    rooms: []
  },
  {
    name: "University Residence",
    description: "Comfortable residence with a homely atmosphere for students.",
    image: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "common room"],
    HostelGender: "male",
    distance: "0.6 km",
    location: "Kikoni",
    availability: true,
    rating: {
      average: 4.3,
      count: 22
    },
    featured: false,
    rooms: []
  },
  {
    name: "Scholar's Place",
    description: "Quiet and conducive environment for serious students.",
    image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "study room", "library"],
    HostelGender: "female",
    distance: "0.8 km",
    location: "Nankulabye",
    availability: true,
    rating: {
      average: 4.6,
      count: 28
    },
    featured: true,
    rooms: []
  },
  {
    name: "Elite Student Residence",
    description: "Premium accommodation with all modern facilities for discerning students.",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym", "cafeteria", "hot shower"],
    HostelGender: "male",
    distance: "0.2 km",
    location: "Wandegeya",
    availability: true,
    rating: {
      average: 4.9,
      count: 56
    },
    featured: true,
    rooms: []
  },
  {
    name: "Comfort Suites",
    description: "Affordable comfort with all basic amenities for student living.",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "laundry"],
    HostelGender: "female",
    distance: "0.9 km",
    location: "Ntinda",
    availability: true,
    rating: {
      average: 4.1,
      count: 15
    },
    featured: false,
    rooms: []
  }
];

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB and ready to seed');

    // Clear existing data
    await Room.deleteMany({});
    await Hostel.deleteMany({});
    console.log('🗑️  Cleared existing hostels and rooms');

    // 1. Insert hostels
    const insertedHostels = await Hostel.insertMany(sampleHostels);
    console.log(`✅ Successfully inserted ${insertedHostels.length} hostels`);

    // Display inserted hostels with their IDs
    console.log('\n📋 Inserted Hostels:');
    insertedHostels.forEach(hostel => {
      console.log(`   ${hostel.name} - ID: ${hostel._id}`);
    });

    // 2. Create rooms for each hostel
    const sampleRooms = [
      // Rooms for Sun ways Hostel (index 0)
      {
        roomNumber: "SW-101",
        roomImage: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
        roomType: 'single', 
        roomGender: 'male', 
        roomPrice: 600000,
        hostelId: insertedHostels[0]._id,
        bookingPrice: 50000,
        roomDescription: 'Spacious single room with great ventilation and natural light',
        maxOccupancy: 1,
      },
      {
        roomNumber: "SW-102",
        roomImage: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
        roomType: "double", 
        roomGender: "male", 
        roomPrice: 800000, 
        hostelId: insertedHostels[0]._id,
        bookingPrice: 80000, 
        roomDescription: 'Comfortable double room with shared bathroom', 
        maxOccupancy: 2, 
      },
      {
        roomNumber: "SW-103",
        roomImage: "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg",
        roomType: "shared", 
        roomGender: "male", 
        roomPrice: 600000, 
        hostelId: insertedHostels[0]._id,
        bookingPrice: 40000, 
        roomDescription: 'Shared room perfect for budget-conscious students', 
        maxOccupancy: 4, 
      },

      // Rooms for Modern Living Apartments (index 1)
      {
        roomNumber: "ML-201",
        roomImage: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 1000000,
        hostelId: insertedHostels[1]._id,
        bookingPrice: 60000,
        roomDescription: 'Cozy single room with private bathroom',
        maxOccupancy: 1,
      },
      {
        roomNumber: "ML-202",
        roomImage: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
        roomType: "double", 
        roomGender: "female", 
        roomPrice: 1000000, 
        hostelId: insertedHostels[1]._id,
        bookingPrice: 90000, 
        roomDescription: 'Luxury double room with balcony', 
        maxOccupancy: 2, 
      },

      // Rooms for Student Paradise (index 2)
      {
        roomNumber: "SP-301",
        roomImage: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg",
        roomType: 'shared', 
        roomGender: 'male', 
        roomPrice: 700000,
        hostelId: insertedHostels[2]._id,
        bookingPrice: 30000,
        roomDescription: 'Budget-friendly shared accommodation',
        maxOccupancy: 3,
      },

      // Rooms for Campus Heights (index 3)
      {
        roomNumber: "CH-401",
        roomImage: "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg",
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 700000,
        hostelId: insertedHostels[3]._id,
        bookingPrice: 70000,
        roomDescription: 'Premium single room with study area',
        maxOccupancy: 1,
      },
      {
        roomNumber: "CH-402",
        roomImage: "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg",
        roomType: "double", 
        roomGender: "female", 
        roomPrice: 1000000, 
        hostelId: insertedHostels[3]._id,
        bookingPrice: 100000, 
        roomDescription: 'Executive double room with private facilities', 
        maxOccupancy: 2, 
      },

      // Rooms for University Residence (index 4)
      {
        roomNumber: "UR-501",
        roomImage: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg",
        roomType: 'single', 
        roomGender: 'male', 
        roomPrice: 1000000,
        hostelId: insertedHostels[4]._id,
        bookingPrice: 45000,
        roomDescription: 'Comfortable single room in quiet environment',
        maxOccupancy: 1,
      },

      // Rooms for Scholar's Place (index 5)
      {
        roomNumber: "SC-601",
        roomImage: "https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg",
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 680000,
        hostelId: insertedHostels[5]._id,
        bookingPrice: 65000,
        roomDescription: 'Quiet single room perfect for studying',
        maxOccupancy: 1,
      },

      // Rooms for Elite Student Residence (index 6)
      {
        roomNumber: "ES-701",
        roomImage: "https://images.pexels.com/photos/6585763/pexels-photo-6585763.jpeg",
        roomType: 'single', 
        roomGender: 'male', 
        roomPrice: 750000,
        hostelId: insertedHostels[6]._id,
        bookingPrice: 75000,
        roomDescription: 'Luxury single room with AC and hot shower',
        maxOccupancy: 1,
      },
      {
        roomNumber: "ES-702",
        roomImage: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg",
        roomType: "double", 
        roomGender: "male", 
        roomPrice: 900000, 
        hostelId: insertedHostels[6]._id,
        bookingPrice: 120000, 
        roomDescription: 'Premium double room with all amenities', 
        maxOccupancy: 2, 
      },

      // Rooms for Comfort Suites (index 7)
      {
        roomNumber: "CS-801",
        roomImage: "https://images.pexels.com/photos/271706/pexels-photo-271706.jpeg",
        roomType: 'shared', 
        roomGender: 'female', 
        roomPrice: 680000,
        hostelId: insertedHostels[7]._id,
        bookingPrice: 35000,
        roomDescription: 'Affordable shared room with basic amenities',
        maxOccupancy: 3,
      }
    ];

    // 3. Insert all rooms
    const insertedRooms = await Room.insertMany(sampleRooms);
    console.log(`✅ Successfully inserted ${insertedRooms.length} rooms`);

    // 4. Update hostels with room references - THIS IS THE CRITICAL PART
    console.log('\n🔗 Linking rooms to hostels...');
    for (const hostel of insertedHostels) {
      const hostelRooms = insertedRooms.filter(room => 
        room.hostelId.toString() === hostel._id.toString()
      );
      
      const roomIds = hostelRooms.map(room => room._id);
      
      // Update the hostel document with room IDs
      await Hostel.findByIdAndUpdate(
        hostel._id,
        { $set: { rooms: roomIds } },
        { new: true }
      );
      
      console.log(`   ✅ ${hostel.name}: ${hostelRooms.length} rooms linked`);
    }

    // 5. Verify the update by fetching a hostel with populated rooms
    console.log('\n🔍 Verifying data...');
    const verifyHostel = await Hostel.findOne({ name: "Sun ways Hostel" }).populate('rooms');
    console.log(`   Sun ways Hostel has ${verifyHostel.rooms.length} rooms`);
    console.log(`   Room prices: ${verifyHostel.rooms.map(r => r.roomPrice).join(', ')}`);

    // 6. Display final summary
    console.log('\n✅ SEEDING COMPLETED SUCCESSFULLY! 🎉');
    console.log('=====================================');
    console.log(`Total Hostels: ${insertedHostels.length}`);
    console.log(`Total Rooms: ${insertedRooms.length}`);
    
    console.log('\n📊 Hostel Room Distribution:');
    for (const hostel of insertedHostels) {
      const hostelWithRooms = await Hostel.findById(hostel._id).populate('rooms');
      const roomTypes = [...new Set(hostelWithRooms.rooms.map(room => room.roomType))];
      const priceRange = hostelWithRooms.rooms.length > 0 ? 
        `UGX ${Math.min(...hostelWithRooms.rooms.map(room => room.roomPrice)).toLocaleString()} - UGX ${Math.max(...hostelWithRooms.rooms.map(room => room.roomPrice)).toLocaleString()}` : 
        'No rooms';
      
      console.log(`\n   🏨 ${hostelWithRooms.name}`);
      console.log(`      📍 ${hostelWithRooms.location} | 👥 ${hostelWithRooms.HostelGender}`);
      console.log(`      🚪 ${hostelWithRooms.rooms.length} rooms (${roomTypes.join(', ')})`);
      console.log(`      💰 ${priceRange}`);
      
      // Show room details
      hostelWithRooms.rooms.forEach(room => {
        console.log(`         • ${room.roomNumber} - ${room.roomType} - UGX ${room.roomPrice.toLocaleString()}`);
      });
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the seeding
seedAll();