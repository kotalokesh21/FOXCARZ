import { useLocation } from "wouter";
import { Car, Phone } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2 -ml-3" 
          data-testid="link-home"
        >
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">FOXCARZ</span>
        </button>

        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => navigate("/")} 
            className="text-sm font-medium hover:text-primary transition-colors" 
            data-testid="link-nav-home"
          >
            Home
          </button>
          <button 
            onClick={() => navigate("/fleet")} 
            className="text-sm font-medium hover:text-primary transition-colors" 
            data-testid="link-nav-fleet"
          >
            Our Fleet
          </button>
          <button 
            onClick={() => navigate("/booking")} 
            className="text-sm font-medium hover:text-primary transition-colors" 
            data-testid="link-nav-booking"
          >
            Book Now
          </button>
          <button 
            onClick={() => navigate("/about")} 
            className="text-sm font-medium hover:text-primary transition-colors" 
            data-testid="link-nav-about"
          >
            About Us
          </button>
          <button 
            onClick={() => navigate("/faq")} 
            className="text-sm font-medium hover:text-primary transition-colors" 
            data-testid="link-nav-faq"
          >
            FAQs
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <a href="tel:+919000478478" className="hidden sm:flex">
            <Button variant="ghost" size="icon" data-testid="button-call">
              <Phone className="h-5 w-5" />
              <span className="sr-only">Call us</span>
            </Button>
          </a>
          <Button
            variant="secondary"
            onClick={() => navigate("/auth")}
            data-testid="button-signin"
          >
            Sign In
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
