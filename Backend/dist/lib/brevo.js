import nodemailer from "nodemailer";
if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
    throw new Error("BREVO_SMTP_USER and BREVO_SMTP_PASS must be set in environment variables");
}
/**
 * Nodemailer transporter configured for Brevo SMTP relay.
 * Credentials: Brevo dashboard → SMTP & API → SMTP tab → Generate SMTP key
 *   BREVO_SMTP_USER = your Brevo account login email
 *   BREVO_SMTP_PASS = SMTP key (not your account password)
 */
export const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // STARTTLS — Brevo requires port 587 with STARTTLS
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
    },
});
//# sourceMappingURL=brevo.js.map