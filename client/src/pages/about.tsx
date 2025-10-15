import { Car, Shield, Clock, Award } from "lucide-react";

export default function About() {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About FOXCARZ</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your premium car rental service provider, offering a seamless and luxurious driving experience.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground">
            Founded in 2023, FOXCARZ was born from a vision to revolutionize the car rental industry. 
            We identified common pain points in traditional car rentals - complex paperwork, hidden fees, 
            and limited flexibility - and set out to create a better solution.
          </p>
          <p className="text-muted-foreground">
            Today, we're proud to offer a fleet of premium vehicles with transparent pricing, 
            unlimited kilometers, and zero deposit requirements. Our commitment to customer 
            satisfaction and service excellence has made us a trusted name in the industry.
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80"
            alt="Luxury car"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose FOXCARZ?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-3 p-6 rounded-lg bg-card">
            <Car className="w-10 h-10 mx-auto text-primary" />
            <h3 className="font-semibold text-xl">Premium Fleet</h3>
            <p className="text-muted-foreground">
              Wide selection of well-maintained, luxury vehicles for every occasion
            </p>
          </div>
          <div className="text-center space-y-3 p-6 rounded-lg bg-card">
            <Shield className="w-10 h-10 mx-auto text-primary" />
            <h3 className="font-semibold text-xl">Zero Deposit</h3>
            <p className="text-muted-foreground">
              No security deposit required, just pick up and drive
            </p>
          </div>
          <div className="text-center space-y-3 p-6 rounded-lg bg-card">
            <Clock className="w-10 h-10 mx-auto text-primary" />
            <h3 className="font-semibold text-xl">24/7 Support</h3>
            <p className="text-muted-foreground">
              Round-the-clock assistance for peace of mind
            </p>
          </div>
          <div className="text-center space-y-3 p-6 rounded-lg bg-card">
            <Award className="w-10 h-10 mx-auto text-primary" />
            <h3 className="font-semibold text-xl">Best Rates</h3>
            <p className="text-muted-foreground">
              Competitive pricing with no hidden charges
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4 p-8 rounded-lg bg-card">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            To provide exceptional car rental experiences through superior service, 
            transparent pricing, and a commitment to customer satisfaction. We aim 
            to make premium car rentals accessible and hassle-free for everyone.
          </p>
        </div>
        <div className="space-y-4 p-8 rounded-lg bg-card">
          <h2 className="text-2xl font-bold">Our Vision</h2>
          <p className="text-muted-foreground">
            To become the most trusted and preferred car rental service provider, 
            known for our reliability, transparency, and customer-first approach. 
            We envision a future where renting a car is as simple as booking a ride.
          </p>
        </div>
      </div>
    </div>
  );
}