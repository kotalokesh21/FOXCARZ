import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  startDate: string;
  endDate: string;
  startTime: string;
  totalCost: string;
  rentalType: string;
  vehicleId: string;
  locationId: string;
}

export default function AdminBookings() {
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await fetch("/api/bookings");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading bookings...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error loading bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of all bookings.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Rental Type</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.map((booking: Booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>{booking.customerPhone}</TableCell>
                  <TableCell>{booking.customerWhatsapp}</TableCell>
                  <TableCell>{booking.startDate}</TableCell>
                  <TableCell>{booking.endDate}</TableCell>
                  <TableCell>{booking.rentalType}</TableCell>
                  <TableCell className="text-right">₹{booking.totalCost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}