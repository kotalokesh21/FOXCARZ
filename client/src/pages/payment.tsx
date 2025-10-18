import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Shield, Clock, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PaymentPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const bookingId = new URLSearchParams(window.location.search).get("bookingId");

  // Fetch booking details
  const { data: booking, isLoading: isLoadingBooking } = useQuery({
    queryKey: ["/api/bookings", bookingId],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (!response.ok) throw new Error("Failed to fetch booking");
      return response.json();
    },
    enabled: !!bookingId,
  });

  const payment = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/bookings/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 100,
          bookingId,
        }),
      });
      if (!response.ok) throw new Error("Payment failed");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed!",
      });
      navigate("/booking/confirmation");
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  if (isLoadingBooking) {
    return (
      <div className="container mx-auto py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <Card className="p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Advance Payment
          </h2>
          <Separator className="my-4" />
          
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Vehicle:</span>
                <span>{booking.vehicleName}</span>
                <span className="text-muted-foreground">Pickup Date:</span>
                <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                <span className="text-muted-foreground">Rental Type:</span>
                <span className="capitalize">{booking.rentalType}</span>
                <span className="text-muted-foreground">Total Cost:</span>
                <span>₹{booking.totalCost}</span>
              </div>
            </div>

            {/* Payment Amount */}
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Advance Amount:</span>
                <span className="text-2xl font-bold text-primary">₹100</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This amount will be adjusted in your final bill
              </p>
            </div>

            {/* Terms */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cancellation Policy
              </h3>
              <div className="grid gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Full refund if cancelled more than 6 hours before pickup</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-red-500 mt-0.5" />
                  <span>No refund for cancellations within 6 hours of pickup</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full py-6 text-lg"
              onClick={() => payment.mutate()}
              disabled={payment.isPending}
            >
              {payment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay ₹100</>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}