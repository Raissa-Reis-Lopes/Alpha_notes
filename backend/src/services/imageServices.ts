import * as imageRepository from "../repositories/imageRepository"
import fs from 'fs';
import path from "path";

export const saveImage = async (filename: string) => {
    try {
        if (!filename) {
            throw new Error("Filename can not be empty.");
        }

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

        const image = await imageRepository.getImageById(imageId);

        if (!image) {
            throw new Error(`Image with id ${imageId} not found`);
        }

        await imageRepository.deleteImageById(imageId);

        const filePath = path.join(__dirname, '../../uploads', image.filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Erro ao deletar o arquivo: ${err.message}`);
                throw err;
            }
        });

    } catch (error: any) {
        throw error;
    }
};