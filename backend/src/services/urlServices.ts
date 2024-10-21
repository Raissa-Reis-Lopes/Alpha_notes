import * as urlRepository from "../repositories/urlRepository";

export const saveUrl = async (url: string, noteId?: string) => {
    try {
        if (!url) {
            throw new Error("URL não pode estar vazia.");
        }

        const newUrl = await urlRepository.saveUrl(url, noteId);
        return newUrl;
    } catch (error: any) {
        throw error;
    }
};

export const deleteUrl = async (urlId: string) => {
    try {
        if (!urlId) {
            throw new Error("URLId can not be empty");
        }

        const url = await urlRepository.getUrlById(urlId);

        if (!url) {
            throw new Error(`URL with id ${urlId} not found`);
        }

        await urlRepository.deleteUrlById(urlId);
    } catch (error: any) {
        throw error;
    }
};

export const updateUrlStatus = async (urlId: string, status: string) => {
    try {
        if (!urlId || !status) {
            throw new Error("URL ID ou status não pode estar vazio.");
        }

        await urlRepository.updateUrlStatus(urlId, status);
    } catch (error: any) {
        throw error;
    }
};

export const updateUrlWithNoteId = async (urlId: string, noteId: string) => {
    try {
        if (!urlId || !noteId) {
            throw new Error("URL ID ou note ID não pode estar vazio.");
        }

        const updatedUrl = await urlRepository.updateUrlWithNoteId(urlId, noteId);
        return updatedUrl;
    } catch (error: any) {
        throw error;
    }
};