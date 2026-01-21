import VIP from "../models/VIP.js";
import transporter from "../config/mailer.js";

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
