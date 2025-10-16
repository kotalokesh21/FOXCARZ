import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ProtectedRoute from "@/components/protected-route";

// Public Pages
import Home from "@/pages/home";
import Fleet from "@/pages/fleet";
import VehicleDetail from "@/pages/vehicle-detail";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import Terms from "@/pages/terms";
import NotFound from "@/pages/not-found";

// Auth Pages
import Auth from "@/pages/auth/auth";
import AdminLogin from "@/pages/auth/admin-login";

// Protected Pages
import Booking from "@/pages/booking";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCars from "@/pages/admin/cars";
import AddCar from "@/pages/admin/cars/add";
import AdminBookings from "@/pages/admin/bookings";
import Reports from "@/pages/admin/reports";

function Router() {
  return (
    <WouterRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Switch>
            {/* Public Routes */}
            <Route path="/" component={Home} />
            <Route path="/fleet" component={Fleet} />
            <Route path="/vehicle/:id" component={VehicleDetail} />
            <Route path="/about" component={About} />
            <Route path="/faq" component={FAQ} />
            <Route path="/terms" component={Terms} />

            {/* Auth Routes */}
            <Route path="/auth">
              {() => <Auth />}
            </Route>
            <Route path="/auth/admin-login">
              {() => <AdminLogin />}
            </Route>

            {/* Protected Routes */}
            <Route path="/booking">
              {() => (
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              )}
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/dashboard" >
              {() => (
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/admin/cars" >
              {() => (
                <ProtectedRoute adminOnly>
                  <AdminCars />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/admin/cars/add" >
              {() => (
                <ProtectedRoute adminOnly>
                  <AddCar />
                </ProtectedRoute>
              )}
            </Route>

            <Route path="/admin/bookings" >
              {() => (
                <ProtectedRoute adminOnly>
                  <AdminBookings />
                </ProtectedRoute>
              )}
            </Route>

            <Route path="/admin/reports" >
              {() => (
                <ProtectedRoute adminOnly>
                  <Reports />
                </ProtectedRoute>
              )}
            </Route>

            {/* 404 Route */}
            <Route>
              {() => <NotFound />}
            </Route>
          </Switch>
        </main>
        <Footer />
      </div>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
