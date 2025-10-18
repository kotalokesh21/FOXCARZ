import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Socket, io } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data - replace with real data from your API
const mockData = [
  { month: 'Jan', sales: 4000, rentals: 2400 },
  { month: 'Feb', sales: 3000, rentals: 1398 },
  { month: 'Mar', sales: 2000, rentals: 9800 },
  { month: 'Apr', sales: 2780, rentals: 3908 },
  { month: 'May', sales: 1890, rentals: 4800 },
  { month: 'Jun', sales: 2390, rentals: 3800 },
];

type BookingData = {
  id: string;
  customerName: string;
  vehicleName: string;
  vehicleCategory: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  advancePayment: number;
  status: string;
  paymentStatus: string;
};

interface DashboardStats {
  totalCars: number;
  availableCars: number;
  totalBookings: number;
  monthlyRevenue: number;
  recentBookings: BookingData[];
  todayStats: {
    totalBookings: number;
    totalRevenue: number;
    pendingPayments: number;
  };
}

export default function AdminDashboard() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    recentBookings: [],
    todayStats: {
      totalBookings: 0,
      totalRevenue: 0,
      pendingPayments: 0,
    }
  });

  // Fetch existing bookings
  const { data: bookings } = useQuery<BookingData[]>({
    queryKey: ["/api/bookings"],
  });

  // Set up Socket.IO connection
  useEffect(() => {
    const socketInstance = io(window.location.origin);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('new-booking', (booking: BookingData) => {
      setStats(prev => ({
        ...prev,
        recentBookings: [booking, ...prev.recentBookings].slice(0, 10),
        todayStats: {
          ...prev.todayStats,
          totalBookings: prev.todayStats.totalBookings + 1,
          pendingPayments: prev.todayStats.pendingPayments + Number(booking.totalCost),
        }
      }));
    });

    socket.on('booking-payment', (booking: BookingData) => {
      setStats(prev => ({
        ...prev,
        recentBookings: prev.recentBookings.map(b => 
          b.id === booking.id ? booking : b
        ),
        todayStats: {
          ...prev.todayStats,
          totalRevenue: prev.todayStats.totalRevenue + Number(booking.advancePayment),
          pendingPayments: prev.todayStats.pendingPayments - Number(booking.advancePayment),
        }
      }));
    });

    return () => {
      socket.off('new-booking');
      socket.off('booking-payment');
    };
  }, [socket]);

  // Initialize data from query results
  useEffect(() => {
    if (bookings) {
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = bookings.filter(
        b => b.startDate.startsWith(today)
      );

      setStats(prev => ({
        ...prev,
        totalBookings: bookings.length,
        recentBookings: bookings.slice(0, 10),
        todayStats: {
          totalBookings: todayBookings.length,
          totalRevenue: todayBookings.reduce((sum, b) => 
            sum + (b.paymentStatus === 'PAID' ? Number(b.advancePayment) : 0), 0
          ),
          pendingPayments: todayBookings.reduce((sum, b) => 
            sum + (b.paymentStatus === 'PENDING' ? Number(b.totalCost) : 0), 0
          ),
        }
      }));
    }
  }, [bookings]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayStats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.todayStats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.todayStats.pendingPayments.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Advance payments received for recent bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.recentBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="startDate" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="advancePayment" fill="#22c55e" name="Advance Payment" />
                  <Bar dataKey="totalCost" fill="#3b82f6" name="Total Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Real-time updates of latest bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell>{booking.vehicleName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.paymentStatus === 'PAID'
                              ? 'default'
                              : booking.status === 'PENDING'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{booking.advancePayment?.toLocaleString() || 0}
                        <span className="text-xs text-muted-foreground ml-1">
                          /₹{booking.totalCost?.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button variant="outline" asChild>
          <a href="/admin/cars/add">Add New Car</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/admin/users">Manage Users</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/admin/bookings">View All Bookings</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/admin/reports">Generate Reports</a>
        </Button>
      </div>
    </div>
  );
}