import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [period, setPeriod] = useState("monthly");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ["reports", period, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        period,
        startDate: startDate?.toISOString() || "",
        endDate: endDate?.toISOString() || "",
      });
      const response = await fetch(`/api/reports?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }
      return response.json();
    },
    enabled: false, // Don't fetch automatically, wait for button click
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            View revenue and booking statistics for different time periods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => date && setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start date"
              className="w-[180px] rounded-md border border-input bg-background px-3 py-2"
              dateFormat="dd/MM/yyyy"
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => date && setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End date"
              className="w-[180px] rounded-md border border-input bg-background px-3 py-2"
            />
            <Button onClick={() => refetch()} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p>Loading report data...</p>
          </CardContent>
        </Card>
      ) : reportData ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="text-lg font-semibold">Total Bookings</h3>
                  <p className="text-3xl font-bold">{reportData.stats.totalBookings}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="text-lg font-semibold">Average Booking Value</h3>
                  <p className="text-3xl font-bold">₹{reportData.stats.averageBookingValue}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="text-lg font-semibold">Total Revenue</h3>
                  <p className="text-3xl font-bold">₹{reportData.stats.totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}