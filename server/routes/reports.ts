import { Router } from 'express';
import { db } from '../storage';
import { bookings } from '../../shared/schema';
import { sql } from 'drizzle-orm';

const router = Router();

// Get reports data
const generateReport = async (query: any) => {
  const { period, startDate, endDate } = query;
  
  // Default to current month if no dates provided
  const start = startDate ? new Date(startDate as string) : new Date();
  const end = endDate ? new Date(endDate as string) : new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  // Get bookings within date range
  const periodBookings = await db.select({
    totalAmount: sql<string>`COALESCE(sum(total_cost), '0')`.mapWith(String),
    count: sql<number>`count(*)`.mapWith(Number),
  })
  .from(bookings)
  .where(sql`booking_date >= ${start.toISOString()} AND booking_date <= ${end.toISOString()}`);

  // Calculate statistics
  const stats = {
    totalBookings: periodBookings[0]?.count || 0,
    totalRevenue: parseFloat(periodBookings[0]?.totalAmount || '0').toFixed(2),
    averageBookingValue: (parseFloat(periodBookings[0]?.totalAmount || '0') / (periodBookings[0]?.count || 1)).toFixed(2),
  };

  // Get revenue data for chart
  let revenueQuery;
  switch(period) {
    case 'daily':
      revenueQuery = sql`DATE_TRUNC('day', booking_date)`;
      break;
    case 'weekly':
      revenueQuery = sql`DATE_TRUNC('week', booking_date)`;
      break;
    case 'yearly':
      revenueQuery = sql`DATE_TRUNC('month', booking_date)`;
      break;
    default: // monthly
      revenueQuery = sql`DATE_TRUNC('day', booking_date)`;
  }

  const revenueData = await db.select({
    date: sql<string>`${revenueQuery}::text`,
    amount: sql<string>`COALESCE(sum(total_cost), '0')`.mapWith(String),
  })
  .from(bookings)
  .where(sql`booking_date >= ${start.toISOString()} AND booking_date <= ${end.toISOString()}`)
  .groupBy(revenueQuery)
  .orderBy(revenueQuery);

  // Format revenue data for chart
  const revenue = revenueData.map(row => ({
    date: new Date(row.date).toLocaleDateString(),
    amount: parseFloat(row.amount),
  }));

  return {
    stats,
    revenue,
  };
};

router.get('/', async (req, res) => {
  try {
    const report = await generateReport(req.query);
    
    // Emit the report through Socket.IO
    const io = req.app.get('io');
    io.emit('reportUpdate', report);
    
    res.json(report);
    const { period, startDate, endDate } = req.query;
    
    // Default to current month if no dates provided
    const start = startDate ? new Date(startDate as string) : new Date();
    const end = endDate ? new Date(endDate as string) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Get bookings within date range
    const periodBookings = await db.select({
      totalAmount: sql<string>`sum(total_cost)`.mapWith(String),
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(bookings)
    .where(sql`created_at >= ${start.toISOString()} AND created_at <= ${end.toISOString()}`);

    // Calculate statistics
    const stats = {
      totalBookings: periodBookings[0]?.count || 0,
      totalRevenue: parseFloat(periodBookings[0]?.totalAmount || '0').toFixed(2),
      averageBookingValue: (parseFloat(periodBookings[0]?.totalAmount || '0') / (periodBookings[0]?.count || 1)).toFixed(2),
    };

    // Get revenue data for chart
    let revenueQuery;
    switch(period) {
      case 'daily':
        revenueQuery = sql`DATE_TRUNC('day', created_at)`;
        break;
      case 'weekly':
        revenueQuery = sql`DATE_TRUNC('week', created_at)`;
        break;
      case 'yearly':
        revenueQuery = sql`DATE_TRUNC('month', created_at)`;
        break;
      default: // monthly
        revenueQuery = sql`DATE_TRUNC('day', created_at)`;
    }

    const revenueData = await db.select({
      date: sql<string>`${revenueQuery}::text`,
      amount: sql<string>`sum(total_cost)`.mapWith(String),
    })
    .from(bookings)
    .where(sql`created_at >= ${start.toISOString()} AND created_at <= ${end.toISOString()}`)
    .groupBy(revenueQuery)
    .orderBy(revenueQuery);

    // Format revenue data for chart
    const revenue = revenueData.map(row => ({
      name: new Date(row.date).toLocaleDateString(),
      amount: parseFloat(row.amount).toFixed(2),
    }));

    res.json({
      stats,
      revenue,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

export default router;