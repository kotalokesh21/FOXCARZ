import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import { users, admins, vehicles, locations, bookings } from '../shared/schema';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Configure neon for server environment
neonConfig.fetchConnectionCache = true;

async function runMigration() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    console.log('Running migrations...');
    
    // Drop and recreate users table with all required fields
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    await sql`
      CREATE TABLE users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        profile_picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create admins table
    await sql`DROP TABLE IF EXISTS admins CASCADE`;
    await sql`
      CREATE TABLE admins (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create a default admin account
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    // First, delete any existing admin with the same email to ensure we can create a new one
    await sql`DELETE FROM admins WHERE email = 'admin@foxcarz.com'`;
    
    // Create new admin
    await sql`
      INSERT INTO admins (name, email, password)
      VALUES ('Admin', 'admin@foxcarz.com', ${hashedPassword});
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        seats INTEGER NOT NULL,
        transmission TEXT NOT NULL,
        fuel_type TEXT NOT NULL,
        hourly_rate DECIMAL(10,2) NOT NULL,
        daily_rate DECIMAL(10,2) NOT NULL,
        weekly_rate DECIMAL(10,2) NOT NULL,
        available BOOLEAN DEFAULT true,
        features TEXT[] DEFAULT '{}'
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS locations (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        phone TEXT NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id VARCHAR NOT NULL REFERENCES vehicles(id),
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_whatsapp TEXT NOT NULL,
        location_id VARCHAR NOT NULL REFERENCES locations(id),
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        total_cost DECIMAL(10,2) NOT NULL,
        rental_type TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        advance_payment DECIMAL(10,2),
        payment_status TEXT DEFAULT 'PENDING',
        refund_status TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();