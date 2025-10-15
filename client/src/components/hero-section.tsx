import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const [, navigate] = useLocation();

  return (
    <section className="relative w-full">
      {/* Hero Background with Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background -z-10" />
      
      <div className="container px-4 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="px-4 py-1.5" data-testid="badge-promo">
            <span className="text-sm font-medium">New Users Get 10% Off!</span>
          </Badge>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Drive Your Dreams
              <span className="block text-primary mt-2">Without Limits</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Premium self-drive cars with unlimited kilometers and zero deposit. 
              Starting at just ₹93/hour.
            </p>
          </div>

          {/* Value Propositions */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-2" />
              <span className="text-sm font-medium">Unlimited Kms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-2" />
              <span className="text-sm font-medium">Free Cancellation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-2" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-2" />
              <span className="text-sm font-medium">No Hidden Charges</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              size="lg" 
              className="text-base w-full sm:w-auto" 
              onClick={() => navigate("/booking")} 
              data-testid="button-book-now"
            >
              Book Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base w-full sm:w-auto" 
              onClick={() => navigate("/fleet")} 
              data-testid="button-view-fleet"
            >
              View Our Fleet
            </Button>
          </div>

          {/* Pricing Info */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Starting from <span className="text-2xl font-bold text-foreground">₹93</span>/hour
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
