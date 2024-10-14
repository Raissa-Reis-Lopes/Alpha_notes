import * as noteRepository from "../repositories/noteRepository";
import { INote } from "../interfaces/note";
import { OpenAIEmbeddings } from "@langchain/openai";

const openAIEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_KEY,
});

// Função para gerar embeddings
const generateEmbedding = async (text: string): Promise<number[]> => {
    // Substitui quebras de linha por espaços
    const formattedText = text.replace(/\n/g, ' ');

    const embedding = await openAIEmbeddings.embedDocuments([formattedText]);
    return embedding[0]; // Retorna o vetor do primeiro documento
};


export const searchNotesByQuery = async (query: string): Promise<INote[]> => {
    try {
        // Gerar o embedding da query
        const queryEmbedding = await generateEmbedding(query);

        // Buscar notas similares no repositório
        const notes = await noteRepository.getNotesByEmbedding(queryEmbedding);

        return notes;  // Retornar as notas ordenadas por relevância
    } catch (error: any) {
        throw new Error(`Failed to search notes: ${error.message}`);
    }
};

export const createNote = async (
    title: string,
    content: string,
    created_by: string,
): Promise<INote> => {
    try {
        if (!title || !content) {
            throw new Error("Title and content cannot be empty.");
        }

        const embedding = await generateEmbedding(content);

        const embeddingAsString = JSON.stringify(embedding);

        const note = await noteRepository.createNote(
            title,
            content,
            embeddingAsString,
            created_by
        );
        return note;
    } catch (error) {
        throw error;
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
        const note = await noteRepository.getNoteById(noteId, userId);
        return note;
    } catch (error) {
        throw error;
    }
};


export const deleteNote = async (noteId: string): Promise<INote> => {
    try {
        const note = await noteRepository.deleteNoteById(noteId);
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

        const updatedNote: INote = {
            ...currentNote,
            title: fields.title || currentNote.title,
            content: fields.content || currentNote.content,
            embedding: fields.embedding || currentNote.embedding,
            updated_at: new Date(),
        };

        const note = await noteRepository.updateNote(noteId, updatedNote);
        return note;
    } catch (error: any) {
        throw new Error(`Failed to update note: ${error.message}`);
    }
};