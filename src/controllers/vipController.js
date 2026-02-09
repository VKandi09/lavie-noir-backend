import VIP from "../models/VIP.js";
import transporter from "../config/mailer.js";
import { sendVIPStatusEmail } from "../utils/sendVIPStatusEmail.js";

/* Create a new VIP request */

export const createVIP = async (req, res) => {

  console.log("🔥 VIP CONTROLLER HIT", req.body);
  try {
    const { firstName, lastName, email, phone, location, interest, message } =
      req.body;

    if (!firstName || !lastName || !email || !location || !interest) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const vip = await VIP.create({
      firstName,
      lastName,
      email,
      phone,
      location,
      interest,
      message,
    });

    // Guest confirmation email
    try {
      await transporter.sendMail({
        to: email,
        subject: "You're on the VIP List 🥂",
        html: `<p>Hi ${firstName},<br/>Thanks for joining our VIP list. Our host will contact you soon.</p>`,
      });
    } catch (err) {
      console.error("Email failed (guest):", err.message);
    }

    // Internal notification
    try {
      await transporter.sendMail({
        to: process.env.VIP_HOST_EMAIL,
        subject: "New VIP Request",
        html: `
      <p>
        <strong>${firstName} ${lastName}</strong><br/>
        Location: ${location}<br/>
        Interest: ${interest}
      </p>
    `,
      });
    } catch (err) {
      console.error("Email failed (internal):", err.message);
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("🔥 VIP Controller Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* Get VIP statistics for admin dashboard */

export const getVIPStats = async (req, res) => {
    const totalVIPs = await VIP.countDocuments();
    const pendingVIPs = await VIP.countDocuments({ status: "pending" });
    const confirmedVIPs = await VIP.countDocuments({ status: "confirmed" });
    const declinedVIPs = await VIP.countDocuments({ status: "declined" });

    const recent = await VIP.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalVIPs,
      pendingVIPs,
      confirmedVIPs,
      declinedVIPs,
      recent,
    });
}

/* Update VIP request status */

export const updateVIPStatus = async ( req, res ) => {
    try {
        const { status } = req.body;
        const vipId = req.params.id;

        if (!['pending', 'confirmed', 'declined'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const vip = await VIP.findById(vipId);
        if (!vip) {
            return res.status(404).json({ message: "VIP request not found" });
        }

        if (vip.status === status) {
            return res.json(vip);
        }
        vip.status = status;
        vip.statusHistory.push({
            status,
            changedBy: req.admin.id,
        });
        await vip.save();

        await sendVIPStatusEmail(vip);
        
        res.status(200).json(vip);
    } catch (error) {
        console.error("Update VIP Status Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};