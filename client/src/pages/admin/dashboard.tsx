import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
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

interface DashboardStats {
  totalCars: number;
  availableCars: number;
  totalBookings: number;
  monthlyRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    // TODO: Fetch real stats from your API
    // This is mock data for demonstration
    setStats({
      totalCars: 50,
      availableCars: 35,
      totalBookings: 150,
      monthlyRevenue: 75000,
    });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCars}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableCars}</div>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sales & Rentals Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                <Bar dataKey="rentals" fill="#82ca9d" name="Rentals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" asChild>
          <a href="/admin/cars/add">Add New Car</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/admin/bookings">View Bookings</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/admin/reports">Generate Reports</a>
        </Button>
      </div>
    </div>
  );
}