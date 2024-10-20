import { pool } from "../database/connection";
import { INote } from "../interfaces/note";

export const getNotesByEmbedding = async (
    embedding: number[],
    matchThreshold: number,
    matchCount: number
): Promise<INote[]> => {
    try {
        // Query que chama a função SQL match_chunks
        const query = `
            SELECT * 
            FROM match_chunks($1, $2, $3);
        `;

        // Definindo os parâmetros
        const values = [JSON.stringify(embedding), matchThreshold, matchCount];

        // Executando a query
        const { rows } = await pool.query(query, values);

        return rows;
    } catch (error: any) {
        throw error;
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

export const updateNoteWithEmbeddings = async (
    noteId: string,
    chunks: { text: string; embedding: number[]; index: number }[]
): Promise<void> => {
    const chunkQuery = `
        INSERT INTO chunks (note_id, chunk_index, text, embedding)
        VALUES ($1, $2, $3, $4::vector)
        RETURNING *;
    `;
    try {
        // Inserir os chunks no banco
        for (const chunk of chunks) {
            await pool.query(chunkQuery, [noteId, chunk.index, chunk.text, JSON.stringify(chunk.embedding)]);
        }
    } catch (error) {
        console.error(error);
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



// export const updateNoteWithEmbeddings = async (
//     noteId: string,
//     enrichedMetadata: object, // Recebendo os metadados atualizados
//     chunks: { text: string; embedding: number[]; index: number }[]
// ): Promise<void> => {
//     const chunkQuery = `
//         INSERT INTO chunks (note_id, chunk_index, text, embedding)
//         VALUES ($1, $2, $3, $4::vector)
//         RETURNING *;
//     `;
//     const updateNoteQuery = `
//         UPDATE notes SET metadata = $2, updated_at = NOW() WHERE id = $1
//     `;
//     try {
//         // Atualizar a nota com os metadados e embeddings
//         await pool.query(updateNoteQuery, [noteId, enrichedMetadata]);

//         // Inserir os chunks no banco
//         for (const chunk of chunks) {
//             await pool.query(chunkQuery, [noteId, chunk.index, chunk.text, JSON.stringify(chunk.embedding)]);
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };



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
            metadata = $3,
            updated_at = $4
        WHERE id = $5 AND created_by = $6
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [
            updatedNote.title,
            updatedNote.content,
            updatedNote.metadata,
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
        throw new Error("Failed to update note.");
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