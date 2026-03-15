import mongoose, { Schema, Document, Model } from "mongoose";

// -------------------
// MongoDB Connection
// -------------------

let isConnected = false;

export async function connectMongoDB() {
  if (isConnected) {
    console.log("[MongoDB] Already connected");
    return;
  }

  try {
    const uri =
      process.env.DATABASE_URL || "mongodb://localhost:27017/utsavmitra";

    await mongoose.connect(uri);

    isConnected = true;
    console.log("[MongoDB] Connected successfully");
  } catch (error) {
    console.error("[MongoDB] Connection failed:", error);
  }
}

// -------------------
// USER SCHEMA
// -------------------

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "user" | "admin";
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  phone: { type: String },
  role: { type: String, default: "user" },
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

// -------------------
// BOOKING SCHEMA
// -------------------

export interface IBooking extends Document {
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
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    eventType: { type: String, required: true },
    eventDate: { type: String, required: true },
    location: { type: String, required: true },
    budget: { type: String },
    notes: { type: String },
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

// -------------------
// APPROVAL SCHEMA
// -------------------

export interface IBookingApproval extends Document {
  bookingId: string;
  approvedBy: string;
  action: "approved" | "rejected";
  reason?: string;
}

const approvalSchema = new Schema<IBookingApproval>(
  {
    bookingId: { type: String, required: true },
    approvedBy: { type: String, required: true },
    action: {
      type: String,
      enum: ["approved", "rejected"],
      required: true,
    },
    reason: { type: String },
  },
  { timestamps: true }
);

export const BookingApproval: Model<IBookingApproval> =
  mongoose.models.BookingApproval ||
  mongoose.model<IBookingApproval>("BookingApproval", approvalSchema);

// -------------------
// USER FUNCTIONS
// -------------------

export async function createUser(data: Partial<IUser>) {
  const user = new User(data);
  await user.save();
  return user;
}

export async function getUserByEmail(email: string) {
  return await User.findOne({ email });
}

export async function getUserById(id: string) {
  return await User.findById(id);
}

// -------------------
// BOOKING FUNCTIONS
// -------------------

export async function createBooking(data: Partial<IBooking>) {
  const booking = new Booking(data);
  await booking.save();
  return booking;
}

export async function getBookingsByUserId(userId: string) {
  return await Booking.find({ userId });
}

export async function getAllBookings() {
  return await Booking.find();
}

export async function getBookingById(id: string) {
  return await Booking.findById(id);
}

export async function updateBookingStatus(
  id: string,
  status: "pending" | "approved" | "rejected"
) {
  return await Booking.findByIdAndUpdate(id, { status }, { new: true });
}

// -------------------
// APPROVAL FUNCTIONS
// -------------------

export async function createBookingApproval(data: Partial<IBookingApproval>) {
  const approval = new BookingApproval(data);
  await approval.save();
  return approval;
}