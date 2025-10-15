import { useLocation } from "wouter";
import { Users, Gauge, Fuel, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@shared/schema";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [, navigate] = useLocation();
  const categoryColors: Record<string, string> = {
    sedan: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    suv: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    hatchback: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    luxury: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <Card className="overflow-hidden group hover-elevate transition-all" data-testid={`card-vehicle-${vehicle.id}`}>
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          data-testid={`img-vehicle-${vehicle.id}`}
        />
        {!vehicle.available && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary">Not Available</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg" data-testid={`text-vehicle-name-${vehicle.id}`}>
              {vehicle.name}
            </h3>
            <Badge className={`mt-1 ${categoryColors[vehicle.category] || ''}`} variant="secondary">
              {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1" data-testid={`text-seats-${vehicle.id}`}>
            <Users className="h-4 w-4" />
            <span>{vehicle.seats}</span>
          </div>
          <div className="flex items-center gap-1" data-testid={`text-transmission-${vehicle.id}`}>
            <Gauge className="h-4 w-4" />
            <span className="capitalize">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-1" data-testid={`text-fuel-${vehicle.id}`}>
            <Fuel className="h-4 w-4" />
            <span className="capitalize">{vehicle.fuelType}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold" data-testid={`text-price-${vehicle.id}`}>
              ₹{vehicle.hourlyRate}
            </span>
            <span className="text-sm text-muted-foreground">/hour</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ₹{vehicle.dailyRate}/day • ₹{vehicle.weeklyRate}/week
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={!vehicle.available}
          onClick={() => navigate(`/vehicle/${vehicle.id}`)}
          data-testid={`button-book-${vehicle.id}`}
        >
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
