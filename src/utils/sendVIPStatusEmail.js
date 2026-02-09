import transporter from "../config/mailer.js";

export const sendVIPStatusEmail = async ( vip ) => {
    let subject, html;
    console.log('sendVIPStatusEmail vip :', vip);

    if (vip.status === 'confirmed') {
        subject = "Your VIP Reservation is Confimed 🥂";
        html = `<p>Hi ${vip.firstName},<br/>
            <p>Your VIP reservation at <strong>${vip.location}</strong> has been
            <strong>confirmed</strong>.</p>
            <p>Our host will contact you shortly.</p>`;
    }

    if (vip.status === 'declined') {
        subject = "Your VIP Reservation Status";
        html = `<p>Hi ${vip.firstName},<br/>
            <p>We regret to inform you that your VIP reservation at
            <strong>${vip.location}</strong> has been
            <strong>declined</strong>.</p>
            <p>Feel free to reach out for more information.</p>`;
    }
    
    if (!subject || !html) return;
    try {
        await transporter.sendMail({
            to: vip.email,
            subject,
            html,
        });
    } catch (err) {
        console.error("Email failed (VIP status update):", err);
    };
}