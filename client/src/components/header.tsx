import { useLocation } from "wouter";
import { Car, Phone } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { UserProfileMenu } from "./user-profile-menu";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
}

export function Header() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch current user data when component mounts
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include' // Important for sending cookies
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setUser(null);
        // Force reload to clear any cached states
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          {user ? (
            <UserProfileMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <Button
              variant="secondary"
              onClick={() => navigate("/auth")}
              data-testid="button-signin"
            >
              Sign In
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
