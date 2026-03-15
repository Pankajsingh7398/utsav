// Custom authentication SDK for email/password login
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";
import { comparePassword, hashPassword } from "./auth";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
  role: "admin" | "user";
};

class AuthService {
  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }

    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  async createSessionToken(
    userId: number,
    email: string,
    name: string,
    role: "admin" | "user" = "user",
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    return this.signSession(
      {
        userId,
        email,
        name,
        role,
      },
      options
    );
  }

  async signSession(
    payload: SessionPayload,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<SessionPayload | null> {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { userId, email, name, role } = payload as Record<string, unknown>;

      if (typeof userId !== "number" || !isNonEmptyString(email)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }

      return {
        userId,
        email,
        name: isNonEmptyString(name) ? name : "",
        role: role === "admin" ? "admin" : "user",
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }

  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const userId = session.userId;
    const signedInAt = new Date();
    let user = await db.getUserById(userId);

    if (!user) {
      throw ForbiddenError("User not found");
    }

    return user;
  }

  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await db.getUserByEmail(email);

    if (!user) {
      throw ForbiddenError("Invalid email or password");
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      throw ForbiddenError("Invalid email or password");
    }

    const token = await this.createSessionToken(
      user.id,
      user.email,
      user.name || "",
      user.role
    );

    return { token, user };
  }

  /**
   * Register new user with email and password
   */
  async register(
    email: string,
    password: string,
    name: string,
    phone?: string
  ): Promise<{ token: string; user: User }> {
    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      throw ForbiddenError("Email already registered");
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    await db.createUser({
      email,
      password: hashedPassword,
      name,
      phone,
      role: "user",
    });

    // Get the created user
    const user = await db.getUserByEmail(email);
    if (!user) {
      throw ForbiddenError("Failed to create user");
    }

    const token = await this.createSessionToken(
      user.id,
      user.email,
      user.name || "",
      user.role
    );

    return { token, user };
  }
}

export const sdk = new AuthService();
