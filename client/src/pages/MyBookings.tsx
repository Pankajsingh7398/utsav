import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function MyBookings() {

  const { user } = useAuth();

  const { data: bookings, isLoading } =
    trpc.bookings.getUserBookings.useQuery({
      userId: user?.id ?? 0
    });

  if (isLoading) {
    return <div className="p-10">Loading bookings...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        My Bookings
      </h1>

      {bookings?.length === 0 && (
        <p>No bookings found.</p>
      )}

      {bookings?.map((booking) => (

        <div
          key={booking._id}
          className="border p-5 rounded-lg mb-4"
        >

          <h2 className="text-xl font-semibold">
            {booking.eventType}
          </h2>

          <p>Date: {booking.eventDate}</p>
          <p>Location: {booking.location}</p>
          <p>Status: {booking.status}</p>

        </div>

      ))}

    </div>
  );
}