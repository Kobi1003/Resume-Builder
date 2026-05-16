import express from 'express';
import { registerUser, loginUser, getUserbyId, updateProfile, getUserResumes } from '../controllers/userController.js';
import protect from '../middlewares/authmiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/data', protect, getUserbyId); // Protected route
router.put('/profile', protect, updateProfile); // Protected route
router.get('/resumes', protect, getUserResumes); // Protected route

export default router;
