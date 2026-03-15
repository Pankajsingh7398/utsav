import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

interface BookingStatus {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  location: string;
  budget?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  notes?: string;
}

export default function TrackBooking() {
  const [, setLocation] = useLocation();
  const [bookingId, setBookingId] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState<BookingStatus | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!bookingId || !email) {
      toast.error("Please enter both Booking ID and Email");
      return;
    }

    setIsSearching(true);
    try {
      // In a real app, you'd call an API endpoint to search for the booking
      // For now, this is a placeholder
      toast.info("Booking search feature coming soon");
    } catch (error) {
      toast.error("Failed to search booking");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "rejected":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "pending":
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      case "pending":
      default:
        return "bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved ✓";
      case "rejected":
        return "Rejected ✗";
      case "pending":
      default:
        return "Pending ⏳";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] via-white to-[#FAF8F3]">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8D5C4] shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B1538] flex items-center justify-center text-white font-bold text-lg">
              ✨
            </div>
            <h1 className="text-2xl font-bold text-[#2C2C2C]">UtsavMitra</h1>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="flex items-center gap-2 border-[#E8D5C4] text-[#2C2C2C] hover:bg-[#FAF8F3]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-4">Track Your Booking</h2>
            <p className="text-lg text-gray-600">
              Enter your Booking ID and Email to check the status of your event booking
            </p>
          </div>

          {/* Search Form */}
          {!booking && (
            <Card className="p-8 border-[#E8D5C4] shadow-lg">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="booking-id" className="text-[#2C2C2C] font-semibold">
                    Booking ID
                  </Label>
                  <Input
                    id="booking-id"
                    type="text"
                    placeholder="Enter your booking ID"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#2C2C2C] font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full bg-[#D4AF37] text-[#2C2C2C] hover:bg-[#8B1538] hover:text-white transition-all duration-300 font-semibold py-6 text-lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {isSearching ? "Searching..." : "Search Booking"}
                </Button>
              </div>
            </Card>
          )}

          {/* Booking Details */}
          {booking && (
            <div className="space-y-6">
              <Card className={`p-8 border-2 ${getStatusColor(booking.status)}`}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#2C2C2C] mb-2">{booking.eventType}</h3>
                    <p className="text-gray-600">Booking ID: #{booking.id}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className="text-sm font-semibold text-[#2C2C2C]">{getStatusText(booking.status)}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t border-gray-300 pt-6 mt-6">
                  <h4 className="font-semibold text-[#2C2C2C] mb-4">Booking Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                        <div className="w-0.5 h-12 bg-gray-300"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-[#2C2C2C]">Booking Submitted</p>
                        <p className="text-sm text-gray-600">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {booking.status !== "pending" && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${booking.status === "approved" ? "bg-green-500" : "bg-red-500"}`}></div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#2C2C2C]">
                            {booking.status === "approved" ? "Booking Approved ✓" : "Booking Rejected ✗"}
                          </p>
                          <p className="text-sm text-gray-600">Status updated</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Booking Details */}
              <Card className="p-8 border-[#E8D5C4]">
                <h4 className="text-xl font-bold text-[#2C2C2C] mb-6">Booking Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-[#2C2C2C]">{booking.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-[#2C2C2C]">{booking.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-[#2C2C2C]">{booking.clientPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Event Date</p>
                    <p className="font-semibold text-[#2C2C2C]">{new Date(booking.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-semibold text-[#2C2C2C]">{booking.location}</p>
                  </div>
                  {booking.budget && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Budget</p>
                      <p className="font-semibold text-[#2C2C2C]">{booking.budget}</p>
                    </div>
                  )}
                  {booking.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Notes</p>
                      <p className="font-semibold text-[#2C2C2C]">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </Card>

              <Button
                onClick={() => {
                  setBooking(null);
                  setBookingId("");
                  setEmail("");
                }}
                variant="outline"
                className="w-full border-[#E8D5C4] text-[#2C2C2C] hover:bg-[#FAF8F3]"
              >
                Search Another Booking
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
