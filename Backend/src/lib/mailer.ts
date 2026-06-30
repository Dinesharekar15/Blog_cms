import { transporter } from "./brevo.js";

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@yourdomain.com";
const APP_NAME = "BlogCMS";

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Your ${APP_NAME} verification code: ${otp}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Email Verification</title>
      </head>
      <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:48px 16px;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#f97316,#ea580c);padding:32px;text-align:center;">
                    <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">${APP_NAME}</h1>
                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Email Verification</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px 36px;">
                    <p style="margin:0 0 16px;color:#d1d5db;font-size:15px;line-height:1.6;">
                      Hi there! 👋 Use the code below to verify your email address. It expires in <strong style="color:#f97316;">10 minutes</strong>.
                    </p>
                    <!-- OTP Box -->
                    <div style="background:#111;border:2px solid #f97316;border-radius:12px;padding:28px;text-align:center;margin:24px 0;">
                      <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Your verification code</p>
                      <span style="font-size:44px;font-weight:800;letter-spacing:12px;color:#f97316;font-family:monospace;">${otp}</span>
                    </div>
                    <p style="margin:16px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
                      If you didn't create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:20px 36px;border-top:1px solid #2a2a2a;text-align:center;">
                    <p style="margin:0;color:#4b5563;font-size:12px;">&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    });
  } catch (error) {
    console.error("Brevo sendOtpEmail error:", error);
    throw new Error(`Failed to send OTP email: ${(error as Error).message}`);
  }
}

export async function sendPasswordResetEmail(to: string, otp: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Reset your ${APP_NAME} password`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Password Reset</title>
      </head>
      <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:48px 16px;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:32px;text-align:center;">
                    <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">${APP_NAME}</h1>
                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Password Reset</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px 36px;">
                    <p style="margin:0 0 16px;color:#d1d5db;font-size:15px;line-height:1.6;">
                      We received a request to reset your password. Use the code below — it expires in <strong style="color:#6366f1;">10 minutes</strong>.
                    </p>
                    <!-- OTP Box -->
                    <div style="background:#111;border:2px solid #6366f1;border-radius:12px;padding:28px;text-align:center;margin:24px 0;">
                      <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Your reset code</p>
                      <span style="font-size:44px;font-weight:800;letter-spacing:12px;color:#6366f1;font-family:monospace;">${otp}</span>
                    </div>
                    <p style="margin:16px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:20px 36px;border-top:1px solid #2a2a2a;text-align:center;">
                    <p style="margin:0;color:#4b5563;font-size:12px;">&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    });
  } catch (error) {
    console.error("Brevo sendPasswordResetEmail error:", error);
    throw new Error(`Failed to send password reset email: ${(error as Error).message}`);
  }
}
