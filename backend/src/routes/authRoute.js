import express from 'express';
import { changeInfo, changePassword, forgotPassword, signIn, signOut, signUp } from '../controllers/authController.js';
import { validateSignUp } from '../middlewares/validateMiddleware.js';
import { checkForgotPasswordMiddleware, jwtMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/auth/sign-in', signIn);
router.post('/auth/sign-up', validateSignUp, signUp);
router.get('/auth/sign-out', signOut);
router.patch('/users/update-profile', jwtMiddleware, changeInfo);
router.patch('/users/change-password', jwtMiddleware, changePassword);
router.patch('/auth/forgot-password', checkForgotPasswordMiddleware, forgotPassword);

export default router;