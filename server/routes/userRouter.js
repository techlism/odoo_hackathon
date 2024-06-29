import { Router } from 'express';
import { registerInstituteWithAdmin, login, getProfile,registerNewUser } from '../controllers/userController.js';
import { checkUserAuthentication } from '../middleware/Auth.js';

const router = Router();

// Routes
router.post('/login', login);
router.get('/profile', checkUserAuthentication, getProfile);
router.post('/register', registerInstituteWithAdmin);
router.post('/register-new-user', registerNewUser);
export default router;
