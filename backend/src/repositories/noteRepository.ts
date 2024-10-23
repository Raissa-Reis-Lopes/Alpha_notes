import { pool } from "../database/connection";
import { IImage } from "../interfaces/image";
import { INote } from "../interfaces/note";
import { IUrl } from "../interfaces/url";

export const getNotesByEmbedding = async (
    embedding: number[],
    matchThreshold: number,
    matchCount: number,
    offset: number,
    filter: string
): Promise<INote[]> => {
    try {
        // Condição de filtro com base no parâmetro "filter"
        let filterCondition = '';
        if (filter === 'trash') {
            filterCondition = 'WHERE n.is_in_trash = true';
        } else if (filter === 'archive') {
            filterCondition = 'WHERE n.is_in_archive = true';
        } else {
            filterCondition = 'WHERE (n.is_in_trash = false OR n.is_in_trash IS NULL) AND (n.is_in_archive = false OR n.is_in_archive IS NULL)';
        }

        const query = `
            SELECT * 
            FROM match_chunks($1, $2, $3, $4, $5);
        `;

        const values = [JSON.stringify(embedding), matchThreshold, matchCount, offset, filterCondition];

        const { rows } = await pool.query(query, values);

        return rows;
    } catch (error: any) {
        throw error;
    }
};


export const getPaginatedNotes = async (limit: number, offset: number, filter?: string): Promise<{ notes: INote[], totalCount: number }> => {
    try {
        let filterCondition = '';
        if (filter === 'trash') {
            filterCondition = 'WHERE n.is_in_trash = true';
        } else if (filter === 'archive') {
            filterCondition = 'WHERE n.is_in_archive = true';
        } else {
            filterCondition = 'WHERE (n.is_in_trash = false OR n.is_in_trash IS NULL) AND (n.is_in_archive = false OR n.is_in_archive IS NULL)';
        }

        // Consulta paginada com JOIN para retornar notas, imagens e URLs
        const notesQuery = `
            SELECT 
                n.id as note_id, n.title, n.content, n.created_by, n.created_at, n.updated_at,
                i.id as image_id, i.filename as image_filename, -- Imagens
                u.id as url_id, u.url as url_link, u.transcription as url_transcription, u.summary as url_summary, u.title as url_title, u.thumbnail as url_thumbnail
            FROM notes n
            LEFT JOIN images i ON n.id = i.note_id
            LEFT JOIN urls u ON n.id = u.note_id
            ${filterCondition}  
            ORDER BY n.created_at DESC
            LIMIT $1 OFFSET $2;
        `;

        const notesResult = await pool.query(notesQuery, [limit, offset]);

        // Consulta para contar o total de notas com o mesmo filtro
        const countQuery = `SELECT COUNT(*) FROM notes n ${filterCondition};`;
        const countResult = await pool.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count, 10);

        // Organizar os dados em um formato de nota com arrays de imagens e URLs
        const notesMap: { [key: string]: INote } = {};

        for (const row of notesResult.rows) {
            const noteId = row.note_id;

            // Se a nota ainda não existir no map, cria uma nova entrada
            if (!notesMap[noteId]) {
                notesMap[noteId] = {
                    id: noteId,
                    title: row.title,
                    content: row.content,
                    created_by: row.created_by,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    images: [],
                    urls: []
                };
            }

            // Adiciona a imagem se existir
            if (row.image_id) {
                notesMap[noteId].images!.push({
                    id: row.image_id,
                    filename: row.image_filename // Retorna o 'id' e o 'filename'
                });
            }

            // Adiciona a URL se existir
            if (row.url_id) {
                notesMap[noteId].urls!.push({
                    id: row.url_id,
                    url: row.url_link,               // Retorna o 'url'
                    transcription: row.url_transcription,
                    summary: row.url_summary,
                    title: row.url_title,
                    thumbnail: row.url_thumbnail
                });
            }
        }

        return {
            notes: Object.values(notesMap),
            totalCount
        };
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching paginated notes.");
    }
};

export const getAllNotes = async (filter?: string): Promise<INote[]> => {
    try {
        let query = `
            SELECT 
                n.id as note_id, n.title, n.content, n.created_by, n.created_at, n.updated_at, n.is_in_trash, n.is_in_archive,
                i.id as image_id, i.filename as image_filename, 
                u.id as url_id, u.url as url_link, u.transcription as url_transcription, u.summary as url_summary,  u.title as url_title, u.thumbnail as url_thumbnail
            FROM notes n
            LEFT JOIN images i ON n.id = i.note_id
            LEFT JOIN urls u ON n.id = u.note_id
        `;

        // Adiciona a condição com base no filtro
        if (filter === 'trash') {
            query += ` WHERE n.is_in_trash = true`;
        } else if (filter === 'archive') {
            query += ` WHERE n.is_in_archive = true`;
        } else {
            query += ` WHERE (n.is_in_trash = false OR n.is_in_trash IS NULL) AND (n.is_in_archive = false OR n.is_in_archive IS NULL)`; // Para notas normais
        }

        query += ` ORDER BY n.created_at DESC;`;

        const { rows } = await pool.query(query);

        // Organizar os dados em um formato de nota com arrays de imagens e urls
        const notesMap: { [key: string]: INote } = {};

        for (const row of rows) {
            const noteId = row.note_id;

            // Se a nota ainda não existir no map, cria uma nova entrada
            if (!notesMap[noteId]) {
                notesMap[noteId] = {
                    id: noteId,
                    title: row.title,
                    content: row.content,
                    created_by: row.created_by,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    is_in_trash: row.is_in_trash,
                    is_in_archive: row.is_in_archive,
                    images: [],
                    urls: []
                };
            }

            // Adiciona a imagem se existir
            if (row.image_id && row.image_filename) {
                notesMap[noteId].images!.push({
                    id: row.image_id,
                    filename: row.image_filename // Retorna o 'id' e o 'filename'
                });
            }

            // Adiciona a URL se existir
            if (row.url_id && row.url_link) {
                notesMap[noteId].urls!.push({
                    id: row.url_id,
                    url: row.url_link,               // Retorna o 'url'
                    transcription: row.url_transcription, // Retorna a 'transcription'
                    summary: row.url_summary,
                    title: row.url_title,
                    thumbnail: row.url_thumbnail
                });
            }
        }

        // Retorna as notas como um array
        return Object.values(notesMap);
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching notes.");
    }
};
//             SELECT * FROM notes
//         `);
//         return rows;
//     } catch (error) {
//         console.error(error);
//         throw new Error("Error fetching notes.");
//     }
// };

export const getNoteById = async (noteId: string): Promise<INote> => {
    try {
        const query = `
            SELECT 
                n.id as note_id, n.title, n.content, n.created_by, n.created_at, n.updated_at,
                i.id as image_id, i.filename as image_filename, 
                u.id as url_id, u.url as url_link, u.transcription as url_transcription, u.summary as url_summary, u.title as url_title, u.thumbnail as url_thumbnail
            FROM notes n
            LEFT JOIN images i ON n.id = i.note_id
            LEFT JOIN urls u ON n.id = u.note_id
            WHERE n.id = $1
        `;

        const result = await pool.query(query, [noteId]);

        if (result.rows.length === 0) {
            throw new Error(`Note with ID ${noteId} not found.`);
        }

        const noteMap: { [key: string]: INote } = {};

        for (const row of result.rows) {
            const noteId = row.note_id;

            if (!noteMap[noteId]) {
                noteMap[noteId] = {
                    id: noteId,
                    title: row.title,
                    content: row.content,
                    created_by: row.created_by,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    images: [],
                    urls: []
                };
            }

            if (row.image_id && row.image_filename) {
                noteMap[noteId].images!.push({
                    id: row.image_id,
                    filename: row.image_filename
                });
            }

            if (row.url_id && row.url_link) {
                noteMap[noteId].urls!.push({
                    id: row.url_id,
                    url: row.url_link,
                    transcription: row.url_transcription,
                    summary: row.url_summary,
                    title: row.url_title,
                    thumbnail: row.url_thumbnail
                });
            }
        }

        return Object.values(noteMap)[0];
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
        const note = result.rows[0] as INote;

        // Buscar as imagens associadas à nota
        const imageQuery = `
         SELECT * FROM images WHERE note_id = $1;
     `;
        const imageResult = await pool.query(imageQuery, [note.id]);
        note.images = imageResult.rows as IImage[];

        // Buscar as URLs associadas à nota
        const urlQuery = `
         SELECT * FROM urls WHERE note_id = $1;
     `;
        const urlResult = await pool.query(urlQuery, [note.id]);
        note.urls = urlResult.rows as IUrl[];

        return note;
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