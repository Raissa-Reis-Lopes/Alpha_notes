// controllers/noteController.ts
import { Request, Response } from "express";
import * as noteServices from "../services/noteServices";
import { INote } from "../interfaces/note";
import { IAPIResponse } from "../interfaces/api";
import webSocketService from "..";

export const createNote = async (req: Request, res: Response) => {
    const response: IAPIResponse<INote> = { success: false };
    try {
        const { title, content, metadata } = req.body;
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
            metadata
        );

        response.data = note;
        response.success = true;
        response.message = "Note successfully created!";
        res.status(201).json(response);

          // Notifica o cliente que o processamento dos embeddings começou, se o WebSocket estiver disponível
          if (socketId) {
            const client = webSocketService.getClient(socketId);
            if (client) {
                client.send(JSON.stringify({ status: 'pending', noteId: note.id }));
            }
        }

        // Processa os embeddings em segundo plano
        noteServices.processEmbeddingsForNote(note.id, userId).then(async () => {
            // Atualiza o status da nota para 'completed' quando os embeddings forem gerados
            await noteServices.updateNoteStatus(note.id, 'completed');
            
            // Notifica o cliente via WebSocket (se existir)
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

        if (!query) {
            res.status(400).json({ message: "Query cannot be empty" });
            return;
        }
        const notes = await noteServices.searchNotesByQuery(query);
        response.data = notes;
        response.success = true;
        response.message = "Notes retrieved successfully";
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        console.error(error)
        res.status(500).json({
            data: null,
            error: error.message || "Failed to search notes by query"
        });
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

        const note: INote = await noteServices.getNoteById(noteId, userId);
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

export const updateNote = async (req: Request, res: Response): Promise<void> => {
    const response: IAPIResponse<INote> = { success: false };
    try {
        const noteId = req.params.noteId;
        const fields: Partial<INote> = req.body;
        const socketId = req.headers['x-socket-id'] as string;
        const userId = req.user!.id;

        // Pego a nota atual antes de atualizar pra ver se o conteúdo mudou, se ele não tiver mudado ele nem passa pelo embedding, pra melhorar a performance
        const currentNote = await noteServices.getNoteById(noteId, userId);

        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
        }

        const updatedNote: INote = await noteServices.updateNote(noteId, fields, userId);
        response.data = updatedNote;
        response.success = true;
        response.message = "Note updated successfully!";
        res.json(response);

        // Verifique se o conteúdo foi alterado
        if (fields.content && fields.content !== currentNote.content) {
            console.log("Chegou aqui onde vai ocorrer o embedidng")
            // Notifica o cliente que o processamento dos embeddings começou, se o WebSocket estiver disponível
            if (socketId) {
                const client = webSocketService.getClient(socketId);
                if (client) {
                    client.send(JSON.stringify({ status: 'pending', noteId: updatedNote.id }));
                }
            }

            // Processa os embeddings em segundo plano
            noteServices.processEmbeddingsForNote(updatedNote.id, userId).then(async () => {
                // Atualiza o status da nota para 'completed' quando os embeddings forem gerados
                await noteServices.updateNoteStatus(updatedNote.id, 'completed');
                
                // Notifica o cliente via WebSocket (se existir)
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