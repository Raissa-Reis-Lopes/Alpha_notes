import { Router } from 'express';
import * as imageController from '../controllers/imageController';
import { auth } from '../middlewares/auth';


const router = Router();

router.post('/', auth, imageController.upload.single('image'), imageController.uploadImage);
router.delete('/:imageId', auth, imageController.deleteImage);

export default router;