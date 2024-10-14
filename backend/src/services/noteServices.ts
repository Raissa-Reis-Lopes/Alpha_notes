import * as noteRepository from "../repositories/noteRepository";
import { INote } from "../interfaces/note";
import { OpenAIEmbeddings } from "@langchain/openai";

const openAIEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_KEY,
});

const generateEmbedding = async (text: string): Promise<number[]> => {
    const formattedText = text.replace(/\n/g, ' ');

    const embedding = await openAIEmbeddings.embedDocuments([formattedText]);
    return embedding[0];
};

export const searchNotesByQuery = async (query: string, matchThreshold = 0.7, matchCount = 10): Promise<INote[]> => {
    try {
        const queryEmbedding = await generateEmbedding(query);

        const queryEmbeddingAsString = JSON.stringify(queryEmbedding)

        const notes = await noteRepository.getNotesByEmbedding(queryEmbeddingAsString, matchThreshold, matchCount);

        return notes;
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