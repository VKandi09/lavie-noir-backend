import express from "express";
import Reservation from "../models/Reservation.js";
import { protectAdmin } from "../middlewares/adminAuth.js";
import { sendReservationStatusEmail } from "../utils/sendReservationStatusEmail.js";
import transporter from "../config/mailer.js";

const router = express.Router();

/* -------------------------
   PUBLIC: Create Reservation
-------------------------- */

router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      reservationDate,
      reservationTime,
      partySize,
      occasion,
      notes,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !location ||
      !reservationDate ||
      !reservationTime ||
      !partySize
    ) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    // Combine date + time into single Date object
    const reservationDateTime = new Date(
      `${reservationDate} ${reservationTime}`
    );

    if (isNaN(reservationDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    // Prevent booking in past
    if (reservationDateTime < new Date()) {
      return res.status(400).json({ message: "Cannot book in the past" });
    }

    const reservation = await Reservation.create({
      firstName,
      lastName,
      email,
      phone,
      location,
      reservationDateTime,
      partySize,
      occasion,
      notes,
    });

    const formattedDateTime = reservationDateTime.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Guest confirmation email
    try {
      await transporter.sendMail({
        to: email,
        subject: "Reservation Request Received 🥂",
        html: `<p>Hi ${firstName},</p>
          <p>We've received your reservation request at <strong>${location}</strong> for <strong>${formattedDateTime}</strong> (party of ${partySize}).</p>
          <p>Our host team will contact you shortly to confirm. Get ready for an elevated experience.</p>`,
      });
    } catch (err) {
      console.error("Email failed (guest confirmation):", err.message);
    }

    // Admin notification email
    try {
      await transporter.sendMail({
        to: process.env.VIP_HOST_EMAIL,
        subject: "New Reservation Request",
        html: `<p><strong>${firstName} ${lastName}</strong> has submitted a reservation request.</p>
          <p>Location: ${location}<br/>Date & Time: ${formattedDateTime}<br/>Party Size: ${partySize}${occasion ? `<br/>Occasion: ${occasion}` : ""}</p>
          <p>Email: ${email} | Phone: ${phone}</p>`,
      });
    } catch (err) {
      console.error("Email failed (admin notification):", err.message);
    }

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Reservation failed" });
  }
});

/* -------------------------
   ADMIN: Get Stats
-------------------------- */

router.get("/stats", protectAdmin, async (_req, res) => {
  try {
    const [total, pending, confirmed, declined, recent] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: "pending" }),
      Reservation.countDocuments({ status: "confirmed" }),
      Reservation.countDocuments({ status: "declined" }),
      Reservation.find().sort({ createdAt: -1 }).limit(5),
    ]);
    res.json({
      totalReservations: total,
      pendingReservations: pending,
      confirmedReservations: confirmed,
      declinedReservations: declined,
      recent,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

/* -------------------------
   ADMIN: Get All Reservations
-------------------------- */

router.get("/", protectAdmin, async (_req, res) => {
  try {
    const reservations = await Reservation.find().sort({
        reservationDateTime: -1,
    });

    res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reservations" });
 }
});

/* -------------------------
   ADMIN: Update Status
-------------------------- */

router.put("/:id/status", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    sendReservationStatusEmail(updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

/* -------------------------
   ADMIN: Update Full Reservation
-------------------------- */

router.put("/:id", protectAdmin, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      reservationDate,
      reservationTime,
      partySize,
      occasion,
      notes,
      status,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !location || !reservationDate || !reservationTime || !partySize) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const reservationDateTime = new Date(`${reservationDate} ${reservationTime}`);
    if (isNaN(reservationDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time" });
    }

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone, location, reservationDateTime, partySize, occasion, notes, status },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Reservation not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update reservation" });
  }
});

/* -------------------------
   ADMIN: Delete Reservation
-------------------------- */

router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Reservation not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete reservation" });
  }
});

export default router;
