import { pool } from "../database/connection";
import { INote } from "../interfaces/note";

export const getAllNotes = async (): Promise<INote[]> => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                id, title, content, embedding, created_at, updated_at, created_by, updated_by
            FROM notes
        `);
        return rows;
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching notes.");
    }
};

export const getNoteById = async (noteId: string): Promise<INote> => {
    try {
        const result = await pool.query(`
            SELECT 
                id, title, content, embedding, created_at, updated_at, created_by, updated_by
            FROM notes 
            WHERE id = $1
        `, [noteId]);

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
    embedding: number[],
    created_by: string,
    updated_by: string
): Promise<INote> => {
    const query = `
        INSERT INTO notes (title, content, embedding, created_by, updated_by) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [
            title,
            content,
            embedding,
            created_by,
            updated_by
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
            updated_by = $5
        WHERE id = $6
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [
            updatedNote.title,
            updatedNote.content,
            updatedNote.embedding,
            updatedNote.updated_at,
            updatedNote.updated_by,
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
                id, title, content, embedding, created_at, updated_at, created_by, updated_by
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