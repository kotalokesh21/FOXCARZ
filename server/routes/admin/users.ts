import { Router } from 'express';
import { db } from '../../storage';
import { users, bookings, vehicles, locations } from '@shared/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { InferModel } from 'drizzle-orm';

type User = InferModel<typeof users>;
type SafeUser = Omit<User, 'password'>;
type Booking = InferModel<typeof bookings>;

// Helper function to ensure string type for database query
function ensureString(value: string | null | undefined): string {
    if (!value) throw new Error('Value must be a non-empty string');
    return value;
}

const router = Router();

// Get all users with their booking counts and total revenue
router.get('/', async (req, res) => {
  try {
    // Log authentication status
    console.log('Admin authentication check:', {
      userId: req.session.userId,
      isAdmin: req.session.isAdmin,
      sessionId: req.sessionID
    });

    if (!req.session.isAdmin) {
      console.log('Unauthorized access attempt');
      return res.status(403).json({ 
        message: 'Not authorized. Please login as admin.' 
      });
    }

    // Get all users
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .orderBy(desc(users.createdAt));
    
    console.log(`Found ${allUsers.length} users`);

    // For each user, get their booking stats
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        const userStats = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };

        if (!user.phone) {
          return {
            ...userStats,
            bookingCount: 0,
            totalRevenue: 0
          };
        }

        try {
          const userBookings = await db
            .select({
              id: bookings.id,
              totalCost: bookings.totalCost
            })
            .from(bookings)
            .where(eq(bookings.customerPhone, ensureString(user.phone)));

          const bookingCount = userBookings.length;
          const totalRevenue = userBookings.reduce((sum: number, booking) => 
            sum + Number(booking.totalCost), 0
          );

          return {
            ...userStats,
            bookingCount,
            totalRevenue
          };
        } catch (error) {
          console.error(`Error fetching bookings for user ${user.id}:`, error);
          return {
            ...userStats,
            bookingCount: 0,
            totalRevenue: 0
          };
        }
      })
    );

    res.json({ users: usersWithStats });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get detailed user information including all bookings
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user details
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Early return if user has no phone number
    if (!user[0].phone) {
      return res.json({
        user: {
          ...user[0],
          password: undefined,
          statistics: {
            totalBookings: 0,
            totalRevenue: 0,
            lastBooking: null
          },
          bookings: []
        }
      });
    }

    // Get user's bookings with vehicle and location details
    const userBookings = await db
      .select({
        id: bookings.id,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        startTime: bookings.startTime,
        totalCost: bookings.totalCost,
        rentalType: bookings.rentalType,
        customerWhatsapp: bookings.customerWhatsapp,
        vehicle: {
          id: vehicles.id,
          name: vehicles.name,
          category: vehicles.category,
          image: vehicles.image,
        },
        location: {
          id: locations.id,
          name: locations.name,
          address: locations.address,
          city: locations.city,
        },
      })
      .from(bookings)
      .innerJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
      .innerJoin(locations, eq(bookings.locationId, locations.id))
      .where(eq(bookings.customerPhone, ensureString(user[0].phone)))
      .orderBy(desc(bookings.startDate));

    // Calculate user statistics
    const totalBookings = userBookings.length;
    const totalRevenue = userBookings.reduce((sum: number, booking) => sum + Number(booking.totalCost), 0);
    const lastBooking = userBookings[0];

    const userDetails = {
      ...user[0],
      password: undefined, // Never send password hash
      statistics: {
        totalBookings,
        totalRevenue,
        lastBooking: lastBooking ? {
          date: lastBooking.startDate,
          vehicleName: lastBooking.vehicle.name,
          amount: lastBooking.totalCost,
        } : null,
      },
      bookings: userBookings,
    };

    res.json({ user: userDetails });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's booking history
router.get('/:userId/bookings', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all bookings for the user
    const userBookings = await db
      .select({
        id: bookings.id,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        startTime: bookings.startTime,
        totalCost: bookings.totalCost,
        rentalType: bookings.rentalType,
        customerWhatsapp: bookings.customerWhatsapp,
        vehicle: {
          name: vehicles.name,
          category: vehicles.category,
          image: vehicles.image,
          fuelType: vehicles.fuelType,
          transmission: vehicles.transmission,
        },
        location: {
          name: locations.name,
          address: locations.address,
          city: locations.city,
          phone: locations.phone,
        },
      })
      .from(bookings)
      .innerJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
      .innerJoin(locations, eq(bookings.locationId, locations.id))
      .where(eq(bookings.customerPhone, ensureString(user[0].phone)))
      .orderBy(desc(bookings.startDate));

    res.json({
      user: {
        id: user[0].id,
        name: user[0].name,
        phone: user[0].phone,
        email: user[0].email,
      },
      bookings: userBookings,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;