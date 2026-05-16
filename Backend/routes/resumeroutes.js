import express from 'express';
import { 
    createResume, 
    deleteResume, 
    getResumeById, 
    updateResume, 
    getResumeByIdPublic,
    uploadImage
} from '../controllers/resumecontroller.js';
import protect from '../middlewares/authmiddleware.js';
import upload from '../configs/multer.js';

const router = express.Router();

// Base route is /api/resume
router.post('/create', protect, createResume);
router.delete('/:id', protect, deleteResume);
router.get('/get/:id', protect, getResumeById);
router.put('/update/:id', protect, updateResume);
router.get('/public/:id', getResumeByIdPublic);
router.post('/upload-image', protect, upload.single('image'), uploadImage);

export default router;
