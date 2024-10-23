import { pool } from "../database/connection";
import { IUrl } from "../interfaces/url";

export const saveUrl = async (url: string): Promise<IUrl> => {
    try {
        const query = `
        INSERT INTO urls (url) 
        VALUES ($1)
        RETURNING id, url;
        `;
        const result = await pool.query(query, [url]);
        return result.rows[0] as IUrl;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUrlWithNoteId = async (urlId: string, noteId: string, title: string, thumbnail: string): Promise<void> => {
    const query = `
        UPDATE urls
        SET note_id = $1, title = $2, thumbnail = $3
        WHERE id = $4
        RETURNING *;
    `;

    try {
        await pool.query(query, [noteId, title, thumbnail, urlId]);
    } catch (error) {
        console.error('Erro ao adicionar o id da nota à URL:', error);
        throw error;
    }
};


export const getUrlById = async (urlId: string): Promise<IUrl | null> => {
    try {
        const query = `
            SELECT * FROM urls
            WHERE id = $1
        `;
        const result = await pool.query(query, [urlId]);

        if (result.rows.length === 0) {
            throw new Error(`Failed to find a URL with ID ${urlId}.`);
        }

        return result.rows[0] as IUrl;
    } catch (error) {
        throw error;
    }
};

export const getUrlsByNoteId = async (noteId: string): Promise<IUrl[]> => {
    try {
        const query = `
            SELECT * FROM urls
            WHERE note_id = $1
        `;
        const results = await pool.query(query, [noteId]);

        return results.rows as IUrl[];
    } catch (error) {
        console.error('Error fetching URLs by note ID:', error);
        return [];
    }
};

export const updateUrlStatus = async (urlId: string, status: string): Promise<void> => {
    const query = `
        UPDATE urls
        SET status = $1
        WHERE id = $2
    `;

    try {
        await pool.query(query, [status, urlId]);
    } catch (error) {
        console.error('Erro ao atualizar o status da URL:', error);
        throw error;
    }
};

export const updateUrlTranscriptionAndSummary = async (urlId: string, transcription: string, summary: string) => {
    const query = `
      UPDATE urls
      SET transcription = $1, summary = $2
      WHERE id = $3
    `;

    try {
        await pool.query(query, [transcription, summary, urlId]);
    } catch (error) {
        console.error('Erro ao atualizar a transcrição e o resumo:', error);
        throw error;
    }
};

export const deleteUrlById = async (urlId: string): Promise<void> => {
    try {
        const query = `
            DELETE FROM urls
            WHERE id = $1
        `;
        const result = await pool.query(query, [urlId]);

        if (result.rowCount === 0) {
            throw new Error(`Failed to delete URL with ID ${urlId}.`);
        }
    } catch (error: any) {
        console.error('Erro ao deletar URL:', error);
        throw error;
    }
};
