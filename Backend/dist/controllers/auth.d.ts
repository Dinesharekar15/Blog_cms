interface SignUpBody {
    name: string;
    email: string;
    password: string;
}
declare const signUp: import("express").RequestHandler<{}, any, SignUpBody, import("qs").ParsedQs, Record<string, any>>;
interface VerifyOtpBody {
    email: string;
    otp: string;
}
declare const verifyOtp: import("express").RequestHandler<{}, any, VerifyOtpBody, import("qs").ParsedQs, Record<string, any>>;
interface ResendOtpBody {
    email: string;
}
declare const resendOtp: import("express").RequestHandler<{}, any, ResendOtpBody, import("qs").ParsedQs, Record<string, any>>;
interface SignInBody {
    email: string;
    password: string;
}
declare const signIn: import("express").RequestHandler<{}, any, SignInBody, import("qs").ParsedQs, Record<string, any>>;
/** POST /api/v1/auth/signout — clears both cookies */
declare const signOut: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** POST /api/v1/auth/refresh — validates refresh token, issues new access token */
declare const refresh: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
interface ForgotPasswordBody {
    email: string;
}
declare const forgotPassword: import("express").RequestHandler<{}, any, ForgotPasswordBody, import("qs").ParsedQs, Record<string, any>>;
interface ResetPasswordBody {
    email: string;
    otp: string;
    newPassword: string;
}
declare const resetPassword: import("express").RequestHandler<{}, any, ResetPasswordBody, import("qs").ParsedQs, Record<string, any>>;
export { signUp, signIn, signOut, refresh, verifyOtp, resendOtp, forgotPassword, resetPassword };
//# sourceMappingURL=auth.d.ts.map