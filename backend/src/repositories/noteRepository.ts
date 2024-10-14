import { pool } from "../database/connection";
import { INote } from "../interfaces/note";


// O postgres usa o <-> para dustancia euclidiana e o <=> para distância de cosseno, o openai usa a de cosseno, então usaremos a mesma
export const getNotesByEmbedding = async (embedding: number[]): Promise<INote[]> => {
    try {
        const result = await pool.query(
            `
            SELECT * FROM notes
            ORDER BY embedding <=> $1
            LIMIT 10;
            `,
            [embedding]
        );

        return result.rows;
    } catch (error: any) {
        throw new Error(`Error retrieving notes by embedding: ${error.message}`);
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
        throw new Error("Failed to retrieve note by ID.");
    }
};

export const createNote = async (
    title: string,
    content: string,
    embedding: string,
    created_by: string
): Promise<INote> => {
    console.log("Embedding dentro do repository sendo enviado ao pgvector", embedding)
    const query = `
        INSERT INTO notes (title, content, embedding, created_by) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [
            title,
            content,
            embedding,
            created_by
        ]);
        return result.rows[0] as INote;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create note.");
    }
};

export const updateNote = async (
    noteId: string,
    updatedNote: INote
): Promise<INote> => {
    const query = `
        UPDATE notes 
        SET 
            title = $1, 
            content = $2, 
            embedding = $3, 
            updated_at = $4, 
        WHERE id = $5
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [
            updatedNote.title,
            updatedNote.content,
            updatedNote.embedding,
            updatedNote.updated_at,
            noteId
        ]);

        if (result.rows.length === 0) {
            throw new Error(`Failed to update note with ID ${noteId}.`);
        }
        return result.rows[0] as INote;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update note.");
    }
};

export const deleteNoteById = async (noteId: string): Promise<INote> => {
    try {
        const result = await pool.query(`
            SELECT 
                id, title, content, embedding, created_at, updated_at, created_by
            FROM notes 
            WHERE id = $1
        `, [noteId]);

        if (result.rows.length === 0) {
            throw new Error(`Note with ID ${noteId} not found.`);
        }

        const note = result.rows[0] as INote;

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
        throw new Error("Failed to delete note.");
    }
};