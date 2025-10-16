import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../hooks/use-toast';

interface Car {
  id: string;
  name: string;
  model: string;
  year: string;
  price: number;
  availability: 'available' | 'rented' | 'maintenance';
  imageUrl: string;
}

export default function CarsList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/admin/cars');
      if (!response.ok) throw new Error('Failed to fetch cars');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch cars',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      const response = await fetch(`/api/admin/cars/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete car');

      toast({
        title: 'Success',
        description: 'Car has been deleted successfully',
      });

      // Refresh the cars list
      fetchCars();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete car',
        variant: 'destructive',
      });
    }
  };

  const getAvailabilityBadge = (availability: Car['availability']) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      available: 'default',
      rented: 'secondary',
      maintenance: 'destructive',
    };

    return (
      <Badge variant={variants[availability] || 'outline'}>
        {availability.charAt(0).toUpperCase() + availability.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cars Management</h1>
        <Button asChild>
          <a href="/admin/cars/add">Add New Car</a>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>
                  <img
                    src={car.imageUrl}
                    alt={car.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{car.name}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>${car.price}/day</TableCell>
                <TableCell>{getAvailabilityBadge(car.availability)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={`/admin/cars/edit/${car.id}`}>Edit</a>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(car.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}