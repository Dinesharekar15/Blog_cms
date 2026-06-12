/** Generate a cryptographically secure 6-digit numeric OTP */
export declare function generateOtp(): string;
/** Hash an OTP using bcrypt */
export declare function hashOtp(otp: string): Promise<string>;
/** Verify a plain OTP against a bcrypt hash */
export declare function verifyOtpHash(plain: string, hashed: string): Promise<boolean>;
/** Returns a Date 10 minutes from now */
export declare function otpExpiry(): Date;
//# sourceMappingURL=otp.d.ts.map