import * as noteRepository from "../repositories/noteRepository";
import { INote } from "../interfaces/note";

export const getAllNotes = async (): Promise<INote[]> => {
    try {
        const notes = await noteRepository.getAllNotes();
        return notes;
    } catch (error) {
        throw error;
    }
};

export const getNoteById = async (noteId: string): Promise<INote> => {
    try {
        const note = await noteRepository.getNoteById(noteId);
        return note;
    } catch (error) {
        throw error;
    }
};

export const createNote = async (
    title: string,
    content: string,
    embedding: number[],
    created_by: string,
    updated_by: string
): Promise<INote> => {
    try {
        if (!title || !content) {
            throw new Error("Title and content cannot be empty.");
        }

        const note = await noteRepository.createNote(
            title,
            content,
            embedding,
            created_by,
            updated_by
        );
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
    fields: Partial<INote>
): Promise<INote> => {
    try {
        const currentNote = await noteRepository.getNoteById(noteId);
        if (!currentNote) {
            throw new Error("Note not found");
        }

        const updatedNote: INote = {
            ...currentNote,
            title: fields.title || currentNote.title,
            content: fields.content || currentNote.content,
            embedding: fields.embedding || currentNote.embedding,
            updated_at: new Date(),
            updated_by: fields.updated_by || currentNote.updated_by
        };

        const note = await noteRepository.updateNote(noteId, updatedNote);
        return note;
    } catch (error: any) {
        throw new Error(`Failed to update note: ${error.message}`);
    }
};