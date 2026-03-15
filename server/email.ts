import { notifyOwner } from "./_core/notification";

interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  eventType: string;
  eventDate: string;
  location: string;
  bookingId: string | number;
}

export async function sendApprovalEmail(data: BookingEmailData): Promise<boolean> {
  try {
    // Send approval notification to owner
    await notifyOwner({
      title: `Booking Approved: ${data.eventType}`,
      content: `Booking #${data.bookingId} for ${data.clientName} (${data.eventType}) on ${data.eventDate} has been approved.`,
    });

    // In a production environment, you would integrate with an email service like SendGrid, Mailgun, or AWS SES
    // For now, we'll log the email that would be sent
    console.log(`[EMAIL] Approval notification sent to ${data.clientEmail}`, {
      subject: `Your ${data.eventType} Booking is Confirmed - UtsavMitra`,
      to: data.clientEmail,
      clientName: data.clientName,
      eventType: data.eventType,
      eventDate: data.eventDate,
      location: data.location,
      bookingId: data.bookingId,
    });

    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send approval email:", error);
    return false;
  }
}

export async function sendRejectionEmail(
  data: BookingEmailData & { reason: string }
): Promise<boolean> {
  try {
    // Send rejection notification to owner
    await notifyOwner({
      title: `Booking Rejected: ${data.eventType}`,
      content: `Booking #${data.bookingId} for ${data.clientName} (${data.eventType}) on ${data.eventDate} has been rejected. Reason: ${data.reason}`,
    });

    // In a production environment, you would integrate with an email service
    console.log(`[EMAIL] Rejection notification sent to ${data.clientEmail}`, {
      subject: `Update on Your ${data.eventType} Booking Request - UtsavMitra`,
      to: data.clientEmail,
      clientName: data.clientName,
      eventType: data.eventType,
      eventDate: data.eventDate,
      location: data.location,
      bookingId: data.bookingId,
      reason: data.reason,
    });

    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send rejection email:", error);
    return false;
  }
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  try {
    console.log(`[EMAIL] Booking confirmation sent to ${data.clientEmail}`, {
      subject: `Booking Request Received - UtsavMitra`,
      to: data.clientEmail,
      clientName: data.clientName,
      eventType: data.eventType,
      eventDate: data.eventDate,
      location: data.location,
      bookingId: data.bookingId,
    });

    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send booking confirmation email:", error);
    return false;
  }
}
