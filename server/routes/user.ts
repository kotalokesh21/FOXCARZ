import { Router, Request, Response, NextFunction } from 'express';
import { Session } from 'express-session';
import { db } from '../storage';
import { users, bookings, vehicles, locations } from '@shared/schema';
import { and, eq, sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define our session data type
interface CustomSessionData {
  userId?: string;
}

// Extend the session type
declare module 'express-session' {
  interface SessionData extends CustomSessionData {}
}

// Custom request type with our session
interface RequestWithSession extends Request {
  session: Session & CustomSessionData;
}

// Utility function to ensure userId exists
function getUserIdFromSession(session: Session & CustomSessionData): string {
  if (!session.userId) {
    throw new Error('Not authenticated');
  }
  return session.userId;
}

interface UpdateProfileBody {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

interface Booking {
  id: string;
  vehicle: {
    name: string;
    image: string;
  };
  startDate: string;
  endDate: string;
  totalCost: string;
  rentalType: string;
  location: {
    name: string;
  };
}

const router = Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads/profile-pictures',
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    let sessionUserId;
    try {
      sessionUserId = getUserIdFromSession(req.session);
    } catch (error) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const updateData = req.body as UpdateProfileBody;

    // Validate required fields
    if (!updateData.name || !updateData.email || !updateData.phone || !updateData.address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updateData.email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if email is already taken by another user
    const existingUser = await db.select()
      .from(users)
      .where(and(
        eq(users.email, updateData.email),
        eq(users.id, sessionUserId)
      ));

    if (existingUser && existingUser[0]?.id !== sessionUserId) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Update user profile
    await db.update(users)
      .set({
        name: updateData.name,
        email: updateData.email,
        phone: updateData.phone,
        address: updateData.address,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, sessionUserId));

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});// Change password
router.put('/change-password', async (req, res) => {
  try {
    let sessionUserId;
    try {
      sessionUserId = getUserIdFromSession(req.session);
    } catch (error) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const passwordData = req.body as ChangePasswordBody;

    // Validate required fields
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    // Validate password strength
    if (passwordData.newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }

    // Get user's current password
    const user = await db.select()
      .from(users)
      .where(eq(users.id, sessionUserId));

    if (!user[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(passwordData.currentPassword, user[0].password);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);

    // Update password
    await db.update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, sessionUserId));

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload profile picture
// Error handling middleware for multer
const handleMulterError = (err: Error, req: RequestWithSession, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

router.post('/profile-picture', 
  (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
      getUserIdFromSession(req.session);
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  },
  upload.single('profilePicture'),
  handleMulterError,
  async (req: RequestWithSession, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Get the current user ID
      let sessionUserId;
      try {
        sessionUserId = getUserIdFromSession(req.session);
      } catch (error) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      // Get the current user's profile to delete old picture if exists
      const user = await db.select()
        .from(users)
        .where(eq(users.id, sessionUserId));

      const imageUrl = `/uploads/profile-pictures/${req.file.filename}`;

      // Update user's profile picture URL
      await db.update(users)
        .set({
          profilePicture: imageUrl,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, sessionUserId));

      // Return success with new image URL
      res.json({
        message: 'Profile picture uploaded successfully',
        imageUrl
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Get user's bookings
router.get('/bookings', async (req, res) => {
  try {
    let sessionUserId;
    try {
      sessionUserId = getUserIdFromSession(req.session);
    } catch (error) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // First get the user's phone number
    const user = await db.select()
      .from(users)
      .where(eq(users.id, sessionUserId));

    if (!user[0]?.phone) {
      return res.json({ bookings: [] });
    }

    const userBookings = await db
      .select({
        id: bookings.id,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalCost: bookings.totalCost,
        rentalType: bookings.rentalType,
        vehicle: {
          name: vehicles.name,
          image: vehicles.image,
        },
        location: {
          name: locations.name,
        },
      })
      .from(bookings)
      .innerJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
      .innerJoin(locations, eq(bookings.locationId, locations.id))
      .where(eq(bookings.customerPhone, user[0].phone));

    // Transform the data to match the frontend expectations
    const transformedBookings = userBookings.map((booking: Booking) => ({
      id: booking.id,
      vehicleName: booking.vehicle.name,
      vehicleImage: booking.vehicle.image,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalAmount: booking.totalCost,
      status: getBookingStatus(booking.startDate, booking.endDate),
      location: booking.location.name,
      rentalType: booking.rentalType
    }));

    console.log('Fetched bookings:', JSON.stringify(userBookings, null, 2));
    res.json({ bookings: transformedBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete account
router.delete('/delete-account', async (req, res) => {
  try {
    let sessionUserId;
    try {
      sessionUserId = getUserIdFromSession(req.session);
    } catch (error) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Delete user's profile picture if exists
    const user = await db.select().from(users).where(eq(users.id, sessionUserId));
    if (user[0]?.profilePicture) {
      // You might want to add file deletion logic here
    }

    // Delete user
    await db.delete(users).where(eq(users.id, sessionUserId));

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json({ message: 'Account deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to determine booking status
function getBookingStatus(startDate: string, endDate: string): 'upcoming' | 'completed' | 'cancelled' {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return 'upcoming';
  } else if (now > end) {
    return 'completed';
  } else {
    return 'cancelled';
  }
}

export default router;