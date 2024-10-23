import { Request, Response } from "express";
import * as noteServices from "../services/noteServices";
import { INote } from "../interfaces/note";
import { IAPIResponse } from "../interfaces/api";
import webSocketService from "..";

export const createNote = async (req: Request, res: Response) => {
    const response: IAPIResponse<INote> = { success: false };
    try {
        const { title, content, images, urls } = req.body;
        const socketId = req.headers['x-socket-id'] as string;
        const userId = req.user!.id;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
        }

        const note = await noteServices.createNoteWithoutEmbeddings(
            title,
            content,
            userId,
            images || [],
            urls || []
        );

        response.data = note;
        response.success = true;
        response.message = "Note successfully created!";
        res.status(201).json(response);

        if (socketId) {
            const client = webSocketService.getClient(socketId);
            if (client) {
                client.send(JSON.stringify({ status: 'pending', noteId: note.id }));
            }
        }

        noteServices.processEmbeddings(note.id).then(async () => {
            await noteServices.updateNoteStatus(note.id, 'completed')
            if (socketId) {
                const client = webSocketService.getClient(socketId);
                if (client) {
                    client.send(JSON.stringify({ status: 'completed', noteId: note.id }));
                }
            }
        }).catch((error) => {
            console.error('Erro ao processar embeddings:', error);
        });


    } catch (error: any) {
        res.status(500).json({
            data: null,
            error: error.message || "An unexpected error occurred"
        });
    }
};



export const searchNotesByQuery = async (req: Request, res: Response): Promise<void> => {
    const response: IAPIResponse<INote[]> = { success: false };

    try {
        const { query } = req.body;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const filter: string = req.query.filter as string;

        if (!query) {
            res.status(400).json({ message: "Query cannot be empty" });
            return;
        }

        const notes = await noteServices.searchNotesByQuery(query, 0.2, limit, page, filter);

        response.data = notes;
        response.success = true;
        response.message = "Notes retrieved successfully";
        res.status(200).json({
            ...response,
            currentPage: page,
            totalPages: Math.ceil(notes.length / limit),
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            data: null,
            error: error.message || "Failed to search notes by query"
        });
    }
};

export const getPaginatedNotes = async (
    req: Request,
    res: Response
): Promise<void> => {
    const response: IAPIResponse<INote[]> = { success: false };
    try {
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 10;
        const filter: string | undefined = typeof req.query.filter === 'string' ? req.query.filter : undefined; // Verifica se filter é uma string

        const { notes, totalCount } = await noteServices.getPaginatedNotes(page, limit, filter);

        response.data = notes;
        response.success = true;
        response.message = "Notes retrieved successfully";
        res.status(200).json({
            ...response,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            data: null,
            error: error.message || "Failed to retrieve paginated notes",
        });
    }
};


export const getAllNotes = async (
    req: Request,
    res: Response
): Promise<void> => {
    const response: IAPIResponse<INote[]> = { success: false };
    try {
        const filter: string | undefined = typeof req.query.filter === 'string' ? req.query.filter : undefined;


        const notes: INote[] = await noteServices.getAllNotes(filter);
        response.data = notes;
        response.success = true;
        response.message = "Notes retrieved successfully";
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        console.error(error)
        res.status(500).json({
            data: null,
            error: error.message || "Failed to retrieve all notes"
        });
    }
};

export const getNoteById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const response: IAPIResponse<INote> = { success: false };
    try {
        const noteId = req.params.noteId;
        const userId = req.user!.id;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
        }

        const note: INote = await noteServices.getNoteById(noteId);
        response.data = note;
        response.success = true;
        response.message = "Note retrieved successfully";
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            data: null,
            error: error.message || "An unexpected error occurred"
        });
    }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
    const response: IAPIResponse<INote> = { success: false };
    try {
        const noteId = req.params.noteId;
        const fields: Partial<INote> = req.body;
        const socketId = req.headers['x-socket-id'] as string;
        const userId = req.user!.id;

        const currentNote = await noteServices.getNoteById(noteId);

        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
        }

        const updatedNote: INote = await noteServices.updateNote(noteId, fields, userId);
        response.data = updatedNote;
        response.success = true;
        response.message = "Note updated successfully!";
        res.json(response);

        if (fields.content && fields.content !== currentNote.content) {
            if (socketId) {
                const client = webSocketService.getClient(socketId);
                if (client) {
                    client.send(JSON.stringify({ status: 'pending', noteId: updatedNote.id }));
                }
            }

            noteServices.processEmbeddings(updatedNote.id).then(async () => {
                await noteServices.updateNoteStatus(updatedNote.id, 'completed');

                if (socketId) {
                    const client = webSocketService.getClient(socketId);
                    if (client) {
                        client.send(JSON.stringify({ status: 'completed', noteId: updatedNote.id }));
                    }
                }
            }).catch((error) => {
                console.error('Erro ao processar embeddings:', error);
            });
        }
    } catch (error: any) {
        console.error(error)
        res.status(500).json({
            data: null,
            error: error.message || "An unexpected error occurred"
        });
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
        res.status(500).json({
            data: null,
            error: error.message || "An unexpected error occurred"
        });
    }
};