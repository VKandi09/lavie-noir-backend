import transporter from "../config/mailer.js";

export const sendReservationStatusEmail = async (reservation) => {
  let subject, html;

  if (reservation.status === "confirmed") {
    subject = "Your Reservation is Confirmed 🥂";
    html = `<p>Hi ${reservation.firstName},</p>
      <p>Your reservation at <strong>${reservation.location}</strong> has been <strong>confirmed</strong>.</p>
      <p>We look forward to seeing you on <strong>${new Date(reservation.reservationDateTime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</strong>.</p>
      <p>Our host team will be in touch if needed.</p>`;
  }

  if (reservation.status === "declined") {
    subject = "Your Reservation Status Update";
    html = `<p>Hi ${reservation.firstName},</p>
      <p>We regret to inform you that your reservation at <strong>${reservation.location}</strong> has been <strong>declined</strong>.</p>
      <p>Feel free to reach out to us for more information.</p>`;
  }

  if (!subject || !html) return;

  try {
    await transporter.sendMail({
      to: reservation.email,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email failed (reservation status update):", err);
  }
};
