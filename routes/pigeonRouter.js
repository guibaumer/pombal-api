import { Router } from 'express';
import { CreatePigeon, GetAllPigeons, getPigeon, getPigeonPhoto } from '../src/controllers/pigeonController.js';
import upload from '../config/multer.js';

// import multer from 'multer';
// const upload = multer({ dest: 'uploads/' });

const router = new Router();

router.get('/', GetAllPigeons);
router.post('/', upload.single('photo'), CreatePigeon);
router.post('/get-pigeon-data', getPigeon);
router.post('/get-photo', getPigeonPhoto);

export default router;


