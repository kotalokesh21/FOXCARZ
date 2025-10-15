import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { VehicleCard } from "@/components/vehicle-card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Vehicle } from "@shared/schema";

export default function Home() {
  const [, navigate] = useLocation();
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const featuredVehicles = vehicles?.slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />

      {/* Featured Fleet Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Vehicles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our premium collection of well-maintained vehicles
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>

              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/fleet")} 
                  data-testid="button-view-all-vehicles"
                >
                  View All Vehicles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Book your perfect ride in just 3 simple steps. No deposit, unlimited kilometers, and 24/7 support.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate("/booking")} 
            data-testid="button-cta-book"
          >
            Start Booking Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
