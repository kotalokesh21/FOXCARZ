import { type Vehicle, type InsertVehicle, type Location, type InsertLocation, type Booking, type InsertBooking, type User, type InsertUser } from "@shared/schema";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import { vehicles, locations, bookings, users, admins } from '@shared/schema';
import * as dotenv from 'dotenv';
import path from 'path';
import { randomUUID } from "crypto";
import { eq } from 'drizzle-orm';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Configure neon to work in server environment
neonConfig.fetchConnectionCache = true;

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

export interface IStorage {
  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;

  // Locations
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;

  // Users
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private vehicles: Map<string, Vehicle>;
  private locations: Map<string, Location>;
  private bookings: Map<string, Booking>;
  private users: Map<string, User>;

  constructor() {
    this.vehicles = new Map();
    this.locations = new Map();
    this.bookings = new Map();
    this.users = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed Vehicles
    const vehiclesData: InsertVehicle[] = [
      {
        name: "Maruti Suzuki Swift",
        category: "hatchback",
        image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
        seats: 5,
        transmission: "manual",
        fuelType: "petrol",
        hourlyRate: "54",
        dailyRate: "1488",
        weeklyRate: "9500",
        available: true,
        features: ["Air Conditioning", "Power Steering", "Central Locking", "Music System"],
      },
      {
        name: "Hyundai i20",
        category: "hatchback",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
        seats: 5,
        transmission: "automatic",
        fuelType: "petrol",
        hourlyRate: "62",
        dailyRate: "1688",
        weeklyRate: "10800",
        available: true,
        features: ["Air Conditioning", "Automatic Transmission", "Touchscreen", "Bluetooth"],
      },
      {
        name: "Maruti Baleno",
        category: "sedan",
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
        seats: 5,
        transmission: "manual",
        fuelType: "petrol",
        hourlyRate: "58",
        dailyRate: "1588",
        weeklyRate: "10200",
        available: true,
        features: ["Air Conditioning", "Power Windows", "ABS", "Airbags"],
      },
      {
        name: "Honda City",
        category: "sedan",
        image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80",
        seats: 5,
        transmission: "automatic",
        fuelType: "petrol",
        hourlyRate: "75",
        dailyRate: "2088",
        weeklyRate: "13500",
        available: true,
        features: ["Air Conditioning", "Automatic Climate Control", "Cruise Control", "Sunroof"],
      },
      {
        name: "Mahindra Scorpio",
        category: "suv",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
        seats: 7,
        transmission: "manual",
        fuelType: "diesel",
        hourlyRate: "95",
        dailyRate: "2588",
        weeklyRate: "16800",
        available: true,
        features: ["4WD", "7 Seater", "Air Conditioning", "Power Steering", "Music System"],
      },
      {
        name: "Toyota Fortuner",
        category: "suv",
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
        seats: 7,
        transmission: "automatic",
        fuelType: "diesel",
        hourlyRate: "125",
        dailyRate: "3488",
        weeklyRate: "22500",
        available: true,
        features: ["4WD", "7 Seater", "Leather Seats", "Sunroof", "Premium Sound System"],
      },
      {
        name: "Mercedes E-Class",
        category: "luxury",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
        seats: 5,
        transmission: "automatic",
        fuelType: "petrol",
        hourlyRate: "180",
        dailyRate: "4988",
        weeklyRate: "32500",
        available: true,
        features: ["Luxury Interior", "Automatic Climate Control", "Premium Sound", "Advanced Safety"],
      },
      {
        name: "BMW 3 Series",
        category: "luxury",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
        seats: 5,
        transmission: "automatic",
        fuelType: "petrol",
        hourlyRate: "200",
        dailyRate: "5488",
        weeklyRate: "35800",
        available: false,
        features: ["Sport Mode", "Leather Seats", "Panoramic Sunroof", "Premium Sound System"],
      },
      {
        name: "Tata Nexon",
        category: "suv",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
        seats: 5,
        transmission: "manual",
        fuelType: "diesel",
        hourlyRate: "68",
        dailyRate: "1888",
        weeklyRate: "12200",
        available: true,
        features: ["Air Conditioning", "Touchscreen", "Reverse Camera", "Airbags"],
      },
    ];

    vehiclesData.forEach((vehicle) => {
      const id = randomUUID();
      const newVehicle: Vehicle = {
        ...vehicle,
        id,
        available: vehicle.available ?? true,
        features: vehicle.features ?? []
      };
      this.vehicles.set(id, newVehicle);
    });

    // Seed Locations
    const locationsData: InsertLocation[] = [
      {
        name: "Kukatpally Branch",
        address: "KPHB Main Road, Hyderabad",
        city: "Hyderabad",
        phone: "+91 9000478478",
      },
      {
        name: "Madhapur Branch",
        address: "HITEC City, Madhapur, Hyderabad",
        city: "Hyderabad",
        phone: "+91 9000478479",
      },
      {
        name: "Dilsukhnagar Branch",
        address: "Chaitanyapuri Main Road, Dilsukhnagar, Hyderabad",
        city: "Hyderabad",
        phone: "+91 9000478480",
      },
      {
        name: "Uppal Branch",
        address: "Uppal Medipally Road, Uppal, Hyderabad",
        city: "Hyderabad",
        phone: "+91 9000478481",
      },
    ];

    locationsData.forEach((location) => {
      const id = randomUUID();
      this.locations.set(id, { ...location, id });
    });
  }

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const id = randomUUID();
    const vehicle: Vehicle = {
      ...insertVehicle,
      id,
      available: insertVehicle.available ?? true,
      features: insertVehicle.features ?? []
    };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = { ...insertLocation, id };
    this.locations.set(id, location);
    return location;
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { ...insertBooking, id };
    this.bookings.set(id, booking);
    return booking;
  }

  // Users
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const user: User = {
      ...insertUser,
      id,
      address: insertUser.address ?? null,
      phone: insertUser.phone ?? null,
      profilePicture: insertUser.profilePicture ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      return undefined;
    }

    const updatedUser: User = {
      ...existingUser,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

export class DbStorage implements IStorage {
  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    return db.select().from(vehicles).execute();
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const results = await db.select().from(vehicles).where(eq(vehicles.id, id)).execute();
    return results[0];
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const results = await db.insert(vehicles).values(vehicle).returning().execute();
    return results[0];
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    return db.select().from(locations).execute();
  }

  async getLocation(id: string): Promise<Location | undefined> {
    const results = await db.select().from(locations).where(eq(locations.id, id)).execute();
    return results[0];
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const results = await db.insert(locations).values(location).returning().execute();
    return results[0];
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return db.select().from(bookings).execute();
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const results = await db.select().from(bookings).where(eq(bookings.id, id)).execute();
    return results[0];
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const results = await db.insert(bookings).values(booking).returning().execute();
    return results[0];
  }

  // Users
  async getUsers(): Promise<User[]> {
    return db.select().from(users).execute();
  }

  async getUser(id: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id)).execute();
    return results[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email)).execute();
    return results[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const results = await db.insert(users).values(user).returning().execute();
    return results[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const results = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id))
      .returning()
      .execute();
    return results[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const results = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning()
      .execute();
    return results.length > 0;
  }
}

// Export the storage implementation based on environment
export const storage = process.env.NODE_ENV === 'production' 
  ? new DbStorage()
  : new MemStorage();
