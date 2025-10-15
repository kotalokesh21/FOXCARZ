import { useLocation } from "wouter";
import { Car, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [, navigate] = useLocation();

  return (
    <footer className="border-t bg-card">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FOXCARZ</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for self-drive car rentals. Experience freedom on the road with unlimited kilometers and zero deposit.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <button 
                onClick={() => navigate("/fleet")} 
                className="text-sm text-muted-foreground hover:text-primary transition-colors text-left" 
                data-testid="link-footer-fleet"
              >
                Our Fleet
              </button>
              <button 
                onClick={() => navigate("/booking")} 
                className="text-sm text-muted-foreground hover:text-primary transition-colors text-left" 
                data-testid="link-footer-booking"
              >
                Book Now
              </button>
              <button 
                onClick={() => navigate("/about")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                data-testid="link-footer-about"
              >
                About Us
              </button>
              <button 
                onClick={() => navigate("/faq")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                data-testid="link-footer-faq"
              >
                FAQs
              </button>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <a href="tel:+919000478478" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-phone">
                <Phone className="h-4 w-4" />
                <span>+91 9000478478</span>
              </a>
              <a href="mailto:info@foxcarz.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-email">
                <Mail className="h-4 w-4" />
                <span>info@foxcarz.com</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Multiple locations across the city</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">
              Get instant support through WhatsApp for bookings and queries.
            </p>
            <a href="https://wa.me/919000478478" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full" data-testid="button-whatsapp">
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button 
                onClick={() => navigate("/terms")} 
                className="hover:text-primary transition-colors"
                data-testid="link-footer-terms"
              >
                Terms & Conditions
              </button>
              <span>•</span>
              <button 
                onClick={() => navigate("/faq")} 
                className="hover:text-primary transition-colors"
                data-testid="link-footer-faq-bottom"
              >
                FAQs
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FOXCARZ. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
