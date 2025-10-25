import mongoose from 'mongoose';
import Hostel from '../models/HostelModel.js';
import Room from '../models/roomModel.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleHostels = [
  // These hostels will have rooms 1M and above
  {
    name: "Olympia Hostel",
    description: "A comfortable and secure hostel located in the heart of Makerere.",
    image: "https://images.pexels.com/photos/20237982/pexels-photo-20237982.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym"],
    HostelGender: "mixed",
    distance: "0.3 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.5, count: 24 },
    featured: true,
    rooms: []
  },
  {
    name: "Lady Juliana Hostel",
    description: "Modern apartments with all amenities included.",
    image: "https://images.pexels.com/photos/18153132/pexels-photo-18153132.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "laundry"],
    HostelGender: "female",
    distance: "0.2 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.3, count: 32 },
    featured: true,
    rooms: []
  },
  {
    name: "Apex Hostel",
    description: "Luxury student accommodation with premium amenities.",
    image: "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym"],
    HostelGender: "female",
    distance: "0.3 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.7, count: 45 },
    featured: true,
    rooms: []
  },
  {
    name: "Aryan Hostel",
    description: "Premium accommodation with all modern facilities.",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym"],
    HostelGender: "mixed",
    distance: "0.2 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.4, count: 56 },
    featured: true,
    rooms: []
  },
  {
    name: "Castle Ville Hostel",
    description: "Premium student residence with modern facilities.",
    image: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym"],
    HostelGender: "mixed",
    distance: "0.3 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.6, count: 29 },
    featured: true,
    rooms: []
  },
  {
    name: "Dream World Hostel",
    description: "Luxury accommodation for students.",
    image: "https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym"],
    HostelGender: "mixed",
    distance: "0.4 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.7, count: 51 },
    featured: true,
    rooms: []
  },

  // These hostels will have rooms below 1M
  {
    name: "Nakiyingi Hostel",
    description: "Affordable accommodation for students on a budget.",
    image: "https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg",
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "mixed",
    distance: "0.4 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.2, count: 18 },
    featured: false,
    rooms: []
  },
  {
    name: "New Nana Hostel",
    description: "Comfortable residence for students near LDC.",
    image: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "mixed",
    distance: "0.5 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.3, count: 22 },
    featured: false,
    rooms: []
  },
  {
    name: "Baskon Hostel",
    description: "Affordable comfort with basic amenities.",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "mixed",
    distance: "0.7 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.1, count: 15 },
    featured: false,
    rooms: []
  },
  {
    name: "Akwata Empola Hostel",
    description: "Popular student hostel with friendly environment.",
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "mixed",
    distance: "0.3 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.0, count: 42 },
    featured: false,
    rooms: []
  },
  {
    name: "Muhika Hostel",
    description: "Budget-friendly accommodation for students.",
    image: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg",
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "mixed",
    distance: "0.6 km",
    location: "Makerere",
    availability: true,
    rating: { average: 3.9, count: 38 },
    featured: false,
    rooms: []
  },
  {
    name: "JJ Hostel",
    description: "Family-run hostel with personalized service.",
    image: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg",
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "mixed",
    distance: "0.7 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.2, count: 36 },
    featured: false,
    rooms: []
  },
   {
    name: "Green Valley Hostel",
    description: "Eco-friendly budget accommodation with garden space.",
    image: "https://images.pexels.com/photos/2091166/pexels-photo-2091166.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "garden"],
    HostelGender: "mixed",
    distance: "0.8 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.0, count: 25 },
    featured: false,
    rooms: []
  },
  {
    name: "Student Comfort Hostel",
    description: "Perfect for students seeking comfortable budget living.",
    image: "https://images.pexels.com/photos/271706/pexels-photo-271706.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "common room"],
    HostelGender: "mixed",
    distance: "0.5 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.1, count: 30 },
    featured: false,
    rooms: []
  },
  {
    name: "Campus View Hostel",
    description: "Budget hostel with great views of the campus area.",
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "female",
    distance: "0.6 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.3, count: 28 },
    featured: false,
    rooms: []
  },
   {
    name: "Urban Lodge Hostel",
    description: "Modern urban living at affordable prices.",
    image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "laundry"],
    HostelGender: "mixed",
    distance: "0.9 km",
    location: "Makerere",
    availability: true,
    rating: { average: 3.8, count: 22 },
    featured: false,
    rooms: []
  },
  {
    name: "Scholar's Rest Hostel",
    description: "Quiet environment perfect for focused students.",
    image: "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg",
    amenities: ["wifi", "security", "water", "electricity", "study room"],
    HostelGender: "male",
    distance: "0.7 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.4, count: 35 },
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

    // 2. Create rooms for each hostel
    const sampleRooms = [];

    // Rooms for hostels that will have 1M+ rooms (first 6 hostels)
    // Olympia Hostel - all rooms 1M+
    sampleRooms.push(
      {
        roomNumber: "OLY-101",
        roomImage: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 1200000,
        hostelId: insertedHostels[0]._id,
        bookingPrice: 96000,
        roomDescription: 'Spacious single room with great ventilation',
        maxOccupancy: 1,
      },
      {
        roomNumber: "OLY-102",
        roomImage: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
        roomType: "double", 
        roomGender: "mixed", 
        roomPrice: 1800000, 
        hostelId: insertedHostels[0]._id,
        bookingPrice: 180000, 
        roomDescription: 'Comfortable double room', 
        maxOccupancy: 2, 
      }
    );

    // Lady Juliana Hostel - all rooms 1M+
    sampleRooms.push(
      {
        roomNumber: "LJH-201",
        roomImage: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 1100000,
        hostelId: insertedHostels[1]._id,
        bookingPrice: 88000,
        roomDescription: 'Cozy single room',
        maxOccupancy: 1,
      },
      {
        roomNumber: "LJH-202",
        roomImage: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
        roomType: "double", 
        roomGender: "female", 
        roomPrice: 1600000, 
        hostelId: insertedHostels[1]._id,
        bookingPrice: 160000, 
        roomDescription: 'Luxury double room', 
        maxOccupancy: 2, 
      }
    );

    // Apex Hostel - all rooms 1M+
    sampleRooms.push(
      {
        roomNumber: "APX-301",
        roomImage: "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg",
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 1300000,
        hostelId: insertedHostels[2]._id,
        bookingPrice: 104000,
        roomDescription: 'Premium single room',
        maxOccupancy: 1,
      },
      {
        roomNumber: "APX-302",
        roomImage: "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg",
        roomType: "double", 
        roomGender: "female", 
        roomPrice: 2000000, 
        hostelId: insertedHostels[2]._id,
        bookingPrice: 200000, 
        roomDescription: 'Executive double room', 
        maxOccupancy: 2, 
      }
    );

    // Aryan Hostel - all rooms 1M+
    sampleRooms.push(
      {
        roomNumber: "ARY-401",
        roomImage: "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg",
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 1400000,
        hostelId: insertedHostels[3]._id,
        bookingPrice: 112000,
        roomDescription: 'Luxury single room',
        maxOccupancy: 1,
      }
    );

    // Castle Ville Hostel - all rooms 1M+
    sampleRooms.push(
      {
        roomNumber: "CVL-501",
        roomImage: "https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg",
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 1500000,
        hostelId: insertedHostels[4]._id,
        bookingPrice: 120000,
        roomDescription: 'Premium single room',
        maxOccupancy: 1,
      }
    );

    // Dream World Hostel - all rooms 1M+
    sampleRooms.push(
      {
        roomNumber: "DWH-601",
        roomImage: "https://images.pexels.com/photos/6585763/pexels-photo-6585763.jpeg",
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 1700000,
        hostelId: insertedHostels[5]._id,
        bookingPrice: 136000,
        roomDescription: 'Luxury single room',
        maxOccupancy: 1,
      }
    );

    // Rooms for hostels that will have below 1M rooms (remaining hostels)
    // Nakiyingi Hostel - all rooms below 1M
    sampleRooms.push(
      {
        roomNumber: "NAK-701",
        roomImage: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg",
        roomType: 'shared', 
        roomGender: 'mixed', 
        roomPrice: 600000,
        hostelId: insertedHostels[6]._id,
        bookingPrice: 36000,
        roomDescription: 'Budget shared accommodation',
        maxOccupancy: 4,
      },
      {
        roomNumber: "NAK-702",
        roomImage: "https://images.pexels.com/photos/271706/pexels-photo-271706.jpeg",
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 800000,
        hostelId: insertedHostels[6]._id,
        bookingPrice: 64000,
        roomDescription: 'Affordable single room',
        maxOccupancy: 1,
      }
    );

    // New Nana Hostel - all rooms below 1M
    sampleRooms.push(
      {
        roomNumber: "NAN-801",
        roomImage: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg",
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 700000,
        hostelId: insertedHostels[7]._id,
        bookingPrice: 56000,
        roomDescription: 'Comfortable single room',
        maxOccupancy: 1,
      }
    );

    // Baskon Hostel - all rooms below 1M
    sampleRooms.push(
      {
        roomNumber: "BSK-901",
        roomImage: "https://images.pexels.com/photos/271706/pexels-photo-271706.jpeg",
        roomType: 'shared', 
        roomGender: 'mixed', 
        roomPrice: 500000,
        hostelId: insertedHostels[8]._id,
        bookingPrice: 30000,
        roomDescription: 'Budget shared room',
        maxOccupancy: 4,
      }
    );

    // Akwata Empola Hostel - all rooms below 1M
    sampleRooms.push(
      {
        roomNumber: "AKE-1001",
        roomImage: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg",
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 650000,
        hostelId: insertedHostels[9]._id,
        bookingPrice: 52000,
        roomDescription: 'Affordable single room',
        maxOccupancy: 1,
      }
    );

    // Muhika Hostel - all rooms below 1M
    sampleRooms.push(
      {
        roomNumber: "MUH-1101",
        roomImage: "https://images.pexels.com/photos/271706/pexels-photo-271706.jpeg",
        roomType: 'shared', 
        roomGender: 'mixed', 
        roomPrice: 450000,
        hostelId: insertedHostels[10]._id,
        bookingPrice: 27000,
        roomDescription: 'Budget shared accommodation',
        maxOccupancy: 4,
      }
    );
    // Add after your existing room definitions...

// Green Valley Hostel - all rooms below 600,000
sampleRooms.push(
  {
    roomNumber: "GVH-1301",
    roomImage: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg",
    roomType: 'shared', 
    roomGender: 'mixed', 
    roomPrice: 450000,
    hostelId: insertedHostels[12]._id,
    bookingPrice: 27000,
    roomDescription: 'Budget shared room with garden view',
    maxOccupancy: 4,
  },
  {
    roomNumber: "GVH-1302",
    roomImage: "https://images.pexels.com/photos/271706/pexels-photo-271706.jpeg",
    roomType: 'single', 
    roomGender: 'mixed', 
    roomPrice: 580000,
    hostelId: insertedHostels[12]._id,
    bookingPrice: 46400,
    roomDescription: 'Affordable single room',
    maxOccupancy: 1,
  }
);

// Student Comfort Hostel - all rooms below 600,000
sampleRooms.push(
  {
    roomNumber: "SCH-1401",
    roomImage: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg",
    roomType: 'single', 
    roomGender: 'mixed', 
    roomPrice: 400000,
    hostelId: insertedHostels[13]._id,
    bookingPrice: 44000,
    roomDescription: 'Comfortable single room',
    maxOccupancy: 1,
  }
);

// Campus View Hostel - all rooms below 600,000
sampleRooms.push(
  {
    roomNumber: "CVH-1501",
    roomImage: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    roomType: 'shared', 
    roomGender: 'female', 
    roomPrice: 400000,
    hostelId: insertedHostels[14]._id,
    bookingPrice: 28800,
    roomDescription: 'Shared room for female students',
    maxOccupancy: 3,
  },
  {
    roomNumber: "CVH-1502",
    roomImage: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    roomType: 'single', 
    roomGender: 'female', 
    roomPrice: 500000,
    hostelId: insertedHostels[14]._id,
    bookingPrice: 47200,
    roomDescription: 'Single room with campus view',
    maxOccupancy: 1,
  }
);

// Urban Lodge Hostel - all rooms below 600,000
sampleRooms.push(
  {
    roomNumber: "ULH-1601",
    roomImage: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
    roomType: 'shared', 
    roomGender: 'mixed', 
    roomPrice: 450000,
    hostelId: insertedHostels[15]._id,
    bookingPrice: 25200,
    roomDescription: 'Budget urban accommodation',
    maxOccupancy: 4,
  }
);

// Scholar's Rest Hostel - all rooms below 600,000
sampleRooms.push(
  {
    roomNumber: "SRH-1701",
    roomImage: "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg",
    roomType: 'single', 
    roomGender: 'male', 
    roomPrice: 570000,
    hostelId: insertedHostels[16]._id,
    bookingPrice: 45600,
    roomDescription: 'Quiet single room for studying',
    maxOccupancy: 1,
  },
  {
    roomNumber: "SRH-1702",
    roomImage: "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg",
    roomType: 'double', 
    roomGender: 'male', 
    roomPrice: 520000,
    hostelId: insertedHostels[16]._id,
    bookingPrice: 52000,
    roomDescription: 'Double room for student buddies',
    maxOccupancy: 2,
  }
);

    // JJ Hostel - all rooms below 1M
    sampleRooms.push(
      {
        roomNumber: "JJH-1201",
        roomImage: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg",
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 750000,
        hostelId: insertedHostels[11]._id,
        bookingPrice: 60000,
        roomDescription: 'Comfortable single room',
        maxOccupancy: 1,
      },
      
    );

    // 3. Insert all rooms
    const insertedRooms = await Room.insertMany(sampleRooms);
    console.log(`✅ Successfully inserted ${insertedRooms.length} rooms`);

    // 4. Update hostels with room references
    console.log('\n🔗 Linking rooms to hostels...');
    for (const hostel of insertedHostels) {
      const hostelRooms = insertedRooms.filter(room => 
        room.hostelId.toString() === hostel._id.toString()
      );
      
      const roomIds = hostelRooms.map(room => room._id);
      
      await Hostel.findByIdAndUpdate(
        hostel._id,
        { $set: { rooms: roomIds } },
        { new: true }
      );
      
      console.log(`   ✅ ${hostel.name}: ${hostelRooms.length} rooms linked`);
    }

    // 5. Display final summary
    console.log('\n✅ SEEDING COMPLETED SUCCESSFULLY! 🎉');
    console.log('=====================================');
    console.log(`Total Hostels: ${insertedHostels.length}`);
    console.log(`Total Rooms: ${insertedRooms.length}`);
    
    console.log('\n📊 Hostels with rooms 1M+:');
    const hostelsWithRooms = await Hostel.find().populate('rooms');
    hostelsWithRooms.forEach(hostel => {
      const roomPrices = hostel.rooms.map(room => room.roomPrice);
      const minPrice = Math.min(...roomPrices);
      const maxPrice = Math.max(...roomPrices);
      console.log(`   🏨 ${hostel.name}: UGX ${minPrice.toLocaleString()} - UGX ${maxPrice.toLocaleString()}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the seeding
seedAll();