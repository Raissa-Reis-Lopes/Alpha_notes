import * as noteRepository from "../repositories/noteRepository";
import * as imageRepository from "../repositories/imageRepository"
import * as urlRepository from "../repositories/urlRepository"
import { INote } from "../interfaces/note";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { IImage } from "../interfaces/image";
import { IUrl } from "../interfaces/url";
import { getImageDescription } from "../utils/getImageDescription";
import { downloadAudioFromYouTube } from "../utils/downloadAudio";
import { transcribeAudio } from "../utils/transcribeAudio"
import path from "path";

const openAIEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_KEY,
});

const splitTextIntoChunks = async (text: string, chunkSize: number, chunkOverlap: number = 0): Promise<string[]> => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: chunkSize,
        chunkOverlap: chunkOverlap,
    });
    const documents = await textSplitter.createDocuments([text]);
    return documents.map(doc => doc.pageContent);
};

const generateEmbeddingsForChunks = async (chunks: string[]): Promise<number[][]> => {
    const embeddings = await openAIEmbeddings.embedDocuments(chunks);
    return embeddings;
};

export const createNoteWithoutEmbeddings = async (
    title: string,
    content: string,
    created_by: string,
    images: IImage[],
    urls: IUrl[]
): Promise<INote> => {
    try {
        if (!title) {
            throw new Error("Title can't be empty.");
        }

        const note = await noteRepository.createNote(title, content, created_by);

        if (images.length > 0) {
            for (const image of images) {
                await imageRepository.updateImageWithNoteId(image.id, note.id);
            }
        }

        if (urls.length > 0) {
            for (const url of urls) {
                console.log(url)
                await urlRepository.saveUrl(url.url, note.id);
            }
        }

        const completeNote = await noteRepository.getNoteById(note.id)
        return completeNote;
    } catch (error) {
        throw error;
    }
};

export const processEmbeddings = async (noteId: string): Promise<void> => {
    try {
        const note = await noteRepository.getNoteById(noteId);

        const chunkSize = 200;
        const chunks = await splitTextIntoChunks((note.title + "" + note.content), chunkSize);

        const embeddings = await generateEmbeddingsForChunks(chunks);

        const chunkData = chunks.map((chunk, index) => ({
            embedding: embeddings[index],
            index,
            note_id: noteId,
            source: 'note',
            image_id: null,
            url_id: null,
        }));

        const images = await imageRepository.getImagesByNoteId(noteId);

        for (const image of images) {
            await imageRepository.updateImageStatus(image.id, 'processing');

            const imagePath = path.join(__dirname, '../../uploads', image.filename);

            const description = await getImageDescription(imagePath);
            const imageChunks = await splitTextIntoChunks(JSON.stringify(description), chunkSize);
            const imageEmbeddings = await generateEmbeddingsForChunks(imageChunks);


            const imageChunkData = imageChunks.map((chunk, index) => ({
                embedding: imageEmbeddings[index],
                index,
                note_id: noteId,
                source: 'image',
                image_id: image.id,
                url_id: null,
            }));

            await imageRepository.updateImageDescription(image.id, JSON.stringify(description));
            await imageRepository.updateImageStatus(image.id, 'processed');
            await noteRepository.saveChunks(imageChunkData);
        }

        const urls = await urlRepository.getUrlsByNoteId(noteId);
        for (const url of urls) {
            await urlRepository.updateUrlStatus(url.id, 'processing');
            //AQUI TEM QUE TER A FUNÇÃO QUE FAZ A TRANSCRIÇÃO DO VÍDEO
            //E PASSA ELA AQUI NO LUGAR DESSE URL.URL   

            const audioPath = path.join(__dirname, '../../audios', url.url);

            console.log(url.url)

            const audioDownloaded = await downloadAudioFromYouTube(url.url, audioPath);
            const transcription = await transcribeAudio(audioDownloaded, url.id);
            console.log(transcription)

            const urlChunks = await splitTextIntoChunks(JSON.stringify(transcription), chunkSize);
            const urlEmbeddings = await generateEmbeddingsForChunks(urlChunks);

            const urlChunkData = urlChunks.map((chunk, index) => ({
                embedding: urlEmbeddings[index],
                index,
                note_id: noteId,
                source: 'url',
                image_id: null,
                url_id: url.id,
            }));

            await urlRepository.updateUrlTranscription(url.id, JSON.stringify(transcription));
            await urlRepository.updateUrlStatus(url.id, 'processed');
            await noteRepository.saveChunks(urlChunkData);
        }

        await noteRepository.updateNoteStatus(noteId, 'completed');

        await noteRepository.saveChunks(chunkData);
    } catch (error) {
        console.error("Error processing embeddings:", error);
        throw error;
    }
};

export const updateNoteStatus = async (noteId: string, status: string): Promise<void> => {
    try {
        await noteRepository.updateNoteStatus(noteId, status);
    } catch (error) {
        console.error('Erro ao atualizar o status da nota:', error);
        throw error;
    }
};

const generateEmbedding = async (text: string): Promise<number[]> => {
    const formattedText = text.replace(/\n/g, ' ');
    const embedding = await openAIEmbeddings.embedDocuments([formattedText]);
    return embedding[0];
};

export const searchNotesByQuery = async (
    query: string,
    matchThreshold = 0.2,
    limit = 10, // Default para a quantidade de notas retornadas
    page = 1,  // Default para a primeira página
    filter?: string
): Promise<INote[]> => {
    try {
        if (!query) {
            throw new Error("Query cannot be empty.");
        }

        const queryEmbedding = await generateEmbedding(query);
        const offset = (page - 1) * limit;  // Cálculo do offset com base na página e no limite
        const notes = await noteRepository.getNotesByEmbedding(queryEmbedding, matchThreshold, limit, offset, filter as string);

        if (!notes) {
            throw new Error("No notes were found for this query");
        }

        return notes;
    } catch (error: any) {
        throw new Error(`Failed to search notes: ${error.message}`);
    }
};


export const getPaginatedNotes = async (page: number, limit: number, filter?: string | undefined): Promise<{ notes: INote[], totalCount: number }> => {
    try {
        const offset = (page - 1) * limit;
        const { notes, totalCount } = await noteRepository.getPaginatedNotes(limit, offset, filter);
        return { notes, totalCount };
    } catch (error) {
        throw error;
    }
};

export const getAllNotes = async (filter?: string): Promise<INote[]> => {
    try {
        const notes = await noteRepository.getAllNotes(filter);
        return notes;
    } catch (error) {
        throw error;
    }
};

export const getNoteById = async (noteId: string): Promise<INote> => {
    try {

        if (!noteId) {
            throw new Error("Note ID is required");
        }

        const note = await noteRepository.getNoteById(noteId);

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
        const currentNote = await noteRepository.getNoteById(noteId);
        if (!currentNote) {
            throw new Error("Note not found");
        }

        const updatedNote: INote = {
            ...currentNote,
            title: fields.title || currentNote.title,
            content: fields.content || currentNote.content,
            is_in_trash: fields.is_in_trash || currentNote.is_in_trash,
            is_in_archive: fields.is_in_archive || currentNote.is_in_archive,
            updated_at: new Date(),
        };

        await noteRepository.updateNote(noteId, updatedNote, userId);

        const completeNote = await noteRepository.getNoteById(noteId)

        return completeNote;
    } catch (error: any) {
        throw error;
    }

};
