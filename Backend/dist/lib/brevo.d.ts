import nodemailer from "nodemailer";
/**
 * Nodemailer transporter configured for Brevo SMTP relay.
 * Credentials: Brevo dashboard → SMTP & API → SMTP tab → Generate SMTP key
 *   BREVO_SMTP_USER = your Brevo account login email
 *   BREVO_SMTP_PASS = SMTP key (not your account password)
 */
export declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo, import("nodemailer/lib/smtp-transport/index.js").Options>;
//# sourceMappingURL=brevo.d.ts.map