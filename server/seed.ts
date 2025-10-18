import { db } from './storage';
import { locations, vehicles, users, admins } from '../shared/schema';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(admins).values({
      name: 'Admin',
      email: 'admin@foxcarz.com',
      password: hashedPassword,
    });
    console.log('✅ Admin user created');

    // Create demo user
    await db.insert(users).values({
      name: 'Demo User',
      email: 'demo@foxcarz.com',
      password: await bcrypt.hash('demo123', 10),
      phone: '+919000000000',
      address: 'Demo Address',
    });
    console.log('✅ Demo user created');

    // Create locations
    for (const location of [
      {
        name: 'City Center',
        address: '123 Main Street',
        city: 'Hyderabad',
        phone: '+919000000001',
      },
      {
        name: 'Airport Terminal',
        address: 'Airport Road',
        city: 'Hyderabad',
        phone: '+919000000002',
      },
      {
        name: 'Railway Station',
        address: 'Station Road',
        city: 'Hyderabad',
        phone: '+919000000003',
      },
    ]) {
      await db.insert(locations).values(location);
    }
    console.log('✅ Locations created');

    // Create vehicles
    const vehiclesToAdd = [
      {
        name: 'Maruti Baleno',
        category: 'hatchback',
        image: '/vehicles/baleno.jpg',
        seats: 5,
        transmission: 'manual',
        fuelType: 'petrol',
        hourlyRate: '200.00',
        dailyRate: '1588.00',
        weeklyRate: '9999.00',
        available: true,
        features: ['AC', 'Music System', 'Power Windows', 'Central Locking'],
      },
      {
        name: 'Toyota Innova',
        category: 'suv',
        image: '/vehicles/innova.jpg',
        seats: 7,
        transmission: 'manual',
        fuelType: 'diesel',
        hourlyRate: '300.00',
        dailyRate: '2500.00',
        weeklyRate: '15000.00',
        available: true,
        features: ['AC', 'Music System', 'Power Windows', 'Central Locking', 'ABS'],
      },
      {
        name: 'Honda City',
        category: 'sedan',
        image: '/vehicles/city.jpg',
        seats: 5,
        transmission: 'automatic',
        fuelType: 'petrol',
        hourlyRate: '250.00',
        dailyRate: '2000.00',
        weeklyRate: '12000.00',
        available: true,
        features: ['AC', 'Music System', 'Power Windows', 'Central Locking', 'Airbags'],
      },
    ];

    for (const vehicle of vehiclesToAdd) {
      await db.insert(vehicles).values(vehicle);
    }
    console.log('✅ Vehicles created');

    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();