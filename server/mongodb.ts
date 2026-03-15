import mongoose, { Schema, Document, Model } from "mongoose";

/* ================================
   MongoDB Connection
================================ */

let isConnected = false;

export async function connectMongoDB(
  mongoUrl: string =
    process.env.DATABASE_URL || "mongodb://localhost:27017/utsavmitra"
) {
  if (isConnected) {
    console.log("[MongoDB] Already connected");
    return;
  }

  try {
    await mongoose.connect(mongoUrl);
    isConnected = true;
    console.log("[MongoDB] Connected successfully");
  } catch (error) {
    console.error("[MongoDB] Connection failed:", error);
    throw error;
  }
}

/* ================================
   Booking Schema
================================ */

export interface IBooking extends Document {
  bookingId: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  location: string;
  budget?: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: { type: String, required: true },

    clientName: { type: String, required: true },

    clientEmail: { type: String, required: true },

    clientPhone: { type: String, required: true },

    eventType: { type: String, required: true },

    eventDate: { type: String, required: true },

    location: { type: String, required: true },

    budget: { type: String, default: null },

    notes: { type: String, default: null },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

/* ================================
   Booking Approval Schema
================================ */

export interface IBookingApproval extends Document {
  bookingId: string;
  approvedBy: string;
  action: "approved" | "rejected";
  reason?: string;
  createdAt: Date;
}

const bookingApprovalSchema = new Schema<IBookingApproval>(
  {
    bookingId: { type: String, required: true },

    approvedBy: { type: String, required: true },

    action: {
      type: String,
      enum: ["approved", "rejected"],
      required: true,
    },

    reason: { type: String, default: null },
  },
  { timestamps: true }
);

export const BookingApproval: Model<IBookingApproval> =
  mongoose.models.BookingApproval ||
  mongoose.model<IBookingApproval>("BookingApproval", bookingApprovalSchema);

/* ================================
   Booking Queries
================================ */

/* CREATE BOOKING */

export async function createBooking(
  bookingData: Omit<
    IBooking,
    "_id" | "bookingId" | "createdAt" | "updatedAt"
  >
) {
  try {
    const bookingId =
      "UTSAV-" +
      Math.floor(100000 + Math.random() * 900000) +
      "-" +
      Date.now();

    const booking = new Booking({
      bookingId,
      ...bookingData,
    });

    await booking.save();

    return booking.toObject();
  } catch (error) {
    console.error("[MongoDB] Failed to create booking:", error);
    throw error;
  }
}

/* GET USER BOOKINGS */

export async function getBookingsByUserId(userId: string) {
  try {
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    return bookings.map((b) => b.toObject());
  } catch (error) {
    console.error("[MongoDB] Failed to get bookings:", error);
    return [];
  }
}

/* GET ALL BOOKINGS */

export async function getAllBookings() {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    return bookings.map((b) => b.toObject());
  } catch (error) {
    console.error("[MongoDB] Failed to get all bookings:", error);
    return [];
  }
}

/* GET BOOKING BY bookingId */

export async function getBookingById(bookingId: string) {
  try {
    const booking = await Booking.findOne({ bookingId });

    return booking ? booking.toObject() : null;
  } catch (error) {
    console.error("[MongoDB] Failed to get booking:", error);
    return null;
  }
}

/* UPDATE BOOKING STATUS */

export async function updateBookingStatus(
  bookingId: string,
  status: "pending" | "approved" | "rejected"
) {
  try {
    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { status, updatedAt: new Date() },
      { new: true }
    );

    return booking ? booking.toObject() : null;
  } catch (error) {
    console.error("[MongoDB] Failed to update booking:", error);
    throw error;
  }
}

/* CREATE BOOKING APPROVAL */

export async function createBookingApproval(
  approvalData: Omit<IBookingApproval, "_id" | "createdAt">
) {
  try {
    const approval = new BookingApproval(approvalData);

    await approval.save();

    return approval.toObject();
  } catch (error) {
    console.error("[MongoDB] Failed to create approval:", error);
    throw error;
  }
}