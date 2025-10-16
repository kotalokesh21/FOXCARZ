import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

const carSchema = z.object({
  name: z.string().min(2, 'Car name must be at least 2 characters'),
  model: z.string().min(2, 'Model must be at least 2 characters'),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
  price: z.string().min(1, 'Price is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  availability: z.enum(['available', 'rented', 'maintenance']),
  features: z.string().min(1, 'Features are required'),
});

type CarFormData = z.infer<typeof carSchema>;

export default function AddCar() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
  });

  const onSubmit = async (data: CarFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement add car logic here
      const response = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add car');
      }

      toast({
        title: 'Success',
        description: 'Car has been added successfully!',
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add car. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Car</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Car Name"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Model"
                  {...form.register('model')}
                />
                {form.formState.errors.model && (
                  <p className="text-sm text-red-500">{form.formState.errors.model.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Year (YYYY)"
                  {...form.register('year')}
                />
                {form.formState.errors.year && (
                  <p className="text-sm text-red-500">{form.formState.errors.year.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Price per day"
                  {...form.register('price')}
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Image URL"
                  {...form.register('imageUrl')}
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <select
                  className="w-full p-2 border rounded-md"
                  {...form.register('availability')}
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                {form.formState.errors.availability && (
                  <p className="text-sm text-red-500">{form.formState.errors.availability.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Features (comma-separated)"
                {...form.register('features')}
              />
              {form.formState.errors.features && (
                <p className="text-sm text-red-500">{form.formState.errors.features.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Description"
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding Car...' : 'Add Car'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}