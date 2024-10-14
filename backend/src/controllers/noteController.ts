import { Request, Response } from "express";
import * as noteServices from "../services/noteServices";
import { INote } from "../interfaces/note";
import { IAPIResponse } from "../interfaces/api";

export const searchNotesByQuery = async (req: Request, res: Response): Promise<void> => {
    const response: IAPIResponse<INote[]> = { success: false };
    try {
        const { query } = req.body;

        if (!query) {
            res.status(400).json({ message: "Query cannot be empty" });
            return;
        }
        // Chama o serviço que realiza a busca
        const notes = await noteServices.searchNotesByQuery(query);
        response.data = notes;
        response.success = true;
        response.message = "Notes retrieved successfully";
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ data: null, error: "Internal server error" });
    }
};

export const getAllNotes = async (
    req: Request,
    res: Response
): Promise<void> => {
    const response: IAPIResponse<INote[]> = { success: false };
    try {
        const notes: INote[] = await noteServices.getAllNotes();
        response.data = notes;
        response.success = true;
        response.message = "Notes retrieved successfully";
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ data: null, error: "Internal server error" });
    }
};

export const getNoteById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const response: IAPIResponse<INote> = { success: false };
    try {
        const noteId = req.params.noteId;
        const userId = req.user!;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
        }

        const note: INote = await noteServices.getNoteById(noteId, userId);
        response.data = note;
        response.success = true;
        response.message = "Note retrieved successfully";
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ data: null, error: "Internal server error" });
    }
};

export const createNote = async (req: Request, res: Response) => {
    const response: IAPIResponse<INote> = { success: false };
    try {
        const { title, content } = req.body;

        // O userId recuperado dos cookies vai ser o id identificador do created_by
        const userId = req.user!;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
        }

        const note = await noteServices.createNote(
            title,
            content,
            userId
        );
        response.data = note;
        response.success = true;
        response.message = "Note successfully created!";
        res.status(201).json(response);
    } catch (error: any) {
        response.error = error.message;
        response.message = "Failed to create the note!";
        return res.status(400).json(response);
    }
};

export const deleteNote = async (
    req: Request,
    res: Response
): Promise<void> => {
    const response: IAPIResponse<INote> = { success: false };
    try {
        const noteId = req.params.noteId;
        const note: INote = await noteServices.deleteNote(noteId);
        response.data = note;
        response.success = true;
        response.message = "Note deleted successfully!";
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        response.message = "Unable to delete note!";
        res.status(500).json({ data: null, error: "Internal server error" });
    }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
    const response: IAPIResponse<INote> = { success: false };
    try {
        const noteId = req.params.noteId;
        const fields: Partial<INote> = req.body;

        const userId = req.user as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
        }

        const updatedNote: INote = await noteServices.updateNote(noteId, fields, userId);
        response.data = updatedNote;
        response.success = true;
        response.message = "Note updated successfully!";
        res.json(response);

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || "Unable to complete the operation" });
    }
};