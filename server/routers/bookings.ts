import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createBooking,
  getBookingsByUserId,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  createBookingApproval,
} from "../mongodb";
import { TRPCError } from "@trpc/server";
import {
  sendApprovalEmail,
  sendRejectionEmail,
  sendBookingConfirmationEmail,
} from "../email";
import { format } from "date-fns";

export const bookingsRouter = router({
  /* ================= CREATE BOOKING ================= */

  create: publicProcedure
    .input(
      z.object({
        clientName: z.string().min(1, "Name is required"),
        clientEmail: z.string().email("Invalid email"),
        clientPhone: z.string().min(10, "Invalid phone number"),
        eventType: z.string().min(1, "Event type is required"),
        eventDate: z.string().refine(
          (date) => !isNaN(Date.parse(date)),
          "Invalid date"
        ),
        location: z.string().min(1, "Location is required"),
        budget: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const booking = await createBooking({
          userId: ctx.user?.id ?? 0,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientPhone: input.clientPhone,
          eventType: input.eventType,
          eventDate: input.eventDate,
          location: input.location,
          budget: input.budget,
          notes: input.notes,
          status: "pending",
        } as any);

        if (!booking) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create booking",
          });
        }

        await sendBookingConfirmationEmail({
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          eventType: input.eventType,
          eventDate: format(new Date(input.eventDate), "MMM dd, yyyy"),
          location: input.location,
          bookingId: booking._id?.toString() || "N/A",
        });

        return booking;
      } catch (error) {
        console.error("Booking creation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create booking",
        });
      }
    }),

  /* ================= USER BOOKINGS ================= */

  getUserBookings: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.id !== input.userId && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view your own bookings",
        });
      }

      try {
        return await getBookingsByUserId(input.userId);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch bookings",
        });
      }
    }),

  /* ================= ADMIN BOOKINGS ================= */

  getAllBookings: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can view all bookings",
      });
    }

    try {
      return await getAllBookings();
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch bookings",
      });
    }
  }),

  /* ================= SINGLE BOOKING ================= */

  getBooking: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const booking = await getBookingById(input.bookingId);

        if (!booking) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Booking not found",
          });
        }

        if (booking.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only view your own bookings",
          });
        }

        return booking;
      } catch (error) {
        console.error("Error fetching booking:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch booking",
        });
      }
    }),

  /* ================= APPROVE BOOKING ================= */

  approveBooking: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can approve bookings",
        });
      }

      try {
        const booking = await getBookingById(input.bookingId);

        if (!booking) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Booking not found",
          });
        }

        const updatedBooking = await updateBookingStatus(
          input.bookingId,
          "approved"
        );

        await createBookingApproval({
          bookingId: input.bookingId,
          approvedBy: ctx.user.id,
          action: "approved",
        } as any);

        await sendApprovalEmail({
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          eventType: booking.eventType,
          eventDate: booking.eventDate,
          location: booking.location,
          bookingId: input.bookingId,
        });

        return updatedBooking;
      } catch (error) {
        console.error("Error approving booking:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to approve booking",
        });
      }
    }),

  /* ================= REJECT BOOKING ================= */

  rejectBooking: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can reject bookings",
        });
      }

      try {
        const booking = await getBookingById(input.bookingId);

        if (!booking) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Booking not found",
          });
        }

        const updatedBooking = await updateBookingStatus(
          input.bookingId,
          "rejected"
        );

        await createBookingApproval({
          bookingId: input.bookingId,
          approvedBy: ctx.user.id,
          action: "rejected",
          reason: input.reason,
        } as any);

        await sendRejectionEmail({
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          eventType: booking.eventType,
          eventDate: booking.eventDate,
          location: booking.location,
          bookingId: input.bookingId,
          reason: input.reason || "No reason provided",
        });

        return updatedBooking;
      } catch (error) {
        console.error("Error rejecting booking:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reject booking",
        });
      }
    }),
});