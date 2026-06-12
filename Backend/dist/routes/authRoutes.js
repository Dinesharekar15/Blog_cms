import express from 'express';
import { signUp, signIn, signOut, refresh, verifyOtp, resendOtp, forgotPassword, resetPassword } from '../controllers/auth.js';
const router = express.Router();
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/refresh', refresh);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
export default router;
//# sourceMappingURL=authRoutes.js.map