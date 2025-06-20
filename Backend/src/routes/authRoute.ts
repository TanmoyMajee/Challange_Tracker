const express = require('express');
import { register } from '../controller/auth/register';
import { login } from '../controller/auth/login';

const router = express.Router();

router.post('/login',login);
router.post('/register',register);
export default router;
