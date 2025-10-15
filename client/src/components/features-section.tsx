import { Infinity, Shield, Clock, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Infinity,
    title: "Unlimited Kilometers",
    description: "Drive as far as you want without any mileage restrictions or extra charges.",
  },
  {
    icon: Shield,
    title: "Free Cancellation",
    description: "Cancel your booking up to 6 hours in advance at no extra cost.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support via phone and WhatsApp whenever you need.",
  },
  {
    icon: BadgeCheck,
    title: "No Hidden Charges",
    description: "Transparent pricing with no surge fees. What you see is what you pay.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Drive Easy?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience hassle-free car rentals with our customer-first approach
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover-elevate transition-all" data-testid={`card-feature-${index}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
