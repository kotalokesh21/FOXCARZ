import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface UserStats {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  bookingCount: number;
  totalRevenue: number;
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  statistics: {
    totalBookings: number;
    totalRevenue: number;
    lastBooking: {
      date: string;
      vehicleName: string;
      amount: number;
    } | null;
  };
  bookings: Array<{
    id: string;
    startDate: string;
    endDate: string;
    totalCost: number;
    rentalType: string;
    vehicle: {
      name: string;
      category: string;
    };
    location: {
      name: string;
      city: string;
    };
  }>;
}

interface UsersResponse {
  users: UserStats[];
}

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: usersData, isLoading, error } = useQuery<UsersResponse>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/admin/users');
        const data = await response.json();
        console.log('Received users data:', data);
        if (!data.users) {
          throw new Error('Invalid response format: missing users array');
        }
        return data;
      } catch (err) {
        console.error('Failed to fetch users:', err);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
        throw err;
      }
    }
  });

  const fetchUserDetails = async (userId: string) => {
    try {
      setIsDialogOpen(true);
      const response = await apiRequest('GET', `/api/admin/users/${userId}`);
      const data = await response.json();
      setSelectedUser(data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user details. Please try again.',
        variant: 'destructive',
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500">
                    <div className="py-4">
                      <p>Error loading users</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="mt-2"
                      >
                        Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !usersData?.users?.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                usersData.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'Not provided'}</TableCell>
                    <TableCell>
                      <Badge variant={user.bookingCount > 0 ? 'default' : 'secondary'}>
                        {user.bookingCount}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{user.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchUserDetails(user.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedUser && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>User Details - {selectedUser.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              {/* User Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Bookings</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.statistics.totalBookings}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Revenue</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{selectedUser.statistics.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking History */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking History</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedUser.bookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No bookings found for this user
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Rental Type</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedUser.bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              {format(new Date(booking.startDate), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.vehicle.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.vehicle.category}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.location.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.location.city}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{booking.rentalType}</Badge>
                            </TableCell>
                            <TableCell>₹{booking.totalCost.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}