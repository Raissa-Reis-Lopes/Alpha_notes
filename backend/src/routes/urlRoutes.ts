import { Router } from 'express';
import * as urlController from '../controllers/urlController';
import { auth } from '../middlewares/auth';


const router = Router();

// Rota para adicionar URL
router.post('/', auth, urlController.addUrl);

// Rota para remover uma URL (se necessário)
router.delete('/:urlId', auth, urlController.deleteUrl);

export default router;