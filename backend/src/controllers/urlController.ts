import { Request, Response } from 'express';
import * as urlServices from "../services/urlServices";
import { IAPIResponse } from '../interfaces/api';
import { IUrl } from '../interfaces/url';

export const addUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL não fornecida.' });
    }

    const newUrl = await urlServices.saveUrl(url);

    return res.status(200).json({ success: true, message: 'URL adicionada com sucesso', url: newUrl });
  } catch (error: any) {
    console.error('Erro ao adicionar URL:', error);
    return res.status(500).json({ message: 'Erro ao adicionar URL', error: error.message });
  }
};

export const deleteUrl = async (req: Request, res: Response): Promise<void> => {
  const response: IAPIResponse<IUrl> = { success: false };
  try {
    const urlId = req.params.urlId;

    await urlServices.deleteUrl(urlId);

    response.success = true;
    response.message = "URL deletada com sucesso!";
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      data: null,
      error: error.message || "Ocorreu um erro inesperado"
    });
  }
};