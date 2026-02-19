import express from "express";
import Reservation from "../models/Reservation.js";
import { protectAdmin } from "../middlewares/adminAuth.js";

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
      reservationDateTime,
      partySize,
      occasion,
      notes,
    });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Reservation failed" });
  }
});

/* -------------------------
   ADMIN: Get All Reservations
-------------------------- */

router.get("/", protectAdmin, async (req, res) => {
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
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

export default router;
