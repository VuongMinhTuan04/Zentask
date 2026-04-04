import express from 'express';
import { signIn, signOut, signUp } from '../controllers/authController.js';
import { validateSignUp } from '../middlewares/validateMiddleware.js';

const router = express.Router();

router.post('/auth/sign-in', signIn);
router.post('/auth/sign-up', validateSignUp, signUp);
router.get('/auth/sign-out', signOut);

export default router;