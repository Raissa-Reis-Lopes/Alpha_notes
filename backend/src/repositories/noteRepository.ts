import { pool } from "../database/connection";
import { INote } from "../interfaces/note";

// export const getNotesByEmbedding = async (
//     embedding: number[],
//     matchThreshold: number,
//     matchCount: number
// ): Promise<INote[]> => {
//     try {
//         const query = `
//             SELECT * 
//             FROM match_chunks($1, $2, $3);
//         `;

//         const values = [JSON.stringify(embedding), matchThreshold, matchCount];

//         const { rows } = await pool.query(query, values);

//         return rows;
//     } catch (error: any) {
//         throw error;
//     }
// };

export const getNotesByEmbedding = async (
    embedding: number[],
    matchThreshold: number,
    matchCount: number,
    offset: number
): Promise<INote[]> => {
    try {
        const query = `
            SELECT * 
            FROM match_chunks($1, $2, $3, $4);  -- Inclui o parâmetro de offset
        `;

        const values = [JSON.stringify(embedding), matchThreshold, matchCount, offset];

        const { rows } = await pool.query(query, values);

        return rows;
    } catch (error: any) {
        throw error;
    }
};


export const getPaginatedNotes = async (limit: number, offset: number): Promise<{ notes: INote[], totalCount: number }> => {
    try {
        const notesQuery = `
            SELECT * FROM notes
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const notesResult = await pool.query(notesQuery, [limit, offset]);

        const countQuery = `SELECT COUNT(*) FROM notes`;
        const countResult = await pool.query(countQuery);

        const totalCount = parseInt(countResult.rows[0].count, 10);

        return {
            notes: notesResult.rows,
            totalCount
        };
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching paginated notes.");
    }
};


export const getAllNotes = async (): Promise<INote[]> => {
    try {
        const { rows } = await pool.query(`
            SELECT * FROM notes
        `);
        return rows;
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching notes.");
    }
};

export const getNoteById = async (noteId: string, userId: string): Promise<INote> => {
    try {
        const result = await pool.query(`
            SELECT * FROM notes WHERE id = $1 AND created_by = $2
        `, [noteId, userId]);

        if (result.rows.length === 0) {
            throw new Error(`Note with ID ${noteId} not found.`);
        }
        return result.rows[0] as INote;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createNote = async (
    title: string,
    content: string,
    created_by: string,
): Promise<INote> => {
    const query = `
        INSERT INTO notes (title, content, created_by) 
        VALUES ($1, $2, $3) 
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [title, content, created_by]);
        return result.rows[0] as INote;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const saveChunks = async (
    chunks: { embedding: number[]; index: number; note_id: string; source: string; image_id: string | null; url_id: string | null }[]
): Promise<void> => {
    const chunkQuery = `
        INSERT INTO chunks (note_id, chunk_index, embedding, source, image_id, url_id)
        VALUES ($1, $2, $3::vector, $4, $5, $6)
        RETURNING *;
    `;
    try {
        for (const chunk of chunks) {
            await pool.query(chunkQuery, [
                chunk.note_id,
                chunk.index,
                JSON.stringify(chunk.embedding),
                chunk.source,
                chunk.image_id,
                chunk.url_id
            ]);
        }
    } catch (error) {
        console.error("Error saving chunks:", error);
        throw error;
    }
};

export const updateNoteStatus = async (noteId: string, status: string) => {
    const query = `
      UPDATE notes
      SET status = $1, updated_at = NOW()
      WHERE id = $2
    `;

    try {
        await pool.query(query, [status, noteId]);
        console.log(`Status da nota ${noteId} atualizado para '${status}'`);
    } catch (error) {
        console.error('Erro ao atualizar o status da nota:', error);
        throw error;
    }
};

export const updateNote = async (
    noteId: string,
    updatedNote: INote,
    userId: string
): Promise<INote> => {
    const query = `
        UPDATE notes 
        SET 
            title = $1, 
            content = $2, 
            is_in_trash = $3,
            is_in_archive = $4,
            updated_at = $5
        WHERE id = $6 AND created_by = $7
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [
            updatedNote.title,
            updatedNote.content,
            updatedNote.is_in_trash,
            updatedNote.is_in_archive,
            updatedNote.updated_at,
            noteId,
            userId
        ]);

        if (result.rows.length === 0) {
            throw new Error(`Failed to update note with ID ${noteId}.`);
        }
        return result.rows[0] as INote;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const deleteNoteById = async (noteId: string): Promise<INote> => {
    try {
        const result = await pool.query(`
            SELECT
                id, title, content, metadata, created_at, updated_at, created_by
            FROM notes
            WHERE id = $1
        `, [noteId]);

        if (result.rows.length === 0) {
            throw new Error(`Note with ID ${noteId} not found.`);
        }

        const note = result.rows[0] as INote;

        const deleteChunksQuery = `
        DELETE FROM chunks WHERE note_id = $1;
        `;
        await pool.query(deleteChunksQuery, [noteId]);

        const deleteResult = await pool.query(`
            DELETE FROM notes
            WHERE id = $1;
        `, [noteId]);


        if (deleteResult.rowCount === 0) {
            throw new Error(`Failed to delete note with ID ${noteId}.`);
        }

        return note;
    } catch (error) {
        console.error(error);
        throw error;
    }
};