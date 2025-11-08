import mongoose from 'mongoose';
import Hostel from '../models/HostelModel.js';
import Room from '../models/roomModel.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleHostels = [
  // Premium hostels (rooms >= 1M)
  {
    name: "Olympia Hostel",
    description: "A comfortable and secure hostel located in the heart of Makerere with modern facilities and 24/7 security.",
    images: [{ url: "https://images.pexels.com/photos/20237982/pexels-photo-20237982.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym", "laundry"],
    HostelGender: "mixed",
    distance: "0.3 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.5, count: 24 },
    featured: true
  },
  {
    name: "Lady Juliana Hostel",
    description: "Modern female-only apartments with all amenities included and excellent security measures.",
    images: [{ url: "https://images.pexels.com/photos/18153132/pexels-photo-18153132.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity", "parking", "laundry", "kitchen"],
    HostelGender: "female",
    distance: "0.2 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.3, count: 32 },
    featured: true
  },
  {
    name: "Apex Hostel",
    description: "Luxury student accommodation with premium amenities including gym and study rooms.",
    images: [{ url: "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity", "parking", "gym", "study_room"],
    HostelGender: "female",
    distance: "0.3 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.7, count: 45 },
    featured: true
  },
  {
    name: "Douglas Villa",
    description: "Spacious and elegant hostel with a homely environment, perfect for serious students.",
    images: [{ url: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity", "parking", "kitchen", "lounge"],
    HostelGender: "mixed",
    distance: "0.5 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.6, count: 38 },
    featured: true
  },
  {
    name: "Mary Stuart Hall",
    description: "Premium female hostel with modern amenities and spacious rooms near main campus.",
    images: [{ url: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity", "parking", "laundry", "study_room"],
    HostelGender: "female",
    distance: "0.4 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.8, count: 52 },
    featured: true
  },
  
  // Mid-range hostels (600k - 1M)
  {
    name: "Akamwesi Hostel",
    description: "Affordable mixed hostel with good security and basic amenities for students.",
    images: [{ url: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "mixed",
    distance: "0.6 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.1, count: 28 },
    featured: false
  },
  {
    name: "Complex Hostel",
    description: "Well-maintained hostel with good ventilation and proximity to lecture rooms.",
    images: [{ url: "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity", "parking"],
    HostelGender: "mixed",
    distance: "0.7 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.0, count: 22 },
    featured: false
  },
  {
    name: "Nsibirwa Hostel",
    description: "Comfortable accommodation with reliable water and electricity supply.",
    images: [{ url: "https://images.pexels.com/photos/2029665/pexels-photo-2029665.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity", "kitchen"],
    HostelGender: "mixed",
    distance: "0.5 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.2, count: 31 },
    featured: false
  },
  {
    name: "Livingstone Hall",
    description: "Classic male hostel with study-friendly environment and good security.",
    images: [{ url: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity", "study_room"],
    HostelGender: "male",
    distance: "0.3 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.3, count: 41 },
    featured: false
  },
  
  // Affordable hostels (rooms < 600k)
  {
    name: "Nakiyingi Hostel",
    description: "Affordable accommodation for students on a budget with basic amenities.",
    images: [{ url: "https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "mixed",
    distance: "0.4 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.2, count: 18 },
    featured: false
  },
  {
    name: "Green Valley Hostel",
    description: "Eco-friendly budget accommodation with garden space and fresh air.",
    images: [{ url: "https://images.pexels.com/photos/2091166/pexels-photo-2091166.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity", "garden"],
    HostelGender: "mixed",
    distance: "0.8 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.0, count: 25 },
    featured: false
  },
  {
    name: "Kikoni View Hostel",
    description: "Budget-friendly hostel in Kikoni with easy access to campus and affordable rates.",
    images: [{ url: "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg", isPrimary: true }],
    amenities: ["security", "water", "electricity"],
    HostelGender: "mixed",
    distance: "1.2 km",
    location: "Kikoni",
    availability: true,
    rating: { average: 3.8, count: 15 },
    featured: false
  },
  {
    name: "Katanga Hostel",
    description: "Affordable student hostel in the lively Katanga area with market access.",
    images: [{ url: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg", isPrimary: true }],
    amenities: ["security", "water", "electricity"],
    HostelGender: "mixed",
    distance: "1.5 km",
    location: "Katanga",
    availability: true,
    rating: { average: 3.9, count: 20 },
    featured: false
  },
  {
    name: "Mitchell Hall",
    description: "Traditional male hostel with spacious rooms and study-friendly atmosphere.",
    images: [{ url: "https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg", isPrimary: true }],
    amenities: ["wifi", "security", "water", "electricity"],
    HostelGender: "male",
    distance: "0.4 km",
    location: "Makerere",
    availability: true,
    rating: { average: 4.1, count: 35 },
    featured: false
  },
  {
    name: "University Hall",
    description: "Historic hostel offering budget accommodation with basic facilities.",
    images: [{ url: "https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg", isPrimary: true }],
    amenities: ["security", "water", "electricity"],
    HostelGender: "male",
    distance: "0.2 km",
    location: "Makerere",
    availability: true,
    rating: { average: 3.7, count: 42 },
    featured: false
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

    // Olympia Hostel - Premium rooms
    const olympiaId = insertedHostels[0]._id;
    sampleRooms.push(
      {
        hostelId: olympiaId,
        roomNumber: "OLY-101",
        roomImages: [{ url: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 1200000,
        bookingPrice: 96000,
        roomDescription: 'Spacious single room with private bathroom and study desk',
        maxOccupancy: 1,
      },
      {
        hostelId: olympiaId,
        roomNumber: "OLY-102",
        roomImages: [{ url: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg", isPrimary: true }],
        roomType: "double", 
        roomGender: "mixed", 
        roomPrice: 1800000, 
        bookingPrice: 180000, 
        roomDescription: 'Comfortable double room with built-in wardrobes', 
        maxOccupancy: 2, 
      },
      {
        hostelId: olympiaId,
        roomNumber: "OLY-103",
        roomImages: [{ url: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'male', 
        roomPrice: 1150000,
        bookingPrice: 92000,
        roomDescription: 'Modern single room with excellent lighting',
        maxOccupancy: 1,
      }
    );

    // Lady Juliana Hostel - Premium rooms
    const ladyJulianaId = insertedHostels[1]._id;
    sampleRooms.push(
      {
        hostelId: ladyJulianaId,
        roomNumber: "LJH-201",
        roomImages: [{ url: "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 1100000,
        bookingPrice: 88000,
        roomDescription: 'Cozy single room with private balcony',
        maxOccupancy: 1,
      },
      {
        hostelId: ladyJulianaId,
        roomNumber: "LJH-202",
        roomImages: [{ url: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg", isPrimary: true }],
        roomType: 'double', 
        roomGender: 'female', 
        roomPrice: 1600000,
        bookingPrice: 160000,
        roomDescription: 'Elegant double room with ensuite bathroom',
        maxOccupancy: 2,
      }
    );

    // Apex Hostel - Premium rooms
    const apexId = insertedHostels[2]._id;
    sampleRooms.push(
      {
        hostelId: apexId,
        roomNumber: "APX-301",
        roomImages: [{ url: "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 1300000,
        bookingPrice: 104000,
        roomDescription: 'Premium single room with air conditioning',
        maxOccupancy: 1,
      },
      {
        hostelId: apexId,
        roomNumber: "APX-302",
        roomImages: [{ url: "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 1250000,
        bookingPrice: 100000,
        roomDescription: 'Luxury single with kitchenette and workspace',
        maxOccupancy: 1,
      }
    );

    // Douglas Villa - Premium rooms
    const douglasId = insertedHostels[3]._id;
    sampleRooms.push(
      {
        hostelId: douglasId,
        roomNumber: "DV-401",
        roomImages: [{ url: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 1150000,
        bookingPrice: 92000,
        roomDescription: 'Spacious room with modern fixtures',
        maxOccupancy: 1,
      },
      {
        hostelId: douglasId,
        roomNumber: "DV-402",
        roomImages: [{ url: "https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg", isPrimary: true }],
        roomType: 'double', 
        roomGender: 'mixed', 
        roomPrice: 1700000,
        bookingPrice: 170000,
        roomDescription: 'Large double room with study area',
        maxOccupancy: 2,
      }
    );

    // Mary Stuart Hall - Premium rooms
    const maryId = insertedHostels[4]._id;
    sampleRooms.push(
      {
        hostelId: maryId,
        roomNumber: "MSH-501",
        roomImages: [{ url: "https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 1280000,
        bookingPrice: 102400,
        roomDescription: 'Premium room with garden view',
        maxOccupancy: 1,
      },
      {
        hostelId: maryId,
        roomNumber: "MSH-502",
        roomImages: [{ url: "https://images.pexels.com/photos/1457845/pexels-photo-1457845.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 1200000,
        bookingPrice: 96000,
        roomDescription: 'Comfortable single with private facilities',
        maxOccupancy: 1,
      }
    );

    // Akamwesi Hostel - Mid-range rooms
    const akamwesiId = insertedHostels[5]._id;
    sampleRooms.push(
      {
        hostelId: akamwesiId,
        roomNumber: "AKM-601",
        roomImages: [{ url: "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 750000,
        bookingPrice: 60000,
        roomDescription: 'Simple single room with good ventilation',
        maxOccupancy: 1,
      },
      {
        hostelId: akamwesiId,
        roomNumber: "AKM-602",
        roomImages: [{ url: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg", isPrimary: true }],
        roomType: 'double', 
        roomGender: 'mixed', 
        roomPrice: 900000,
        bookingPrice: 90000,
        roomDescription: 'Affordable double room with shared bathroom',
        maxOccupancy: 2,
      }
    );

    // Complex Hostel - Mid-range rooms
    const complexId = insertedHostels[6]._id;
    sampleRooms.push(
      {
        hostelId: complexId,
        roomNumber: "CPX-701",
        roomImages: [{ url: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 700000,
        bookingPrice: 56000,
        roomDescription: 'Basic single room near lecture halls',
        maxOccupancy: 1,
      },
      {
        hostelId: complexId,
        roomNumber: "CPX-702",
        roomImages: [{ url: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg", isPrimary: true }],
        roomType: 'shared', 
        roomGender: 'male', 
        roomPrice: 850000,
        bookingPrice: 68000,
        roomDescription: 'Shared room for 3 students',
        maxOccupancy: 3,
      }
    );

    // Nsibirwa Hostel - Mid-range rooms
    const nsibirwaId = insertedHostels[7]._id;
    sampleRooms.push(
      {
        hostelId: nsibirwaId,
        roomNumber: "NSB-801",
        roomImages: [{ url: "https://images.pexels.com/photos/2029665/pexels-photo-2029665.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 780000,
        bookingPrice: 62400,
        roomDescription: 'Clean single room with study desk',
        maxOccupancy: 1,
      },
      {
        hostelId: nsibirwaId,
        roomNumber: "NSB-802",
        roomImages: [{ url: "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg", isPrimary: true }],
        roomType: 'double', 
        roomGender: 'mixed', 
        roomPrice: 950000,
        bookingPrice: 95000,
        roomDescription: 'Well-maintained double room',
        maxOccupancy: 2,
      }
    );

    // Livingstone Hall - Mid-range rooms
    const livingstoneId = insertedHostels[8]._id;
    sampleRooms.push(
      {
        hostelId: livingstoneId,
        roomNumber: "LVH-901",
        roomImages: [{ url: "https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'male', 
        roomPrice: 720000,
        bookingPrice: 57600,
        roomDescription: 'Traditional single room for male students',
        maxOccupancy: 1,
      },
      {
        hostelId: livingstoneId,
        roomNumber: "LVH-902",
        roomImages: [{ url: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg", isPrimary: true }],
        roomType: 'double', 
        roomGender: 'male', 
        roomPrice: 880000,
        bookingPrice: 88000,
        roomDescription: 'Classic double room with good lighting',
        maxOccupancy: 2,
      }
    );

    // Nakiyingi Hostel - Affordable rooms
    const nakiyingiId = insertedHostels[9]._id;
    sampleRooms.push(
      {
        hostelId: nakiyingiId,
        roomNumber: "NAK-1001",
        roomImages: [{ url: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg", isPrimary: true }],
        roomType: 'shared', 
        roomGender: 'mixed', 
        roomPrice: 500000,
        bookingPrice: 36000,
        roomDescription: 'Budget shared accommodation for 4 students',
        maxOccupancy: 4,
      },
      {
        hostelId: nakiyingiId,
        roomNumber: "NAK-1002",
        roomImages: [{ url: "https://images.pexels.com/photos/271706/pexels-photo-271706.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'mixed', 
        roomPrice: 580000,
        bookingPrice: 46400,
        roomDescription: 'Affordable single room with basic amenities',
        maxOccupancy: 1,
      }
    );

    // Green Valley Hostel - Affordable rooms
    const greenValleyId = insertedHostels[10]._id;
    sampleRooms.push(
      {
        hostelId: greenValleyId,
        roomNumber: "GVH-1101",
        roomImages: [{ url: "https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg", isPrimary: true }],
        roomType: 'shared', 
        roomGender: 'mixed', 
        roomPrice: 450000,
        bookingPrice: 27000,
        roomDescription: 'Budget shared room with garden view',
        maxOccupancy: 4,
      },
      {
        hostelId: greenValleyId,
        roomNumber: "GVH-1102",
        roomImages: [{ url: "https://images.pexels.com/photos/2091166/pexels-photo-2091166.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'female', 
        roomPrice: 550000,
        bookingPrice: 44000,
        roomDescription: 'Eco-friendly single room',
        maxOccupancy: 1,
      }
    );

    // Kikoni View Hostel - Affordable rooms
    const kikoniId = insertedHostels[11]._id;
    sampleRooms.push(
      {
        hostelId: kikoniId,
        roomNumber: "KKV-1201",
        roomImages: [{ url: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg", isPrimary: true }],
        roomType: 'shared', 
        roomGender: 'mixed', 
        roomPrice: 420000,
        bookingPrice: 25200,
        roomDescription: 'Basic shared room in Kikoni area',
        maxOccupancy: 4,
      },
      {
        hostelId: kikoniId,
        roomNumber: "KKV-1202",
        roomImages: [{ url: "https://images.pexels.com/photos/271706/pexels-photo-271706.jpeg", isPrimary: true }],
        roomType: 'double', 
        roomGender: 'mixed', 
        roomPrice: 600000,
        bookingPrice: 60000,
        roomDescription: 'Simple double room near market',
        maxOccupancy: 2,
      }
    );

    // Katanga Hostel - Affordable rooms
    const katangaId = insertedHostels[12]._id;
    sampleRooms.push(
      {
        hostelId: katangaId,
        roomNumber: "KTG-1301",
        roomImages: [{ url: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg", isPrimary: true }],
        roomType: 'shared', 
        roomGender: 'male', 
        roomPrice: 400000,
        bookingPrice: 24000,
        roomDescription: 'Budget room in lively Katanga area',
        maxOccupancy: 4,
      },
      {
        hostelId: katangaId,
        roomNumber: "KTG-1302",
        roomImages: [{ url: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'male', 
        roomPrice: 520000,
        bookingPrice: 41600,
        roomDescription: 'Small single room near taxi park',
        maxOccupancy: 1,
      }
    );

    // Mitchell Hall - Affordable rooms
    const mitchellId = insertedHostels[13]._id;
    sampleRooms.push(
      {
        hostelId: mitchellId,
        roomNumber: "MTH-1401",
        roomImages: [{ url: "https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'male', 
        roomPrice: 650000,
        bookingPrice: 52000,
        roomDescription: 'Traditional single room with desk',
        maxOccupancy: 1,
      },
      {
        hostelId: mitchellId,
        roomNumber: "MTH-1402",
        roomImages: [{ url: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg", isPrimary: true }],
        roomType: 'double', 
        roomGender: 'male', 
        roomPrice: 800000,
        bookingPrice: 80000,
        roomDescription: 'Spacious double room for male students',
        maxOccupancy: 2,
      }
    );

    // University Hall - Affordable rooms
    const universityId = insertedHostels[14]._id;
    sampleRooms.push(
      {
        hostelId: universityId,
        roomNumber: "UNH-1501",
        roomImages: [{ url: "https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg", isPrimary: true }],
        roomType: 'shared', 
        roomGender: 'male', 
        roomPrice: 480000,
        bookingPrice: 28800,
        roomDescription: 'Historic shared room on main campus',
        maxOccupancy: 4,
      },
      {
        hostelId: universityId,
        roomNumber: "UNH-1502",
        roomImages: [{ url: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg", isPrimary: true }],
        roomType: 'single', 
        roomGender: 'male', 
        roomPrice: 590000,
        bookingPrice: 47200,
        roomDescription: 'Classic single room in historic building',
        maxOccupancy: 1,
      }
    );

    // 3. Insert all rooms
    const insertedRooms = await Room.insertMany(sampleRooms);
    console.log(`✅ Successfully inserted ${insertedRooms.length} rooms`);

    // 4. Verify room-hostel links
    console.log('\n🔗 Verifying room-hostel links...');
    for (const hostel of insertedHostels) {
      const hostelRooms = insertedRooms.filter(room => 
        room.hostelId.toString() === hostel._id.toString()
      );
      
      console.log(`   ✅ ${hostel.name}: ${hostelRooms.length} rooms linked via hostelId`);
    }

    // 5. Display final summary
    console.log('\n✅ SEEDING COMPLETED SUCCESSFULLY! 🎉');
    console.log('=====================================');
    console.log(`Total Hostels: ${insertedHostels.length}`);
    console.log(`Total Rooms: ${insertedRooms.length}`);
    
    // 6. Test virtual populate
    console.log('\n📊 Testing virtual populate (hostels with rooms):');
    const hostelsWithRooms = await Hostel.find().populate('rooms');
    hostelsWithRooms.forEach(hostel => {
      const roomPrices = hostel.rooms.map(room => room.roomPrice);
      const minPrice = Math.min(...roomPrices);
      const maxPrice = Math.max(...roomPrices);
      console.log(`   🏨 ${hostel.name}: ${hostel.rooms.length} rooms | UGX ${minPrice.toLocaleString()} - UGX ${maxPrice.toLocaleString()}`);
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