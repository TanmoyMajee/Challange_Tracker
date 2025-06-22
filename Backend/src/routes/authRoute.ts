import express from 'express';
import { register } from '../controller/auth/register';
import { login } from '../controller/auth/login';
// import { logout } from '../controller/auth/logout';
import { getProfile } from '../controller/auth/profile';
import { verifyUser } from '../middleware/verifyUser';
import { getAlluser } from '../controller/auth/getAlluser';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes (require authentication)
// router.post('/logout', verifyUser, logout);
router.get('/profile', verifyUser, getProfile);
router.get('/gelAllUsers', verifyUser, getAlluser);



export default router;
