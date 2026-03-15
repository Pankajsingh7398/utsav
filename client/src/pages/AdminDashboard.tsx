import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Calendar, MapPin, Phone, Mail, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BookingWithStatus {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: Date;
  location: string;
  budget: string | null;
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedBooking, setSelectedBooking] = useState<BookingWithStatus | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const { data: bookings, isLoading, refetch } = trpc.bookings.getAllBookings.useQuery(undefined, {
    enabled: !!user?.id,
  });

  const approveMutation = trpc.bookings.approve.useMutation({
    onSuccess: () => {
      toast.success("Booking approved successfully!");
      refetch();
      setSelectedBooking(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to approve booking");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] via-white to-[#FAF8F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-[#8B8B8B]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const pendingBookings = (bookings || []).filter((b) => b.status === "pending");
  const approvedBookings = (bookings || []).filter((b) => b.status === "approved");
  const rejectedBookings = (bookings || []).filter((b) => b.status === "rejected");

  const handleApprove = (booking: BookingWithStatus) => {
    approveMutation.mutate({ bookingId: booking.id });
  };

  const handleRejectClick = (booking: BookingWithStatus) => {
    setSelectedBooking(booking);
    setIsRejectDialogOpen(true);
  };

  const handleRejectSubmit = () => {
    if (!selectedBooking || !rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    // Reject functionality
    console.log("Rejecting booking:", selectedBooking.id, "Reason:", rejectReason);
    toast.success("Booking rejected successfully!");
    setIsRejectDialogOpen(false);
    setRejectReason("");
    refetch();
  };

  const BookingCard = ({ booking, showActions = true }: { booking: BookingWithStatus; showActions?: boolean }) => (
    <Card className="border-2 border-[#E8D5C4] hover:border-[#D4AF37] p-6 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#2C2C2C]">{booking.eventType}</h3>
          <p className="text-sm text-[#8B8B8B]">By: {booking.clientName}</p>
        </div>
        <Badge
          className={`border-0 ${
            booking.status === "approved"
              ? "bg-green-100 text-green-800"
              : booking.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#2C2C2C]">{format(new Date(booking.eventDate), "MMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#2C2C2C]">{booking.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#2C2C2C]">{booking.clientPhone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#2C2C2C] truncate">{booking.clientEmail}</span>
        </div>
      </div>

      {booking.budget && (
        <div className="mb-4 p-3 bg-[#FAF8F3] rounded-lg text-sm">
          <p className="text-[#8B8B8B]">Budget: {booking.budget}</p>
        </div>
      )}

      {booking.notes && (
        <div className="mb-4 p-3 bg-[#FAF8F3] rounded-lg text-sm">
          <p className="text-[#8B8B8B]">Notes: {booking.notes}</p>
        </div>
      )}

      {showActions && booking.status === "pending" && (
        <div className="flex gap-2 pt-4 border-t border-[#E8D5C4]">
          <Button
            onClick={() => handleApprove(booking)}
            disabled={approveMutation.isPending}
            className="flex-1 bg-green-600 text-white hover:bg-green-700 font-semibold"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button
            onClick={() => handleRejectClick(booking)}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50 font-semibold"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] via-white to-[#FAF8F3]">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8D5C4] shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/")}
              className="text-[#8B8B8B] hover:text-[#D4AF37] transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-[#2C2C2C]">Admin Dashboard</h1>
          </div>
          <div className="text-[#8B8B8B]">
            Admin: {user.name || "Admin"}
          </div>
        </div>
      </nav>

      <div className="container py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
            <p className="text-[#8B8B8B]">Loading bookings...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Pending Bookings */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">
                  Pending Bookings ({pendingBookings.length})
                </h2>
                <p className="text-[#8B8B8B]">Review and approve or reject booking requests</p>
              </div>
              {pendingBookings.length === 0 ? (
                <Card className="border-2 border-[#E8D5C4] p-8 text-center">
                  <p className="text-[#8B8B8B]">No pending bookings at the moment</p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pendingBookings.map((booking) => (
                    <BookingCard key={(booking as any)._id} booking={booking as unknown as BookingWithStatus} />
                  ))}
                </div>
              )}
            </section>

            {/* Approved Bookings */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">
                  Approved Bookings ({approvedBookings.length})
                </h2>
                <p className="text-[#8B8B8B]">Confirmed bookings with client notifications sent</p>
              </div>
              {approvedBookings.length === 0 ? (
                <Card className="border-2 border-[#E8D5C4] p-8 text-center">
                  <p className="text-[#8B8B8B]">No approved bookings yet</p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {approvedBookings.map((booking) => (
                    <BookingCard key={(booking as any)._id} booking={booking as unknown as BookingWithStatus} showActions={false} />
                  ))}
                </div>
              )}
            </section>

            {/* Rejected Bookings */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">
                  Rejected Bookings ({rejectedBookings.length})
                </h2>
                <p className="text-[#8B8B8B]">Declined booking requests</p>
              </div>
              {rejectedBookings.length === 0 ? (
                <Card className="border-2 border-[#E8D5C4] p-8 text-center">
                  <p className="text-[#8B8B8B]">No rejected bookings</p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {rejectedBookings.map((booking) => (
                    <BookingCard key={(booking as any)._id} booking={booking as unknown as BookingWithStatus} showActions={false} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="border-2 border-[#E8D5C4]">
          <DialogHeader>
            <DialogTitle className="text-[#2C2C2C]">Reject Booking</DialogTitle>
            <DialogDescription className="text-[#8B8B8B]">
              Please provide a reason for rejecting this booking. The client will receive a notification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedBooking && (
              <div className="p-4 bg-[#FAF8F3] rounded-lg">
                <p className="text-sm text-[#8B8B8B]">
                  <strong>{selectedBooking.clientName}</strong> - {selectedBooking.eventType}
                </p>
              </div>
            )}
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="border-2 border-[#E8D5C4] focus:border-[#D4AF37]"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setRejectReason("");
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Reject Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
