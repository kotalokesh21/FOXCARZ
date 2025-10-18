import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, Calendar, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function BookingConfirmation() {
  const [, navigate] = useLocation();
  const bookingId = new URLSearchParams(window.location.search).get("bookingId");

  const { data: booking, isLoading } = useQuery({
    queryKey: ["/api/bookings", bookingId],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (!response.ok) throw new Error("Failed to fetch booking");
      return response.json();
    },
    enabled: !!bookingId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-20">
        <Card className="max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-center text-destructive">Booking Not Found</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Booking Confirmed!</h1>
            <p className="text-muted-foreground mt-2">
              Your vehicle has been successfully booked
            </p>
          </div>

          <div className="space-y-6">
            {/* Booking Details */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold">Booking Details</h3>
              <div className="grid gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Pickup Date & Time</p>
                    <p className="text-muted-foreground">
                      {new Date(booking.startDate).toLocaleDateString()} at {booking.startTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Vehicle</p>
                    <p className="text-muted-foreground">{booking.vehicleName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Rental Duration</p>
                    <p className="text-muted-foreground capitalize">{booking.rentalType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-primary/5 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Advance Payment</span>
                <span className="font-semibold text-primary">₹100</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This amount will be adjusted in your final bill
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/profile/bookings")}
              >
                View My Bookings
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}