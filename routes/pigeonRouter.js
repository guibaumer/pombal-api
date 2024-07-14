import { Router } from 'express';
import { CreatePigeon, GetAllPigeons, getPigeon, getPigeonPhoto, EditPigeon, getOffspring, deletePigeon } from '../src/controllers/pigeonController.js';
import upload from '../config/multer.js';

const router = new Router();

router.get('/', GetAllPigeons);
router.post('/', upload.single('photo'), CreatePigeon);
router.put('/', upload.single('photo'), EditPigeon);
router.post('/get-pigeon-data', getPigeon);
router.post('/get-photo', getPigeonPhoto);
router.post('/get-offspring', getOffspring);
router.delete('/delete-pigeon', deletePigeon);

export default router;

