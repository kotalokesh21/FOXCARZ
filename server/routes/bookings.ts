import { Router } from 'express';
import { db } from '../storage';
import { eq } from 'drizzle-orm';
import { bookings } from '../../shared/schema';

const router = Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const allBookings = await db.select().from(bookings);
    res.json(allBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

export default router;