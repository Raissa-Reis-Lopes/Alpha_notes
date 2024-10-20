import * as imageRepository from "../repositories/imageRepository"
import fs from 'fs';
import path from "path";

export const saveImage = async (filename: string) => {
    try {
        if (!filename) {
            throw new Error("Filename can not be empty.");
        }

        // Criar a imagem no repositório sem processar embeddings
        const image = await imageRepository.saveImage(filename);
        return image;
    } catch (error: any) {
        throw error;
    }
}



export const deleteImage = async (imageId: string) => {
    try {
        if (!imageId) {
            throw new Error("ImageId can not be empty");
        }

        // Recupera o filename antes de deletar a imagem do banco
        const image = await imageRepository.getImageById(imageId);

        if (!image) {
            throw new Error(`Image with id ${imageId} not found`);
        }

        // Deleta a imagem do banco de dados
        await imageRepository.deleteImageById(imageId);

        // Caminho completo do arquivo
        const filePath = path.join(__dirname, '../../uploads', image.filename);

        // Remove o arquivo da pasta uploads
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Erro ao deletar o arquivo: ${err.message}`);
                throw err;
            }
            console.log(`Arquivo ${image.filename} deletado com sucesso.`);
        });

    } catch (error: any) {
        throw error;
    }
};