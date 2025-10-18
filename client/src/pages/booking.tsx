import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock, MapPin, User, Phone, MessageCircle, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Vehicle, Location, InsertBooking } from "@shared/schema";

const bookingSchema = z.object({
  vehicleId: z.string().min(1, "Please select a vehicle"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  customerWhatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits"),
  locationId: z.string().min(1, "Please select a pickup location"),
  startDate: z.string().min(1, "Please select a start date"),
  endDate: z.string().min(1, "Please select an end date"),
  startTime: z.string().min(1, "Please select a start time"),
  rentalType: z.enum(["hourly", "daily", "weekly"]),
  totalCost: z.string(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function Booking() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const searchParams = new URLSearchParams(window.location.search);
  const preSelectedVehicleId = searchParams.get("vehicle");

  const { data: vehicles } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const { data: locations } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      vehicleId: preSelectedVehicleId || "",
      customerName: "",
      customerPhone: "",
      customerWhatsapp: "",
      locationId: "",
      startDate: "",
      endDate: "",
      startTime: "10:00",
      rentalType: "daily",
      totalCost: "0",
    },
  });

  const selectedVehicleId = form.watch("vehicleId");
  const selectedVehicle = vehicles?.find((v) => v.id === selectedVehicleId);
  const rentalType = form.watch("rentalType");

  useEffect(() => {
    if (selectedVehicle) {
      const rate = rentalType === "hourly" 
        ? selectedVehicle.hourlyRate 
        : rentalType === "daily" 
        ? selectedVehicle.dailyRate 
        : selectedVehicle.weeklyRate;
      form.setValue("totalCost", String(rate));
    }
  }, [selectedVehicle, rentalType, form]);

  const createBooking = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      const result = await response.json() as { bookingId: string };
      return result;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      // Redirect to payment page with booking ID
      navigate(`/payment?bookingId=${response.bookingId}`);
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBooking.mutate(data);
  };

  const canProceedToStep2 = form.watch("customerName") && form.watch("customerPhone") && form.watch("customerWhatsapp");
  const canProceedToStep3 = canProceedToStep2 && form.watch("startDate") && form.watch("endDate") && form.watch("startTime") && form.watch("locationId");

  return (
    <div className="flex flex-col min-h-screen py-8">
      <div className="container px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Your Vehicle</h1>
          <p className="text-lg text-muted-foreground">
            Complete your booking in 3 simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= s ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`} data-testid={`step-indicator-${s}`}>
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step > s ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">Contact Info</span>
            <span className="text-xs text-muted-foreground">Date & Time</span>
            <span className="text-xs text-muted-foreground">Vehicle</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Contact Information */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} data-testid="input-customer-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9000000000" {...field} data-testid="input-customer-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerWhatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9000000000" {...field} data-testid="input-customer-whatsapp" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    data-testid="button-next-step-1"
                  >
                    Next: Date & Time
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Date, Time & Location */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Date, Time & Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-start-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-end-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} data-testid="input-start-time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="locationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Location</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-location">
                              <SelectValue placeholder="Select pickup location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations?.map((loc) => (
                              <SelectItem key={loc.id} value={loc.id}>
                                {loc.name} - {loc.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      data-testid="button-back-step-2"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                      data-testid="button-next-step-2"
                    >
                      Next: Select Vehicle
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Vehicle Selection */}
            {step === 3 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Select Vehicle & Rental Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="vehicleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Choose Your Vehicle</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-vehicle">
                                <SelectValue placeholder="Select a vehicle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vehicles?.filter(v => v.available).map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.name} - ₹{vehicle.dailyRate}/day
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rentalType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rental Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-rental-type">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly (₹{selectedVehicle?.hourlyRate || 0}/hour)</SelectItem>
                              <SelectItem value="daily">Daily (₹{selectedVehicle?.dailyRate || 0}/day)</SelectItem>
                              <SelectItem value="weekly">Weekly (₹{selectedVehicle?.weeklyRate || 0}/week)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedVehicle && (
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
                        <p className="text-2xl font-bold" data-testid="text-total-cost">₹{form.watch("totalCost")}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          * Final cost will be calculated based on actual rental duration
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                        data-testid="button-back-step-3"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={createBooking.isPending || !selectedVehicle}
                        data-testid="button-confirm-booking"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        {createBooking.isPending ? "Booking..." : "Confirm Booking"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
