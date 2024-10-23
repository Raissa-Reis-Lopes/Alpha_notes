import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import * as imageServices from "../services/imageServices"
import { IAPIResponse } from '../interfaces/api';
import { IImage } from '../interfaces/image';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

export const upload = multer({ storage: storage });

export const uploadImage = async (req: Request, res: Response) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
    }

    const filename = req.file?.filename

    const image = await imageServices.saveImage(filename);

    return res.status(200).json({ success: true, message: 'Imagem enviada com sucesso', image });
  } catch (error: any) {
    console.error('Erro ao realizar upload do avatar:', error);
    return res.status(500).json({ message: 'Erro ao realizar upload do avatar', error: error.message });
  }
};


export const deleteImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const response: IAPIResponse<IImage> = { success: false };
  try {
    const imageId = req.params.imageId;

    await imageServices.deleteImage(imageId);

    response.success = true;
    response.message = "Image deleted successfully!";
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      data: null,
      error: error.message || "An unexpected error occurred"
    });
  }
};