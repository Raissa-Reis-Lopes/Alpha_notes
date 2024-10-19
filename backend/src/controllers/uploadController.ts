import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

// Configuração do multer (armazenamento em disco)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Define o diretório onde os arquivos serão salvos
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);  // Pega a extensão original do arquivo
        cb(null, `${Date.now()}${ext}`);  // Renomeia o arquivo para ser único
    }
});

// Função de upload que será usada no router
const upload = multer({ storage: storage });

const uploadImage = (req: Request, res: Response) => {
    // Verifica se o arquivo foi enviado corretamente
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
    }
    
    res.status(200).json({ 
        message: 'Upload realizado com sucesso!', 
        file: req.file 
    });
};

const removeImage = (req: Request, res: Response) => {
    // Lógica para remover imagem aqui (se necessário)
    res.status(200).json({ message: 'Imagem removida.' });
};

export { upload, uploadImage, removeImage };