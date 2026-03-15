import crypto from "crypto";

/**
 * Generate email verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Get token expiry time (24 hours from now)
 */
export function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
}

/**
 * Create verification email HTML
 */
export function createVerificationEmailHTML(
  userName: string,
  verificationLink: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D4AF37 0%, #8B1538 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px; background: #f9f9f9; border-radius: 8px; margin-top: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: #D4AF37; color: #2C2C2C; text-decoration: none; border-radius: 4px; margin-top: 15px; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to UtsavMitra! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for creating an account with UtsavMitra. To complete your registration and start booking events, please verify your email address.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${verificationLink}" class="button">Verify Email</a>
            <p style="margin-top: 20px; font-size: 14px;">Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #666;">${verificationLink}</p>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 UtsavMitra. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Create welcome email after verification
 */
export function createWelcomeEmailHTML(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D4AF37 0%, #8B1538 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px; background: #f9f9f9; border-radius: 8px; margin-top: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: #D4AF37; color: #2C2C2C; text-decoration: none; border-radius: 4px; margin-top: 15px; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verified! ✓</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Your email has been successfully verified. Your account is now active and ready to use!</p>
            <p>You can now:</p>
            <ul>
              <li>Book events and celebrations</li>
              <li>Track your bookings in real-time</li>
              <li>Receive updates about your events</li>
            </ul>
            <a href="https://utsavmitra.com" class="button">Start Booking Now</a>
          </div>
          <div class="footer">
            <p>&copy; 2024 UtsavMitra. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
