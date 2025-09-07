import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import Hostel from '../models/Hostel.js';

dotenv.config();

const sampleHostels = [
  {
    name: 'Kampala City Backpackers',
    description:
      'Affordable and friendly hostel located in the heart of Kampala. Ideal for backpackers and budget travelers.',
    location: {
      address: '123 Kampala Road',
      city: 'Kampala',
      state: 'Central Region',
      zipCode: '00100',
      coordinates: { latitude: 0.3476, longitude: 32.5825 }
    },
    amenities: ['WiFi', 'Breakfast', '24/7 Reception', 'Lounge'],
    roomTypes: [
      { type: 'single', price: 25000, capacity: 1, available: 10 },
      { type: 'double', price: 45000, capacity: 2, available: 6 },
      { type: 'dormitory', price: 20000, capacity: 8, available: 24 }
    ],
    images: [
      { url: 'https://placehold.co/600x400?text=Kampala+Backpackers+1', alt: 'Hostel exterior' }
    ],
    rating: 4.2,
    contact: { phone: '+256701234567', email: 'contact@kampalabackpackers.ug' },
    policies: { checkIn: '14:00', checkOut: '11:00', cancellation: '24 hours' }
  },
  {
    name: 'Mukono Garden Hostel',
    description:
      'Peaceful garden hostel near Lake Victoria with beautiful greenery and calm surroundings.',
    location: {
      address: '45 Victoria Lane',
      city: 'Mukono',
      state: 'Central Region',
      zipCode: '00200',
      coordinates: { latitude: 0.353, longitude: 32.755 }
    },
    amenities: ['WiFi', 'Garden', 'Parking', 'Breakfast'],
    roomTypes: [
      { type: 'single', price: 20000, capacity: 1, available: 8 },
      { type: 'double', price: 85000, capacity: 2, available: 4 }
    ],
    images: [
      { url: 'https://placehold.co/600x400?text=Mukono+Garden+1', alt: 'Garden view' }
    ],
    rating: 4.5,
    contact: { phone: '+256702345678', email: 'info@mukonogarden.ug' },
    policies: { checkIn: '13:00', checkOut: '10:00', cancellation: '48 hours' }
  },
  {
    name: 'Jinja Adventure Hostel',
    description:
      'Adventure-focused hostel close to the Nile River with access to rafting and kayaking.',
    location: {
      address: '7 Nile Avenue',
      city: 'Jinja',
      state: 'Eastern Region',
      zipCode: '00300',
      coordinates: { latitude: 0.44, longitude: 33.2 }
    },
    amenities: ['WiFi', 'Tour Desk', 'Bar', 'Breakfast'],
    roomTypes: [
      { type: 'dormitory', price: 30000, capacity: 10, available: 30 },
      { type: 'suite', price: 110000, capacity: 2, available: 3 }
    ],
    images: [
      { url: 'https://placehold.co/600x400?text=Jinja+Adventure+1', alt: 'Nile River nearby' }
    ],
    rating: 4.6,
    contact: { phone: '+256703456789', email: 'hello@jinjaadventure.ug' },
    policies: { checkIn: '15:00', checkOut: '11:00', cancellation: '72 hours' }
  },
  {
    name: 'Gulu Cultural Hostel',
    description:
      'Cultural experiences in Northern Uganda with local cuisine and performances.',
    location: {
      address: '21 Culture Street',
      city: 'Gulu',
      state: 'Northern Region',
      zipCode: '00400',
      coordinates: { latitude: 2.7746, longitude: 32.2989 }
    },
    amenities: ['WiFi', 'Cultural Nights', 'Restaurant'],
    roomTypes: [
      { type: 'single', price: 35000, capacity: 1, available: 6 },
      { type: 'double', price: 65000, capacity: 2, available: 4 }
    ],
    images: [
      { url: 'https://placehold.co/600x400?text=Gulu+Cultural+1', alt: 'Cultural show' }
    ],
    rating: 4.1,
    contact: { phone: '+256704567890', email: 'stay@gulucultural.ug' },
    policies: { checkIn: '14:00', checkOut: '10:00', cancellation: '24 hours' }
  },
  {
    name: 'Kampala Tech Hub Hostel',
    description:
      'Modern hostel for digital nomads with co-working space and fast WiFi.',
    location: {
      address: '99 Innovation Drive',
      city: 'Kampala',
      state: 'Central Region',
      zipCode: '00500',
      coordinates: { latitude: 0.35, longitude: 32.6 }
    },
    amenities: ['WiFi', 'Coworking Space', 'Coffee Bar'],
    roomTypes: [
      { type: 'suite', price: 130000, capacity: 2, available: 2 },
      { type: 'double', price: 90000, capacity: 2, available: 5 }
    ],
    images: [
      { url: 'https://placehold.co/600x400?text=Kampala+Tech+Hub+1', alt: 'Coworking space' }
    ],
    rating: 4.7,
    contact: { phone: '+256705678901', email: 'team@kampalatechhub.ug' },
    policies: { checkIn: '14:00', checkOut: '11:00', cancellation: '24 hours' }
  }
];

async function seed() {
  try {
    await connectDB();

    const databaseName = mongoose.connection.name;
    console.log(`\n⚙️  Seeding database: ${databaseName}`);

    // Clear existing data
    const result = await Hostel.deleteMany({});
    console.log(`🧹 Cleared existing hostels: ${result.deletedCount} removed`);

    // Insert sample data
    const created = await Hostel.insertMany(sampleHostels);
    console.log(`✅ Inserted ${created.length} hostels`);

    console.log('🎉 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Allow running with optional --drop to drop the collection entirely
const shouldDrop = process.argv.includes('--drop');
if (shouldDrop) {
  (async () => {
    try {
      await connectDB();
      await mongoose.connection.dropCollection('hostels').catch(() => {});
      console.log('🗑️  Dropped hostels collection');
    } catch (err) {
      console.error('Drop failed:', err.message);
      process.exitCode = 1;
    } finally {
      await mongoose.connection.close();
    }
  })().then(() => seed());
} else {
  seed();
}


