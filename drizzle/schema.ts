import { int, mysqlEnum, mysqlTable, text, varchar, timestamp, date, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table for custom email/password authentication.
 * Extend this file with additional tables as your product grows.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Email for login - unique per user */
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** Hashed password using bcrypt */
  password: varchar("password", { length: 255 }).notNull(),
  /** User's full name */
  name: varchar("name", { length: 255 }),
  /** User's phone number */
  phone: varchar("phone", { length: 20 }),
  /** User role: user or admin */
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Account creation timestamp */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** Last updated timestamp */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  /** Last login timestamp */
  lastSignedIn: timestamp("lastSignedIn"),
  /** Email verification token */
  emailVerificationToken: varchar("emailVerificationToken", { length: 255 }),
  /** Email verification token expiry */
  emailVerificationTokenExpiry: timestamp("emailVerificationTokenExpiry"),
  /** Email verified status */
  emailVerified: boolean("emailVerified").default(false).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Bookings table for storing event booking requests
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 20 }).notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  eventDate: date("eventDate").notNull(),
  location: text("location").notNull(),
  budget: varchar("budget", { length: 50 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Booking approvals table for tracking admin actions
 */
export const bookingApprovals = mysqlTable("bookingApprovals", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  adminId: int("adminId").notNull(),
  action: mysqlEnum("action", ["approved", "rejected"]).notNull(),
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookingApproval = typeof bookingApprovals.$inferSelect;
export type InsertBookingApproval = typeof bookingApprovals.$inferInsert;
