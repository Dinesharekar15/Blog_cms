import crypto from "crypto";
import bcrypt from "bcrypt";
/** Generate a cryptographically secure 6-digit numeric OTP */
export function generateOtp() {
    // Use crypto to generate a number between 100000 and 999999
    const buffer = crypto.randomBytes(4);
    const num = buffer.readUInt32BE(0) % 900000;
    return String(100000 + num);
}
/** Hash an OTP using bcrypt */
export async function hashOtp(otp) {
    return bcrypt.hash(otp, 10);
}
/** Verify a plain OTP against a bcrypt hash */
export async function verifyOtpHash(plain, hashed) {
    return bcrypt.compare(plain, hashed);
}
/** Returns a Date 10 minutes from now */
export function otpExpiry() {
    return new Date(Date.now() + 10 * 60 * 1000);
}
//# sourceMappingURL=otp.js.map