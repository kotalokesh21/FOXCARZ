import { Router } from 'express';
import { db } from '../storage';
import { eq } from 'drizzle-orm';
import { bookings, vehicles } from '../../shared/schema';

const router = Router();

// Create new booking (guest or authenticated)
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['vehicleId', 'customerName', 'customerPhone', 'customerWhatsapp', 
      'locationId', 'startDate', 'endDate', 'startTime', 'rentalType', 'totalCost'];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const booking = await db.insert(bookings)
      .values({
        ...req.body,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning({
        id: bookings.id,
        vehicleId: bookings.vehicleId,
        customerName: bookings.customerName,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalCost: bookings.totalCost,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus
      });

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.emit('new-booking', booking[0]);

    res.json({ bookingId: booking[0].id });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Process booking payment
router.post('/payment', async (req, res) => {
  const { amount, bookingId } = req.body;

  try {
    // Update booking with payment information
    const [updatedBooking] = await db.update(bookings)
      .set({
        advancePayment: amount,
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, bookingId))
      .returning({
        id: bookings.id,
        vehicleId: bookings.vehicleId,
        customerName: bookings.customerName,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalCost: bookings.totalCost,
        advancePayment: bookings.advancePayment,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus
      });

    // Get vehicle details
    const [vehicle] = await db.select({
      name: vehicles.name,
      category: vehicles.category,
    })
    .from(vehicles)
    .where(eq(vehicles.id, updatedBooking.vehicleId));

    const bookingDetails = {
      ...updatedBooking,
      vehicleName: vehicle.name,
      vehicleCategory: vehicle.category,
    };

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.emit('booking-payment', bookingDetails);

    res.json({ 
      success: true,
      message: "Payment processed successfully" 
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to process payment" 
    });
  }
});

// Process booking cancellation
router.post('/cancel/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Get booking details
    const [booking] = await db.select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if cancellation is within 6 hours of pickup
    const pickupTime = new Date(booking.startDate);
    const now = new Date();
    const hoursToPickup = (pickupTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    const shouldRefund = hoursToPickup > 6;
    
    await db.update(bookings)
      .set({
        status: 'CANCELLED',
        refundStatus: shouldRefund ? 'REFUNDED' : 'NO_REFUND',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, bookingId));

    res.json({
      success: true,
      message: shouldRefund ? 
        "Booking cancelled with refund" : 
        "Booking cancelled without refund",
      refunded: shouldRefund
    });
  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to cancel booking" 
    });
  }
});

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

// Get booking by ID with vehicle details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.select({
      id: bookings.id,
      vehicleId: bookings.vehicleId,
      customerName: bookings.customerName,
      customerPhone: bookings.customerPhone,
      customerWhatsapp: bookings.customerWhatsapp,
      locationId: bookings.locationId,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      startTime: bookings.startTime,
      totalCost: bookings.totalCost,
      rentalType: bookings.rentalType,
      status: bookings.status,
      paymentStatus: bookings.paymentStatus,
      advancePayment: bookings.advancePayment,
      vehicleName: vehicles.name,
      vehicleImage: vehicles.image,
    })
    .from(bookings)
    .leftJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
    .where(eq(bookings.id, id));

    const booking = result[0];
    
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