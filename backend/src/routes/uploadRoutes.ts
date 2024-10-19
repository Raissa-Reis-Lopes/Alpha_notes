import { Router } from 'express';
import { upload, uploadImage, removeImage } from '../controllers/uploadController';

const router = Router();

// Rota para fazer upload da imagem
router.post('/', upload.single('image'), uploadImage);

// Rota para remover uma imagem (se necessário)
router.delete('/', removeImage);

export default router;