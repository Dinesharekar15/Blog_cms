import exress from 'express';
import { signUp, signIn } from '../controllers/auth.js';
const router = exress.Router();
router.post('/signup', signUp);
router.post('/signin', signIn);
export default router;
//# sourceMappingURL=authRoutes.js.map