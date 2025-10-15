import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VehicleCard } from "@/components/vehicle-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Vehicle } from "@shared/schema";

export default function Fleet() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("price-low");

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const filteredVehicles = vehicles
    ?.filter((v) => categoryFilter === "all" || v.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return Number(a.hourlyRate) - Number(b.hourlyRate);
      } else if (sortBy === "price-high") {
        return Number(b.hourlyRate) - Number(a.hourlyRate);
      }
      return 0;
    }) || [];

  const categories = [
    { value: "all", label: "All Vehicles" },
    { value: "sedan", label: "Sedans" },
    { value: "suv", label: "SUVs" },
    { value: "hatchback", label: "Hatchbacks" },
    { value: "luxury", label: "Luxury" },
  ];

  return (
    <div className="flex flex-col min-h-screen py-8">
      <div className="container px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Fleet</h1>
          <p className="text-lg text-muted-foreground">
            Browse our collection of premium vehicles and find your perfect ride
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setCategoryFilter("all");
                setSortBy("price-low");
              }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No vehicles found matching your filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setCategoryFilter("all");
                setSortBy("price-low");
              }}
              className="mt-4"
              data-testid="button-reset-filters"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground" data-testid="text-vehicle-count">
                Showing {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
