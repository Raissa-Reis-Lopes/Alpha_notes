import { pool } from "../database/connection";
import { IImage } from "../interfaces/image";


export const saveImage = async (filename: string): Promise<IImage> => {
    try {
        const query = `
        INSERT INTO images( filename ) 
        VALUES ($1)
        RETURNING *;
        `

        const result = await pool.query(query, [filename])
        return result.rows[0] as IImage;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteImageById = async (imageId: string) => {
    try {
        const query = `
        DELETE FROM images 
        WHERE id = $1
        `
        const result = await pool.query(query, [imageId])

        if (result.rowCount === 0) {
            throw new Error(`Failed to delete image with ID ${imageId}.`);
        }

        return;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
}

export const getImageById = async (imageId: string) => {
    try {
        const query = `
            SELECT * FROM images
            WHERE id=$1
        `
        const result = await pool.query(query, [imageId]);

        if (result.rows.length === 0) {
            throw new Error(`Failed to find an image with ID ${imageId}.`);
        }

        return result.rows[0];
    } catch (error) {

    }
}