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


export const getImagesByNoteId = async (noteId: string): Promise<IImage[]> => {
    try {
        const query = `
            SELECT * FROM images
            WHERE note_id = $1
        `;
        const results = await pool.query(query, [noteId]);

        return results.rows as IImage[];
    } catch (error) {
        console.error('Error fetching images by note ID:', error);
        return [];
    }
};

export const updateImageStatus = async (imageId: string, status: string) => {
    const query = `
      UPDATE images
      SET status = $1
      WHERE id = $2
    `;

    try {
        await pool.query(query, [status, imageId]);
    } catch (error) {
        console.error('Erro ao atualizar o status da imagem:', error);
        throw error;
    }
};

export const updateImageDescription = async (imageId: string, description: string) => {
    const query = `
      UPDATE images
      SET description = $1
      WHERE id = $2
    `;

    try {
        await pool.query(query, [description, imageId]);
    } catch (error) {
        console.error('Erro ao atualizar o status da imagem:', error);
        throw error;
    }
};



export const updateImageWithNoteId = async (imageId: string, noteId: string): Promise<IImage> => {
    try {
        const query = `
            UPDATE images
            SET note_id = $1
            WHERE id = $2
            RETURNING *;
        `;

        const result = await pool.query(query, [noteId, imageId]);
        return result.rows[0] as IImage;
    } catch (error) {
        console.error('Erro ao atualizar imagem:', error);
        throw error;
    }
};

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
