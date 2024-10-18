// services/noteServices.ts
import * as noteRepository from "../repositories/noteRepository";
import { INote } from "../interfaces/note";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const openAIEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_KEY,
});

// Função para dividir o texto em chunks usando o RecursiveCharacterTextSplitter
const splitTextIntoChunks = async (text: string, chunkSize: number, chunkOverlap: number = 0): Promise<string[]> => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: chunkSize,
        chunkOverlap: chunkOverlap,
    });

    // O método createDocuments espera um array de textos
    const documents = await textSplitter.createDocuments([text]);

    // Extrair o texto dos documentos resultantes
    return documents.map(doc => doc.pageContent);
};

// Função para gerar embeddings para cada chunk
const generateEmbeddingsForChunks = async (chunks: string[]): Promise<number[][]> => {
    const embeddings = await openAIEmbeddings.embedDocuments(chunks);
    return embeddings;
};

// Função para criar a nota sem embeddings inicialmente
export const createNoteWithoutEmbeddings = async (
    title: string,
    content: string,
    created_by: string,
    metadata: object = {}
): Promise<INote> => {
    try {
        if (!title || !content) {
            throw new Error("Title and content cannot be empty.");
        }

        // Criar a nota no repositório sem processar embeddings
        const note = await noteRepository.createNote(title, content, created_by, metadata);
        return note;
    } catch (error) {
        throw error;
    }
};

// Função para processar embeddings e chunks em segundo plano
export const processEmbeddingsForNote = async (noteId: string, userId: string): Promise<void> => {
    try {
        // Obter a nota sem os embeddings
        const note = await noteRepository.getNoteById(noteId, userId);

        // Dividir o conteúdo da nota em chunks
        const chunkSize = 200;
        const chunks = await splitTextIntoChunks(note.content, chunkSize);

        // Gerar embeddings para cada chunk
        const embeddings = await generateEmbeddingsForChunks(chunks);

        // Preparar os dados dos chunks
        const chunkData = chunks.map((chunk, index) => ({
            text: chunk,
            embedding: embeddings[index],
            index
        }));

//VOu deixar essa parte aqui comentada, pq vamos precisar disso pra salvar o embedding no metadata, senão não vai vincular à nota
 // Enriquecer os metadados com os chunks
        // const enrichedMetadata = {
        //     ...metadata,
        //     chunks: chunkData
        // };
        await noteRepository.updateNoteWithEmbeddings(noteId, chunkData);
    } catch (error) {
        console.error("Error processing embeddings:", error);
        throw error;
    }
};

// export const createNote = async (
//     title: string,
//     content: string,
//     created_by: string,
//     metadata: object = {}
// ): Promise<INote> => {
//     try {
//         if (!title || !content) {
//             throw new Error("Title and content cannot be empty.");
//         }

//         // Dividir o conteúdo em chunks
//         const chunkSize = 200; // Número de caracteres por chunk 
//         const chunks = await splitTextIntoChunks(content, chunkSize);

//         // Gerar embeddings para cada chunk
//         const embeddings = await generateEmbeddingsForChunks(chunks);

//         // Preparar os chunks com seus embeddings e índices
//         const chunkData = chunks.map((chunk, index) => ({
//             text: chunk,
//             embedding: embeddings[index],
//             index: index
//         }));

//         // Enriquecer os metadados com os chunks
//         const enrichedMetadata = {
//             ...metadata,
//             chunks: chunkData
//         };

//         // Criar a nota no repositório
//         const note = await noteRepository.createNote(
//             title,
//             content,
//             created_by,
//             enrichedMetadata
//         );
//         return note;
//     } catch (error) {
//         throw error;
//     }
// };

const generateEmbedding = async (text: string): Promise<number[]> => {
    const formattedText = text.replace(/\n/g, ' ');
    const embedding = await openAIEmbeddings.embedDocuments([formattedText]);
    return embedding[0];
};

export const searchNotesByQuery = async (query: string, matchThreshold = 0.2, matchCount = 10): Promise<INote[]> => {
    try {
        if (!query) {
            throw new Error("Query cannot be empty.");
        }

        const queryEmbedding = await generateEmbedding(query);
        const notes = await noteRepository.getNotesByEmbedding(queryEmbedding, matchThreshold, matchCount);

        if (!notes) {
            throw new Error("No notes were found for this query")
        }

        return notes;
    } catch (error: any) {
        throw new Error(`Failed to search notes: ${error.message}`);
    }
};

export const getAllNotes = async (): Promise<INote[]> => {
    try {
        const notes = await noteRepository.getAllNotes();
        return notes;
    } catch (error) {
        throw error;
    }
};

export const getNoteById = async (noteId: string, userId: string): Promise<INote> => {
    try {

        if (!userId) {
            throw new Error("User not logged in. This action is forbidden");
        }

        if (!noteId) {
            throw new Error("Note ID is required");
        }

        const note = await noteRepository.getNoteById(noteId, userId);

        if (!note) {
            throw new Error(`Note with id ${noteId} not found`);
        }

        return note;
    } catch (error) {
        throw error;
    }
};

export const deleteNote = async (noteId: string): Promise<INote> => {
    try {

        if (!noteId) {
            throw new Error("Note ID is required");
        }

        const note = await noteRepository.deleteNoteById(noteId);

        if (!note) {
            throw new Error(`Note with id ${noteId} not found`);
        }

        return note;
    } catch (error) {
        throw error;
    }
};

export const updateNote = async (
    noteId: string,
    fields: Partial<INote>,
    userId: string
): Promise<INote> => {
    try {
        const currentNote = await noteRepository.getNoteById(noteId, userId);
        if (!currentNote) {
            throw new Error("Note not found");
        }

        let updatedMetadata = currentNote.metadata;

        if (fields.content && fields.content !== currentNote.content) {
            // Dividir o novo conteúdo em chunks
            const chunkSize = 200;
            const newChunks = await splitTextIntoChunks(fields.content, chunkSize);

            // Gerar embeddings para os novos chunks
            const newEmbeddings = await generateEmbeddingsForChunks(newChunks);

            // Preparar os chunks com seus embeddings e índices
            const newChunkData = newChunks.map((chunk, index) => ({
                text: chunk,
                embedding: newEmbeddings[index],
                index: index
            }));

            // Atualizar os metadados com os novos chunks
            updatedMetadata = {
                ...updatedMetadata,
                chunks: newChunkData
            };
        }

        const updatedNote: INote = {
            ...currentNote,
            title: fields.title || currentNote.title,
            content: fields.content || currentNote.content,
            metadata: updatedMetadata,
            updated_at: new Date(),
        };

        const note = await noteRepository.updateNote(noteId, updatedNote, userId);
        return note;
    } catch (error: any) {
        throw new Error(`Failed to update note: ${error.message}`);
    }
};
