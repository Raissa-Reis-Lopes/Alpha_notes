import { Router } from 'express';
import * as imageController from '../controllers/imageController';

const router = Router();

// Rota para fazer upload da imagem
router.post('/', imageController.upload.single('image'), imageController.uploadImage);

// Rota para remover uma imagem (se necessário)
router.delete('/:imageId', imageController.deleteImage);

export default router;