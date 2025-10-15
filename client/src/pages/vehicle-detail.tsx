import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Gauge, Fuel, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@shared/schema";

export default function VehicleDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();

  const { data: vehicle, isLoading } = useQuery<Vehicle>({
    queryKey: ["/api/vehicles", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen py-8">
        <div className="container px-4">
          <div className="h-96 rounded-lg bg-muted animate-pulse mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-64 rounded-lg bg-muted animate-pulse" />
            <div className="h-64 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col min-h-screen py-8">
        <div className="container px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The vehicle you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/fleet")}>Back to Fleet</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-8">
      <div className="container px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/fleet")} 
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Fleet
        </Button>

        {/* Vehicle Image */}
        <div className="aspect-video md:aspect-[21/9] rounded-lg overflow-hidden mb-8">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover"
            data-testid="img-vehicle-detail"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-vehicle-name">
                    {vehicle.name}
                  </h1>
                  <Badge className="capitalize">{vehicle.category}</Badge>
                </div>
                {!vehicle.available && (
                  <Badge variant="secondary">Not Available</Badge>
                )}
              </div>

              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2" data-testid="text-specs-seats">
                  <Users className="h-5 w-5" />
                  <span>{vehicle.seats} Seats</span>
                </div>
                <div className="flex items-center gap-2" data-testid="text-specs-transmission">
                  <Gauge className="h-5 w-5" />
                  <span className="capitalize">{vehicle.transmission}</span>
                </div>
                <div className="flex items-center gap-2" data-testid="text-specs-fuel">
                  <Fuel className="h-5 w-5" />
                  <span className="capitalize">{vehicle.fuelType}</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.features.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehicle.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2" data-testid={`text-feature-${index}`}>
                        <Check className="h-4 w-4 text-chart-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Standard features included
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pricing Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">Hourly Rate</span>
                    <span className="text-xl font-bold" data-testid="text-hourly-rate">₹{vehicle.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-muted-foreground">Daily Rate</span>
                    <span className="text-xl font-bold" data-testid="text-daily-rate">₹{vehicle.dailyRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Weekly Rate</span>
                    <span className="text-xl font-bold" data-testid="text-weekly-rate">₹{vehicle.weeklyRate}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-chart-2" />
                    <span>Unlimited Kilometers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-chart-2" />
                    <span>No Deposit Required</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-chart-2" />
                    <span>24/7 Support</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!vehicle.available}
                  onClick={() => navigate(`/booking?vehicle=${vehicle.id}`)}
                  data-testid="button-book-now"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book This Vehicle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
